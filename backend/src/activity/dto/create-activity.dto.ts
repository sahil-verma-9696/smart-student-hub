import {
  IsString,
  IsOptional,
  IsEnum,
  // IsMongoId,
  IsObject,
  IsNumber,
  ValidateIf,
  IsArray,
  IsDate,
} from 'class-validator';
import { ACTIVITY_TYPES, ACTIVITY_STATUS } from '../types/enum';

export class CreateActivityDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  student: string;

  @IsEnum(ACTIVITY_TYPES)
  @IsOptional()
  activityType?: ACTIVITY_TYPES;

  @IsOptional()
  @IsEnum(ACTIVITY_STATUS)
  status?: ACTIVITY_STATUS;

  @IsOptional()
  @IsArray()
  attachments?: string[];

  // -------------------------------------------
  // CUSTOM
  // -------------------------------------------
  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.CUSTOM,
  )
  @IsObject()
  fields?: Record<string, any>;

  // -------------------------------------------
  // HACKATHON
  // -------------------------------------------

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.HACKATHON,
  )
  @IsOptional()
  @IsNumber()
  teamSize?: number;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.HACKATHON,
  )
  @IsOptional()
  @IsString()
  rank?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.HACKATHON,
  )
  @IsOptional()
  @IsString()
  hackDescription?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.HACKATHON,
  )
  @IsOptional()
  @IsString()
  level?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.HACKATHON,
  )
  @IsOptional()
  @IsString()
  participantType?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.HACKATHON,
  )
  @IsOptional()
  @IsDate()
  deadline?: Date;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.HACKATHON,
  )
  @IsOptional()
  @IsString()
  organizer?: string;
  // -------------------------------------------
  // WORKSHOP
  // -------------------------------------------
  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.WORKSHOP,
  )
  @IsString()
  workshopName?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.WORKSHOP,
  )
  @IsOptional()
  @IsString()
  speaker?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.WORKSHOP,
  )
  @IsOptional()
  @IsString()
  duration?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.WORKSHOP,
  )
  @IsOptional()
  @IsString()
  location?: string;

  /***************************
   * Conference
   *****************************************/
}
