import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

// ========== SUB-DTO IMPORTS ==========
import { DepartmentDto } from './sub/department.dto';
import { ProgramDto } from './sub/program.dto';
import { VerificationDto } from './sub/verification.dto';

export class CreateInstituteDto {
  @IsString()
  instituteId: string;

  @IsString()
  instituteName: string;

  @IsString()
  instituteCode: string;

  @IsNumber()
  establishedYear: number;

  @IsString()
  accreditationStatus: string;

  @IsEnum(['government', 'private', 'autonomous'], {
    message: 'instituteType must be government | private | autonomous',
  })
  instituteType: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  alternatePhone?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsString()
  addressLine1: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  pincode: string;

  @IsOptional()
  @IsString()
  logo?: string;

  // Departments
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DepartmentDto)
  departments: DepartmentDto[];

  // Programs
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProgramDto)
  programs: ProgramDto[];

  // Admin Info
  @IsString()
  adminName: string;

  @IsString()
  adminEmail: string;

  @IsString()
  adminPhone: string;

  @IsString()
  adminDesignation: string;

  // Verification
  @ValidateNested()
  @Type(() => VerificationDto)
  verification: VerificationDto;
}
