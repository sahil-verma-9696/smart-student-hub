import { Test, TestingModule } from '@nestjs/testing';
import { Criterion4Service } from './criterion4.service';
import { ReportGeneratorService } from './services/report-generator.service';
import { DataFetcherService } from './services/data-fetcher.service';

describe('Criterion4Service', () => {
  let service: Criterion4Service;
  let reportGenerator: ReportGeneratorService;
  let dataFetcher: DataFetcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Criterion4Service,
        {
          provide: ReportGeneratorService,
          useValue: {
            generate: jest.fn(),
          },
        },
        {
          provide: DataFetcherService,
          useValue: {
            fetchAllData: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<Criterion4Service>(Criterion4Service);
    reportGenerator = module.get<ReportGeneratorService>(ReportGeneratorService);
    dataFetcher = module.get<DataFetcherService>(DataFetcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateReportData', () => {
    it('should validate report data', async () => {
      const mockData: any = {
        programInfo: {},
        batchYears: {},
        batches: {},
      };
      
      const result = await service.validateReportData(mockData);
      expect(result).toBe(true);
    });
  });
});
