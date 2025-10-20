# I Need Numbers - Real Estate Financial Tools

## Production Deployment Notes

### Critical System Dependencies

The backend requires **WeasyPrint system libraries** for PDF generation. If the backend returns 502 errors after a restart:

```bash
# Install required system libraries
sudo apt-get update
sudo apt-get install -y libpango-1.0-0 libpangoft2-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf2.0-0

# Restart backend
sudo supervisorctl restart backend
```

**Automated Solution**: A startup script has been created at `/app/backend/install_dependencies.sh` that automatically installs these dependencies.

### Backend Startup

The backend can be started with the wrapper script that ensures dependencies are installed:

```bash
/app/backend/start_backend.sh
```

Or manually with:
```bash
cd /app/backend
uvicorn server:app --host 0.0.0.0 --port 8001 --workers 1 --reload
```

### Services

```bash
# Check status
sudo supervisorctl status

# Restart services
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
sudo supervisorctl restart all
```

## Here are your Instructions
