import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReportGeneratorService } from './services/report-generator.service';
import { DataFetcherService } from './services/data-fetcher.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ReportData } from './interfaces/report-data.interface';
import { NbaReport, NbaReportDocument } from './schemas/nba-report.schema';

@Injectable()
export class Criterion4Service {
  private readonly logger = new Logger(Criterion4Service.name);

  constructor(
    @InjectModel(NbaReport.name) private nbaReportModel: Model<NbaReportDocument>,
    private readonly reportGenerator: ReportGeneratorService,
    private readonly dataFetcher: DataFetcherService,
  ) { }

  async getPrograms(): Promise<any[]> {
    const programs = await this.nbaReportModel.find({}, { 'reportData.programInfo': 1 }).exec();
    this.logger.log(`Fetched ${programs.length} programs from nbareports collection`);
    if (programs.length > 0) {
      this.logger.log('Sample program data:', JSON.stringify(programs[0]));
    } else {
      this.logger.warn('No programs found in nbareports collection. Check if collection exists and has data.');
    }
    return this.nbaReportModel.find({}, { 'reportData': 1 }).exec();
  }

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
