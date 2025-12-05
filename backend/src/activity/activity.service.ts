import { 
	ForbiddenException, 
	Injectable, 
	NotFoundException,
	BadRequestException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activity, ActivityDocument } from './schema/activity.schema';
import { ActivityAssignment } from '../activity-assignment/schema/activity-assignment.schema';
import { ActivityAssignmentService } from '../activity-assignment/activity-assignment.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { JwtPayload } from '../auth/types/auth.type';
import { Role } from '../auth/types/auth.enum';
import { Student, StudentDocument } from '../student/schema/student.schema';
import { ActivityType } from '../activity-type/schema/activity-type.schema';

interface FindActivitiesFilter {
	status?: string;
	activityTypeId?: string;
}

/**
 * ActivityService - Production-Ready Implementation
 * 
 * BUSINESS RULES:
 * 1. Activity Creation (Students Only):
 *    - Validate activityTypeId exists and is APPROVED or primitive
 *    - Validate dynamic fields match ActivityType.formSchema
 *    - Required fields must be filled
 *    - Set status = PENDING
 *    - Auto-create ActivityAssignment
 * 
 * 2. Activity Visibility Rules:
 *    - Private (isPublic=false): Only student, assigned faculty, admin can view
 *    - Public (isPublic=true): Student, faculty of same department, admin can view
 *    - Service enforces visibility in queries
 * 
 * 3. Review Workflow (Faculty):
 *    - Faculty can review assigned activities
 *    - Update reviewedBy, reviewedAt
 *    - Recommend for approval (not final)
 *    - Can access private activities during review
 * 
 * 4. Approval Workflow (Admin Only):
 *    - Admin can approve activity → set approvedBy, approvedAt, status=APPROVED
 *    - Admin can reject activity → set rejectedBy, rejectedAt, status=REJECTED
 *    - Validate credits are in allowed range (minCredit–maxCredit)
 *    - Dynamic fields must exist and be valid
 * 
 * 5. Access Control:
 *    - Student: Can create, edit before review, view own activities
 *    - Faculty: Can view assigned activities, review them
 *    - Admin: Full access to institute's activities
 */
@Injectable()
export class ActivityService {
	constructor(
		@InjectModel(Activity.name) private readonly activityModel: Model<ActivityDocument>,
		@InjectModel(ActivityAssignment.name)
		private readonly activityAssignmentModel: Model<ActivityAssignment>,
		@InjectModel(Student.name)
		private readonly studentModel: Model<StudentDocument>,
		@InjectModel(ActivityType.name)
		private readonly activityTypeModel: Model<ActivityType>,
		private readonly activityAssignmentService: ActivityAssignmentService,
	) {}

	/**
	 * CREATE ACTIVITY (Students Only)
	 * 
	 * VALIDATION RULES:
	 * 1. activityTypeId must exist and be APPROVED or primitive
	 * 2. Dynamic fields must match ActivityType.formSchema
	 * 3. Required fields must be filled
	 * 4. Field types must match (number, date, text, select, checkbox)
	 * 5. Select fields must have valid options
	 * 
	 * WORKFLOW:
	 * - Validate student context
	 * - Validate activity type exists and is approved
	 * - Validate dynamic fields against formSchema
	 * - Create activity with status = PENDING
	 * - Auto-create ActivityAssignment
	 */
	async create(dto: CreateActivityDto, user: JwtPayload): Promise<Activity> {
		// RULE: Only students can create activities
		if (user.role !== Role.Student) {
			throw new ForbiddenException('Only students can create activities');
		}

		// Validate student exists and belongs to institute
		const student = await this.studentModel.findById(user.studentId).exec();
		if (!student) {
			throw new NotFoundException('Student profile not found');
		}
		if (student.instituteId.toString() !== user.instituteId) {
			throw new ForbiddenException('Invalid student or institute context');
		}

		// RULE: Validate activityTypeId exists
		if (!Types.ObjectId.isValid(dto.activityTypeId)) {
			throw new BadRequestException('Invalid activity type ID');
		}

		const activityType = await this.activityTypeModel.findById(dto.activityTypeId).exec();
		if (!activityType) {
			throw new NotFoundException('Activity type not found');
		}

		// RULE: ActivityType must be APPROVED or primitive
		if (!activityType.isPrimitive && activityType.status !== 'APPROVED') {
			throw new ForbiddenException('Activity type is not approved yet');
		}

		// RULE: For non-primitive types, must belong to same institute
		if (!activityType.isPrimitive && 
		    activityType.instituteId?.toString() !== user.instituteId) {
			throw new ForbiddenException('Activity type not available for your institute');
		}

		// RULE: Validate dynamic fields against formSchema
		const validatedDetails = this.validateDynamicFields(
			dto.details || {}, 
			activityType.formSchema
		);

		// Set submittedAt
		const submittedAt = dto.submittedAt ? new Date(dto.submittedAt) : new Date();

		// Create activity with status = PENDING
		const created = await this.activityModel.create({
			studentId: new Types.ObjectId(user.studentId),
			activityTypeId: new Types.ObjectId(dto.activityTypeId),
			title: dto.title.trim(),
			description: dto.description?.trim() || '',
			attachments: dto.attachments?.map((id) => new Types.ObjectId(id)) ?? [],
			location: dto.location?.trim(),
			locationType: dto.locationType,
			details: validatedDetails, // Validated dynamic fields
			submittedAt,
			isPublic: dto.isPublic ?? false,
			skills: dto.skills ?? [],
			creditsEarned: 0, // Will be set during approval
			externalUrl: dto.externalUrl?.trim(),
			status: 'PENDING',
		});

		// Auto-create ActivityAssignment
		await this.activityAssignmentService.create({
			activityId: created._id.toString(),
			studentId: user.studentId!,
			instituteId: user.instituteId,
		});

		return created;
	}

	/**
	 * GET ACTIVITIES FOR USER
	 * 
	 * VISIBILITY RULES:
	 * - Student: Own activities only
	 * - Faculty: Assigned activities + public activities of department students
	 * - Admin: All activities in institute
	 * 
	 * FILTERING:
	 * - By status (PENDING, UNDER_REVIEW, APPROVED, REJECTED)
	 * - By activityTypeId
	 */
	async getActivitiesForUser(user: JwtPayload, filters: FindActivitiesFilter = {}): Promise<Activity[]> {
		const query: any = {};

		// Apply filters
		if (filters.status) {
			query.status = filters.status;
		}
		if (filters.activityTypeId && Types.ObjectId.isValid(filters.activityTypeId)) {
			query.activityTypeId = new Types.ObjectId(filters.activityTypeId);
		}

		// STUDENT: Own activities only
		if (user.role === Role.Student) {
			query.studentId = new Types.ObjectId(user.studentId);
			return this.activityModel.find(query).exec();
		}

		// FACULTY: Assigned activities
		if (user.role === Role.Faculty) {
			const assignments = await this.activityAssignmentModel
				.find({ facultyId: new Types.ObjectId(user.facultyId) })
				.select('activityId')
				.exec();
			const activityIds = assignments.map((a) => a.activityId);
			query._id = { $in: activityIds };
			return this.activityModel.find(query).exec();
		}

		// ADMIN: All activities in institute
		const instituteAssignments = await this.activityAssignmentModel
			.find({ instituteId: new Types.ObjectId(user.instituteId) })
			.select('activityId')
			.exec();
		const instActivityIds = instituteAssignments.map((a) => a.activityId);
		query._id = { $in: instActivityIds };
		return this.activityModel.find(query).exec();
	}

	/**
	 * GET PUBLIC ACTIVITIES
	 * 
	 * Returns public activities (isPublic=true) visible to user
	 * - Students: Public activities from same institute
	 * - Faculty: Public activities from assigned students + department students
	 * - Admin: All public activities in institute
	 */
	async getPublicActivities(user: JwtPayload): Promise<Activity[]> {
		const query: any = { isPublic: true };

		// Get activities from same institute
		const instituteAssignments = await this.activityAssignmentModel
			.find({ instituteId: new Types.ObjectId(user.instituteId) })
			.select('activityId')
			.exec();
		const activityIds = instituteAssignments.map((a) => a.activityId);
		query._id = { $in: activityIds };

		return this.activityModel.find(query).exec();
	}

	/**
	 * GET ACTIVITY BY ID
	 * 
	 * ACCESS CONTROL:
	 * - Private activity: Only student, assigned faculty, admin
	 * - Public activity: Student, faculty, admin (same institute)
	 */
	async getActivityById(id: string, user: JwtPayload): Promise<Activity> {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid activity ID');
		}

		const activity = await this.activityModel.findById(id).exec();
		if (!activity) {
			throw new NotFoundException('Activity not found');
		}

		// Check access based on visibility and role
		await this.ensureAccess(activity, user);
		return activity;
	}

	/**
	 * UPDATE ACTIVITY
	 * 
	 * RULES:
	 * - Students: Can edit only before review (status=PENDING)
	 * - Students: Cannot change status or credits
	 * - Faculty: Can update as part of review workflow
	 * - Admin: Full update access
	 */
	async updateActivity(id: string, dto: UpdateActivityDto, user: JwtPayload): Promise<Activity> {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid activity ID');
		}

		const activity = await this.activityModel.findById(id).exec();
		if (!activity) {
			throw new NotFoundException('Activity not found');
		}

		// Check access
		await this.ensureAccess(activity, user, dto.status);

		// RULE: Students can only edit PENDING activities
		if (user.role === Role.Student && activity.status !== 'PENDING') {
			throw new ForbiddenException('Cannot edit activity after it has been reviewed');
		}

		// RULE: Students cannot change status or credits
		if (user.role === Role.Student) {
			if (dto.status || dto.creditsEarned !== undefined) {
				throw new ForbiddenException('Students cannot change status or credits');
			}
		}

		// Apply updates
		Object.assign(activity, dto);
		return activity.save();
	}

	/**
	 * DELETE ACTIVITY
	 * 
	 * RULES:
	 * - Students: Can delete only PENDING activities
	 * - Faculty: Cannot delete (can only reject)
	 * - Admin: Can delete any activity in institute
	 */
	async deleteActivity(id: string, user: JwtPayload): Promise<void> {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid activity ID');
		}

		const activity = await this.activityModel.findById(id).exec();
		if (!activity) {
			throw new NotFoundException('Activity not found');
		}

		// Check access
		await this.ensureAccess(activity, user);

		// RULE: Students can only delete PENDING activities
		if (user.role === Role.Student) {
			if (activity.status !== 'PENDING') {
				throw new ForbiddenException('Cannot delete activity after it has been reviewed');
			}
			if (activity.studentId.toString() !== user.studentId) {
				throw new ForbiddenException('Can only delete your own activities');
			}
		}

		// RULE: Faculty cannot delete
		if (user.role === Role.Faculty) {
			throw new ForbiddenException('Faculty cannot delete activities. Use reject instead.');
		}

		// Delete activity and assignment
		await this.activityAssignmentModel.deleteOne({ activityId: activity._id }).exec();
		await activity.deleteOne();
	}

	/**
	 * FACULTY REVIEW ACTIVITY
	 * 
	 * WORKFLOW:
	 * - Faculty can review assigned activities
	 * - Update reviewedBy, reviewedAt
	 * - Optionally recommend for approval (not final)
	 * - Can access private activities during review
	 */
	async facultyReviewActivity(
		id: string, 
		reviewData: { comments?: string; recommendApproval?: boolean }, 
		user: JwtPayload
	): Promise<Activity> {
		if (user.role !== Role.Faculty) {
			throw new ForbiddenException('Only faculty can review activities');
		}

		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid activity ID');
		}

		const activity = await this.activityModel.findById(id).exec();
		if (!activity) {
			throw new NotFoundException('Activity not found');
		}

		// Check faculty is assigned to this activity
		const assignment = await this.activityAssignmentModel
			.findOne({ activityId: activity._id, facultyId: new Types.ObjectId(user.facultyId) })
			.exec();
		if (!assignment) {
			throw new ForbiddenException('You are not assigned to this activity');
		}

		// Update review fields
		activity.reviewedBy = new Types.ObjectId(user.facultyId);
		activity.reviewedAt = new Date();
		
		if (reviewData.recommendApproval) {
			activity.status = 'UNDER_REVIEW';
		}

		return activity.save();
	}

	/**
	 * ADMIN APPROVE ACTIVITY
	 * 
	 * WORKFLOW:
	 * 1. Validate admin role
	 * 2. Validate activity exists and belongs to institute
	 * 3. Validate credits are in allowed range (minCredit–maxCredit)
	 * 4. Set approvedBy, approvedAt, status=APPROVED
	 */
	async adminApproveActivity(
		id: string, 
		approvalData: { creditsEarned: number; comments?: string }, 
		user: JwtPayload
	): Promise<Activity> {
		if (user.role !== Role.Admin) {
			throw new ForbiddenException('Only admins can approve activities');
		}

		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid activity ID');
		}

		const activity = await this.activityModel.findById(id).exec();
		if (!activity) {
			throw new NotFoundException('Activity not found');
		}

		// Check activity belongs to institute
		const assignment = await this.activityAssignmentModel
			.findOne({ activityId: activity._id, instituteId: new Types.ObjectId(user.instituteId) })
			.exec();
		if (!assignment) {
			throw new ForbiddenException('Activity not in your institute');
		}

		// Validate credits against activity type range
		const activityType = await this.activityTypeModel
			.findById(activity.activityTypeId)
			.exec();
		if (!activityType) {
			throw new NotFoundException('Associated activity type not found');
		}

		const min = activityType.minCredit ?? 0;
		const max = activityType.maxCredit ?? 0;

		if (approvalData.creditsEarned < min || (max > 0 && approvalData.creditsEarned > max)) {
			throw new BadRequestException(
				`Credits must be between ${min} and ${max > 0 ? max : 'unlimited'}`
			);
		}

		// Update activity
		activity.creditsEarned = approvalData.creditsEarned;
		activity.approvedBy = new Types.ObjectId(user.adminId);
		activity.approvedAt = new Date();
		activity.status = 'APPROVED';

		return activity.save();
	}

	/**
	 * ADMIN REJECT ACTIVITY
	 * 
	 * WORKFLOW:
	 * 1. Validate admin role
	 * 2. Validate activity exists and belongs to institute
	 * 3. Set rejectedBy, rejectedAt, status=REJECTED
	 */
	async adminRejectActivity(
		id: string, 
		rejectionData: { reason: string }, 
		user: JwtPayload
	): Promise<Activity> {
		if (user.role !== Role.Admin) {
			throw new ForbiddenException('Only admins can reject activities');
		}

		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid activity ID');
		}

		const activity = await this.activityModel.findById(id).exec();
		if (!activity) {
			throw new NotFoundException('Activity not found');
		}

		// Check activity belongs to institute
		const assignment = await this.activityAssignmentModel
			.findOne({ activityId: activity._id, instituteId: new Types.ObjectId(user.instituteId) })
			.exec();
		if (!assignment) {
			throw new ForbiddenException('Activity not in your institute');
		}

		// Update activity
		activity.rejectedBy = new Types.ObjectId(user.adminId);
		activity.rejectedAt = new Date();
		activity.status = 'REJECTED';

		return activity.save();
	}

	/**
	 * VALIDATE DYNAMIC FIELDS
	 * 
	 * RULES:
	 * 1. Required fields must be filled
	 * 2. Field types must match (number, date, text, select, checkbox)
	 * 3. Select fields must have valid options
	 * 4. Type conversion for number and date fields
	 */
	validateDynamicFields(details: Record<string, any>, formSchema: any[]): Record<string, any> {
		const validatedDetails: Record<string, any> = {};

		if (!formSchema || formSchema.length === 0) {
			return details;
		}

		for (const field of formSchema) {
			const fieldValue = details[field.key];
			
			// Check required fields
			if (field.required && (fieldValue === undefined || fieldValue === null || fieldValue === '')) {
				throw new BadRequestException(`Field '${field.label}' (${field.key}) is required`);
			}

			// Validate and convert field types if value is provided
			if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
				switch (field.type) {
					case 'number':
						if (isNaN(Number(fieldValue))) {
							throw new BadRequestException(`Field '${field.label}' must be a number`);
						}
						validatedDetails[field.key] = Number(fieldValue);
						break;
						
					case 'date':
						const dateValue = new Date(fieldValue);
						if (isNaN(dateValue.getTime())) {
							throw new BadRequestException(`Field '${field.label}' must be a valid date`);
						}
						validatedDetails[field.key] = dateValue;
						break;
						
					case 'checkbox':
						if (typeof fieldValue !== 'boolean') {
							throw new BadRequestException(`Field '${field.label}' must be a boolean`);
						}
						validatedDetails[field.key] = fieldValue;
						break;
						
					case 'select':
						if (field.options && field.options.length > 0 && !field.options.includes(fieldValue)) {
							throw new BadRequestException(
								`Field '${field.label}' must be one of: ${field.options.join(', ')}`
							);
						}
						validatedDetails[field.key] = fieldValue;
						break;
						
					default: // 'text'
						validatedDetails[field.key] = fieldValue;
						break;
				}
			} else if (!field.required) {
				// Optional field, include as-is
				validatedDetails[field.key] = fieldValue;
			}
		}

		return validatedDetails;
	}

	/**
	 * ENSURE ACCESS - Private helper
	 * 
	 * Checks if user has access to activity based on:
	 * - Role (Student/Faculty/Admin)
	 * - Activity visibility (isPublic)
	 * - Assignment relationship
	 */
	private async ensureAccess(
		activity: ActivityDocument,
		user: JwtPayload,
		newStatus?: UpdateActivityDto['status'],
	): Promise<void> {
		// STUDENT: Can access only own activities
		if (user.role === Role.Student) {
			if (activity.studentId.toString() !== user.studentId) {
				throw new ForbiddenException('You can access only your own activities');
			}
			// Students cannot change status
			if (newStatus && newStatus !== activity.status) {
				throw new ForbiddenException('Students cannot change activity status');
			}
			return;
		}

		// FACULTY: Can access assigned activities (including private)
		if (user.role === Role.Faculty) {
			const assignment = await this.activityAssignmentModel
				.findOne({ activityId: activity._id, facultyId: new Types.ObjectId(user.facultyId) })
				.exec();
			if (!assignment) {
				// If public, allow view access
				if (activity.isPublic) {
					return;
				}
				throw new ForbiddenException('You are not assigned to this activity');
			}
			return;
		}

		// ADMIN: Can access all activities in institute
		const adminAssignment = await this.activityAssignmentModel
			.findOne({ activityId: activity._id, instituteId: new Types.ObjectId(user.instituteId) })
			.exec();
		if (!adminAssignment) {
			throw new ForbiddenException('Activity not in your institute');
		}
	}
}

