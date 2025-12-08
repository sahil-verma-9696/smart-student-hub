import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityAssignmentController } from './activity-assignment.controller';
import { ActivityAssignmentService } from './activity-assignment.service';
import {
  ActivityAssignment,
  ActivityAssignmentSchema,
} from './schema/activity-assignment.schema';
import { Student, StudentSchema } from '../student/schema/student.schema';
import { Faculty, FacultySchema } from '../faculty/schemas/faculty.schema';
import { Academic, AcademicSchema } from '../academic/schema/academic.schema';
import { Activity, ActivitySchema } from '../activity/schema/acivity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityAssignment.name, schema: ActivityAssignmentSchema },
      { name: Activity.name, schema: ActivitySchema },
      { name: Student.name, schema: StudentSchema },
      { name: Faculty.name, schema: FacultySchema },
      { name: Academic.name, schema: AcademicSchema },
    ]),
  ],
  controllers: [ActivityAssignmentController],
  providers: [ActivityAssignmentService],
  exports: [ActivityAssignmentService],
})
export class ActivityAssignmentModule {}
