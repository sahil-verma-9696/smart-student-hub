import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BranchDto } from './branch.dto';
import { YearLevelDto } from './year-level.dto';

export class DegreeDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  programId: string;

  @IsNumber()
  duration: number;

  @IsString()
  durationUnit: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BranchDto)
  branches: BranchDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => YearLevelDto)
  yearLevels: YearLevelDto[];
}
