import { PartialType } from '@nestjs/mapped-types';
import { VerificationDto } from './verification.dto';

export class UpdateVerificationDto extends PartialType(VerificationDto) {}
