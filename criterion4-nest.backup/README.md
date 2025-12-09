# Criterion4 NestJS Module

This is a NestJS-based modular implementation of the Criterion4 report generation system.

## Structure

```
criterion4-nest/
├── app.module.ts                   # Root application module
├── main.ts                         # Application entry point
├── tsconfig.json                   # TypeScript configuration
├── criterion4.module.ts            # Criterion4 feature module
├── criterion4.controller.ts        # HTTP endpoints controller
├── criterion4.service.ts           # Main business logic
├── dto/
│   └── generate-report.dto.ts      # Data transfer objects
├── interfaces/
│   └── report-data.interface.ts    # TypeScript interfaces
└── services/
    ├── report-generator.service.ts # PDF generation service
    └── data-fetcher.service.ts     # Data fetching service
```

## Installation

```bash
npm install
npm install --save-dev @types/node typescript ts-node
```

## Running the Module

### Standalone Mode
```bash
npm run start:nest
```

### Development Mode with Hot Reload
```bash
npm run dev:nest
```

## API Endpoints

### Generate Report
```
POST http://localhost:3001/api/criterion4/generate
Content-Type: application/json

{
  "reportData": {
    // Optional: Include report data or it will be fetched from database
  }
}
```

### Health Check
```
GET http://localhost:3001/api/criterion4/health
```

## Features

- ✅ Modular NestJS architecture
- ✅ Dependency injection
- ✅ TypeScript support
- ✅ Validation with class-validator
- ✅ Async PDF generation
- ✅ Data fetching service
- ✅ Clean separation of concerns
- ✅ Easy to test and maintain

## Integration with Express Backend

You can run this NestJS module alongside your existing Express backend on a different port, or integrate it into your Express app using NestJS's Express adapter.

## Environment Variables

Create a `.env` file in the root directory:

```
NEST_PORT=3001
DEPARTMENT=Computer Science & Engineering
PROGRAM_NAME=B.Tech (CSE)
PROGRAMME_CODE=CSE101
INSTITUTE_NAME=Allenhouse Institute of Technology
UNIVERSITY=AKTU, Lucknow
```

## Testing

```bash
npm run test
npm run test:e2e
npm run test:cov
```
