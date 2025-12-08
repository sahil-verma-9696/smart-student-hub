import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class InstituteQueryDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(['approved', 'pending', 'rejected', 'all'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  createdAt?: 'asc' | 'desc'; // <--- sorting based on createdAt
}
