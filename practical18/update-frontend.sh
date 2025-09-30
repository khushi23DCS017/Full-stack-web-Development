#!/bin/bash

# Bash script to update frontend with backend URL

if [ $# -eq 0 ]; then
    echo "Usage: ./update-frontend.sh <backend-url>"
    echo "Example: ./update-frontend.sh https://taskify-backend-xxxx.onrender.com"
    exit 1
fi

BACKEND_URL=$1

echo "🔗 Updating frontend with backend URL: $BACKEND_URL"

# Create .env file in frontend directory
echo "REACT_APP_API_URL=$BACKEND_URL" > frontend/.env

echo "✅ Environment file created!"

# Build frontend
echo "Building frontend..."
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
echo "Deploying to Firebase..."
firebase deploy --only hosting
if [ $? -ne 0 ]; then
    echo "❌ Firebase deployment failed!"
    exit 1
fi

echo "🎉 Frontend updated and deployed!"
echo "Frontend URL: https://practical11-c4e74.web.app"
echo "Backend URL: $BACKEND_URL"
