#!/bin/bash
# Build script for Vercel deployment

echo "Building frontend..."
vite build

echo "Building backend..."
node build-server.js

echo "Copying backend to api directory..."
mkdir -p api
cp dist/index.js api/index.js

echo "Build complete!"
echo "Frontend built to: dist/public"
echo "Backend copied to: api/index.js"

# Verify build output
if [ -d "dist/public" ]; then
    echo "✓ Frontend build successful"
    ls -la dist/public/
else
    echo "✗ Frontend build failed"
    exit 1
fi

if [ -f "api/index.js" ]; then
    echo "✓ Backend build successful"
    ls -la api/index.js
else
    echo "✗ Backend build failed"
    exit 1
fi

echo "Project ready for Vercel deployment!"