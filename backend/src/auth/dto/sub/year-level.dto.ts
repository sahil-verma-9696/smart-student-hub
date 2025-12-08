import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SemesterDto } from './semester.dto';

export class YearLevelDto {
  @IsString()
  id: string;

  @IsNumber()
  year: number;

  @IsString()
  degreeId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SemesterDto)
  semesters: SemesterDto[];
}
