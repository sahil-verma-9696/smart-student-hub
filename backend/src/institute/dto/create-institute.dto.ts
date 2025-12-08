import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsEmail,
  IsObject,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InstituteType } from 'src/auth/types/auth.enum';
import { CreateAttachmentDto } from 'src/attachment/dto/create-attachment.dto';

export default class CreateInstituteDto {
  // ---------------- BASIC ----------------
  @IsString()
  @IsNotEmpty()
  institute_name: string;

  @IsEnum(InstituteType)
  institute_type: InstituteType;

  @IsEmail()
  official_email: string;

  @IsString()
  @IsNotEmpty()
  official_phone: string;

  // ---------------- ADDRESS ----------------
  @IsString()
  @IsNotEmpty()
  address_line1: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  pincode: string;

  // ---------------- AFFILIATION ----------------
  @IsOptional()
  @IsString()
  affiliation_university?: string;

  @IsOptional()
  @IsString()
  affiliation_id?: string;

  // ---------------- METADATA ----------------
  @IsOptional()
  @IsNumber()
  establishedYear?: number;

  @IsOptional()
  @IsString()
  accreditationStatus?: string;

  // ---------------- CONTACT & SITE ----------------
  @IsOptional()
  @IsString()
  alternatePhone?: string;

  @IsOptional()
  @IsString()
  website?: string;

  // ---------------- LOGO (Attachment) ----------------
  @IsOptional()
  @IsObject()
  @Type(() => CreateAttachmentDto)
  logo?: CreateAttachmentDto;
}
