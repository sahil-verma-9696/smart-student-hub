import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ActivityAssignmentService } from '../activity-assignment/activity-assignment.service';
import { Activity, ActivitySchema } from './schema/activity.schema';
import { ActivityAssignment } from '../activity-assignment/schema/activity-assignment.schema';
import { ActivityAssignmentSchema } from '../activity-assignment/schema/activity-assignment.schema';
import { Student, StudentSchema } from '../student/schema/student.schema';
import { ActivityType, ActivityTypeSchema } from '../activity-type/schema/activity-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
      { name: ActivityAssignment.name, schema: ActivityAssignmentSchema },
      { name: Student.name, schema: StudentSchema },
      { name: ActivityType.name, schema: ActivityTypeSchema },
    ]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityAssignmentService],
})
export class ActivityModule {}
