// dto/create-faculty.dto.ts
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsEnum, IsDateString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class ContactInfoDto {
  @IsEmail()
  email: string;

  @IsString()
  mobile: string;
}

class AcademicQualificationDto {
  @IsString()
  degree: string;

  @IsOptional()
  @IsString()
  institution?: string;

  @IsOptional()
  year?: number;

  @IsOptional()
  @IsString()
  proofUrl?: string;
}

class ExperienceDetailsDto {
  @IsString()
  position: string;

  @IsString()
  institution: string;

  @IsOptional()
  fromYear?: number;

  @IsOptional()
  toYear?: number;

  @IsOptional()
  yearsOfService?: number;
}

class DocumentsDto {
  @IsString()
  @IsNotEmpty()
  idProofUrl: string;

  @IsOptional()
  @IsString()
  appointmentLetterUrl?: string;

  @IsOptional()
  @IsString()
  cvUrl?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}

export class CreateFacultyDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(['Male', 'Female', 'Other'])
  gender: string;

  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;

  @IsString()
  @IsNotEmpty()
  facultyId: string;

  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsOptional()
  @IsString()
  subjectArea?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AcademicQualificationDto)
  academicQualifications?: AcademicQualificationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDetailsDto)
  experienceDetails?: ExperienceDetailsDto[];

  @ValidateNested()
  @Type(() => DocumentsDto)
  documents?: DocumentsDto;
}
