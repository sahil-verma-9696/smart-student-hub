import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { InstituteType } from 'src/institute/types/enum';
import { ContactInfoDto } from 'src/user/dto/contact-info.dto';

export default class InstituteRegistrationDto {
  @IsString()
  institute_name: string;

  @IsEnum(InstituteType)
  institute_type: InstituteType;

  @IsEmail()
  official_email: string;

  @IsString()
  official_phone: string;

  @IsString()
  address_line1: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  pincode: string;

  // ---------- ADMIN USER FIELDS ----------
  @IsString()
  admin_name: string;

  @IsEmail()
  admin_email: string;

  @IsString()
  admin_password: string;

  @IsEnum(['male', 'female', 'other'])
  admin_gender: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  admin_contactInfo: ContactInfoDto;

  @IsBoolean()
  is_affiliated: boolean;

  @IsOptional()
  @IsString()
  affiliation_university?: string;

  @IsOptional()
  @IsString()
  affiliation_id?: string;
}
