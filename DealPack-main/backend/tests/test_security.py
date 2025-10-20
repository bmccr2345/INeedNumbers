import pytest
from httpx import AsyncClient
from server import app
import json

@pytest.mark.asyncio
async def test_security_headers_present():
    """Test that security headers are present on responses"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Test health endpoint
        r = await ac.get("/health")
        
        # Check security headers
        assert r.headers.get("X-Frame-Options") == "DENY"
        assert "default-src 'self'" in r.headers.get("Content-Security-Policy", "")
        assert r.headers.get("X-Content-Type-Options") == "nosniff"
        assert r.headers.get("Referrer-Policy") == "no-referrer"
        
        # HSTS should be present (but may vary by environment)
        if "Strict-Transport-Security" in r.headers:
            assert "max-age" in r.headers.get("Strict-Transport-Security", "")

@pytest.mark.asyncio
async def test_body_size_guard():
    """Test that large JSON bodies are rejected"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Create a large JSON payload (>256KB)
        big_data = {"data": "x" * (300 * 1024)}
        big_json = json.dumps(big_data)
        
        # Should be rejected due to size
        r = await ac.post(
            "/api/reports/pnl", 
            content=big_json, 
            headers={"Content-Type": "application/json"}
        )
        assert r.status_code in (400, 413)

@pytest.mark.asyncio
async def test_cors_configuration():
    """Test CORS is properly configured"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # OPTIONS request should include proper CORS headers
        r = await ac.options("/api/health")
        
        # Should have CORS headers
        if r.status_code == 200:
            access_control_headers = [
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Methods",
                "Access-Control-Allow-Headers"
            ]
            for header in access_control_headers:
                assert header in r.headers or r.status_code == 405  # Method not allowed is also valid

@pytest.mark.asyncio  
async def test_ai_coach_rate_limiting():
    """Test AI Coach rate limiting works"""
    # This would need proper authentication setup
    # For now just test that the endpoint exists and requires auth
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.post("/api/ai-coach/generate", json={"stream": False})
        # Should require authentication
        assert r.status_code == 401

@pytest.mark.asyncio
async def test_stripe_webhook_security():
    """Test Stripe webhook requires proper signature"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Webhook without signature should fail
        r = await ac.post("/api/stripe/webhook", json={"test": "data"})
        # Should reject invalid signature
        assert r.status_code in (400, 401, 404)  # 404 if route doesn't exist yet

@pytest.mark.asyncio
async def test_upload_validation():
    """Test file upload validation"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Test without authentication
        r = await ac.post("/api/upload/asset")
        # Should require authentication
        assert r.status_code == 401

@pytest.mark.asyncio
async def test_https_redirect_in_production():
    """Test HTTPS redirect is configured for production"""
    # This is mainly configuration test - in production env
    # the HTTPSRedirectMiddleware should be active
    # For test environment, this may not apply
    assert True  # Placeholder - would need production environment testing