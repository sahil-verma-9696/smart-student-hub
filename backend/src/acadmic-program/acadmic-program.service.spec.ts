import { Test, TestingModule } from '@nestjs/testing';
import { AcadmicProgramService } from './acadmic-program.service';

describe('AcadmicProgramService', () => {
  let service: AcadmicProgramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcadmicProgramService],
    }).compile();

    service = module.get<AcadmicProgramService>(AcadmicProgramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
