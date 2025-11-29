import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsEnum,
  Matches,
  Length,
  ValidateIf,
} from 'class-validator';
import { InstituteType } from 'src/institute/types/enum';

/**
 * DTO for Institute Registration
 * Programs are NOT required during registration - admin can add them later
 */
export default class CreateInstituteDto {
  @IsString()
  @Matches(/^[A-Za-z0-9 .&()-]+$/, {
    message: 'Institute name contains invalid characters',
  })
  @Length(3, 100, { message: 'Institute name must be between 3 and 100 characters' })
  institute_name: string;

  @IsEnum(InstituteType, { message: 'Invalid institute type' })
  institute_type: InstituteType;

  @IsEmail({}, { message: 'Invalid official email format' })
  official_email: string;

  @Matches(/^(?:(\+91[\s-]?)?[6-9]\d{9})$/, {
    message: 'Invalid official phone number',
  })
  official_phone: string;

  @IsString()
  @Matches(/^[A-Za-z0-9 ,.-/()]+$/, {
    message: 'Address contains invalid characters',
  })
  @Length(3, 120)
  address_line1: string;

  @IsString()
  @Matches(/^[A-Za-z ]+$/, {
    message: 'City must contain letters only',
  })
  @Length(2, 50)
  city: string;

  @IsString()
  @Matches(/^[A-Za-z ]+$/, {
    message: 'State must contain letters only',
  })
  @Length(2, 50)
  state: string;

  @Matches(/^\d{6}$/, { message: 'Pincode must be a 6-digit number' })
  pincode: string;

  @IsBoolean()
  is_affiliated: boolean;

  @ValidateIf((o) => o.is_affiliated === true)
  @IsString({ message: 'Affiliation university is required when affiliated' })
  @Matches(/^[A-Za-z .&()-]+$/, {
    message: 'Affiliation university contains invalid characters',
  })
  affiliation_university?: string;

  @ValidateIf((o) => o.is_affiliated === true)
  @IsString({ message: 'Affiliation ID is required when affiliated' })
  @Matches(/^[A-Za-z0-9-_/]+$/, {
    message: 'Affiliation ID contains invalid characters',
  })
  affiliation_id?: string;

  // 🚫 Programs NOT included in registration DTO
  // Admin can add programs later via UpdateInstituteDto or Program endpoints
}
