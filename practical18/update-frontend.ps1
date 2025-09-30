# PowerShell script to update frontend with backend URL

param(
    [Parameter(Mandatory=$true)]
    [string]$BackendUrl
)

Write-Host "🔗 Updating frontend with backend URL: $BackendUrl" -ForegroundColor Green

# Create .env file in frontend directory
$envContent = "REACT_APP_API_URL=$BackendUrl"
$envPath = "frontend\.env"

Write-Host "Creating $envPath..." -ForegroundColor Yellow
$envContent | Out-File -FilePath $envPath -Encoding UTF8

Write-Host "✅ Environment file created!" -ForegroundColor Green

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Yellow
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
Write-Host "Deploying to Firebase..." -ForegroundColor Yellow
firebase deploy --only hosting
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Firebase deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Frontend updated and deployed!" -ForegroundColor Green
Write-Host "Frontend URL: https://practical11-c4e74.web.app" -ForegroundColor Cyan
Write-Host "Backend URL: $BackendUrl" -ForegroundColor Cyan
