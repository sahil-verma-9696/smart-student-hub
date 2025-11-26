import { IsString, IsOptional, IsEnum, IsDateString, IsArray, IsMongoId } from 'class-validator';
import { ACTIVITY_TYPES, ACTIVITY_STATUS } from '../types/enum';

export class BaseActivityDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsMongoId()
  student: string;

  @IsEnum(ACTIVITY_TYPES)
  activityType: ACTIVITY_TYPES;

  @IsOptional()
  @IsEnum(ACTIVITY_STATUS)
  status?: ACTIVITY_STATUS;

  @IsOptional()
  @IsArray()
  externalLinks?: string[];

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsDateString()
  dateStart?: Date;

  @IsOptional()
  @IsDateString()
  dateEnd?: Date;
}
