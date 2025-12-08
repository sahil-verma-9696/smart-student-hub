import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import { IsOptional, IsString } from 'class-validator';
import * as academicSchema from 'src/academic/schema/academic.schema';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  // required
  @IsString()
  @IsOptional()
  roll_number?: string;

  @IsString()
  @IsOptional()
  basicUserDetail?: string;

  @IsOptional()
  academicDetails?: academicSchema.AcademicDocument;
}
