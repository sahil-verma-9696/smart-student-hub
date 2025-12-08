import { Test, TestingModule } from '@nestjs/testing';
import { ActivityAssignmentController } from './activity-assignment.controller';

describe('ActivityAssignmentController', () => {
  let controller: ActivityAssignmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityAssignmentController],
    }).compile();

    controller = module.get<ActivityAssignmentController>(ActivityAssignmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
