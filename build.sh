#!/bin/bash
# Build script for Vercel deployment

echo "Building frontend..."
npm run build

echo "Build complete!"
echo "Frontend built to: dist/public"
echo "Backend ready at: server/index.ts"

# Verify build output
if [ -d "dist/public" ]; then
    echo "✓ Frontend build successful"
    ls -la dist/public/
else
    echo "✗ Frontend build failed"
    exit 1
fi

if [ -f "server/index.ts" ]; then
    echo "✓ Backend entry point exists"
else
    echo "✗ Backend entry point missing"
    exit 1
fi

echo "Project ready for Vercel deployment!"