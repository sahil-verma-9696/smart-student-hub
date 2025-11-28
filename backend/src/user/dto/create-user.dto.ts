import {
  IsEmail,
  IsEnum,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ContactInfoDto } from './contact-info.dto';
import { Type } from 'class-transformer';
import { USER_ROLE } from '../types/enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string; // plain → hash later in service

  @IsEnum(USER_ROLE)
  role: USER_ROLE;

  @IsString()
  gender: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;
}
