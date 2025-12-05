import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create-activity.dto';
import { IsOptional, IsString, IsIn, IsMongoId, IsNumber, IsDateString } from 'class-validator';

/**
 * UpdateActivityDto
 * 
 * Allows partial updates to Activity.
 * 
 * Access control (enforced in service):
 * - Students: Can update own PENDING activities (not APPROVED/REJECTED)
 * - Faculty: Can update status, creditsEarned, and add review metadata
 * - Admins: Full update permissions
 */
export class UpdateActivityDto extends PartialType(CreateActivityDto) {
  // Status updates (controlled by role)
  @IsString()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED'])
  @IsOptional()
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';

  // Faculty review metadata
  @IsMongoId()
  @IsOptional()
  reviewedBy?: string;

  @IsDateString()
  @IsOptional()
  reviewedAt?: string;

  // Credits awarded (set by faculty on approval)
  @IsNumber()
  @IsOptional()
  creditsEarned?: number;
}
