import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityTypeDto } from './create-activity-type.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';

/**
 * UpdateActivityTypeDto
 * 
 * Allows partial updates to ActivityType.
 * Extends CreateActivityTypeDto with all fields optional.
 * Adds status field for approval/rejection workflow.
 */
export class UpdateActivityTypeDto extends PartialType(CreateActivityTypeDto) {
  @IsString()
  @IsIn(['DRAFT', 'APPROVED', 'REJECTED', 'SUBMITTED', 'UNDER_REVIEW'])
  @IsOptional()
  status?: 'DRAFT' | 'APPROVED' | 'REJECTED' | 'SUBMITTED' | 'UNDER_REVIEW';
}
