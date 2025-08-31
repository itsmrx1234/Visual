#!/bin/bash
# Build script for Vercel deployment

echo "Building frontend..."
vite build

echo "Building backend..."
node build-server.js

echo "Build complete!"
echo "Frontend built to: dist/public"
echo "Backend built to: dist/index.js"

# Verify build output
if [ -d "dist/public" ]; then
    echo "✓ Frontend build successful"
    ls -la dist/public/
else
    echo "✗ Frontend build failed"
    exit 1
fi

if [ -f "dist/index.js" ]; then
    echo "✓ Backend build successful"
    ls -la dist/index.js
else
    echo "✗ Backend build failed"
    exit 1
fi

echo "Project ready for Vercel deployment!"