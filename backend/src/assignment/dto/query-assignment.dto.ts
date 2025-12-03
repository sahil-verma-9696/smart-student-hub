import { IsOptional, IsMongoId } from 'class-validator';

export class QueryAssignmentDto {
  @IsOptional()
  @IsMongoId()
  facultyId?: string;

  @IsOptional()
  @IsMongoId()
  instituteId?: string;

  @IsOptional()
  @IsMongoId()
  activityId?: string;
}
