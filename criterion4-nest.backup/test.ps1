# Criterion4 NestJS - Quick Test Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Testing Criterion4 NestJS Module" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test health endpoint
Write-Host "1. Testing health endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/api/criterion4/health" -Method Get
    Write-Host "✓ Health check passed!" -ForegroundColor Green
    $health | Format-List
} catch {
    Write-Host "✗ Server not running. Please start with 'npm start' first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "2. Generating test report..." -ForegroundColor Yellow

# Generate report
$data = Get-Content sampleReportData.json | ConvertFrom-Json
$body = @{ 
    reportData = $data
    fileName = "test-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').pdf"
} | ConvertTo-Json -Depth 20

try {
    $result = Invoke-RestMethod -Uri "http://localhost:3001/api/criterion4/generate" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "✓ Report generated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Result:" -ForegroundColor Cyan
    $result | Format-List
    
    Write-Host ""
    Write-Host "3. Output files:" -ForegroundColor Yellow
    Get-ChildItem output\*.pdf | Sort-Object LastWriteTime -Descending | 
        Select-Object -First 5 Name, LastWriteTime, @{Name="Size(KB)";Expression={[math]::Round($_.Length/1KB,2)}} |
        Format-Table -AutoSize
    
} catch {
    Write-Host "✗ Failed to generate report" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " All tests passed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
