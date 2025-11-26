import { IsOptional, IsString } from 'class-validator';

export class ContactInfoDto {
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  alternatePhone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
