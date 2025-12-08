# Criterion4 NestJS Module - Standalone

This is a **self-contained** NestJS module for generating Criterion4 reports. Everything needed to run is in this folder.

## 📁 Folder Structure

```
criterion4-nest/
├── package.json              # Dependencies & scripts
├── .env                      # Configuration
├── tsconfig.json            # TypeScript config
├── main.ts                  # Application entry point
├── app.module.ts            # Root module
├── criterion4.module.ts     # Feature module
├── criterion4.controller.ts # HTTP endpoints
├── criterion4.service.ts    # Business logic
├── dto/                     # Request validation
├── interfaces/              # TypeScript types
├── services/                # PDF & data services
├── modules/                 # PDF generation modules (copied from criterion4-report)
├── utils/                   # Utility functions (copied from criterion4-report)
├── output/                  # Generated PDFs saved here
└── sampleReportData.json    # Sample data for testing
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend/criterion4-nest
npm install
```

### 2. Configure Environment
Edit `.env` file with your institution details (already created with defaults).

### 3. Run the Server
```bash
npm start
```

Server will start on: **http://localhost:3001**

### 4. Test the API

#### Health Check
```bash
curl http://localhost:3001/api/criterion4/health
```

#### Generate Report (PowerShell)
```powershell
$data = Get-Content sampleReportData.json | ConvertFrom-Json
$body = @{ reportData = $data } | ConvertTo-Json -Depth 20
Invoke-RestMethod -Uri "http://localhost:3001/api/criterion4/generate" -Method Post -ContentType "application/json" -Body $body
```

#### Check Output
```bash
ls output/
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the server |
| `npm run dev` | Development mode with auto-reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm run start:prod` | Run compiled JavaScript |
| `npm test` | Run tests |

## 🔌 API Endpoints

### GET `/api/criterion4/health`
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-08T...",
  "module": "criterion4"
}
```

### POST `/api/criterion4/generate`
Generate PDF report

**Request Body:**
```json
{
  "reportData": {
    "programInfo": { ... },
    "batchYears": { ... },
    "batches": { ... },
    ...
  },
  "fileName": "my-report.pdf",  // Optional
  "options": {                   // Optional
    "departmentName": "CSE",
    "instituteName": "AIT"
  }
}
```

**Response:**
```json
{
  "message": "Report generated successfully",
  "filePath": "C:\\...\\criterion4-nest\\output\\my-report.pdf",
  "fileName": "my-report.pdf",
  "timestamp": "2025-12-08T..."
}
```

## 📂 Output Location

All generated PDFs are saved to:
```
criterion4-nest/output/
```

## 🎯 Standalone Features

✅ **Self-contained** - All dependencies in this folder
✅ **Own package.json** - Independent from parent project
✅ **Own node_modules** - No conflicts
✅ **Local modules** - Utils and modules copied locally
✅ **Local output** - PDFs saved to `output/` folder
✅ **Sample data included** - Test without external data

## 🔧 Configuration

Edit `.env` file:
```env
PORT=3001
DEPARTMENT=Your Department
PROGRAM_NAME=Your Program
INSTITUTE_NAME=Your Institute
UNIVERSITY=Your University
```

## 📦 Dependencies

All required packages are in `package.json`:
- NestJS framework
- PDFKit for PDF generation
- TypeScript support
- Class validators
- Testing libraries

## 🧪 Testing

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

## 🎨 Usage Examples

### Basic Report Generation
```typescript
POST http://localhost:3001/api/criterion4/generate
Content-Type: application/json

{
  "reportData": { ...from sampleReportData.json... }
}
```

### Custom Filename
```typescript
{
  "reportData": { ... },
  "fileName": "criterion4-2025.pdf"
}
```

### With Options
```typescript
{
  "reportData": { ... },
  "fileName": "report.pdf",
  "options": {
    "departmentName": "Computer Science",
    "instituteName": "My Institute"
  }
}
```

## 📖 Sample Data

Use `sampleReportData.json` for testing. It contains complete data structure with all required fields.

## 🔄 Development Workflow

1. Start dev server: `npm run dev`
2. Make changes to TypeScript files
3. Server auto-reloads
4. Test with API calls
5. Check output in `output/` folder

## 🚀 Production Deployment

1. Build the project: `npm run build`
2. Run production server: `npm run start:prod`
3. Or use PM2: `pm2 start dist/main.js --name criterion4`

## ⚙️ TypeScript Configuration

The module uses `tsconfig.json` with:
- CommonJS modules
- Decorator support
- Strict null checks disabled
- ES2021 target

## 📝 Notes

- Module runs independently of parent project
- Can be deployed as a separate microservice
- All dependencies are self-contained
- No external database required (use request body data)
- PDFs are saved locally in `output/` folder

---

**Ready to use!** 🎉

Just run `npm install` and `npm start` from this folder.
