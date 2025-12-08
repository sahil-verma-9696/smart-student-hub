import { Type } from 'class-transformer';
import {
  IsEmail,
  IsObject,
  // IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ContactInfoDto } from 'src/user/dto/contact-info.dto';
import { OmitType } from '@nestjs/mapped-types';

export class CreateFacultyDto {
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
  employee_code: string;

  @IsString()
  department?: string;

  @IsString()
  designation?: string;
}

export class CreateFacultyWithoutInstituteDto extends OmitType(
  CreateFacultyDto,
  ['instituteId'] as const,
) {}
