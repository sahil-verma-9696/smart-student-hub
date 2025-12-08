import { Module } from '@nestjs/common';
import { InstituteService } from './institute.service';
import { InstituteController } from './institute.controller';
import { MongooseModule } from '@nestjs/mongoose';
import Institute, { InstituteSchema } from './schemas/institute.schema';
import { AdminModule } from 'src/admin/admin.module';
import { AcademicModule } from 'src/academic/academic.module';
import { StudentModule } from 'src/student/student.module';
import { FacultyModule } from 'src/faculty/faculty.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Institute.name, schema: InstituteSchema },
    ]),
    AdminModule,
    AcademicModule,
    StudentModule,
    FacultyModule,
  ],
  controllers: [InstituteController],
  providers: [InstituteService],
  exports: [InstituteService],
})
export class InstituteModule {}
