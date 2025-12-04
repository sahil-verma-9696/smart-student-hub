import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ContactInfoDto } from 'src/user/dto/contact-info.dto';
import { InstituteType } from '../types/auth.enum';
import { Type } from 'class-transformer';

export class RegisterInstituteDto {
  /**
   * Institute state
   * */
  @IsString()
  inst_name: string;

  /**
   * Institute state
   * */
  @IsEnum(InstituteType)
  inst_type: InstituteType;

  /**
   * Institute state
   * */
  @IsString()
  inst_email: string;

  /**
   * Institute state
   * */
  @IsString()
  inst_phone: string;

  /**
   * Institute address line 1
   */
  @IsString()
  inst_address_line1: string;

  /**
   * Institute city
   */
  @IsString()
  inst_city: string;

  /**
   * Institute state
   * */
  @IsString()
  inst_state: string;

  /**
   * Institute state
   * */
  @IsString()
  inst_pincode: string;

  /**
   * Admin name
   */
  @IsString()
  @IsNotEmpty()
  admin_name: string;

  /**
   * Admin email
   */
  @IsEmail()
  admin_email: string;

  /**
   * Admin password
   */
  @IsString()
  admin_password: string;

  /**
   * Admin gender
   */
  @IsEnum(['male', 'female', 'other'])
  admin_gender: string;

  /**
   * Institute code or short form
   */
  @IsString()
  @IsOptional()
  instituteCode?: string;

  /**
   * Address / Location (Optional)
   */
  @IsString()
  @IsOptional()
  instituteAddress?: string;

  /**
   * Admin contact info
   */
  @IsObject()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  admin_contactInfo: ContactInfoDto;

  /**
   * Institute state
   * */
  @IsBoolean()
  inst_is_affiliated: boolean;
  /**
   * Institute state
   * */
  @IsString()
  inst_affiliation_id: string;

  /**
   * Institute state
   * */
  @IsString()
  inst_affiliation_university: string;
}
