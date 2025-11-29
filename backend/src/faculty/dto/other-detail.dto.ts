import { IsOptional, IsString } from 'class-validator';

export class OtherDetailsDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  alternatePhone?: string;
  
}
