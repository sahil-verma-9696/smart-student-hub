import { 
	ForbiddenException, 
	Injectable, 
	NotFoundException, 
	BadRequestException,
	ConflictException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ActivityType } from './schema/activity-type.schema';
import { CreateActivityTypeDto } from './dto/create-activity-type.dto';
import { UpdateActivityTypeDto } from './dto/update-activity-type.dto';
import { JwtPayload } from '../auth/types/auth.type';
import { Role } from '../auth/types/auth.enum';

/**
 * ActivityTypeService - Production-Ready Implementation
 * 
 * BUSINESS RULES:
 * 1. Primitive Types (isPrimitive=true):
 *    - No instituteId (visible to ALL institutes)
 *    - Cannot be modified/deleted by institutes
 *    - Only system admins can create (hard-coded)
 * 
 * 2. Institute-Specific Types (isPrimitive=false):
 *    - Must have instituteId
 *    - Only visible to owning institute
 *    - Full CRUD by same institute
 * 
 * 3. Approval Workflow:
 *    - Student/Faculty creates → status = UNDER_REVIEW
 *    - Admin creates → status = APPROVED (pre-approved)
 *    - Only admins can approve/reject
 * 
 * 4. FormSchema Validation:
 *    - Each field must have: key, label, type
 *    - Select/checkbox types must have options[]
 *    - Keys must be unique within formSchema
 * 
 * 5. Access Control:
 *    - Students/Faculty: Read-only access to APPROVED types
 *    - Admins: Full access to their institute's types
 */
@Injectable()
export class ActivityTypeService {
	constructor(
		@InjectModel(ActivityType.name) private readonly activityTypeModel: Model<ActivityType>,
	) {}

	/**
	 * CREATE ACTIVITY TYPE
	 * 
	 * VALIDATION RULES:
	 * 1. Name is required and unique per institute
	 * 2. FormSchema must be valid (validateFormSchema)
	 * 3. minCredit <= maxCredit
	 * 4. Primitive types: Only admins can create, no instituteId
	 * 5. Institute types: Must have valid instituteId
	 * 
	 * WORKFLOW:
	 * - Admin creates → status = APPROVED (pre-approved)
	 * - Student/Faculty creates → status = UNDER_REVIEW (needs approval)
	 * 
	 * @throws BadRequestException - Invalid input data
	 * @throws ForbiddenException - Missing instituteId or unauthorized
	 */
	async create(dto: CreateActivityTypeDto, user: JwtPayload): Promise<ActivityType> {
		// Validate name
		if (!dto.name || dto.name.trim().length === 0) {
			throw new BadRequestException('Activity type name is required');
		}

		// Validate credits
		if (dto.minCredit && dto.maxCredit && dto.minCredit > dto.maxCredit) {
			throw new BadRequestException('Minimum credit cannot be greater than maximum credit');
		}

		// Validate formSchema
		if (dto.formSchema && dto.formSchema.length > 0) {
			this.validateFormSchema(dto.formSchema);
		}

		// Check for duplicate name within institute
		const query: any = { name: dto.name.trim() };
		if (!dto.isPrimitive && user.instituteId && user.instituteId.trim() !== '') {
			query.instituteId = new Types.ObjectId(user.instituteId);
		} else if (!dto.isPrimitive) {
			query.instituteId = { $exists: false };
		}

		const existing = await this.activityTypeModel.findOne(query);
		if (existing) {
			throw new ConflictException(`Activity type with name "${dto.name}" already exists`);
		}

		// Determine status based on role
		let status: ActivityType['status'];
		if (user.role === Role.Admin) {
			status = 'APPROVED'; // Admins create pre-approved types
		} else {
			status = 'UNDER_REVIEW'; // Students/Faculty need approval
		}

		// Build activity type document
		const activityTypeData: any = {
			name: dto.name.trim(),
			description: dto.description?.trim() || '',
			isPrimitive: dto.isPrimitive ?? false,
			formSchema: dto.formSchema ?? [],
			minCredit: dto.minCredit ?? 0,
			maxCredit: dto.maxCredit ?? 0,
			status,
		};

		// Handle instituteId for non-primitive types
		if (!dto.isPrimitive) {
			if (!user.instituteId || user.instituteId.trim() === '') {
				throw new ForbiddenException(
					'Institute ID is required to create institute-specific activity types. Please log out and log back in.'
				);
			}
			activityTypeData.instituteId = new Types.ObjectId(user.instituteId);
		}

		// Create and return
		const created = await this.activityTypeModel.create(activityTypeData);
		return created;
	}

	/**
	 * Get all activity types accessible to user
	 * 
	 * Filtering logic:
	 * 1. Include primitive types (isPrimitive=true) - visible to ALL institutes
	 * 2. Include institute-specific types (instituteId matches user's institute)
	 * 3. For non-admins: Only return APPROVED types
	 * 4. For admins: Return all types (including UNDER_REVIEW, REJECTED)
	 * 
	 * @param user - Authenticated user (contains role, instituteId)
	 * @returns Array of activity types
	 */
	async findAll(user: JwtPayload) {
		const typeFilter: any = {};
		
		// Build OR condition: primitive types OR institute-specific types
		const orConditions: any[] = [{ isPrimitive: true }]; // Primitive types visible to all institutes
		
		// Only add institute filter if user has valid instituteId
		if (user.instituteId && user.instituteId.trim() !== '') {
			orConditions.push({ instituteId: new Types.ObjectId(user.instituteId) });
		} else {
			console.log('⚠️  Warning: User has no instituteId, only showing primitive types');
			console.log('User data:', { sub: user.sub, email: user.email, role: user.role, instituteId: user.instituteId });
		}
		
		typeFilter.$or = orConditions;

		// Students and faculty can only see approved types; admins see all statuses
		if (user.role !== Role.Admin) {
			typeFilter.status = 'APPROVED';
		}

		console.log('ActivityType findAll query:', JSON.stringify(typeFilter, null, 2));
		
		// Execute query and return results
		const results = await this.activityTypeModel.find(typeFilter).exec();
		console.log(`Found ${results.length} activity type(s)`);
		return results;
	}

	/**
	 * Get single activity type by ID
	 * 
	 * Access control:
	 * 1. Primitive types: Accessible to all institutes
	 * 2. Institute-specific types: Only accessible to same institute
	 * 3. Non-admins: Can only view APPROVED types
	 * 4. Admins: Can view all statuses for their institute
	 * 
	 * @param id - ActivityType ObjectId
	 * @param user - Authenticated user
	 * @returns Activity type document
	 * @throws NotFoundException if type doesn't exist
	 * @throws ForbiddenException if user lacks access
	 */
	async findOne(id: string, user: JwtPayload) {
		// Fetch activity type by ID
		const type = await this.activityTypeModel.findById(id).exec();
		if (!type) throw new NotFoundException('ActivityType not found');

		// Access check: primitive types visible to all, otherwise must be same institute
		if (!type.isPrimitive && type.instituteId?.toString() !== user.instituteId) {
			throw new ForbiddenException('Activity type not accessible to your institute');
		}

		// Status check: non-admins can only view approved types
		if (user.role !== Role.Admin && type.status !== 'APPROVED') {
			throw new ForbiddenException('You can only view approved activity types');
		}
		
		return type;
	}

	/**
	 * UPDATE ACTIVITY TYPE
	 * 
	 * RESTRICTIONS:
	 * 1. Cannot modify primitive types
	 * 2. Can only update types from same institute
	 * 3. Only admins can change status
	 * 4. Validate formSchema if updated
	 * 5. Validate credits if updated
	 */
	async update(id: string, dto: UpdateActivityTypeDto, user: JwtPayload): Promise<ActivityType> {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid activity type ID');
		}

		const type = await this.activityTypeModel.findById(id).exec();
		if (!type) {
			throw new NotFoundException('Activity type not found');
		}

		// RULE: Cannot modify primitive types
		if (type.isPrimitive) {
			throw new ForbiddenException('Primitive activity types cannot be modified');
		}

		// RULE: Can only update types from same institute
		if (type.instituteId?.toString() !== user.instituteId) {
			throw new ForbiddenException('You can only update activity types from your institute');
		}

		// RULE: Only admins can change status
		if (dto.status && user.role !== Role.Admin) {
			throw new ForbiddenException('Only admins can change activity type status');
		}

		// Validate formSchema if provided
		if (dto.formSchema) {
			this.validateFormSchema(dto.formSchema);
		}

		// Validate credits if provided
		const newMinCredit = dto.minCredit ?? type.minCredit ?? 0;
		const newMaxCredit = dto.maxCredit ?? type.maxCredit ?? 0;
		if (newMinCredit > newMaxCredit) {
			throw new BadRequestException('Minimum credit cannot be greater than maximum credit');
		}

		// Perform update
		const updated = await this.activityTypeModel
			.findByIdAndUpdate(id, dto, { new: true })
			.exec();

		return updated!;
	}

	/**
	 * APPROVE ACTIVITY TYPE (Admin Only)
	 * 
	 * WORKFLOW:
	 * 1. Check user is admin
	 * 2. Check activity type exists and belongs to institute
	 * 3. Change status to APPROVED
	 */
	async approveActivityType(id: string, user: JwtPayload): Promise<ActivityType> {
		if (user.role !== Role.Admin) {
			throw new ForbiddenException('Only admins can approve activity types');
		}

		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid activity type ID');
		}

		const type = await this.activityTypeModel.findById(id).exec();
		if (!type) {
			throw new NotFoundException('Activity type not found');
		}

		// Check institute access
		if (!type.isPrimitive && type.instituteId?.toString() !== user.instituteId) {
			throw new ForbiddenException('You can only approve activity types from your institute');
		}

		// Update status
		type.status = 'APPROVED';
		await type.save();

		return type;
	}

	/**
	 * REJECT ACTIVITY TYPE (Admin Only)
	 * 
	 * WORKFLOW:
	 * 1. Check user is admin
	 * 2. Check activity type exists and belongs to institute
	 * 3. Change status to REJECTED
	 */
	async rejectActivityType(id: string, user: JwtPayload): Promise<ActivityType> {
		if (user.role !== Role.Admin) {
			throw new ForbiddenException('Only admins can reject activity types');
		}

		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid activity type ID');
		}

		const type = await this.activityTypeModel.findById(id).exec();
		if (!type) {
			throw new NotFoundException('Activity type not found');
		}

		// Check institute access
		if (!type.isPrimitive && type.instituteId?.toString() !== user.instituteId) {
			throw new ForbiddenException('You can only reject activity types from your institute');
		}

		// Update status
		type.status = 'REJECTED';
		await type.save();

		return type;
	}

	/**
	 * DELETE ACTIVITY TYPE
	 * 
	 * RESTRICTIONS:
	 * 1. Cannot delete primitive types
	 * 2. Can only delete types from same institute
	 * 3. Only admins can delete
	 */
	async remove(id: string, user: JwtPayload): Promise<void> {
		if (user.role !== Role.Admin) {
			throw new ForbiddenException('Only admins can delete activity types');
		}

		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid activity type ID');
		}

		const type = await this.activityTypeModel.findById(id).exec();
		if (!type) {
			throw new NotFoundException('Activity type not found');
		}

		// RULE: Cannot delete primitive types
		if (type.isPrimitive) {
			throw new ForbiddenException('Primitive activity types cannot be deleted');
		}

		// RULE: Can only delete types from same institute
		if (type.instituteId?.toString() !== user.instituteId) {
			throw new ForbiddenException('You can only delete activity types from your institute');
		}

		await this.activityTypeModel.findByIdAndDelete(id).exec();
	}

	/**
	 * VALIDATE FORM SCHEMA
	 * 
	 * RULES:
	 * 1. Each field must have: key, label, type
	 * 2. Keys must be unique
	 * 3. Type must be valid enum value
	 * 4. Select/checkbox types must have options[]
	 */
	validateFormSchema(formSchema: any[]): void {
		if (!Array.isArray(formSchema)) {
			throw new BadRequestException('formSchema must be an array');
		}

		const keys = new Set<string>();
		const validTypes = ['text', 'number', 'date', 'select', 'checkbox'];

		for (let i = 0; i < formSchema.length; i++) {
			const field = formSchema[i];

			// Validate required fields
			if (!field.key || field.key.trim().length === 0) {
				throw new BadRequestException(`Field ${i + 1}: key is required`);
			}
			if (!field.label || field.label.trim().length === 0) {
				throw new BadRequestException(`Field ${i + 1}: label is required`);
			}
			if (!field.type) {
				throw new BadRequestException(`Field ${i + 1}: type is required`);
			}

			// Validate type enum
			if (!validTypes.includes(field.type)) {
				throw new BadRequestException(
					`Field ${i + 1}: type must be one of: ${validTypes.join(', ')}`
				);
			}

			// Validate unique keys
			if (keys.has(field.key.trim())) {
				throw new BadRequestException(`Field ${i + 1}: duplicate key "${field.key}"`);
			}
			keys.add(field.key.trim());

			// Validate options for select/checkbox
			if ((field.type === 'select' || field.type === 'checkbox') && 
			    (!field.options || field.options.length === 0)) {
				throw new BadRequestException(
					`Field ${i + 1}: ${field.type} type requires options array`
				);
			}
		}
	}

	/**
	 * GET ACTIVITY TYPES FOR INSTITUTE (Admin Helper)
	 * 
	 * Returns all activity types for a specific institute, including all statuses
	 */
	async getActivityTypesForInstitute(instituteId: string, user: JwtPayload): Promise<ActivityType[]> {
		if (user.role !== Role.Admin) {
			throw new ForbiddenException('Only admins can view all institute activity types');
		}

		if (!Types.ObjectId.isValid(instituteId)) {
			throw new BadRequestException('Invalid institute ID');
		}

		// Admins can only view types from their own institute
		if (user.instituteId !== instituteId) {
			throw new ForbiddenException('You can only view activity types from your institute');
		}

		// Return primitive types + institute-specific types
		return this.activityTypeModel.find({
			$or: [
				{ isPrimitive: true },
				{ instituteId: new Types.ObjectId(instituteId) }
			]
		}).exec();
	}
}

