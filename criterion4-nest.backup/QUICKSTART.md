# Quick Start Guide - Criterion4 NestJS Module

## 🚀 Getting Started

### 1. Install Dependencies
Already done! The following packages were installed:
- @nestjs/common
- @nestjs/core
- @nestjs/platform-express
- reflect-metadata
- rxjs
- typescript
- class-validator
- class-transformer

### 2. Configure Environment
Copy the example environment file:
```bash
cp backend/criterion4-nest/.env.example backend/criterion4-nest/.env
```

Edit `.env` with your institution details.

### 3. Run the NestJS Module

#### Standalone Mode (Recommended for testing)
```bash
npm run start:nest
```
The module will start on `http://localhost:3001`

#### Development Mode with Auto-reload
```bash
npm run dev:nest
```

### 4. Test the API

#### Health Check
```bash
curl http://localhost:3001/api/criterion4/health
```

#### Generate Report with Sample Data
```bash
curl -X POST http://localhost:3001/api/criterion4/generate \
  -H "Content-Type: application/json" \
  -d @backend/criterion4-report/sampleReportData.json \
  --output criterion4-report.pdf
```

Or using PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/criterion4/health" -Method Get
```

### 5. Integration Options

#### Option A: Run Both Servers (Recommended for now)
- Express backend on port 3000
- NestJS module on port 3001

#### Option B: Integrate into Express
You can mount the NestJS module into your existing Express app. See integration example below.

## 📁 Module Structure

```
criterion4-nest/
├── main.ts                         # Entry point
├── app.module.ts                   # Root module
├── criterion4.module.ts            # Feature module
├── criterion4.controller.ts        # API endpoints
├── criterion4.service.ts           # Business logic
├── dto/
│   └── generate-report.dto.ts      # Request validation
├── interfaces/
│   └── report-data.interface.ts    # TypeScript types
└── services/
    ├── report-generator.service.ts # PDF generation
    └── data-fetcher.service.ts     # Data fetching
```

## 🔧 Key Features

✅ **Type Safety**: Full TypeScript support with interfaces
✅ **Validation**: Automatic request validation with class-validator
✅ **Dependency Injection**: Clean, testable architecture
✅ **Modular**: Easy to extend and maintain
✅ **Backward Compatible**: Reuses existing criterion4-report code
✅ **Testing Ready**: Unit test examples included

## 🎯 Next Steps

1. ✅ Module structure created
2. ✅ Dependencies installed
3. ⏭️ Test the module endpoints
4. ⏭️ Integrate with frontend
5. ⏭️ Add authentication/authorization
6. ⏭️ Add more comprehensive tests
7. ⏭️ Consider migrating other routes to NestJS

## 📝 Notes

- The module reuses existing PDF generation logic from `criterion4-report/`
- It provides a clean API layer with proper validation
- Can run independently or be integrated into Express
- Uses the same MongoDB models as the Express backend
