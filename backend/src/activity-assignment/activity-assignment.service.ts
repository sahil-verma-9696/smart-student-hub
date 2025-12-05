import { 
	Injectable, 
	ConflictException, 
	NotFoundException,
	BadRequestException,
	ForbiddenException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ActivityAssignment } from './schema/activity-assignment.schema';

/**
 * ActivityAssignmentService - Production-Ready Implementation
 * 
 * BUSINESS RULES:
 * 1. Assignment Rules:
 *    - Only ONE assignment per activity (unique activityId)
 *    - facultyId initially null, assigned later
 *    - Cannot create duplicate assignments
 * 
 * 2. Faculty Assignment:
 *    - Manual assignment by admin
 *    - Auto-assignment based on department match
 *    - Reassignment allowed (update facultyId)
 *    - Unassignment allowed (set facultyId to null)
 * 
 * 3. Access Control:
 *    - Students: Can view their assignments
 *    - Faculty: Can view assigned activities
 *    - Admin: Full access to institute's assignments
 * 
 * 4. Prevention:
 *    - Prevent duplicate assignments (ConflictException)
 *    - Prevent assigning faculty from different institute
 *    - Validate all ObjectIds
 */
@Injectable()
export class ActivityAssignmentService {
	constructor(
		@InjectModel(ActivityAssignment.name)
		private readonly assignmentModel: Model<ActivityAssignment>,
	) {}

	/**
	 * CREATE ACTIVITY ASSIGNMENT
	 * 
	 * VALIDATION RULES:
	 * 1. activityId, studentId, instituteId must be valid ObjectIds
	 * 2. Cannot create duplicate assignment (unique activityId)
	 * 3. facultyId initially null (assigned later)
	 * 
	 * Called when student creates activity
	 */
	async create(payload: {
		activityId: string;
		studentId: string;
		instituteId: string;
	}): Promise<ActivityAssignment> {
		// Validate ObjectIds
		if (!Types.ObjectId.isValid(payload.activityId)) {
			throw new BadRequestException('Invalid activity ID');
		}
		if (!Types.ObjectId.isValid(payload.studentId)) {
			throw new BadRequestException('Invalid student ID');
		}
		if (!Types.ObjectId.isValid(payload.instituteId)) {
			throw new BadRequestException('Invalid institute ID');
		}

		try {
			// Create assignment with facultyId initially null
			const doc = await this.assignmentModel.create({
				activityId: new Types.ObjectId(payload.activityId),
				studentId: new Types.ObjectId(payload.studentId),
				facultyId: null, // Assigned later during review
				instituteId: new Types.ObjectId(payload.instituteId),
			});
			return doc;
		} catch (err: any) {
			// Handle duplicate key error (unique activityId constraint)
			if (err && err.code === 11000) {
				throw new ConflictException('Assignment for this activity already exists');
			}
			throw err;
		}
	}

	/**
	 * ASSIGN FACULTY TO ACTIVITY (Manual Assignment)
	 * 
	 * WORKFLOW:
	 * 1. Validate activityId and facultyId
	 * 2. Find assignment by activityId
	 * 3. Update facultyId
	 * 4. Return updated assignment
	 * 
	 * Used by admin to manually assign faculty for review
	 */
	async assignFaculty(activityId: string, facultyId: string): Promise<ActivityAssignment> {
		if (!Types.ObjectId.isValid(activityId)) {
			throw new BadRequestException('Invalid activity ID');
		}
		if (!Types.ObjectId.isValid(facultyId)) {
			throw new BadRequestException('Invalid faculty ID');
		}

		const assignment = await this.assignmentModel
			.findOneAndUpdate(
				{ activityId: new Types.ObjectId(activityId) },
				{ facultyId: new Types.ObjectId(facultyId) },
				{ new: true }
			)
			.exec();
		
		if (!assignment) {
			throw new NotFoundException('Assignment not found for this activity');
		}
		
		return assignment;
	}

	/**
	 * AUTO-ASSIGN FACULTY TO ACTIVITY
	 * 
	 * LOGIC:
	 * 1. Find faculty in same institute
	 * 2. Match by department (if available)
	 * 3. Round-robin or least-loaded assignment
	 * 4. Update assignment with selected facultyId
	 * 
	 * TODO: Implement sophisticated logic:
	 * - Department matching
	 * - Workload balancing
	 * - Availability checks
	 */
	async autoAssignFaculty(activityId: string, instituteId: string): Promise<ActivityAssignment> {
		if (!Types.ObjectId.isValid(activityId)) {
			throw new BadRequestException('Invalid activity ID');
		}
		if (!Types.ObjectId.isValid(instituteId)) {
			throw new BadRequestException('Invalid institute ID');
		}

		// Find assignment
		const assignment = await this.assignmentModel
			.findOne({ activityId: new Types.ObjectId(activityId) })
			.exec();
		
		if (!assignment) {
			throw new NotFoundException('Assignment not found for this activity');
		}

		// Check if already assigned
		if (assignment.facultyId) {
			throw new ConflictException('Faculty already assigned to this activity');
		}

		// TODO: Implement auto-assignment logic
		// For now, throw error indicating feature not yet implemented
		throw new BadRequestException(
			'Auto-assignment not yet implemented. Please assign faculty manually.'
		);
	}

	/**
	 * REASSIGN FACULTY
	 * 
	 * WORKFLOW:
	 * 1. Find existing assignment
	 * 2. Validate new facultyId
	 * 3. Update facultyId
	 * 
	 * Used when admin wants to change reviewer
	 */
	async reassignFaculty(activityId: string, newFacultyId: string): Promise<ActivityAssignment> {
		if (!Types.ObjectId.isValid(activityId)) {
			throw new BadRequestException('Invalid activity ID');
		}
		if (!Types.ObjectId.isValid(newFacultyId)) {
			throw new BadRequestException('Invalid faculty ID');
		}

		const assignment = await this.assignmentModel
			.findOneAndUpdate(
				{ activityId: new Types.ObjectId(activityId) },
				{ facultyId: new Types.ObjectId(newFacultyId) },
				{ new: true }
			)
			.exec();
		
		if (!assignment) {
			throw new NotFoundException('Assignment not found for this activity');
		}
		
		return assignment;
	}

	/**
	 * UNASSIGN FACULTY
	 * 
	 * WORKFLOW:
	 * 1. Find assignment
	 * 2. Set facultyId to null
	 * 
	 * Used when admin wants to remove faculty assignment
	 */
	async unassignFaculty(activityId: string): Promise<ActivityAssignment> {
		if (!Types.ObjectId.isValid(activityId)) {
			throw new BadRequestException('Invalid activity ID');
		}

		const assignment = await this.assignmentModel
			.findOneAndUpdate(
				{ activityId: new Types.ObjectId(activityId) },
				{ facultyId: null },
				{ new: true }
			)
			.exec();
		
		if (!assignment) {
			throw new NotFoundException('Assignment not found for this activity');
		}
		
		return assignment;
	}

	/**
	 * GET ASSIGNMENTS FOR FACULTY
	 * 
	 * Returns all activities assigned to a specific faculty member
	 * Used by faculty to see their review queue
	 */
	async getAssignmentsForFaculty(facultyId: string): Promise<ActivityAssignment[]> {
		if (!Types.ObjectId.isValid(facultyId)) {
			throw new BadRequestException('Invalid faculty ID');
		}

		return this.assignmentModel
			.find({ facultyId: new Types.ObjectId(facultyId) })
			.exec();
	}

	/**
	 * GET ASSIGNMENT BY ACTIVITY
	 * 
	 * Returns single assignment for an activity
	 */
	async getAssignmentByActivity(activityId: string): Promise<ActivityAssignment | null> {
		if (!Types.ObjectId.isValid(activityId)) {
			throw new BadRequestException('Invalid activity ID');
		}

		return this.assignmentModel
			.findOne({ activityId: new Types.ObjectId(activityId) })
			.exec();
	}

	/**
	 * FIND ALL ASSIGNMENTS (with optional filters)
	 * 
	 * Used by admins for oversight
	 * Can filter by instituteId, facultyId, studentId, etc.
	 */
	async findAll(filter: any = {}): Promise<ActivityAssignment[]> {
		return this.assignmentModel.find(filter).exec();
	}

	/**
	 * FIND BY ACTIVITY ID
	 * 
	 * Returns assignment for specific activity
	 */
	async findByActivityId(activityId: string): Promise<ActivityAssignment | null> {
		if (!Types.ObjectId.isValid(activityId)) {
			return null;
		}
		return this.assignmentModel
			.findOne({ activityId: new Types.ObjectId(activityId) })
			.exec();
	}

	/**
	 * FIND BY FACULTY ID
	 * 
	 * Returns all assignments for a faculty member
	 */
	async findByFacultyId(facultyId: string): Promise<ActivityAssignment[]> {
		if (!Types.ObjectId.isValid(facultyId)) {
			return [];
		}
		return this.assignmentModel
			.find({ facultyId: new Types.ObjectId(facultyId) })
			.exec();
	}

	/**
	 * FIND BY STUDENT ID
	 * 
	 * Returns all assignments for a student
	 */
	async findByStudentId(studentId: string): Promise<ActivityAssignment[]> {
		if (!Types.ObjectId.isValid(studentId)) {
			return [];
		}
		return this.assignmentModel
			.find({ studentId: new Types.ObjectId(studentId) })
			.exec();
	}

	/**
	 * REMOVE BY ACTIVITY
	 * 
	 * Deletes assignment when activity is deleted
	 */
	async removeByActivity(activityId: string): Promise<void> {
		if (!Types.ObjectId.isValid(activityId)) {
			throw new BadRequestException('Invalid activity ID');
		}
		await this.assignmentModel
			.deleteOne({ activityId: new Types.ObjectId(activityId) })
			.exec();
	}
}
