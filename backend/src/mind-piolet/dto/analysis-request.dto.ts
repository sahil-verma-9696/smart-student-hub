import { IsArray, IsOptional, IsString } from 'class-validator';

export class AnalysisRequestDto {
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsArray()
  conversation?: any[];

  @IsOptional()
  @IsString()
  message?: string;
}
