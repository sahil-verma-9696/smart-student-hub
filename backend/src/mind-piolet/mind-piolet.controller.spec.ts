import { Test, TestingModule } from '@nestjs/testing';
import { MindPioletController } from './mind-piolet.controller';
import { MindPioletService } from './mind-piolet.service';

describe('MindPioletController', () => {
  let controller: MindPioletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MindPioletController],
      providers: [MindPioletService],
    }).compile();

    controller = module.get<MindPioletController>(MindPioletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
