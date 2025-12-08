import { PartialType } from '@nestjs/mapped-types';
import { VerificationFieldDto } from './verification-field.dto';

export class UpdateVerificationFieldDto extends PartialType(
  VerificationFieldDto,
) {}
