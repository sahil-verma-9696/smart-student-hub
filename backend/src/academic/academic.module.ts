import { Module } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { AcademicController } from './academic.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Academic, AcademicSchema } from './schema/academic.schema';
import { Program, ProgramSchema } from './schema/program.schema';
import { Branch, BranchSchema } from './schema/branch.schema';
import { Department, DepartmentSchema } from './schema/department.schema';
import {
  Specialization,
  SpecializationSchema,
} from './schema/specialization.schema';
import { YearLevel, YearLevelSchema } from './schema/year-level.schema';
import { Degree, DegreeSchema } from './schema/degree.schema';
import { Section, SectionSchema } from './schema/section.schema';
import { Semester, SemesterSchema } from './schema/semester.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Academic.name, schema: AcademicSchema },
      { name: Program.name, schema: ProgramSchema }, // UG, PG, PhD
      { name: Degree.name, schema: DegreeSchema }, // Bachelor, Master
      { name: Branch.name, schema: BranchSchema }, // CS, ME, EE
      { name: Specialization.name, schema: SpecializationSchema }, // AI, IOT, ML, AIML
      { name: YearLevel.name, schema: YearLevelSchema }, // 1, 2, 3, 4
      { name: Section.name, schema: SectionSchema }, // A, B, C
      { name: Semester.name, schema: SemesterSchema }, // 1, 2
      { name: Department.name, schema: DepartmentSchema }, //
    ]),
  ],
  providers: [AcademicService],
  controllers: [AcademicController],
  exports: [AcademicService],
})
export class AcademicModule {}
