import { Controller, Post, Body, Res, HttpStatus, Get } from '@nestjs/common';
import type { Response } from 'express';
import { Criterion4Service } from './criterion4.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import * as fs from 'fs';
import * as path from 'path';

@Controller('api/criterion4')
export class Criterion4Controller {
  constructor(private readonly criterion4Service: Criterion4Service) {}

  @Post('generate')
  async generateReport(
    @Body() generateReportDto: GenerateReportDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.criterion4Service.generateReport(generateReportDto);
      
      // Check if PDF file exists
      if (fs.existsSync(result.filePath)) {
        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
        
        // Stream the PDF file
        const fileStream = fs.createReadStream(result.filePath);
        fileStream.pipe(res);
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Report generated but file not found',
          error: 'PDF file does not exist at the expected path',
        });
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to generate report',
        error: error.message,
      });
    }
  }

  @Get('sample-data')
  getSampleData() {
    try {
      const sampleDataPath = path.join(__dirname, 'sampleReportData.json');
      const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf-8'));
      
      return {
        message: 'Sample data retrieved successfully',
        data: sampleData,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Failed to load sample data: ${error.message}`);
    }
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      module: 'criterion4',
    };
  }
}
