# Criterion4 Module Test Script

## Prerequisites
Make sure the backend server is running:
```bash
cd backend
npm run start:dev
```

## Test Commands

### 1. Health Check
Test if the Criterion4 module is running:
```bash
curl http://localhost:3000/api/criterion4/health
```

Expected Response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-08T...",
  "module": "criterion4"
}
```

### 2. Get Sample Data
Retrieve sample report data:
```bash
curl http://localhost:3000/api/criterion4/sample-data
```

Expected Response:
```json
{
  "message": "Sample data retrieved successfully",
  "data": {
    "programInfo": { ... },
    "batchYears": { ... },
    "batches": { ... }
  },
  "timestamp": "2025-12-08T..."
}
```

### 3. Generate Report (Using Sample Data)
Generate a PDF report using the sample data:

#### PowerShell:
```powershell
$sampleData = Invoke-RestMethod -Uri "http://localhost:3000/api/criterion4/sample-data" | Select-Object -ExpandProperty data
$jsonBody = $sampleData | ConvertTo-Json -Depth 10
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/criterion4/generate" -ContentType "application/json" -Body "{`"reportData`": $jsonBody}"
```

#### Using curl (if installed):
```bash
curl -X POST http://localhost:3000/api/criterion4/generate \
  -H "Content-Type: application/json" \
  -d "$(curl http://localhost:3000/api/criterion4/sample-data | jq '.data | {reportData: .}')"
```

Expected Response:
```json
{
  "message": "Report generated successfully",
  "filePath": "/path/to/output/report.pdf",
  "fileName": "report.pdf",
  "timestamp": "2025-12-08T..."
}
```

## Testing with Postman or Thunder Client

### Endpoint 1: Health Check
- Method: GET
- URL: `http://localhost:3000/api/criterion4/health`

### Endpoint 2: Get Sample Data
- Method: GET
- URL: `http://localhost:3000/api/criterion4/sample-data`

### Endpoint 3: Generate Report
- Method: POST
- URL: `http://localhost:3000/api/criterion4/generate`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "reportData": {
    // Paste the data from sample-data endpoint here
  }
}
```

## Notes
- The MongoDB connection warning can be ignored if you're only testing the Criterion4 module endpoints
- Generated PDF reports will be saved in: `backend/dist/criterion4/output/`
- The sample data contains realistic test data for all required report sections
