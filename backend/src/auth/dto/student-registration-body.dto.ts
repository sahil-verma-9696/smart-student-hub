import { Type } from 'class-transformer';
import {
  IsEmail,
  // IsEnum,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ContactInfoDto } from 'src/user/dto/contact-info.dto';

export default class StudentRegistrationBodyDto {
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

  // @IsString()
  // instituteId: string;
}
