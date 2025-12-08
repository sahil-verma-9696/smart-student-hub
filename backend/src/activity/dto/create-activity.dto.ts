import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsArray, 
  IsBoolean, 
  IsObject, 
  IsNumber, 
  IsUrl 
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * CreateActivityDto
 * 
 * DTO for creating a new activity submission by a student.
 * 
 * VALIDATION RULES:
 * - activityTypeId: Must be valid and APPROVED (or primitive)
 * - title: Required, meaningful activity name
 * - details: Dynamic fields matching ActivityType.formSchema
 * - location: Required (physical or online location)
 * - attachments: Array of attachment ObjectIds
 * - skills: Array of skills acquired
 * - creditsEarned: Must be within ActivityType's minCredit-maxCredit range
 * - isPublic: Controls visibility (default: false/private)
 */
export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  activityTypeId: string; // ActivityType reference

  @IsString()
  @IsNotEmpty()
  title: string; // Short, meaningful title

  @IsString()
  @IsOptional()
  description?: string; // Detailed description (optional)

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[]; // Array of Attachment ObjectIds

  @IsString()
  @IsNotEmpty()
  location: string; // Activity location

  @IsString()
  @IsOptional()
  locationType?: string; // e.g., "Online", "On-Campus", "Off-Campus"

  @IsObject()
  @IsOptional()
  details?: Record<string, any>; // Dynamic fields based on ActivityType.formSchema

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean; // Visibility control (default: false)

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[]; // Skills acquired from activity

  @IsNumber()
  @IsOptional()
  creditsEarned?: number; // Credits earned (must be within min-max range)

  @IsUrl()
  @IsOptional()
  externalUrl?: string; // External proof link (optional)
}
