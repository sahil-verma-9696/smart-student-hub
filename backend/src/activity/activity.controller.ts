import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import type { AuthenticatedRequest } from '../auth/types/auth.type';

/**
 * ActivityController
 * 
 * Handles HTTP requests for Activity CRUD operations.
 * Activities represent student accomplishments (internships, projects, seminars, etc.)
 * 
 * Routes:
 * - POST /activities - Create new activity (students only)
 * - GET /activities - Get activities (filtered by role)
 * - GET /activities/:id - Get single activity
 * - PATCH /activities/:id - Update activity
 * - DELETE /activities/:id - Delete activity
 * 
 * Query Parameters:
 * - status: Filter by approval status (PENDING, APPROVED, REJECTED)
 * - activityTypeId: Filter by activity type
 */
@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivityController {
	constructor(private readonly activityService: ActivityService) {}

	/**
	 * Create a new activity
	 * 
	 * @param dto - Activity data (title, description, activityTypeId, details, etc.)
	 * @param req - Authenticated request (must be student)
	 * @returns Created activity document
	 * 
	 * Process:
	 * 1. Validate user is a student
	 * 2. Fetch ActivityType and validate details against formSchema
	 * 3. Create Activity document
	 * 4. Create ActivityAssignment (for faculty review)
	 * 
	 * Access: Students only
	 */
	@Post()
	create(@Body() dto: CreateActivityDto, @Req() req: AuthenticatedRequest) {
		return this.activityService.create(dto, req.user!);
	}

	/**
	 * Get all activities (filtered by role)
	 * 
	 * @param req - Authenticated request
	 * @param status - Optional status filter (PENDING, APPROVED, REJECTED)
	 * @param activityTypeId - Optional activity type filter
	 * @returns Array of activities
	 * 
	 * Filtering by role:
	 * - Students: See only their own activities
	 * - Faculty: See activities assigned to them for review
	 * - Admins: See all activities in their institute
	 */
	@Get()
	findAll(
		@Req() req: AuthenticatedRequest,
		@Query('status') status?: string,
		@Query('activityTypeId') activityTypeId?: string,
	) {
		return this.activityService.getActivitiesForUser(req.user!, { status, activityTypeId });
	}

	/**
	 * Get single activity by ID
	 * 
	 * @param id - Activity ObjectId
	 * @param req - Authenticated request
	 * @returns Activity document
	 * 
	 * Access control:
	 * - Students: Can view their own activities
	 * - Faculty: Can view activities assigned to them
	 * - Admins: Can view all activities in their institute
	 */
	@Get(':id')
	findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
		return this.activityService.getActivityById(id, req.user!);
	}

	/**
	 * Update an activity
	 * 
	 * @param id - Activity ObjectId
	 * @param dto - Partial update data
	 * @param req - Authenticated request
	 * @returns Updated activity document
	 * 
	 * Access control:
	 * - Students: Can update own PENDING activities (not APPROVED/REJECTED)
	 * - Faculty: Can update status and add review comments
	 * - Admins: Full update permissions
	 */
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() dto: UpdateActivityDto,
		@Req() req: AuthenticatedRequest,
	) {
		return this.activityService.updateActivity(id, dto, req.user!);
	}

	/**
	 * Delete an activity
	 * 
	 * @param id - Activity ObjectId
	 * @param req - Authenticated request
	 * @returns Deletion confirmation
	 * 
	 * Access control:
	 * - Students: Can delete own PENDING activities only
	 * - Admins: Can delete any activity in their institute
	 * 
	 * Also deletes associated ActivityAssignment
	 */
	@Delete(':id')
	remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
		return this.activityService.deleteActivity(id, req.user!);
	}

	/**
	 * Faculty reviews an activity
	 * 
	 * @param id - Activity ObjectId
	 * @param reviewData - Review details (comments, recommendation, etc.)
	 * @param req - Authenticated request (must be faculty)
	 * @returns Updated activity with review details
	 * 
	 * Process:
	 * 1. Validate user is faculty
	 * 2. Check faculty is assigned to this activity
	 * 3. Update reviewedBy, reviewedAt fields
	 * 4. Optionally recommend for approval (not final approval)
	 * 5. Change status to UNDER_REVIEW
	 * 
	 * Access: Faculty only (assigned reviewer)
	 */
	@Post(':id/review')
	facultyReview(
		@Param('id') id: string,
		@Body() reviewData: any,
		@Req() req: AuthenticatedRequest,
	) {
		return this.activityService.facultyReviewActivity(id, reviewData, req.user!);
	}

	/**
	 * Admin approves an activity
	 * 
	 * @param id - Activity ObjectId
	 * @param approvalData - Approval details (finalCredits, comments, etc.)
	 * @param req - Authenticated request (must be admin)
	 * @returns Approved activity
	 * 
	 * Process:
	 * 1. Validate user is admin
	 * 2. Validate activity belongs to admin's institute
	 * 3. Validate finalCredits is within ActivityType's minCredit-maxCredit range
	 * 4. Set approvedBy, approvedAt, status=APPROVED
	 * 
	 * Validation:
	 * - Credits must be within allowed range (minCredit-maxCredit)
	 * - Activity must be UNDER_REVIEW or PENDING
	 * 
	 * Access: Admins only (same institute)
	 */
	@Post(':id/approve')
	adminApprove(
		@Param('id') id: string,
		@Body() approvalData: any,
		@Req() req: AuthenticatedRequest,
	) {
		return this.activityService.adminApproveActivity(id, approvalData, req.user!);
	}

	/**
	 * Admin rejects an activity
	 * 
	 * @param id - Activity ObjectId
	 * @param rejectionData - Rejection details (reason, comments, etc.)
	 * @param req - Authenticated request (must be admin)
	 * @returns Rejected activity
	 * 
	 * Process:
	 * 1. Validate user is admin
	 * 2. Validate activity belongs to admin's institute
	 * 3. Set rejectedBy, rejectedAt, status=REJECTED
	 * 
	 * Access: Admins only (same institute)
	 */
	@Post(':id/reject')
	adminReject(
		@Param('id') id: string,
		@Body() rejectionData: any,
		@Req() req: AuthenticatedRequest,
	) {
		return this.activityService.adminRejectActivity(id, rejectionData, req.user!);
	}
}

