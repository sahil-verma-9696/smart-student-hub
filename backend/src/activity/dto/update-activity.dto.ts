import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create-activity.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {
  @IsOptional()
  @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
  verificationStatus?: string;

  @IsOptional()
  approved_by?: string;

  @IsOptional()
  rejected_by?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
