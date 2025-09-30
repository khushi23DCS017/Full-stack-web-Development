# PowerShell Deployment Script for Taskify MERN App

Write-Host "🚀 Taskify Deployment Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if Firebase CLI is installed
Write-Host "Checking Firebase CLI..." -ForegroundColor Yellow
try {
    $firebaseVersion = firebase --version
    Write-Host "✅ Firebase CLI found: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}

# Build frontend
Write-Host "`nBuilding React frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend built successfully!" -ForegroundColor Green

# Go back to root
Set-Location ..

# Deploy to Firebase
Write-Host "`nDeploying to Firebase..." -ForegroundColor Yellow
firebase deploy --only hosting
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Firebase deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "Frontend URL: https://practical11-c4e74.web.app" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Deploy your backend to Railway/Render" -ForegroundColor White
Write-Host "2. Update REACT_APP_API_URL in frontend/.env" -ForegroundColor White
Write-Host "3. Rebuild and redeploy frontend" -ForegroundColor White
Write-Host "`nSee DEPLOYMENT_GUIDE.md for detailed instructions." -ForegroundColor Cyan
