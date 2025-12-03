import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Assignment, AssignmentDocument } from './schema/assignment.schema';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { BulkAssignDto } from './dto/bulk-assign.dto';
import { ReassignActivityDto } from './dto/reassign-activity.dto';
import { QueryAssignmentDto } from './dto/query-assignment.dto';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectModel(Assignment.name)
    private assignmentModel: Model<AssignmentDocument>,
  ) {}

  /**
   * Assign a single activity to a faculty
   */
  async assignActivity(
    dto: CreateAssignmentDto,
  ): Promise<AssignmentDocument> {
    const { activityId, facultyId, instituteId } = dto;

    // Check if activity is already assigned
    const existing = await this.assignmentModel
      .findOne({ activityId: new Types.ObjectId(activityId as string) })
      .exec();

    if (existing) {
      throw new ConflictException(
        `Activity ${activityId} is already assigned to faculty ${existing.facultyId}`,
      );
    }

    // Create new assignment
    const assignment = await this.assignmentModel.create({
      activityId: new Types.ObjectId(activityId as string),
      facultyId: new Types.ObjectId(facultyId as string),
      instituteId: new Types.ObjectId(instituteId as string),
    });

    return assignment.populate(['activityId', 'facultyId']);
  }

  /**
   * Bulk assign multiple activities to a single faculty
   */
  async bulkAssignActivities(dto: BulkAssignDto) {
    const { activityIds, facultyId, instituteId } = dto;

    const successes: { activityId: string; assignmentId: string }[] = [];
    const failures: { activityId: string; reason: string }[] = [];
    const alreadyAssigned: { activityId: string; currentFacultyId: string }[] =
      [];

    for (const activityId of activityIds) {
      try {
        // Check if already assigned
        const existing = await this.assignmentModel
          .findOne({ activityId: new Types.ObjectId(activityId as string) })
          .exec();

        if (existing) {
          alreadyAssigned.push({
            activityId: activityId.toString(),
            currentFacultyId: existing.facultyId.toString(),
          });
          continue;
        }

        // Create assignment
        const assignment = await this.assignmentModel.create({
          activityId: new Types.ObjectId(activityId as string),
          facultyId: new Types.ObjectId(facultyId as string),
          instituteId: new Types.ObjectId(instituteId as string),
        });

        successes.push({
          activityId: activityId.toString(),
          assignmentId: assignment._id.toString(),
        });
      } catch (error: any) {
        failures.push({
          activityId: activityId.toString(),
          reason: error.message || 'Unknown error',
        });
      }
    }

    return {
      status:
        failures.length === 0 && alreadyAssigned.length === 0
          ? 'success'
          : successes.length > 0
            ? 'partial'
            : 'failed',
      total: activityIds.length,
      assigned: successes.length,
      alreadyAssignedCount: alreadyAssigned.length,
      failed: failures.length,
      successes,
      alreadyAssigned,
      failures,
    };
  }

  /**
   * Reassign an activity to a different faculty
   */
  async reassignActivity(dto: ReassignActivityDto): Promise<AssignmentDocument> {
    const { activityId, newFacultyId } = dto;

    const assignment = await this.assignmentModel
      .findOne({ activityId: new Types.ObjectId(activityId as string) })
      .exec();

    if (!assignment) {
      throw new NotFoundException(
        `No assignment found for activity ${activityId}`,
      );
    }

    // Update faculty assignment
    assignment.facultyId = new Types.ObjectId(newFacultyId as string);
    await assignment.save();

    return assignment.populate(['activityId', 'facultyId']);
  }

  /**
   * Get all activities assigned to a specific faculty
   */
  async getActivitiesByFacultyId(
    facultyId: string,
    instituteId?: string,
  ): Promise<AssignmentDocument[]> {
    const query: any = {
      facultyId: new Types.ObjectId(facultyId),
    };

    if (instituteId) {
      query.instituteId = new Types.ObjectId(instituteId);
    }

    return this.assignmentModel
      .find(query)
      .populate([
        {
          path: 'activityId',
          populate: {
            path: 'student',
            populate: { path: 'basicUserDetails', select: '-passwordHash' },
          },
        },
        {
          path: 'facultyId',
          populate: { path: 'basicUserDetails', select: '-passwordHash' },
        },
      ])
      .exec();
  }

  /**
   * Get all assignments by query filters
   */
  async getAssignments(
    query: QueryAssignmentDto,
  ): Promise<AssignmentDocument[]> {
    const filter: any = {};

    if (query.facultyId) {
      filter.facultyId = new Types.ObjectId(query.facultyId);
    }

    if (query.instituteId) {
      filter.instituteId = new Types.ObjectId(query.instituteId);
    }

    if (query.activityId) {
      filter.activityId = new Types.ObjectId(query.activityId);
    }

    return this.assignmentModel
      .find(filter)
      .populate([
        {
          path: 'activityId',
          populate: {
            path: 'student',
            populate: { path: 'basicUserDetails', select: '-passwordHash' },
          },
        },
        {
          path: 'facultyId',
          populate: { path: 'basicUserDetails', select: '-passwordHash' },
        },
      ])
      .exec();
  }

  /**
   * Get assignment by activity ID
   */
  async getAssignmentByActivityId(
    activityId: string,
  ): Promise<AssignmentDocument | null> {
    return this.assignmentModel
      .findOne({ activityId: new Types.ObjectId(activityId) })
      .populate([
        'activityId',
        {
          path: 'facultyId',
          populate: { path: 'basicUserDetails', select: '-passwordHash' },
        },
      ])
      .exec();
  }

  /**
   * Unassign an activity from faculty
   */
  async unassignActivity(activityId: string): Promise<void> {
    const result = await this.assignmentModel
      .deleteOne({ activityId: new Types.ObjectId(activityId) })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `No assignment found for activity ${activityId}`,
      );
    }
  }

  /**
   * Get faculty assignment counts for an institute
   */
  async getFacultyAssignmentCounts(instituteId: string) {
    const counts = await this.assignmentModel.aggregate([
      { $match: { instituteId: new Types.ObjectId(instituteId) } },
      {
        $group: {
          _id: '$facultyId',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'faculties',
          localField: '_id',
          foreignField: '_id',
          as: 'faculty',
        },
      },
      { $unwind: '$faculty' },
      {
        $lookup: {
          from: 'users',
          localField: 'faculty.basicUserDetails',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          facultyId: '$_id',
          count: 1,
          name: '$userDetails.name',
          email: '$userDetails.email',
          department: '$faculty.department',
        },
      },
    ]);

    return counts;
  }
}
