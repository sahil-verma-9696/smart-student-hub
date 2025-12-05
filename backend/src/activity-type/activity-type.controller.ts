import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ActivityTypeService } from './activity-type.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateActivityTypeDto } from './dto/create-activity-type.dto';
import { UpdateActivityTypeDto } from './dto/update-activity-type.dto';
import type { AuthenticatedRequest } from '../auth/types/auth.type';

/**
 * ActivityTypeController
 * 
 * Handles HTTP requests for ActivityType CRUD operations.
 * All routes are protected by JwtAuthGuard.
 * 
 * Routes:
 * - POST /activity-types - Create new activity type
 * - GET /activity-types - Get all activity types for user's institute
 * - GET /activity-types/:id - Get single activity type by ID
 * - PATCH /activity-types/:id - Update activity type
 * - DELETE /activity-types/:id - Delete activity type
 */
@Controller('activity-types')
@UseGuards(JwtAuthGuard)
export class ActivityTypeController {
	constructor(private readonly activityTypeService: ActivityTypeService) {}

	/**
	 * Create a new activity type
	 * 
	 * @param dto - Activity type data (name, description, formSchema, etc.)
	 * @param req - Authenticated request with user info
	 * @returns Created activity type document
	 * 
	 * Access:
	 * - Admins: Can create approved activity types
	 * - Others: Can create activity types (requires approval)
	 */
	@Post()
	create(@Body() dto: CreateActivityTypeDto, @Req() req: AuthenticatedRequest) {
		return this.activityTypeService.create(dto, req.user!);
	}

	/**
	 * Get all activity types accessible to user
	 * 
	 * @param req - Authenticated request with user info
	 * @returns List of activity types (primitive + institute-specific)
	 * 
	 * Filtering:
	 * - Returns primitive types (isPrimitive=true) visible to all
	 * - Returns institute-specific types (user's instituteId)
	 * - Students/Faculty: Only see APPROVED types
	 * - Admins: See all types for their institute
	 */
	@Get()
	findAll(@Req() req: AuthenticatedRequest) {
		return this.activityTypeService.findAll(req.user!);
	}

	/**
	 * Get single activity type by ID
	 * 
	 * @param id - ActivityType ObjectId
	 * @param req - Authenticated request with user info
	 * @returns Activity type document
	 * 
	 * Access control:
	 * - Primitive types: Accessible to all
	 * - Institute-specific: Only accessible to same institute
	 * - Non-admins: Only see APPROVED types
	 */
	@Get(':id')
	findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
		return this.activityTypeService.findOne(id, req.user!);
	}

	/**
	 * Update an activity type
	 * 
	 * @param id - ActivityType ObjectId
	 * @param dto - Update data (partial fields)
	 * @param req - Authenticated request with user info
	 * @returns Updated activity type document
	 * 
	 * Restrictions:
	 * - Cannot modify primitive types
	 * - Can only update types from same institute
	 * - Only admins can change status
	 */
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() dto: UpdateActivityTypeDto,
		@Req() req: AuthenticatedRequest,
	) {
		return this.activityTypeService.update(id, dto, req.user!);
	}

	/**
	 * Delete an activity type
	 * 
	 * @param id - ActivityType ObjectId
	 * @param req - Authenticated request with user info
	 * @returns Deletion confirmation
	 * 
	 * Restrictions:
	 * - Cannot delete primitive types
	 * - Can only delete types from same institute
	 * - Only admins can delete
	 */
	@Delete(':id')
	remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
		return this.activityTypeService.remove(id, req.user!);
	}

	/**
	 * Approve an activity type (Admin Only)
	 * 
	 * @param id - ActivityType ObjectId
	 * @param req - Authenticated request with admin user
	 * @returns Approved activity type
	 * 
	 * Access: Admin only
	 * Changes status to APPROVED
	 */
	@Patch(':id/approve')
	approve(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
		return this.activityTypeService.approveActivityType(id, req.user!);
	}

	/**
	 * Reject an activity type (Admin Only)
	 * 
	 * @param id - ActivityType ObjectId
	 * @param req - Authenticated request with admin user
	 * @returns Rejected activity type
	 * 
	 * Access: Admin only
	 * Changes status to REJECTED
	 */
	@Patch(':id/reject')
	reject(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
		return this.activityTypeService.rejectActivityType(id, req.user!);
	}
}

