import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schema/student.schema';
import { UserModule } from 'src/user/user.module';
import { AcademicModule } from 'src/academic/academic.module';
import { Faculty, FacultySchema } from 'src/faculty/schemas/faculty.schema';
import { Activity, ActivitySchema } from 'src/activity/schema/activity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Faculty.name, schema: FacultySchema },
      { name: Activity.name, schema: ActivitySchema }
    ]),
    UserModule,
    AcademicModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
