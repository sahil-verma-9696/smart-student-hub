import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFacultyWithoutInstituteDto } from './create-faculty.dto';

export class BulkCreateFacultyDto {
  @IsString()
  instituteId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFacultyWithoutInstituteDto)
  faculties: CreateFacultyWithoutInstituteDto[];
}
