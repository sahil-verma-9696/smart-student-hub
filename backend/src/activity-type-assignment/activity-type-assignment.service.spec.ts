import { Test, TestingModule } from '@nestjs/testing';
import { ActivityTypeAssignmentService } from './activity-type-assignment.service';

describe('ActivityTypeAssignmentService', () => {
  let service: ActivityTypeAssignmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivityTypeAssignmentService],
    }).compile();

    service = module.get<ActivityTypeAssignmentService>(ActivityTypeAssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
