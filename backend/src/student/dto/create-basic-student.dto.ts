import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  // IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ContactInfoDto } from 'src/user/dto/contact-info.dto';

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
  roll_number?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsNumber()
  @IsOptional()
  backlogs?: number;
}

export class CreateStudentWithoutInstitueIdDto {
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
  roll_number?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsNumber()
  @IsOptional()
  backlogs?: number;
}
