import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { ContactInfoDto } from 'src/user/dto/contact-info.dto';

export class CreateAdminDto {
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
