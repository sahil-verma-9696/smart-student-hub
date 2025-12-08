import { IsString, IsOptional } from 'class-validator';

export class WorkshopDto {
  @IsString()
  workshopName: string;

  @IsOptional()
  @IsString()
  speaker?: string;

  @IsOptional()
  @IsString()
  organizer?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
