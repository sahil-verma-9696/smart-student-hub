import { Test, TestingModule } from '@nestjs/testing';
import { MindPioletService } from './mind-piolet.service';

describe('MindPioletService', () => {
  let service: MindPioletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MindPioletService],
    }).compile();

    service = module.get<MindPioletService>(MindPioletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
