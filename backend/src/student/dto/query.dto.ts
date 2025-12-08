import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class StudentQueryDto {
  @IsOptional()
  @IsMongoId()
  instituteId?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  roll_number?: string;
}
