import { IsBoolean, IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString, IsArray, IsNumber } from 'class-validator';

/**
 * CreateActivityDto
 * 
 * DTO for creating a new Activity (student accomplishment).
 * 
 * Key concepts:
 * - activityTypeId: Links to ActivityType (defines which fields are required)
 * - details: Dynamic object validated against ActivityType.formSchema
 * - status: Always starts as PENDING, changed by faculty during review
 * - creditsEarned: Set by faculty during approval (not by student)
 */
export class CreateActivityDto {
  @IsMongoId()
  @IsNotEmpty()
  activityTypeId: string; // Reference to ActivityType

  @IsString()
  @IsNotEmpty()
  title: string; // Activity title (e.g., "Summer Internship at Google")

  @IsString()
  @IsOptional()
  description?: string; // Detailed description of the activity

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  attachments?: string[]; // Uploaded certificates, photos, etc.

  @IsString()
  @IsNotEmpty()
  location: string; // Where the activity took place

  @IsString()
  @IsOptional()
  locationType?: string; // Type of location (e.g., "On-site", "Remote")

  // Dynamic details payload, validated against ActivityType.formSchema in service
  // Example: { companyName: "Google", duration: 3, role: "SWE Intern" }
  @IsOptional()
  details?: Record<string, any>;

  // optional explicit submittedAt (defaults to now if missing)
  @IsDateString()
  @IsOptional()
  submittedAt?: string;

  // allow client to request public visibility
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  // credits are assigned by faculty on approval, not by student
  @IsNumber()
  @IsOptional()
  creditsEarned?: number;

  @IsString()
  @IsOptional()
  externalUrl?: string;

  // faculty to assign for review; if omitted, service may infer from student.assignedFaculty
  @IsMongoId()
  @IsOptional()
  facultyId?: string;
}
