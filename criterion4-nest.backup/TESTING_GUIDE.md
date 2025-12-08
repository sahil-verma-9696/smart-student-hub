# ✅ Testing the Updated NestJS Module

## Quick Test Commands

### 1. Check Health
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/criterion4/health"
```

Expected output:
```json
{
  "status": "ok",
  "timestamp": "2025-12-07T...",
  "module": "criterion4"
}
```

### 2. Generate Report (with sample data)
```powershell
$body = Get-Content backend/criterion4-report/sampleReportData.json -Raw
$response = Invoke-RestMethod -Uri "http://localhost:3001/api/criterion4/generate" -Method Post -ContentType "application/json" -Body $body
$response
```

Expected output:
```json
{
  "message": "Report generated successfully",
  "filePath": "C:\\Users\\...\\backend\\criterion4-report\\output\\criterion4-test-1234567890.pdf",
  "fileName": "criterion4-test-1234567890.pdf",
  "timestamp": "2025-12-07T..."
}
```

###3. Generate Report with Custom Filename
```powershell
$body = @{
  reportData = (Get-Content backend/criterion4-report/sampleReportData.json | ConvertFrom-Json)
  fileName = "my-custom-report.pdf"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:3001/api/criterion4/generate" -Method Post -ContentType "application/json" -Body $body
```

### 4. Check Generated Files
```powershell
Get-ChildItem backend\criterion4-report\output\ | Sort-Object LastWriteTime -Descending | Select-Object -First 5 Name, LastWriteTime
```

## Output Location

All reports are saved to:
```
backend/criterion4-report/output/
```

Same as the original `criterion4-report` system!

## File Naming

- **Default**: `criterion4-test-{timestamp}.pdf`
- **Custom**: Specify `fileName` in request body

## Comparison

### Old System (criterion4-report)
```javascript
const report = require('./generateCriterion4Report');
report.generateCriterion4Report(data, 'report.pdf');
// Saves to: backend/criterion4-report/output/report.pdf
```

### New System (NestJS)
```http
POST http://localhost:3001/api/criterion4/generate
{
  "reportData": { ...data... },
  "fileName": "report.pdf"
}
// Saves to: backend/criterion4-report/output/report.pdf
```

**✅ Same output directory, same behavior!**
