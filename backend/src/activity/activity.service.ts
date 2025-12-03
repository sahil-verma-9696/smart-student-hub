import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { Activity, ActivityDocument } from './schema/activity.schema';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { SearchActivityDto } from './dto/search-activity.dto';
import { ApproveActivityDto } from './dto/approve-activity.dto';
import { RejectActivityDto } from './dto/reject-activity.dto';
import {
  ActivityAggregationResult,
  ActivityStatsResponse,
} from './types/types';
import { ACTIVITY_STATUS } from './types/enum';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name)
    private readonly activityModel: Model<ActivityDocument>,
  ) {}

  // -----------------------------
  // CREATE ACTIVITY
  // -----------------------------
  async create(dto: CreateActivityDto) {
    const activity = await new this.activityModel(dto).save();

    return this.activityModel
      .findById(activity._id)
      .populate({
        path: 'student',
        populate: [
          { path: 'basicUserDetails', select: '-passwordHash' },
          { path: 'institute' }
        ]
      })
      .populate('attachments');
  }

  // -----------------------------
  // FIND ALL
  // -----------------------------
  async findAll(query: SearchActivityDto) {
    const filter: FilterQuery<ActivityDocument> = {};

    if (query.activityType) {
      filter.activityType = query.activityType;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.studentId) {
      filter.student = query.studentId;
    }

    if (query.title) {
      filter.title = { $regex: query.title, $options: 'i' };
    }

    if (query.from || query.to) {
      const dateRange: { $gte?: Date; $lte?: Date } = {};

      if (query.from) dateRange.$gte = new Date(query.from);
      if (query.to) dateRange.$lte = new Date(query.to);

      filter.dateStart = dateRange;
    }

    return this.activityModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: 'student',
        populate: [
          { path: 'basicUserDetails', select: '-passwordHash' },
          { path: 'institute' }
        ]
      })
      .populate('attachments')
      .exec();
  }

  // -----------------------------
  // FIND ONE
  // -----------------------------
  async findOne(id: string) {
    const activity = await this.activityModel
      .findById(id)
      .populate({
        path: 'student',
        populate: [
          { path: 'basicUserDetails', select: '-passwordHash' },
          { path: 'institute' }
        ]
      })
      .populate('attachments')
      .exec();

    if (!activity) throw new NotFoundException('Activity not found');

    return activity;
  }

  // -----------------------------
  // UPDATE
  // -----------------------------
  async update(id: string, dto: UpdateActivityDto) {
    const updated = await this.activityModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) throw new NotFoundException('Activity not found');

    return updated;
  }

  // -----------------------------
  // DELETE
  // -----------------------------
  async remove(id: string) {
    const deleted = await this.activityModel.findByIdAndDelete(id);

    if (!deleted) throw new NotFoundException('Activity not found');

    return { message: 'Activity deleted successfully' };
  }

  /******************************************************
   *
   * @returns {Promise<ActivityStatsResponse>}
   *******************************************************/
  async getStudentActivityStats(
    studentId: string,
  ): Promise<ActivityStatsResponse> {
    const match: Activity | Record<string, any> = {};

    if (studentId) {
      match.student = new Types.ObjectId(studentId);
    }

    const aggregation =
      await this.activityModel.aggregate<ActivityAggregationResult>([
        { $match: match },

        {
          $facet: {
            // ------------------------------------------
            // 1. STATUS COUNTS
            // ------------------------------------------
            statusStats: [
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 },
                },
              },
            ],

            // ------------------------------------------
            // 2. TYPE COUNTS
            // ------------------------------------------
            typeStats: [
              {
                $group: {
                  _id: '$activityType',
                  count: { $sum: 1 },
                },
              },
            ],

            // ------------------------------------------
            // 3. TRENDING TYPE (most common)
            // ------------------------------------------
            trendingType: [
              {
                $group: {
                  _id: '$activityType',
                  count: { $sum: 1 },
                },
              },
              { $sort: { count: -1 } },
              { $limit: 1 },
            ],
          },
        },
      ]);

    const result = aggregation[0];

    // ----------------------------------------------
    // Prepare final response
    // ----------------------------------------------

    const formatted: ActivityStatsResponse = {
      status: {
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0,
      },
      types: {},
      trendingActivityType: null,
    };

    // Fill status stats
    for (const item of result.statusStats) {
      formatted.status[item._id] = item.count;
      formatted.status.total += item.count;
    }

    // Fill type counts
    for (const item of result.typeStats) {
      formatted.types[item._id] = item.count;
    }

    // Add trending type
    formatted.trendingActivityType = result.trendingType[0]?._id || null;

    return formatted;
  }

  /******************************************************
   * @description Approve an activity
   * @param activityId - The ID of the activity to approve
   * @param dto - ApproveActivityDto with optional remarks
   * @returns {Promise<ActivityDocument>}
   *******************************************************/
  async approveActivity(
    activityId: string,
    dto: ApproveActivityDto,
  ): Promise<ActivityDocument> {
    const activity = await this.activityModel.findById(activityId);

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    activity.status = ACTIVITY_STATUS.APPROVED;
    if (dto.remarks) {
      activity.remarks = dto.remarks;
    }

    await activity.save();

    const populated = await this.activityModel
      .findById(activityId)
      .populate({
        path: 'student',
        populate: [
          { path: 'basicUserDetails', select: '-passwordHash' },
          { path: 'institute' },
        ],
      })
      .populate('attachments')
      .exec();

    if (!populated) throw new NotFoundException('Activity not found after update');

    return populated;
  }

  /******************************************************
   * @description Reject an activity with mandatory remarks
   * @param activityId - The ID of the activity to reject
   * @param dto - RejectActivityDto with mandatory remarks
   * @returns {Promise<ActivityDocument>}
   *******************************************************/
  async rejectActivity(
    activityId: string,
    dto: RejectActivityDto,
  ): Promise<ActivityDocument> {
    const activity = await this.activityModel.findById(activityId);

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    activity.status = ACTIVITY_STATUS.REJECTED;
    activity.remarks = dto.remarks;

    await activity.save();

    const populated = await this.activityModel
      .findById(activityId)
      .populate({
        path: 'student',
        populate: [
          { path: 'basicUserDetails', select: '-passwordHash' },
          { path: 'institute' },
        ],
      })
      .populate('attachments')
      .exec();

    if (!populated) throw new NotFoundException('Activity not found after update');

    return populated;
  }

  /******************************************************
   * @description Update activity status
   * @param acitivityId
   * @param facultyId
   * @param ACTIVITY_STATUS
   * @returns {Promise<ActivityDocument>}
   *******************************************************/
  // async updateActivityStatus(
  //   activityId: string,
  //   facultyId: string,
  //   status: ACTIVITY_STATUS,
  // ): Promise<ActivityDocument> {}

  /******************************************************
   * @description Update activity social links
   * @param acitivityId
   * @param studentId
   * @param {{plateform: string, link: string}}
   * @returns {Promise<ActivityDocument>}
   *******************************************************/
  // async updateActivitySocialLinks(
  //   activityId: string,
  //   facultyId: string,
  //   status: ACTIVITY_STATUS,
  // ): Promise<ActivityDocument> {}
}
