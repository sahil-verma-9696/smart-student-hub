import { IsOptional, IsString, IsEnum, IsNumberString } from 'class-validator';

export class FacultyQueryDto {
  @IsOptional()
  @IsString()
  instituteId?: string;

  @IsOptional()
  @IsString()
  gender?: string; // "male" | "female" | "other"

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  employee_code?: string;

  @IsOptional()
  @IsString()
  name?: string; // search basicUserDetails.name

  @IsOptional()
  @IsString()
  email?: string; // search basicUserDetails.email

  // Pagination
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  // Sorting
  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'sortOrder must be asc or desc' })
  sortOrder?: 'asc' | 'desc';
}
