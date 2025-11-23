import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { InstituteType } from 'src/institute/types/enum';

export default class CreateInstituteDto {
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

  @IsBoolean()
  is_affiliated: boolean;

  @IsOptional()
  @IsString()
  affiliation_university?: string;

  @IsOptional()
  @IsString()
  affiliation_id?: string;
}
