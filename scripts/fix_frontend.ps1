Write-Host "Fixing Frontend Dependencies..." -ForegroundColor Green

# 1. Remove v4 dependencies
npm uninstall @tailwindcss/postcss tailwindcss
if ($LASTEXITCODE -ne 0) { Write-Host "Uninstall failed, continuing..." -ForegroundColor Yellow }

# 2. Install v3 dependencies
Write-Host "Installing Tailwind v3..." -ForegroundColor Green
npm install -D tailwindcss@3 postcss autoprefixer
if ($LASTEXITCODE -ne 0) { Write-Error "Installation failed"; exit 1 }

# 3. Update PostCSS Config
$postcssConfig = @"
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
export default config;
"@
Set-Content -Path "postcss.config.mjs" -Value $postcssConfig

# 4. Clear Cache
if (Test-Path ".next") {
    Write-Host "Clearing .next cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".next"
}

# 5. Start App
Write-Host "Starting Application..." -ForegroundColor Green
npm run dev
