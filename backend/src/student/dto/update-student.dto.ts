import { IsString, IsNumber, IsOptional, IsEmail } from 'class-validator';

/**
 * DTO for updating student details (user fields + academic fields)
 */
export class UpdateStudentDto {
  // User fields
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  // Academic fields
  @IsOptional()
  @IsString()
  course?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsNumber()
  semester?: number;

  @IsOptional()
  @IsString()
  section?: string;
}
