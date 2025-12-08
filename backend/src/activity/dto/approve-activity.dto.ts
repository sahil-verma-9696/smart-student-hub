import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

/**
 * ApproveActivityDto
 * 
 * DTO for admin to approve an activity.
 * Admin can override credits if needed.
 */
export class ApproveActivityDto {
  @IsString()
  @IsOptional()
  comments?: string; // Approval comments

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  creditsEarned?: number; // Override credits (must be within ActivityType range)
}
