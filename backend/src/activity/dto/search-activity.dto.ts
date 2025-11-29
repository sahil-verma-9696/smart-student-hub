import { IsOptional } from 'class-validator';

export class SearchActivityDto {
  @IsOptional()
  activityType?: string;

  @IsOptional()
  status?: string;
  @IsOptional()
  studentId?: string;
  @IsOptional()
  title?: string;
  @IsOptional()
  from?: string;
  @IsOptional()
  to?: string;
}
