import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsDateString,
  IsUrl,
} from 'class-validator';

import type { ActivityDetailsDto } from './activity-details.dto';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsEnum([
    'MOOC',
    'CERTIFICATION',
    'CONFERENCE',
    'CONFERENCE_PAPER',
    'WORKSHOP',
    'WEBINAR',
    'COMPETITION',
    'INTERNSHIP',
    'LEADERSHIP',
    'VOLUNTEERING',
    'CLUB_ACTIVITY',
    'PROJECT',
    'SPORTS',
    'CULTURAL',
    'RESEARCH',
    'PATENT',
    'OTHER',
  ])
  category: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dateStart?: string;

  @IsOptional()
  @IsDateString()
  dateEnd?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  certificateUrls?: string[];

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  mediaUrls?: string[];

  // @IsNotEmpty()
  // details: ActivityDetailsDto;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  hoursCount?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
