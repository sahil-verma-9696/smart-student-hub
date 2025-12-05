import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DegreeDto } from './degree.dto';

export class ProgramDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  instituteId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DegreeDto)
  degrees: DegreeDto[];
}
