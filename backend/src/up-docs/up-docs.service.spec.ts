import { Test, TestingModule } from '@nestjs/testing';
import { UpDocsService } from './up-docs.service';

describe('UpDocsService', () => {
  let service: UpDocsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpDocsService],
    }).compile();

    service = module.get<UpDocsService>(UpDocsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
