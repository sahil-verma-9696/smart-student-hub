import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityAssignmentController } from './activity-assignment.controller';
import { ActivityAssignmentService } from './activity-assignment.service';
import { ActivityAssignment, ActivityAssignmentSchema } from './schema/activity-assignment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityAssignment.name, schema: ActivityAssignmentSchema },
    ]),
  ],
  controllers: [ActivityAssignmentController],
  providers: [ActivityAssignmentService],
  exports: [ActivityAssignmentService],
})
export class ActivityAssignmentModule {}
