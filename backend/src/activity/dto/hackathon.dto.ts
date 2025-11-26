import { IsString, IsNumber, IsOptional } from 'class-validator';

export class HackathonDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  teamSize?: number;

  @IsOptional()
  @IsString()
  rank?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
