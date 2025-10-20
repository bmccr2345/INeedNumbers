"""
Production-ready security middleware and utilities.
Includes comprehensive security headers, Redis-based rate limiting, and CSRF protection.
"""

from fastapi import Request, HTTPException, Response
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Callable, Optional
import time
import hmac
import hashlib
import secrets
from urllib.parse import urlparse
from config import get_config
from app.redis_client import get_redis_client
import logging

logger = logging.getLogger(__name__)

def get_allowlist(origins_csv: str) -> list[str]:
    """Parse CORS origins from comma-separated string"""
    return [o.strip() for o in origins_csv.split(",") if o.strip()]

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Add comprehensive security headers to all responses.
    Production-ready with configurable CSP and security policies.
    """
    
    def __init__(self, app, config=None):
        super().__init__(app)
        self.config = config or get_config()
    
    async def dispatch(self, request: Request, call_next: Callable):
        response = await call_next(request)
        
        # Get the request origin for CSP
        origin = request.headers.get("origin", "")
        
        # Base security headers
        security_headers = {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "X-XSS-Protection": "1; mode=block",
            "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
        }
        
        # HSTS for HTTPS
        if request.url.scheme == "https" or self.config.NODE_ENV == "production":
            security_headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        
        # Content Security Policy
        allowed_origins = self.config.get_cors_origins()
        csp_sources = ["'self'"]
        
        # Add allowed origins to CSP
        for allowed_origin in allowed_origins:
            if allowed_origin != "*":
                parsed = urlparse(allowed_origin)
                if parsed.netloc:
                    csp_sources.append(parsed.netloc)
        
        csp_policy = f"default-src {' '.join(csp_sources)}; "
        csp_policy += "img-src 'self' data: blob: https:; "
        csp_policy += "style-src 'self' 'unsafe-inline'; "
        csp_policy += "script-src 'self'; "
        csp_policy += "connect-src 'self' https:; "
        csp_policy += "font-src 'self'; "
        csp_policy += "object-src 'none'; "
        csp_policy += "frame-ancestors 'none'; "
        csp_policy += "base-uri 'self';"
        
        security_headers["Content-Security-Policy"] = csp_policy
        
        # Add headers to response
        response.headers.update(security_headers)
        return response

class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Redis-based rate limiting middleware with graceful fallback.
    """
    
    def __init__(self, app):
        super().__init__(app)
        self.config = get_config()
        self.redis = get_redis_client()
    
    async def dispatch(self, request: Request, call_next: Callable):
        # Skip rate limiting for health checks and static files
        if request.url.path in ["/health", "/api/health"] or request.url.path.startswith("/static"):
            return await call_next(request)
        
        # Get client identifier (IP + user agent for unauthenticated requests)
        client_ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")[:100]  # Limit length
        rate_limit_key = f"rate_limit:{client_ip}:{hash(user_agent)}"
        
        # Check rate limit
        allowed, current_count, reset_time = self.redis.rate_limit_check(
            rate_limit_key,
            self.config.RATE_LIMIT_REQUESTS,
            self.config.RATE_LIMIT_WINDOW
        )
        
        if not allowed:
            logger.warning(f"Rate limit exceeded for {client_ip}: {current_count}/{self.config.RATE_LIMIT_REQUESTS}")
            
            response = Response(
                content='{"error": "Rate limit exceeded", "retry_after": ' + str(reset_time - int(time.time())) + '}',
                status_code=429,
                media_type="application/json"
            )
            response.headers["Retry-After"] = str(reset_time - int(time.time()))
            response.headers["X-RateLimit-Limit"] = str(self.config.RATE_LIMIT_REQUESTS)
            response.headers["X-RateLimit-Remaining"] = "0"
            response.headers["X-RateLimit-Reset"] = str(reset_time)
            return response
        
        # Process request and add rate limit headers to response
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(self.config.RATE_LIMIT_REQUESTS)
        response.headers["X-RateLimit-Remaining"] = str(max(0, self.config.RATE_LIMIT_REQUESTS - current_count))
        response.headers["X-RateLimit-Reset"] = str(reset_time)
        
        return response

def rate_limit(user_key: str, limit_per_min: int):
    """
    Per-user rate limiting function for API endpoints.
    Uses Redis-based sliding window with fallback.
    """
    redis_client = get_redis_client()
    rate_limit_key = f"user_rate_limit:{user_key}"
    
    # Convert per-minute to per-60-seconds for consistency
    window_seconds = 60
    
    allowed, current_count, reset_time = redis_client.rate_limit_check(
        rate_limit_key, limit_per_min, window_seconds
    )
    
    if not allowed:
        retry_after = reset_time - int(time.time())
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Try again in {retry_after} seconds.",
            headers={
                "Retry-After": str(retry_after),
                "X-RateLimit-Limit": str(limit_per_min),
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset": str(reset_time)
            }
        )

def enforce_body_limit(request: Request, max_kb: int):
    """Enforce maximum body size for requests"""
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > max_kb * 1024:
        raise HTTPException(
            status_code=413,
            detail=f"Request entity too large. Maximum size: {max_kb}KB"
        )

def generate_csrf_token() -> str:
    """Generate a secure CSRF token."""
    return secrets.token_urlsafe(32)

def verify_csrf_token(token: str, expected_token: str) -> bool:
    """Verify CSRF token using constant-time comparison."""
    return hmac.compare_digest(token, expected_token)

class CSRFMiddleware(BaseHTTPMiddleware):
    """
    CSRF protection middleware for state-changing requests.
    """
    
    def __init__(self, app):
        super().__init__(app)
        self.config = get_config()
        
        # Methods that require CSRF protection
        self.protected_methods = {"POST", "PUT", "DELETE", "PATCH"}
        
        # Paths that are exempt from CSRF (webhooks, public APIs)
        self.exempt_paths = {
            "/api/stripe/webhook",
            "/api/auth/login", 
            "/api/auth/register",
            "/api/health",
            "/health",
            "/api/ai-coach-v2/generate",
            "/api/ai-coach-v2/diag",
            "/api/activity-log",
            "/api/activity-logs",
            "/api/reflection-log", 
            "/api/reflection-logs"
        }
    
    async def dispatch(self, request: Request, call_next: Callable):
        # Skip CSRF for safe methods and exempt paths
        if (request.method not in self.protected_methods or 
            request.url.path in self.exempt_paths):
            return await call_next(request)
        
        # Skip CSRF for authenticated API requests (SPA with JWT doesn't need CSRF protection)
        auth_header = request.headers.get("Authorization", "")
        has_jwt_token = auth_header.startswith("Bearer ") and len(auth_header) > 7
        
        if has_jwt_token:
            # JWT-authenticated requests are safe from CSRF (tokens aren't sent automatically)
            return await call_next(request)
        
        # For non-JWT requests, verify CSRF token
        csrf_token = request.headers.get("X-CSRF-Token")
        
        # Get expected token from session/cookie (simplified for demo)
        # In production, this would come from encrypted session data
        expected_token = request.cookies.get("csrf_token")
        
        if not csrf_token or not expected_token:
            raise HTTPException(
                status_code=403,
                detail="CSRF token missing"
            )
        
        if not verify_csrf_token(csrf_token, expected_token):
            raise HTTPException(
                status_code=403,
                detail="CSRF token invalid"
            )
        
        return await call_next(request)

def create_secure_cookie_response(
    response: Response,
    key: str,
    value: str,
    max_age: Optional[int] = None,
    httponly: bool = True
) -> Response:
    """
    Create a secure cookie with production-ready settings.
    """
    config = get_config()
    
    response.set_cookie(
        key=key,
        value=value,
        max_age=max_age,
        httponly=httponly,
        secure=config.COOKIE_SECURE,
        samesite=config.COOKIE_SAMESITE,
        path="/"
    )
    
    return response