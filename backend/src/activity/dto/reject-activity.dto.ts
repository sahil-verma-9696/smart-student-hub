import { IsString, IsNotEmpty } from 'class-validator';

/**
 * RejectActivityDto
 * 
 * DTO for admin to reject an activity.
 * Rejection reason is mandatory.
 */
export class RejectActivityDto {
  @IsString()
  @IsNotEmpty()
  reason: string; // Mandatory rejection reason
}
