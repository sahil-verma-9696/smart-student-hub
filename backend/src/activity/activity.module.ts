import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Activity, ActivitySchema } from './schema/acivity.schema';
import { ActivityType, ActivityTypeSchema } from '../activity-type/schema/activity-type.schema';
import { Student, StudentSchema } from '../student/schema/student.schema';
import { Faculty, FacultySchema } from '../faculty/schemas/faculty.schema';
import { ActivityAssignmentModule } from '../activity-assignment/activity-assignment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
      { name: ActivityType.name, schema: ActivityTypeSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Faculty.name, schema: FacultySchema },
    ]),
    ActivityAssignmentModule, // Import for ActivityAssignmentService
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
