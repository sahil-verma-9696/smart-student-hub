import { IsString, IsOptional, IsEnum } from 'class-validator';

/**
 * ReviewActivityDto
 * 
 * DTO for faculty to review an activity.
 * Faculty can recommend approval but cannot finalize it.
 */
export class ReviewActivityDto {
  @IsString()
  @IsOptional()
  comments?: string; // Review comments/feedback

  @IsEnum(['RECOMMEND_APPROVAL', 'RECOMMEND_REJECTION', 'NEEDS_REVISION'])
  @IsOptional()
  recommendation?: 'RECOMMEND_APPROVAL' | 'RECOMMEND_REJECTION' | 'NEEDS_REVISION';
}
