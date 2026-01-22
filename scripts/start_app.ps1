$env:Path = "C:\Program Files\nodejs;" + $env:Path
Write-Host "Environment configured. Starting Application..." -ForegroundColor Green

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

npm run dev
