import { IsOptional, IsString } from 'class-validator';

export class ApproveActivityDto {
  @IsOptional()
  @IsString()
  remarks?: string;
}
