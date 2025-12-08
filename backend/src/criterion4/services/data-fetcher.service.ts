import { Injectable, Logger } from '@nestjs/common';
import { ReportData } from '../interfaces/report-data.interface';

@Injectable()
export class DataFetcherService {
  private readonly logger = new Logger(DataFetcherService.name);

  async fetchAllData(): Promise<ReportData> {
    this.logger.log('Returning empty placeholder data structure');
    
    // Return empty/placeholder data when no data is provided
    // Users should provide reportData in the request body
    return {
      programInfo: this.getProgramInfo(),
      batchYears: this.getBatchYears(),
      batches: {},
      graduationStats: {},
      totalGraduationStats: {},
      placementStats: {},
      placementDetails: {},
      interInstituteEvents: {
        outsideState: [],
        withinState: [],
        prizeWinners: []
      },
      codingCompetitions: [],
      universityMerit: []
    };
  }

  private getProgramInfo(): any {
    // You can fetch this from config or database
    return {
      department: process.env.DEPARTMENT || 'Computer Science & Engineering',
      programName: process.env.PROGRAM_NAME || 'B.Tech (CSE)',
      programmeCode: process.env.PROGRAMME_CODE || 'CSE101',
      instituteName: process.env.INSTITUTE_NAME || 'Allenhouse Institute of Technology',
      affiliatingUniversity: process.env.UNIVERSITY || 'AKTU, Lucknow',
    };
  }

  private getBatchYears(): any {
    const currentYear = new Date().getFullYear();
    const getCayFormat = (offset: number) => {
      const year = currentYear - offset;
      return `${year}-${(year + 1).toString().slice(-2)}`;
    };

    return {
      CAY: getCayFormat(0),
      CAYm1: getCayFormat(1),
      CAYm2: getCayFormat(2),
      CAYm3: getCayFormat(3),
      CAYm4: getCayFormat(4),
      CAYm5: getCayFormat(5),
      CAYm6: getCayFormat(6),
    };
  }
}
