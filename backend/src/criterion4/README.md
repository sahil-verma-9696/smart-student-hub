# Criterion4 Module

## Overview
The Criterion4 module is a NestJS module integrated into the Smart Student Hub backend for generating academic performance reports based on Criterion 4 standards.

## Module Structure

```
criterion4/
├── dto/                          # Data Transfer Objects
│   └── generate-report.dto.ts
├── interfaces/                   # TypeScript interfaces
│   └── report-data.interface.ts
├── modules/                      # Report generation modules
│   ├── header.js
│   ├── narrative.js
│   ├── tableB4a.js
│   ├── tableEnrollmentRatio.js
│   ├── tableGraduated.js
│   ├── tableInterInstitute.js
│   ├── tablePlacement.js
│   ├── tablePlacementDetails.js
│   ├── tableSecondYearAPI.js
│   ├── tableSuccessRate.js
│   └── tableThirdYearAPI.js
├── services/                     # Business logic services
│   ├── aiNarrativeGenerator.js
│   ├── data-fetcher.service.ts
│   └── report-generator.service.ts
├── utils/                        # Utility functions
│   ├── cursor.js
│   ├── ensureSpace.js
│   ├── table.js
│   ├── table2.js
│   └── text.js
├── output/                       # Generated PDF reports
├── criterion4.controller.ts      # API endpoints
├── criterion4.service.ts         # Main service
├── criterion4.module.ts          # Module configuration
└── sampleReportData.json         # Sample data for testing

```

## API Endpoints

### 1. Generate Report
**POST** `/api/criterion4/generate`

Generates a Criterion 4 report based on provided data.

**Request Body:**
```json
{
  "programInfo": {
    "department": "Computer Science & Engineering",
    "programName": "B.Tech (CSE)",
    "programmeCode": "CSE101",
    "instituteName": "Institute Name",
    "affiliatingUniversity": "University Name"
  },
  "batchYears": { ... },
  "batches": { ... }
}
```

**Response:**
```json
{
  "message": "Report generated successfully",
  "filePath": "/path/to/report.pdf",
  "fileName": "report.pdf",
  "timestamp": "2025-12-08T10:00:00.000Z"
}
```

### 2. Get Sample Data
**GET** `/api/criterion4/sample-data`

Returns sample report data that can be used for testing the report generation.

**Response:**
```json
{
  "message": "Sample data retrieved successfully",
  "data": { ... },
  "timestamp": "2025-12-08T10:00:00.000Z"
}
```

### 3. Health Check
**GET** `/api/criterion4/health`

Checks the health status of the Criterion4 module.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-08T10:00:00.000Z",
  "module": "criterion4"
}
```

## Usage Example

### Using Sample Data
```bash
# Get sample data
curl http://localhost:3000/api/criterion4/sample-data

# Generate report using the sample data
curl -X POST http://localhost:3000/api/criterion4/generate \
  -H "Content-Type: application/json" \
  -d @sampleData.json
```

### In Your Code
```typescript
import { Criterion4Service } from './criterion4/criterion4.service';

@Injectable()
export class YourService {
  constructor(private readonly criterion4Service: Criterion4Service) {}

  async generateReport(data: GenerateReportDto) {
    return await this.criterion4Service.generateReport(data);
  }
}
```

## Dependencies

- `pdfkit`: PDF generation library
- `@types/pdfkit`: TypeScript types for pdfkit
- NestJS core modules

## Features

- PDF report generation with custom formatting
- Multiple table types for different data presentations
- AI-powered narrative generation
- Data validation using class-validator
- TypeScript support with proper type definitions
- Modular architecture for easy maintenance

## Configuration

The module uses environment variables for configuration. Make sure to set up your `.env` file:

```env
# Add any required environment variables here
```

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Integration with Backend

The Criterion4 module is fully integrated into the Smart Student Hub backend and can be accessed through the main API gateway at `/api/criterion4/*`.

## Notes

- Generated reports are saved in the `output/` directory
- The module supports both TypeScript and JavaScript files for flexibility
- Sample data is provided for testing purposes
- The module is designed to be easily extensible for additional report types
