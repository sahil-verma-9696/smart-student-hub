import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsObject,
  // IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ContactInfoDto } from 'src/user/dto/contact-info.dto';
import { USER_ROLE } from 'src/user/types/enum';

export class CreateStudentDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(USER_ROLE)
  role: USER_ROLE;

  @IsString()
  gender: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;

  @IsString()
  instituteId: string;
}
