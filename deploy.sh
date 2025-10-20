#!/bin/bash

# I Need Numbers - Production Deployment Script
# WARNING: This application is NOT ready for production deployment
# See FINAL_PROD_SECURITY_REPORT.md for critical security issues

set -e  # Exit on any error

echo "🚀 I Need Numbers Deployment Script"
echo "⚠️  WARNING: This app has critical security vulnerabilities"
echo "📋 See FINAL_PROD_SECURITY_REPORT.md before deploying"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if this is a production deployment
if [ "$1" = "--force-production" ]; then
    echo -e "${RED}⚠️  FORCING PRODUCTION DEPLOYMENT DESPITE SECURITY ISSUES${NC}"
    echo -e "${RED}⚠️  THIS IS STRONGLY NOT RECOMMENDED${NC}"
    FORCE_DEPLOY=true
else 
    echo -e "${RED}❌ DEPLOYMENT BLOCKED${NC}"
    echo -e "${RED}Critical security issues must be fixed first:${NC}"
    echo "1. Stripe webhook signature verification"
    echo "2. Content Security Policy headers"
    echo "3. File upload security controls"
    echo "4. Security test suite"
    echo ""
    echo "Use --force-production to override (NOT RECOMMENDED)"
    exit 1
fi

# Deployment steps
echo -e "${YELLOW}🔧 Starting deployment process...${NC}"

# Step 1: Environment validation
echo -e "${YELLOW}📋 Step 1: Validating environment...${NC}"

# Check required environment variables
required_vars=(
    "JWT_SECRET_KEY"
    "MONGO_URL" 
    "REDIS_URL"
    "STRIPE_SECRET_KEY"
    "STRIPE_WEBHOOK_SECRET"
    "OPENAI_API_KEY"
)

for var in "${required_vars[@]}"
do
    if [ -z "${!var}" ]; then
        echo -e "${RED}❌ Missing required environment variable: $var${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ Environment variables validated${NC}"

# Step 2: Build frontend
echo -e "${YELLOW}📦 Step 2: Building frontend...${NC}"
cd /app/frontend

# Install dependencies
yarn install --frozen-lockfile
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend dependency installation failed${NC}"
    exit 1
fi

# Build for production
yarn build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend build completed${NC}"

# Step 3: Backend dependencies
echo -e "${YELLOW}🐍 Step 3: Installing backend dependencies...${NC}"
cd /app/backend

# Install Python dependencies
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend dependency installation failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend dependencies installed${NC}"

# Step 4: Database migration/setup
echo -e "${YELLOW}🗄️  Step 4: Database setup...${NC}"

# Test MongoDB connection
python3 -c "
import pymongo
import os
try:
    client = pymongo.MongoClient(os.environ['MONGO_URL'])
    client.admin.command('ping')
    print('✅ MongoDB connection successful')
except Exception as e:
    print(f'❌ MongoDB connection failed: {e}')
    exit(1)
" 
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Database connection test failed${NC}"
    exit 1
fi

# Step 5: Cache warmup
echo -e "${YELLOW}🔄 Step 5: Cache warmup...${NC}"

# Test Redis connection
python3 -c "
import redis
import os
try:
    r = redis.from_url(os.environ['REDIS_URL'])
    r.ping()
    print('✅ Redis connection successful')
except Exception as e:
    print(f'❌ Redis connection failed: {e}')
    exit(1)
"
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Redis connection test failed${NC}"
    exit 1
fi

# Step 6: Health checks (basic)
echo -e "${YELLOW}🏥 Step 6: Health checks...${NC}"

# Start services temporarily for health check
echo "Starting backend for health check..."
cd /app/backend
python3 -c "
import asyncio
from server import app
import uvicorn
import signal
import sys
import time
import requests
import threading

# Start server in background
def start_server():
    uvicorn.run(app, host='127.0.0.1', port=8001, log_level='error')

server_thread = threading.Thread(target=start_server, daemon=True)
server_thread.start()

# Wait for server to start
time.sleep(5)

try:
    # Test health endpoint
    response = requests.get('http://127.0.0.1:8001/health', timeout=10)
    if response.status_code == 200:
        print('✅ Health check passed')
    else:
        print(f'❌ Health check failed: {response.status_code}')
        sys.exit(1)
except Exception as e:
    print(f'❌ Health check failed: {e}')
    sys.exit(1)
" &
HEALTH_PID=$!

# Wait for health check
wait $HEALTH_PID
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Health check failed${NC}"
    exit 1
fi

# Step 7: Security validation
echo -e "${YELLOW}🔒 Step 7: Security validation...${NC}"
echo -e "${RED}⚠️  SECURITY VALIDATION SKIPPED - CRITICAL ISSUES REMAIN${NC}"
echo -e "${RED}⚠️  The following security issues are NOT resolved:${NC}"
echo "   - Stripe webhook signature verification"
echo "   - Content Security Policy headers" 
echo "   - File upload security controls"
echo "   - Comprehensive security test suite"

# Step 8: Final deployment
if [ "$FORCE_DEPLOY" = true ]; then
    echo -e "${YELLOW}🚢 Step 8: Final deployment...${NC}"
    echo -e "${RED}⚠️  DEPLOYING WITH KNOWN SECURITY VULNERABILITIES${NC}"
    
    # In a real deployment, this would:
    # - Copy files to production directory
    # - Update nginx configuration
    # - Restart services
    # - Update DNS if needed
    
    echo "Frontend built at: /app/frontend/build"
    echo "Backend ready at: /app/backend"
    echo ""
    echo -e "${GREEN}✅ Deployment completed (WITH SECURITY RISKS)${NC}"
    echo ""
    echo -e "${RED}🚨 CRITICAL REMINDER:${NC}"
    echo -e "${RED}This deployment has known security vulnerabilities.${NC}"
    echo -e "${RED}Fix issues in FINAL_PROD_SECURITY_REPORT.md immediately.${NC}"
else
    echo -e "${RED}❌ Deployment blocked due to security issues${NC}"
    exit 1
fi

# Success message
echo ""
echo -e "${GREEN}🎉 Deployment script completed${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Fix critical security issues in FINAL_PROD_SECURITY_REPORT.md"
echo "2. Run comprehensive security tests"  
echo "3. Configure production nginx/load balancer"
echo "4. Set up monitoring and logging"
echo "5. Create incident response plan"
echo ""
echo -e "${YELLOW}🔗 Service URLs (if force deployed):${NC}"
echo "Frontend: http://localhost:3000 (serve from /app/frontend/build)"
echo "Backend:  http://localhost:8001"
echo "Health:   http://localhost:8001/health"
echo ""
echo -e "${RED}⚠️  Remember: This deployment is NOT production-ready!${NC}"