import { Controller, Post, Body, Res, HttpStatus, Get } from '@nestjs/common';
import { Response } from 'express';
import { Criterion4Service } from './criterion4.service';
import { GenerateReportDto } from './dto/generate-report.dto';

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
      
      res.status(HttpStatus.OK).json({
        message: 'Report generated successfully',
        filePath: result.filePath,
        fileName: result.fileName,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to generate report',
        error: error.message,
      });
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
