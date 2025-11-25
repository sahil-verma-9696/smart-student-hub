import { Test, TestingModule } from '@nestjs/testing';
import { UpDocsController } from './up-docs.controller';
import { UpDocsService } from './up-docs.service';

describe('UpDocsController', () => {
  let controller: UpDocsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpDocsController],
      providers: [UpDocsService],
    }).compile();

    controller = module.get<UpDocsController>(UpDocsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
