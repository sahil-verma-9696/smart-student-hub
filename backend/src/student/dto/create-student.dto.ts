import { Type } from 'class-transformer';
import {
  IsEmail,
  IsObject,
  IsOptional,
  // IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ContactInfoDto } from 'src/user/dto/contact-info.dto';
import { OmitType } from '@nestjs/mapped-types';

export class CreateStudentDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  gender: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;

  @IsString()
  instituteId: string;

  @IsString()
  roll_number: string;

  @IsString()
  @IsOptional()
  branch: string;

  @IsString()
  @IsOptional()
  degree: string;

  @IsString()
  @IsOptional()
  program: string;
}

export class CreateStudentWithoutInstituteDto extends OmitType(
  CreateStudentDto,
  ['instituteId'] as const,
) {}
