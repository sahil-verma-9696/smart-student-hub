import { Injectable, Logger } from '@nestjs/common';
import { ReportGeneratorService } from './services/report-generator.service';
import { DataFetcherService } from './services/data-fetcher.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ReportData } from './interfaces/report-data.interface';

@Injectable()
export class Criterion4Service {
  private readonly logger = new Logger(Criterion4Service.name);

  constructor(
    private readonly reportGenerator: ReportGeneratorService,
    private readonly dataFetcher: DataFetcherService,
  ) {}

  async generateReport(dto: GenerateReportDto): Promise<{ filePath: string; fileName: string }> {
    this.logger.log('Starting report generation');
    
    try {
      // Fetch data from database or use provided data
      const reportData: ReportData = dto.reportData || await this.dataFetcher.fetchAllData();
      
      // Generate PDF and save to file
      const result = await this.reportGenerator.generate(reportData, dto.fileName, dto.options);
      
      this.logger.log(`Report generated successfully: ${result.fileName}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to generate report: ${error.message}`, error.stack);
      throw error;
    }
  }

  async validateReportData(data: ReportData): Promise<boolean> {
    // Add validation logic
    return true;
  }
}
