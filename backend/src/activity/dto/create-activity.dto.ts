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

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.CUSTOM,
  )
  @IsOptional()
  @IsArray()
  custom_skill?: string[];

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

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.HACKATHON,
  )
  @IsOptional()
  @IsArray()
  hackathon_skill?: string[];

  // -------------------------------------------
  // WORKSHOP
  // -------------------------------------------
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
  mode?: string;

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

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.WORKSHOP,
  )
  @IsOptional()
  @IsArray()
  workshop_skill?: string[];

  // -------------------------------------------
  // INTERNSHIP
  // -------------------------------------------
  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.INTERNSHIP,
  )
  @IsOptional()
  @IsString()
  company?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.INTERNSHIP,
  )
  @IsOptional()
  @IsString()
  role?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.INTERNSHIP,
  )
  @IsOptional()
  @IsString()
  inst_duration?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.INTERNSHIP,
  )
  @IsOptional()
  @IsString()
  inst_startDate?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.INTERNSHIP,
  )
  @IsOptional()
  @IsString()
  inst_endDate?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.INTERNSHIP,
  )
  @IsOptional()
  @IsString()
  inst_paid?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.INTERNSHIP,
  )
  @IsOptional()
  @IsArray()
  internship_skill?: string[];

  // -------------------------------------------
  // PLACEMENT
  // -------------------------------------------
  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.PLACEMENT,
  )
  @IsOptional()
  @IsString()
  placement_company?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.PLACEMENT,
  )
  @IsOptional()
  @IsString()
  placement_role?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.PLACEMENT,
  )
  @IsOptional()
  @IsString()
  placement_package?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.PLACEMENT,
  )
  @IsOptional()
  @IsString()
  placement_placementType?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.PLACEMENT,
  )
  @IsOptional()
  @IsString()
  placement_joiningDate?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.PLACEMENT,
  )
  @IsOptional()
  @IsString()
  placement_referenceNo?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.PLACEMENT,
  )
  @IsOptional()
  @IsArray()
  placement_skill?: string[];

  /****************************************
   * High School Marksheet
   *****************************************/
  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.HIGH_SCHOOL,
  )
  @IsOptional()
  @IsString()
  board?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.HIGH_SCHOOL,
  )
  @IsOptional()
  @IsString()
  schoolName?: string;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.HIGH_SCHOOL,
  )
  @IsOptional()
  @IsNumber()
  percentage?: number;

  @ValidateIf(
    (o: CreateActivityDto) => o.activityType === ACTIVITY_TYPES.HIGH_SCHOOL,
  )
  @IsOptional()
  @IsArray()
  highschool_subjects?: string[];
}
