import { Module } from '@nestjs/common';
import { ActivityTypeAssignmentController } from './activity-type-assignment.controller';
import { ActivityTypeAssignmentService } from './activity-type-assignment.service';

@Module({
  controllers: [ActivityTypeAssignmentController],
  providers: [ActivityTypeAssignmentService]
})
export class ActivityTypeAssignmentModule {}
