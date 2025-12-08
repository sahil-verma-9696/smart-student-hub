import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class VerificationFieldDto {
  @IsBoolean()
  verified: boolean;

  @IsOptional()
  @IsString()
  verifiedAt?: string;
}
