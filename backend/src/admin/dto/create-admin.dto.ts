import { Type } from 'class-transformer';
import { IsString, IsEmail, IsObject, ValidateNested } from 'class-validator';
import { ContactInfoDto } from 'src/user/dto/contact-info.dto';

export class CreateAdminDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string; // plain → hash later in service

  @IsString()
  gender: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;
}
