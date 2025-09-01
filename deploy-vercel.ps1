# Vercel Deployment Script for Windows PowerShell
# Updated for MongoDB Atlas Configuration

Write-Host "=== Chatbot Deployment Script ===" -ForegroundColor Green
Write-Host "Deploying with MongoDB Atlas configuration..." -ForegroundColor Yellow

# Check if Vercel CLI is installed
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Vercel CLI" -ForegroundColor Red
        exit 1
    }
}

# Check if .env file exists in backend
if (-not (Test-Path "backend\.env")) {
    Write-Host "Warning: backend\.env file not found!" -ForegroundColor Red
    Write-Host "Make sure your MongoDB Atlas configuration is set up." -ForegroundColor Yellow
    exit 1
}

# Verify MongoDB Atlas URL is configured
$envContent = Get-Content "backend\.env" -Raw
if ($envContent -notmatch "MONGO_URL=mongodb\+srv://") {
    Write-Host "Warning: MongoDB Atlas URL not found in .env file!" -ForegroundColor Red
    Write-Host "Please configure MONGO_URL with your Atlas connection string." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ MongoDB Atlas configuration verified" -ForegroundColor Green

# Login to Vercel (if not already logged in)
Write-Host "Checking Vercel authentication..." -ForegroundColor Yellow
vercel whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Vercel:" -ForegroundColor Yellow
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to login to Vercel" -ForegroundColor Red
        exit 1
    }
}

# Deploy Backend
Write-Host "\n=== Deploying Backend ===" -ForegroundColor Cyan
Set-Location backend
try {
    $backendResult = vercel --prod 2>&1
    if ($LASTEXITCODE -eq 0) {
        $backendUrl = ($backendResult | Select-String "https://.*\.vercel\.app").Matches.Value | Select-Object -Last 1
        Write-Host "✅ Backend deployed successfully!" -ForegroundColor Green
        Write-Host "Backend URL: $backendUrl" -ForegroundColor White
    } else {
        Write-Host "❌ Backend deployment failed!" -ForegroundColor Red
        Write-Host $backendResult -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error during backend deployment: $_" -ForegroundColor Red
    exit 1
}

# Deploy Frontend
Write-Host "\n=== Deploying Frontend ===" -ForegroundColor Cyan
Set-Location ..\frontend
try {
    $frontendResult = vercel --prod 2>&1
    if ($LASTEXITCODE -eq 0) {
        $frontendUrl = ($frontendResult | Select-String "https://.*\.vercel\.app").Matches.Value | Select-Object -Last 1
        Write-Host "✅ Frontend deployed successfully!" -ForegroundColor Green
        Write-Host "Frontend URL: $frontendUrl" -ForegroundColor White
    } else {
        Write-Host "❌ Frontend deployment failed!" -ForegroundColor Red
        Write-Host $frontendResult -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error during frontend deployment: $_" -ForegroundColor Red
    exit 1
}

# Summary
Write-Host "\n=== Deployment Summary ===" -ForegroundColor Green
Write-Host "✅ Backend:  $backendUrl" -ForegroundColor White
Write-Host "✅ Frontend: $frontendUrl" -ForegroundColor White
Write-Host "\n🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "Share the Frontend URL with your users to access the chatbot." -ForegroundColor Yellow

# Return to original directory
Set-Location ..