import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schema/admin.schema';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Student, StudentSchema } from 'src/student/schema/student.schema';
import { Faculty, FacultySchema } from 'src/faculty/schemas/faculty.schema';
import { Program, ProgramSchema } from 'src/program/schema/program.schema';
import { Activity, ActivitySchema } from 'src/activity/schema/activity.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Academic, AcademicSchema } from 'src/academic/schema/academic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Faculty.name, schema: FacultySchema },
      { name: Program.name, schema: ProgramSchema },
      { name: Activity.name, schema: ActivitySchema },
      { name: User.name, schema: UserSchema },
      { name: Academic.name, schema: AcademicSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
