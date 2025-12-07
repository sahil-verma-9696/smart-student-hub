import { IsString, IsNotEmpty } from 'class-validator';

/**
 * AssignFacultyDto
 * 
 * DTO for assigning a faculty member to review an activity.
 */
export class AssignFacultyDto {
  @IsString()
  @IsNotEmpty()
  activityId: string; // Activity to assign

  @IsString()
  @IsNotEmpty()
  facultyId: string; // Faculty to assign
}
