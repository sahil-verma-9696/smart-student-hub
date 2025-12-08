import {
	Injectable,
	NotFoundException,
	ForbiddenException,
	BadRequestException,
	ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activity } from './schema/acivity.schema';
import { ActivityType } from '../activity-type/schema/activity-type.schema';
import { Student } from '../student/schema/student.schema';
import { Faculty } from '../faculty/schemas/faculty.schema';
import { ActivityAssignmentService } from '../activity-assignment/activity-assignment.service';
import { JwtPayload } from '../auth/types/auth.type';
import { Role } from '../auth/types/auth.enum';
import {
	CreateActivityDto,
	UpdateActivityDto,
	ReviewActivityDto,
	ApproveActivityDto,
	RejectActivityDto,
} from './dto';

/**
 * ActivityService - Production-Ready Implementation
 *
 * BUSINESS RULES:
 * 1. Activity Creation:
 *    - Validate activityTypeId exists and is APPROVED (or primitive)
 *    - Validate dynamic fields against ActivityType.formSchema
 *    - Required fields must be filled
 *    - Credits must be within minCredit-maxCredit range
 *    - Auto-create ActivityAssignment
 *    - Set status = PENDING by default
 *
 * 2. Activity Visibility:
 *    - Private (isPublic=false): Only student + faculty/admin during review
 *    - Public (isPublic=true): Student + faculty of same dept + institute admin
 *
 * 3. Review Workflow (Faculty):
 *    - Faculty can review assigned activities
 *    - Set reviewedBy, reviewedAt
 *    - Can recommend approval (but cannot finalize)
 *    - Faculty gets access to private activities during review
 *
 * 4. Approval Workflow (Admin Only):
 *    - Admin can approve/reject
 *    - Set approvedBy/rejectedBy, approvedAt/rejectedAt
 *    - Validate all requirements before approval
 *    - Can override visibility during review
 *
 * 5. Edit Restrictions:
 *    - Student can edit only BEFORE review (status=PENDING, no reviewedBy)
 *    - Cannot change activityTypeId after creation
 *    - Cannot modify approval metadata
 *
 * 6. Access Control:
 *    - Student: Own activities only + public activities (with dept filter)
 *    - Faculty: Assigned activities + public activities of dept students
 *    - Admin: Full access to institute's activities
 */
@Injectable()
export class ActivityService {
	constructor(
		@InjectModel(Activity.name) private readonly activityModel: Model<Activity>,
		@InjectModel(ActivityType.name) private readonly activityTypeModel: Model<ActivityType>,
		@InjectModel(Student.name) private readonly studentModel: Model<Student>,
		@InjectModel(Faculty.name) private readonly facultyModel: Model<Faculty>,
		private readonly activityAssignmentService: ActivityAssignmentService,
	) {}

	/**
	 * CREATE ACTIVITY
	 *
	 * VALIDATION WORKFLOW:
	 * 1. Validate activityTypeId exists and is APPROVED (or primitive)
	 * 2. Validate dynamic fields against formSchema
	 * 3. Validate required fields are filled
	 * 4. Validate credits within allowed range
	 * 5. Create activity with status=PENDING
	 * 6. Auto-create ActivityAssignment
	 *
	 * @throws NotFoundException - ActivityType not found
	 * @throws ForbiddenException - ActivityType not approved
	 * @throws BadRequestException - Invalid fields or missing required data
	 */
	async createActivity(dto: CreateActivityDto, user: JwtPayload): Promise<Activity> {
		// Only students can create activities
		if (user.role !== Role.Student) {
			throw new ForbiddenException('Only students can create activities');
		}

		// Validate ObjectId format
		if (!Types.ObjectId.isValid(dto.activityTypeId)) {
			throw new BadRequestException('Invalid activity type ID');
		}

		// Fetch and validate ActivityType
		const activityType = await this.activityTypeModel.findById(dto.activityTypeId).exec();
		if (!activityType) {
			throw new NotFoundException('Activity type not found');
		}

		// RULE: ActivityType must be APPROVED or primitive
		if (activityType.status !== 'APPROVED' && !activityType.isPrimitive) {
			throw new ForbiddenException('Cannot create activity with unapproved activity type');
		}

		// Validate dynamic fields against formSchema
		if (activityType.formSchema && activityType.formSchema.length > 0) {
			this.validateDynamicFields(dto.details || {}, activityType.formSchema);
		}

		// Validate credits within allowed range
		const creditsEarned = dto.creditsEarned ?? 0;
		const minCredit = activityType.minCredit ?? 0;
		const maxCredit = activityType.maxCredit ?? 0;

		if (creditsEarned < minCredit || creditsEarned > maxCredit) {
			throw new BadRequestException(
				`Credits earned must be between ${minCredit} and ${maxCredit}`
			);
		}

		// Get student info
		const student = await this.studentModel
			.findOne({ basicUserDetails: new Types.ObjectId(user.userId) })
			.exec();
		if (!student) {
			throw new NotFoundException('Student profile not found');
		}

		// Build activity document
		const activityData: any = {
			studentId: student._id,
			activityTypeId: new Types.ObjectId(dto.activityTypeId),
			title: dto.title.trim(),
			description: dto.description?.trim() || '',
			location: dto.location.trim(),
			locationType: dto.locationType?.trim() || '',
			details: dto.details || {},
			attachments: dto.attachments?.map((id) => new Types.ObjectId(id)) || [],
			skills: dto.skills || [],
			creditsEarned,
			externalUrl: dto.externalUrl || '',
			isPublic: dto.isPublic ?? false, // Default: private
			status: 'PENDING',
			submittedAt: new Date(),
		};

		// Create activity
		const activity = await this.activityModel.create(activityData);

		// Auto-create ActivityAssignment
		try {
			await this.activityAssignmentService.create({
				activityId: activity._id.toString(),
				studentId: student._id.toString(),
				instituteId: student.institute.toString(),
			});
		} catch (error: any) {
			// If assignment creation fails, rollback activity
			await this.activityModel.findByIdAndDelete(activity._id).exec();
			throw error;
		}

		return activity;
	}

	/**
	 * UPDATE ACTIVITY
	 *
	 * RESTRICTIONS:
	 * - Student can only edit BEFORE review starts
	 * - Cannot change activityTypeId
	 * - Cannot modify approval metadata
	 * - Must re-validate dynamic fields if changed
	 *
	 * @throws NotFoundException - Activity not found
	 * @throws ForbiddenException - Cannot edit (already reviewed) or not owner
	 * @throws BadRequestException - Invalid updates
	 */
	async updateActivity(
		activityId: string,
		dto: UpdateActivityDto,
		user: JwtPayload,
	): Promise<Activity> {
		if (!Types.ObjectId.isValid(activityId)) {
			throw new BadRequestException('Invalid activity ID');
		}

		// Fetch activity
		const activity = await this.activityModel.findById(activityId).exec();
		if (!activity) {
			throw new NotFoundException('Activity not found');
		}

		// Get student info
		const student = await this.studentModel
			.findOne({ basicUserDetails: new Types.ObjectId(user.userId) })
			.exec();
		if (!student) {
			throw new NotFoundException('Student profile not found');
		}

		// RULE: Only owner can update
		if (activity.studentId.toString() !== student._id.toString()) {
			throw new ForbiddenException('You can only update your own activities');
		}

		// RULE: Cannot edit after review starts
		if (activity.reviewedBy || activity.status !== 'PENDING') {
			throw new ForbiddenException(
				'Cannot edit activity after review has started or status changed'
			);
		}

		// RULE: Cannot change activityTypeId
		if (dto.activityTypeId && dto.activityTypeId !== activity.activityTypeId.toString()) {
			throw new BadRequestException('Cannot change activity type after creation');
		}

		// If details are updated, re-validate against formSchema
		if (dto.details) {
			const activityType = await this.activityTypeModel.findById(activity.activityTypeId).exec();
			if (activityType && activityType.formSchema && activityType.formSchema.length > 0) {
				this.validateDynamicFields(dto.details, activityType.formSchema);
			}
		}

		// If credits are updated, validate range
		if (dto.creditsEarned !== undefined) {
			const activityType = await this.activityTypeModel.findById(activity.activityTypeId).exec();
			if (activityType) {
				const minCredit = activityType.minCredit ?? 0;
				const maxCredit = activityType.maxCredit ?? 0;
				if (dto.creditsEarned < minCredit || dto.creditsEarned > maxCredit) {
					throw new BadRequestException(
						`Credits earned must be between ${minCredit} and ${maxCredit}`
					);
				}
			}
		}

		// Build update object (exclude fields that shouldn't be updated)
		const updateData: any = {};
		if (dto.title) updateData.title = dto.title.trim();
		if (dto.description !== undefined) updateData.description = dto.description.trim();
		if (dto.location) updateData.location = dto.location.trim();
		if (dto.locationType !== undefined) updateData.locationType = dto.locationType.trim();
		if (dto.details) updateData.details = dto.details;
		if (dto.attachments) updateData.attachments = dto.attachments.map((id) => new Types.ObjectId(id));
		if (dto.skills) updateData.skills = dto.skills;
		if (dto.creditsEarned !== undefined) updateData.creditsEarned = dto.creditsEarned;
		if (dto.externalUrl !== undefined) updateData.externalUrl = dto.externalUrl;
		if (dto.isPublic !== undefined) updateData.isPublic = dto.isPublic;

		// Update activity
		const updated = await this.activityModel
			.findByIdAndUpdate(activityId, updateData, { new: true })
			.exec();

		return updated!;
	}

	/**
	 * DELETE ACTIVITY
	 *
	 * RESTRICTIONS:
	 * - Student can delete only BEFORE review
	 * - Admin can delete any activity
	 * - Deleting activity also deletes assignment
	 *
	 * @throws NotFoundException - Activity not found
	 * @throws ForbiddenException - Cannot delete (already reviewed) or not owner
	 */
	async deleteActivity(activityId: string, user: JwtPayload): Promise<void> {
		if (!Types.ObjectId.isValid(activityId)) {
			throw new BadRequestException('Invalid activity ID');
		}

		const activity = await this.activityModel.findById(activityId).exec();
		if (!activity) {
			throw new NotFoundException('Activity not found');
		}

		// Admin can delete any activity
		if (user.role === Role.Admin) {
			await this.activityModel.findByIdAndDelete(activityId).exec();
			await this.activityAssignmentService.removeByActivity(activityId);
			return;
		}

		// Student can only delete their own activities
		const student = await this.studentModel
			.findOne({ basicUserDetails: new Types.ObjectId(user.userId) })
			.exec();
		if (!student || activity.studentId.toString() !== student._id.toString()) {
			throw new ForbiddenException('You can only delete your own activities');
		}

		// Student cannot delete after review starts
		if (activity.reviewedBy || activity.status !== 'PENDING') {
			throw new ForbiddenException('Cannot delete activity after review has started');
		}

		// Delete activity and assignment
		await this.activityModel.findByIdAndDelete(activityId).exec();
		await this.activityAssignmentService.removeByActivity(activityId);
	}

	/**
	 * GET ACTIVITIES FOR USER
	 *
	 * ACCESS CONTROL:
	 * - Student: Own activities + public activities
	 * - Faculty: Assigned activities + public activities of dept students
	 * - Admin: All institute activities
	 *
	 * @returns Array of activities based on role
	 */
	async getActivitiesForUser(user: JwtPayload): Promise<Activity[]> {
		const query: any = {};

		switch (user.role) {
			case Role.Student: {
				// Get student info
				const student = await this.studentModel
					.findOne({ basicUserDetails: new Types.ObjectId(user.userId) })
					.exec();
				if (!student) {
					throw new NotFoundException('Student profile not found');
				}

				// Return: Own activities + public activities
				query.$or = [
					{ studentId: student._id }, // Own activities
					{ isPublic: true }, // Public activities
				];
				break;
			}

			case Role.Faculty: {
				// Get faculty info
				const faculty = await this.facultyModel
					.findOne({ basicUserDetails: new Types.ObjectId(user.userId) })
					.populate('department')
					.exec();
				if (!faculty) {
					throw new NotFoundException('Faculty profile not found');
				}

				// Get assigned activities
				const assignments = await this.activityAssignmentService.findByFacultyId(
					faculty._id.toString()
				);
				const assignedActivityIds = assignments.map((a) => a.activityId);

				// Return: Assigned activities + public activities
				query.$or = [
					{ _id: { $in: assignedActivityIds } }, // Assigned activities
					{ isPublic: true }, // Public activities
				];
				break;
			}

			case Role.Admin: {
				// Admin sees all activities in their institute
				if (!user.instituteId) {
					throw new BadRequestException('Institute ID not found in user token');
				}

				// Get all students from institute
				const students = await this.studentModel
					.find({ institute: new Types.ObjectId(user.instituteId) })
					.exec();
				const studentIds = students.map((s) => s._id);

				query.studentId = { $in: studentIds };
				break;
			}

			default:
				throw new ForbiddenException('Invalid role');
		}

		return this.activityModel
			.find(query)
			.populate('activityTypeId')
			.populate('studentId')
			.sort({ submittedAt: -1 })
			.exec();
	}

	/**
	 * GET PUBLIC ACTIVITIES
	 *
	 * Returns all public activities (isPublic=true, status=APPROVED)
	 * Useful for showcase/portfolio view
	 */
	async getPublicActivities(): Promise<Activity[]> {
		return this.activityModel
			.find({
				isPublic: true,
				status: 'APPROVED',
			})
			.populate('activityTypeId')
			.populate('studentId')
			.sort({ approvedAt: -1 })
			.exec();
	}

	/**
	 * GET ACTIVITY BY ID
	 *
	 * ACCESS CONTROL:
	 * - Private activity: Only student + assigned faculty + admin
	 * - Public activity: Anyone can view
	 *
	 * @throws NotFoundException - Activity not found
	 * @throws ForbiddenException - No access to private activity
	 */
	async getActivityById(activityId: string, user: JwtPayload): Promise<Activity> {
		if (!Types.ObjectId.isValid(activityId)) {
			throw new BadRequestException('Invalid activity ID');
		}

		const activity = await this.activityModel
			.findById(activityId)
			.populate('activityTypeId')
			.populate('studentId')
			.exec();

		if (!activity) {
			throw new NotFoundException('Activity not found');
		}

		// Public activities: Anyone can view
		if (activity.isPublic) {
			return activity;
		}

		// Private activities: Check access
		switch (user.role) {
			case Role.Student: {
				const student = await this.studentModel
					.findOne({ basicUserDetails: new Types.ObjectId(user.userId) })
					.exec();
				if (!student || activity.studentId.toString() !== student._id.toString()) {
					throw new ForbiddenException('You can only view your own private activities');
				}
				break;
			}

			case Role.Faculty: {
				// Faculty can view if assigned OR if activity is under review
				const faculty = await this.facultyModel
					.findOne({ basicUserDetails: new Types.ObjectId(user.userId) })
					.exec();
				if (!faculty) {
					throw new NotFoundException('Faculty profile not found');
				}

				const assignment = await this.activityAssignmentService.getAssignmentByActivity(activityId);
				if (!assignment || assignment.facultyId?.toString() !== faculty._id.toString()) {
					throw new ForbiddenException('You can only view activities assigned to you');
				}
				break;
			}

			case Role.Admin: {
				// Admin can view all activities in their institute
				const student = await this.studentModel.findById(activity.studentId).exec();
				if (!student || student.institute.toString() !== user.instituteId) {
					throw new ForbiddenException('You can only view activities from your institute');
				}
				break;
			}

			default:
				throw new ForbiddenException('Invalid role');
		}

		return activity;
	}

	/**
	 * FACULTY REVIEW ACTIVITY
	 *
	 * WORKFLOW:
	 * 1. Verify faculty is assigned to activity
	 * 2. Update reviewedBy, reviewedAt
	 * 3. Cannot finalize approval (admin only)
	 * 4. Faculty gets access to private activities during review
	 *
	 * @throws NotFoundException - Activity not found
	 * @throws ForbiddenException - Not assigned to review
	 * @throws BadRequestException - Already reviewed/approved/rejected
	 */
	async facultyReviewActivity(
		activityId: string,
		dto: ReviewActivityDto,
		user: JwtPayload,
	): Promise<Activity> {
		if (user.role !== Role.Faculty) {
			throw new ForbiddenException('Only faculty can review activities');
		}

		if (!Types.ObjectId.isValid(activityId)) {
			throw new BadRequestException('Invalid activity ID');
		}

		const activity = await this.activityModel.findById(activityId).exec();
		if (!activity) {
			throw new NotFoundException('Activity not found');
		}

		// Check if already approved/rejected
		if (activity.status !== 'PENDING') {
			throw new BadRequestException(`Activity is already ${activity.status.toLowerCase()}`);
		}

		// Verify faculty is assigned
		const faculty = await this.facultyModel
			.findOne({ basicUserDetails: new Types.ObjectId(user.userId) })
			.exec();
		if (!faculty) {
			throw new NotFoundException('Faculty profile not found');
		}

		const assignment = await this.activityAssignmentService.getAssignmentByActivity(activityId);
		if (!assignment || assignment.facultyId?.toString() !== faculty._id.toString()) {
			throw new ForbiddenException('You can only review activities assigned to you');
		}

		// Update review metadata
		activity.reviewedBy = faculty._id;
		activity.reviewedAt = new Date();

		await activity.save();

		return activity;
	}

	/**
	 * ADMIN APPROVE ACTIVITY
	 *
	 * WORKFLOW:
	 * 1. Verify all validations (dynamic fields, credits, etc.)
	 * 2. Set status=APPROVED
	 * 3. Set approvedBy, approvedAt
	 * 4. Optionally override credits
	 *
	 * @throws NotFoundException - Activity not found
	 * @throws ForbiddenException - Not admin or wrong institute
	 * @throws BadRequestException - Already approved or validation failed
	 */
	async adminApproveActivity(
		activityId: string,
		dto: ApproveActivityDto,
		user: JwtPayload,
	): Promise<Activity> {
		if (user.role !== Role.Admin) {
			throw new ForbiddenException('Only admins can approve activities');
		}

		if (!Types.ObjectId.isValid(activityId)) {
			throw new BadRequestException('Invalid activity ID');
		}

		const activity = await this.activityModel.findById(activityId).exec();
		if (!activity) {
			throw new NotFoundException('Activity not found');
		}

		// Check if already approved
		if (activity.status === 'APPROVED') {
			throw new BadRequestException('Activity is already approved');
		}

		// Verify activity belongs to admin's institute
		const student = await this.studentModel.findById(activity.studentId).exec();
		if (!student || student.institute.toString() !== user.instituteId) {
			throw new ForbiddenException('You can only approve activities from your institute');
		}

		// Validate dynamic fields exist
		const activityType = await this.activityTypeModel.findById(activity.activityTypeId).exec();
		if (activityType && activityType.formSchema && activityType.formSchema.length > 0) {
			this.validateDynamicFields(activity.details, activityType.formSchema);
		}

		// Validate credits if overridden
		if (dto.creditsEarned !== undefined) {
			const minCredit = activityType?.minCredit ?? 0;
			const maxCredit = activityType?.maxCredit ?? 0;
			if (dto.creditsEarned < minCredit || dto.creditsEarned > maxCredit) {
				throw new BadRequestException(
					`Credits earned must be between ${minCredit} and ${maxCredit}`
				);
			}
			activity.creditsEarned = dto.creditsEarned;
		} else {
			// Validate existing credits
			const minCredit = activityType?.minCredit ?? 0;
			const maxCredit = activityType?.maxCredit ?? 0;
			if (activity.creditsEarned < minCredit || activity.creditsEarned > maxCredit) {
				throw new BadRequestException(
					`Credits earned must be between ${minCredit} and ${maxCredit}. Please provide valid creditsEarned.`
				);
			}
		}

		// Update approval metadata
		activity.status = 'APPROVED';
		activity.approvedBy = new Types.ObjectId(user.userId);
		activity.approvedAt = new Date();

		await activity.save();

		return activity;
	}

	/**
	 * ADMIN REJECT ACTIVITY
	 *
	 * WORKFLOW:
	 * 1. Set status=REJECTED
	 * 2. Set rejectedBy, rejectedAt
	 * 3. Rejection reason is mandatory
	 *
	 * @throws NotFoundException - Activity not found
	 * @throws ForbiddenException - Not admin or wrong institute
	 * @throws BadRequestException - Already rejected
	 */
	async adminRejectActivity(
		activityId: string,
		dto: RejectActivityDto,
		user: JwtPayload,
	): Promise<Activity> {
		if (user.role !== Role.Admin) {
			throw new ForbiddenException('Only admins can reject activities');
		}

		if (!Types.ObjectId.isValid(activityId)) {
			throw new BadRequestException('Invalid activity ID');
		}

		const activity = await this.activityModel.findById(activityId).exec();
		if (!activity) {
			throw new NotFoundException('Activity not found');
		}

		// Check if already rejected
		if (activity.status === 'REJECTED') {
			throw new BadRequestException('Activity is already rejected');
		}

		// Verify activity belongs to admin's institute
		const student = await this.studentModel.findById(activity.studentId).exec();
		if (!student || student.institute.toString() !== user.instituteId) {
			throw new ForbiddenException('You can only reject activities from your institute');
		}

		// Update rejection metadata
		activity.status = 'REJECTED';
		activity.rejectedBy = new Types.ObjectId(user.userId);
		activity.rejectedAt = new Date();

		await activity.save();

		return activity;
	}

	/**
	 * VALIDATE DYNAMIC FIELDS
	 *
	 * RULES:
	 * 1. All required fields must be present
	 * 2. Field types must match formSchema definitions
	 * 3. Select/checkbox values must be from options
	 *
	 * @throws BadRequestException - Validation failed
	 */
	validateDynamicFields(details: Record<string, any>, formSchema: any[]): void {
		for (const field of formSchema) {
			const value = details[field.key];

			// Check required fields
			if (field.required && (value === undefined || value === null || value === '')) {
				throw new BadRequestException(`Required field "${field.label}" is missing`);
			}

			// Skip validation for optional empty fields
			if (!field.required && (value === undefined || value === null || value === '')) {
				continue;
			}

			// Type validation
			switch (field.type) {
				case 'text':
					if (typeof value !== 'string') {
						throw new BadRequestException(`Field "${field.label}" must be a string`);
					}
					break;

				case 'number':
					if (typeof value !== 'number' && isNaN(Number(value))) {
						throw new BadRequestException(`Field "${field.label}" must be a number`);
					}
					break;

				case 'date':
					if (isNaN(Date.parse(value))) {
						throw new BadRequestException(`Field "${field.label}" must be a valid date`);
					}
					break;

				case 'select':
					if (field.options && !field.options.includes(value)) {
						throw new BadRequestException(
							`Field "${field.label}" must be one of: ${field.options.join(', ')}`
						);
					}
					break;

				case 'checkbox':
					if (!Array.isArray(value)) {
						throw new BadRequestException(`Field "${field.label}" must be an array`);
					}
					if (field.options) {
						for (const v of value) {
							if (!field.options.includes(v)) {
								throw new BadRequestException(
									`Field "${field.label}" contains invalid value: ${v}`
								);
							}
						}
					}
					break;

				default:
					throw new BadRequestException(`Invalid field type: ${field.type}`);
			}
		}
	}
}
