import { IsString, ValidateNested } from 'class-validator';
import { CreateStudentWithoutInstituteDto } from './create-student.dto';
import { Type } from 'class-transformer';

export class BulkCreateStudentDto {
  @IsString()
  instituteId: string;

  @ValidateNested({ each: true })
  @Type(() => CreateStudentWithoutInstituteDto)
  students: CreateStudentWithoutInstituteDto[];
}
