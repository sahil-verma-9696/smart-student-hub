import { IsString, IsNotEmpty } from 'class-validator';

/**
 * ReassignFacultyDto
 * 
 * DTO for reassigning an activity to a different faculty member.
 */
export class ReassignFacultyDto {
  @IsString()
  @IsNotEmpty()
  activityId: string; // Activity to reassign

  @IsString()
  @IsNotEmpty()
  newFacultyId: string; // New faculty to assign
}
