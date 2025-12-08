import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAcademicDto {
  @IsString()
  @IsOptional()
  department?: string;

  @IsNumber()
  @IsOptional()
  backlogs?: number;

  @IsNumber()
  @IsOptional()
  course?: string;

  @IsNumber()
  @IsOptional()
  year?: number;

  @IsNumber()
  @IsOptional()
  section?: string;
}
