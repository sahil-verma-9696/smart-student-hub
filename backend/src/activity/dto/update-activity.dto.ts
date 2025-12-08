import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create-activity.dto';

/**
 * UpdateActivityDto
 * 
 * DTO for updating an existing activity.
 * 
 * RESTRICTIONS:
 * - Student can only edit BEFORE review starts (status = PENDING, no reviewedBy)
 * - Cannot change activityTypeId after creation
 * - Cannot modify approval/rejection metadata
 */
export class UpdateActivityDto extends PartialType(CreateActivityDto) {}
