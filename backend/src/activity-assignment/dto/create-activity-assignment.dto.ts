import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * CreateActivityAssignmentDto
 * 
 * DTO for creating an activity assignment.
 * Usually auto-created when student submits an activity.
 */
export class CreateActivityAssignmentDto {
  @IsString()
  @IsNotEmpty()
  activityId: string; // Activity reference

  @IsString()
  @IsNotEmpty()
  studentId: string; // Student reference

  @IsString()
  @IsNotEmpty()
  instituteId: string; // Institute reference

  @IsString()
  @IsOptional()
  facultyId?: string; // Optional: Faculty assigned to review (can be null initially)
}
