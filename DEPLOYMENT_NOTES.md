# Deployment Configuration Notes

## Issue: Backend 502 Errors After Container Restart

### Root Cause
The backend uses WeasyPrint for PDF generation, which requires system libraries that are not persisted in the container image. When the container restarts, these libraries are lost, causing the backend to crash with:

```
OSError: cannot load library 'libpangoft2-1.0-0'
```

### Symptoms
- 502 Bad Gateway errors on all API endpoints
- Login fails with "Login failed. Please try again"
- Backend logs show WeasyPrint import errors

### Permanent Solution

**Option 1: Supervisor Configuration (Recommended)**
Update the supervisor backend command to use the startup wrapper:

```ini
[program:backend]
command=/app/backend/start_backend.sh
directory=/app/backend
...
```

**Option 2: Dockerfile (Best for Production)**
If you have access to the Dockerfile, add:

```dockerfile
RUN apt-get update && apt-get install -y \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libgdk-pixbuf-xlib-2.0-0 \
    libgdk-pixbuf2.0-bin \
    && rm -rf /var/lib/apt/lists/*
```

**Option 3: Manual Fix (Temporary)**
After each container restart, run:

```bash
sudo apt-get install -y libpango-1.0-0 libpangoft2-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf2.0-0
sudo supervisorctl restart backend
```

### Scripts Created

1. `/app/backend/install_dependencies.sh` - Checks and installs dependencies
2. `/app/backend/start_backend.sh` - Startup wrapper that ensures dependencies before starting backend

### Prevention

To prevent this issue in future deployments:
1. Use the startup wrapper script in supervisor config
2. OR add system dependencies to the container image via Dockerfile
3. OR use a persistent volume for system libraries

### Testing

After implementing the fix, verify with:

```bash
# Check if libraries are installed
ldconfig -p | grep libpangoft2

# Test backend startup
/app/backend/start_backend.sh

# Test API endpoint
curl https://your-domain.com/api/health
```

## Recommended Action for Platform Team

This issue should be addressed at the platform level by:
1. Adding WeasyPrint system dependencies to the base container image
2. OR providing a mechanism for persistent system package installation
3. OR allowing custom Dockerfile configuration for projects that need system libraries
