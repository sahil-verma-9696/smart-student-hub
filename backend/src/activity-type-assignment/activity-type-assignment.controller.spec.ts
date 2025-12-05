import { Test, TestingModule } from '@nestjs/testing';
import { ActivityTypeAssignmentController } from './activity-type-assignment.controller';

describe('ActivityTypeAssignmentController', () => {
  let controller: ActivityTypeAssignmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityTypeAssignmentController],
    }).compile();

    controller = module.get<ActivityTypeAssignmentController>(ActivityTypeAssignmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
