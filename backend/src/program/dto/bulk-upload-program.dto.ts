import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ProgramLevel } from './create-program.dto';

/**
 * DTO for bulk upload - instituteId will be taken from JWT user
 * Excel/CSV columns: Level, Degree, Branch, Specialization, Intake
 */
export class BulkUploadProgramDto {
  @IsEnum(ProgramLevel)
  level: ProgramLevel;

  @IsString()
  degree: string;

  @IsString()
  branch: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsNumber()
  @Min(1)
  intake: number;
}
