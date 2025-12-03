import { IsArray, IsString, ValidateNested } from 'class-validator';
import { CreateStudentWithoutInstituteDto } from './create-student.dto';
import { Type } from 'class-transformer';

export class BulkCreateStudentDto {
  @IsString()
  instituteId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStudentWithoutInstituteDto)
  students: CreateStudentWithoutInstituteDto[];
}
