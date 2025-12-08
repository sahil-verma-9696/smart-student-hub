import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SpecializationDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  branchId: string;

  @IsNumber()
  @IsOptional()
  sectionIntake: number;
}
