# Deployment Readiness Guide - I Need Numbers

## ⚠️ PRODUCTION DEPLOYMENT STATUS: NOT READY

**Current Security Score: 4/9 (44% PASS)**

This application is **NOT READY** for production deployment due to critical security vulnerabilities. See FINAL_PROD_SECURITY_REPORT.md for details.

## Required Environment Variables

### Backend (.env)

#### Authentication & Security (REQUIRED)
```bash
# JWT Configuration  
JWT_SECRET_KEY="your-super-secure-jwt-secret-key-min-32-chars"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_DAYS=30

# CSRF Protection
CSRF_SECRET_KEY="dev-csrf-secret-key-32-chars-minimum-length-required-for-security"

# Environment
ENVIRONMENT="production"  # CRITICAL: Enables secure cookies, HTTPS redirect
```

#### Database (REQUIRED)
```bash
# MongoDB
MONGO_URL="mongodb://username:password@host:port/database"
DB_NAME="ineed_numbers_prod"
```

#### External Services (REQUIRED)
```bash
# OpenAI Integration
OPENAI_API_KEY="sk-..."

# Stripe Payments
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..." 
STRIPE_WEBHOOK_SECRET="whsec_..."  # ⚠️ CRITICAL: Must be implemented in webhook handler

# Redis Cache & Rate Limiting
REDIS_URL="redis://username:password@host:port/db"  # REQUIRED in production
```

#### Optional Services
```bash
# S3 File Storage (Optional)
S3_BUCKET_NAME="your-s3-bucket"
S3_ACCESS_KEY_ID="AKIA..."
S3_SECRET_ACCESS_KEY="..."
S3_REGION="us-east-1"

# Email (Future)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_HOST_USER="your-email@gmail.com" 
EMAIL_HOST_PASSWORD="your-app-password"
```

### Frontend (.env)

#### Required Configuration
```bash
# Backend API URL
REACT_APP_BACKEND_URL="https://api.yourdomain.com"

# Build Configuration
NODE_ENV="production"
GENERATE_SOURCEMAP=false

# WebSocket (Development only)
# WDS_SOCKET_PORT=443  # Remove in production
```

## Critical Security Issues to Fix Before Deployment

### 1. Stripe Webhook Security (CRITICAL)
**Current Risk**: Webhooks can be spoofed by attackers
```python
# Required implementation in backend/app/routes/plans.py:
import stripe

@app.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.environ['STRIPE_WEBHOOK_SECRET']
        )
    except ValueError:
        raise HTTPException(400, "Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(400, "Invalid signature")
    
    # Process validated event...
```

### 2. Content Security Policy (CRITICAL)
**Current Risk**: No XSS protection
```python
# Required CSP header:
"Content-Security-Policy": "default-src 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'"
```

### 3. File Upload Security (HIGH)
**Current Risk**: Malware uploads, file system attacks
```python
# Required validations:
- Max size: 5MB
- Allowed MIME: application/pdf, image/png, image/jpeg
- Use python-magic for real MIME detection
- S3 upload: ACL=private, ServerSideEncryption=AES256
```

## Build Commands

### Frontend Build
```bash
cd /app/frontend
yarn install --frozen-lockfile
yarn build
```

### Backend Setup
```bash
cd /app/backend
pip install -r requirements.txt
```

### Database Migration
```bash
# MongoDB collections should be initialized automatically
# Verify connection: python -c "import pymongo; client = pymongo.MongoClient('your-mongo-url'); print('Connected:', client.admin.command('ping'))"
```

## Service Startup Commands

### Production Startup (After Security Fixes)
```bash
# Start MongoDB (if self-hosted)
sudo systemctl start mongod

# Start Redis (required for rate limiting)
sudo systemctl start redis

# Start Backend
cd /app/backend
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8001

# Serve Frontend (via nginx or serve)
cd /app/frontend/build
serve -s . -p 3000
```

### Development Startup
```bash
# Backend
cd /app/backend
sudo supervisorctl restart backend

# Frontend  
cd /app/frontend
sudo supervisorctl restart frontend
```

## Health Check Endpoints

### Current Endpoints
```bash
# Basic health check
GET /health
Response: {"ok": true, "version": "...", "environment": "production"}

# Authentication test
GET /api/auth/me
Response: User data or 401
```

### Required for Production
```bash
# Comprehensive readiness check (TO BE IMPLEMENTED)
GET /ready  
Expected Response: {
  "ready": true,
  "checks": {
    "database": "ok",
    "redis": "ok", 
    "s3": "ok",
    "stripe": "ok"
  }
}
```

## Nginx Configuration (Recommended)

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Security Headers  
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    # Frontend
    location / {
        root /app/frontend/build;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Security Checklist Before Going Live

- [ ] ✅ Argon2id password hashing implemented
- [ ] ✅ HttpOnly secure cookies configured  
- [ ] ❌ Stripe webhook signature verification
- [ ] ❌ File upload security controls (5MB limit, MIME validation)
- [ ] ❌ Content Security Policy headers
- [ ] ❌ CORS restricted to production domains
- [ ] ❌ Template XSS protection audit
- [ ] ❌ Sensitive data logging filters
- [ ] ❌ Comprehensive security test suite
- [ ] ❌ /ready endpoint with dependency checks

## Monitoring and Logging

### Log Files to Monitor
```bash
# Backend application logs
/var/log/supervisor/backend.out.log
/var/log/supervisor/backend.err.log

# Frontend build logs  
/var/log/supervisor/frontend.out.log
/var/log/supervisor/frontend.err.log

# System logs
/var/log/nginx/access.log
/var/log/nginx/error.log
```

### Key Metrics to Track
- Authentication success/failure rates
- API response times
- Rate limiting triggers
- File upload attempts
- Stripe webhook events
- Database connection health
- Redis availability

## Incident Response

### Security Incident Checklist
1. Isolate affected systems
2. Review authentication logs for unauthorized access
3. Check file upload logs for malicious files
4. Verify webhook signature validation
5. Monitor for unusual API activity
6. Update security keys if compromised
7. Document incident and lessons learned

**⚠️ IMPORTANT: Do not deploy to production until all CRITICAL and HIGH priority security issues in FINAL_PROD_SECURITY_REPORT.md are resolved.**