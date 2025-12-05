import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { VerificationFieldDto } from './verification-field.dto';

export class VerificationDto {
  @ValidateNested()
  @Type(() => VerificationFieldDto)
  email: VerificationFieldDto;

  @ValidateNested()
  @Type(() => VerificationFieldDto)
  phone: VerificationFieldDto;

  @ValidateNested()
  @Type(() => VerificationFieldDto)
  adminEmail: VerificationFieldDto;

  @ValidateNested()
  @Type(() => VerificationFieldDto)
  adminPhone: VerificationFieldDto;
}
