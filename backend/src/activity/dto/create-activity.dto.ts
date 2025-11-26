import {
  IsString,
  IsOptional,
  IsEnum,
  IsMongoId,
  IsObject,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import { ACTIVITY_TYPES, ACTIVITY_STATUS } from '../types/enum';

export class CreateActivityDto {
  @IsString()
  title: string;

  // @IsOptional()
  // @IsString()
  // description?: string;

  @IsMongoId()
  student: string;

  @IsEnum(ACTIVITY_TYPES)
  activityType: ACTIVITY_TYPES;

  @IsOptional()
  @IsEnum(ACTIVITY_STATUS)
  status?: ACTIVITY_STATUS;

  // -------------------------------------------
  // CUSTOM
  // -------------------------------------------
  @ValidateIf((o) => o.activityType === ACTIVITY_TYPES.CUSTOM)
  @IsObject()
  fields?: Record<string, any>;

  // -------------------------------------------
  // HACKATHON
  // -------------------------------------------
  @ValidateIf((o) => o.activityType === ACTIVITY_TYPES.HACKATHON)
  @IsString()
  name?: string;

  @ValidateIf((o) => o.activityType === ACTIVITY_TYPES.HACKATHON)
  @IsOptional()
  @IsNumber()
  teamSize?: number;

  @ValidateIf((o) => o.activityType === ACTIVITY_TYPES.HACKATHON)
  @IsOptional()
  @IsString()
  rank?: string;

  @ValidateIf((o) => o.activityType === ACTIVITY_TYPES.HACKATHON)
  @IsOptional()
  @IsString()
  hackDescription?: string;

  // -------------------------------------------
  // WORKSHOP
  // -------------------------------------------
  @ValidateIf((o) => o.activityType === ACTIVITY_TYPES.WORKSHOP)
  @IsString()
  workshopName?: string;

  @ValidateIf((o) => o.activityType === ACTIVITY_TYPES.WORKSHOP)
  @IsOptional()
  @IsString()
  speaker?: string;

  @ValidateIf((o) => o.activityType === ACTIVITY_TYPES.WORKSHOP)
  @IsOptional()
  @IsString()
  organizer?: string;

  @ValidateIf((o) => o.activityType === ACTIVITY_TYPES.WORKSHOP)
  @IsOptional()
  @IsString()
  duration?: string;

  @ValidateIf((o) => o.activityType === ACTIVITY_TYPES.WORKSHOP)
  @IsOptional()
  @IsString()
  location?: string;
}
