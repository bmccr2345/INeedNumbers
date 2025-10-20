#!/bin/bash
# Startup script to ensure WeasyPrint system dependencies are installed
# This runs before the backend starts to prevent 502 errors

echo "Checking WeasyPrint system dependencies..."

# Check if libpangoft2 is installed
if ! ldconfig -p | grep -q "libpangoft2-1.0"; then
    echo "Installing WeasyPrint system dependencies..."
    sudo apt-get update -qq
    sudo apt-get install -y \
        libpango-1.0-0 \
        libpangoft2-1.0-0 \
        libpangocairo-1.0-0 \
        libgdk-pixbuf2.0-0 \
        libgdk-pixbuf-xlib-2.0-0 \
        libgdk-pixbuf2.0-bin
    echo "✅ WeasyPrint dependencies installed"
else
    echo "✅ WeasyPrint dependencies already installed"
fi
