import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsEnum,
  Matches,
  Length,
  ValidateIf,
  IsArray,
  IsMongoId,
} from 'class-validator';

import { InstituteType } from 'src/institute/types/enum';

/**
 * DTO for Updating Institute
 * Admin can update all fields including programs
 */
export class UpdateInstituteDto {
  // 👉 Institute Name
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9 .&()-]+$/, {
    message: 'Institute name contains invalid characters',
  })
  @Length(3, 100, { message: 'Institute name must be between 3 and 100 characters' })
  institute_name?: string;

  // 👉 Institute Type
  @IsOptional()
  @IsEnum(InstituteType, { message: 'Invalid institute type' })
  institute_type?: InstituteType;

  // 👉 Official Email
  @IsOptional()
  @IsEmail({}, { message: 'Invalid official email format' })
  official_email?: string;

  // 👉 Official Phone
  @IsOptional()
  @Matches(/^(?:(\+91[\s-]?)?[6-9]\d{9})$/, {
    message: 'Invalid official phone number',
  })
  official_phone?: string;

  // 👉 Address Line 1
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9 ,.-/()]+$/, {
    message: 'Address contains invalid characters',
  })
  @Length(3, 120)
  address_line1?: string;

  // 👉 City
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z ]+$/, {
    message: 'City must contain letters only',
  })
  @Length(2, 50)
  city?: string;

  // 👉 State
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z ]+$/, {
    message: 'State must contain letters only',
  })
  @Length(2, 50)
  state?: string;

  // 👉 Pincode
  @IsOptional()
  @Matches(/^\d{6}$/, { message: 'Pincode must be a 6-digit number' })
  pincode?: string;

  // 👉 Affiliation Flag
  @IsOptional()
  @IsBoolean()
  is_affiliated?: boolean;

  // 👉 Affiliation University (required only if is_affiliated = true)
  @ValidateIf((o) => o.is_affiliated === true)
  @IsString({ message: 'Affiliation university is required when affiliated' })
  @Matches(/^[A-Za-z .&()-]+$/, {
    message: 'Affiliation university contains invalid characters',
  })
  affiliation_university?: string;

  // 👉 Affiliation ID
  @ValidateIf((o) => o.is_affiliated === true)
  @IsString({ message: 'Affiliation ID is required when affiliated' })
  @Matches(/^[A-Za-z0-9-_/]+$/, {
    message: 'Affiliation ID contains invalid characters',
  })
  affiliation_id?: string;

  // 🎓 Programs - Admin can manage programs via this DTO
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true, message: 'Each program ID must be a valid MongoDB ObjectId' })
  programs?: string[];
}
