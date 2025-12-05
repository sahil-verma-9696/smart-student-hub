import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * FormFieldDto
 * 
 * Defines a dynamic form field for ActivityType.
 * These fields define what data students must provide when creating activities.
 * 
 * Example: For "Internship" activity type, you might have:
 * - key: "companyName", label: "Company Name", type: "text", required: true
 * - key: "duration", label: "Duration (months)", type: "number", required: true
 * - key: "role", label: "Role/Position", type: "select", options: ["Developer", "Designer", "Analyst"]
 */
export class FormFieldDto {
  @IsString()
  @IsNotEmpty()
  key: string; // Field identifier (e.g., "companyName", "duration")

  @IsString()
  @IsNotEmpty()
  label: string; // Display label (e.g., "Company Name", "Duration")

  @IsIn(['text', 'number', 'date', 'select', 'checkbox'])
  @IsNotEmpty()
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox'; // Input type

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options?: string[]; // Options for select/checkbox types

  @IsBoolean()
  @IsOptional()
  required?: boolean; // Whether field is mandatory

  @IsString()
  @IsOptional()
  placeholder?: string; // Placeholder text for input
}

/**
 * CreateActivityTypeDto
 * 
 * DTO for creating a new ActivityType.
 * 
 * isPrimitive:
 * - true: Hard-coded types visible to ALL institutes (e.g., "Internship", "Workshop")
 * - false: Institute-specific types (only visible to creating institute)
 * 
 * formSchema:
 * - Array of custom fields that activities of this type must have
 * - Validated dynamically when students create activities
 */
export class CreateActivityTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Activity type name (e.g., "Internship", "Hackathon")

  @IsString()
  @IsOptional()
  description?: string; // Detailed description

  @IsBoolean()
  @IsOptional()
  isPrimitive?: boolean; // If true, visible to all institutes

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  @IsOptional()
  formSchema?: FormFieldDto[]; // Dynamic form fields

  @IsNumber()
  @IsOptional()
  minCredit?: number;

  @IsNumber()
  @IsOptional()
  maxCredit?: number;
}
