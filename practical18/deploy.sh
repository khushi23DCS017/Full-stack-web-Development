#!/bin/bash

# Bash Deployment Script for Taskify MERN App

echo "🚀 Taskify Deployment Script"
echo "================================"

# Check if Firebase CLI is installed
echo "Checking Firebase CLI..."
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

echo "✅ Firebase CLI found: $(firebase --version)"

# Build frontend
echo ""
echo "Building React frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi
echo "✅ Frontend built successfully!"

# Go back to root
cd ..

# Deploy to Firebase
echo ""
echo "Deploying to Firebase..."
firebase deploy --only hosting
if [ $? -ne 0 ]; then
    echo "❌ Firebase deployment failed!"
    exit 1
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo "Frontend URL: https://practical11-c4e74.web.app"
echo ""
echo "Next steps:"
echo "1. Deploy your backend to Railway/Render"
echo "2. Update REACT_APP_API_URL in frontend/.env"
echo "3. Rebuild and redeploy frontend"
echo ""
echo "See DEPLOYMENT_GUIDE.md for detailed instructions."
