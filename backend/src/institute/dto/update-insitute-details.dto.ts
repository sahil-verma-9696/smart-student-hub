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
import { DepartmentDto } from 'src/auth/dto/sub/department.dto';
import { ProgramDto } from 'src/auth/dto/sub/program.dto';

export default class UpdateInstituteDetailsDto {
  @IsString()
  @IsOptional()
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
  @IsString()
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
  @IsOptional()
  adminDesignation: string;
}
