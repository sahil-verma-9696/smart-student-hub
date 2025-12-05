import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsMongoId,
  Min,
} from 'class-validator';

// Enum matching schema
export enum ProgramLevel {
  UG = 'UG',
  PG = 'PG',
  Diploma = 'Diploma',
  PhD = 'PhD',
  Certification = 'Certification',
}

/**
 * DTO for creating a program
 * Admin creates programs AFTER institute is registered
 */
export class CreateProgramDto {
  @IsEnum(ProgramLevel, { message: 'Level must be UG, PG, Diploma, PhD, or Certification' })
  level: ProgramLevel; // UG, PG, Diploma, PhD, Certification

  @IsString()
  degree: string; // BTech, BCA, MTech, MBA etc.

  @IsOptional()
  @IsString()
  branch?: string; // CSE, Mechanical, etc. (optional for degrees like BCA, MBA)

  @IsOptional()
  @IsString()
  specialization?: string; // AI & ML, Cyber Security, or null

  @IsNumber()
  @Min(1)
  intake: number; // seat count for this specific program

  @IsMongoId()
  instituteId: string;
}
