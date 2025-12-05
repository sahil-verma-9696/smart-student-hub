import { Test, TestingModule } from '@nestjs/testing';
import { ActivityAssignmentService } from './activity-assignment.service';

describe('ActivityAssignmentService', () => {
  let service: ActivityAssignmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivityAssignmentService],
    }).compile();

    service = module.get<ActivityAssignmentService>(ActivityAssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
