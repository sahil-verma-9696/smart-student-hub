import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ProgramLevel } from './create-program.dto';

/**
 * DTO for updating a program
 * Admin can update program details after creation
 */
export class UpdateProgramDto {
  @IsOptional()
  @IsEnum(ProgramLevel, { message: 'Level must be UG, PG, Diploma, PhD, or Certification' })
  level?: ProgramLevel;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  intake?: number;
}
