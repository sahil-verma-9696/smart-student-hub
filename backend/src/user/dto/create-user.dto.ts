import {
  IsEmail,
  IsEnum,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ContactInfoDto } from './contact-info.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  passwordHash: string; // plain → hash later in service

  @IsEnum(['student', 'faculty', 'admin'])
  role: string;

  @IsString()
  gender: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;
}
