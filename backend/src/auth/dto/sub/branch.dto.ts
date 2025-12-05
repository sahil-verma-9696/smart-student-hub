import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SpecializationDto } from './specialization.dto';

export class BranchDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  degreeId: string;

  @IsString()
  departmentId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecializationDto)
  specializations: SpecializationDto[];
}
