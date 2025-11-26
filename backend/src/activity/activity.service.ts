import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Activity } from './schemas/activity.schema';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name)
    private readonly activityModel: Model<Activity>,
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    const activityData = {
      ...createActivityDto,
      verificationStatus: 'PENDING',
      approved_by: null,
      rejected_by: null,
      rejectionReason: null,
    };
    const activity = new this.activityModel(activityData);
    return activity.save();
  }

  // Get all activities
  async findAll(): Promise<Activity[]> {
    return this.activityModel.find().exec();
  }

  // Get one activity by id
  async findOne(id: string): Promise<Activity> {
    const activity = await this.activityModel.findById(id).exec();
    if (!activity) throw new NotFoundException('Activity not found');
    return activity;
  }

  // Update activity (student edits OR faculty verifies)
  async update(id: string, updateDto: UpdateActivityDto): Promise<Activity> {
    const existingActivity = await this.activityModel.findById(id);
    if (!existingActivity) {
      throw new NotFoundException('Activity not found');
    }

    const { verificationStatus, approved_by, rejected_by, rejectionReason, ...rest } = updateDto;

    const updateData: any = { ...rest };

    if (verificationStatus) {
      updateData.verificationStatus = verificationStatus;
      if (verificationStatus === 'APPROVED') {
        if (!approved_by) {
          throw new BadRequestException('approved_by is required for approving an activity');
        }
        updateData.approved_by = approved_by;
        updateData.rejected_by = null;
        updateData.rejectionReason = null;
      } else if (verificationStatus === 'REJECTED') {
        if (!rejected_by || !rejectionReason) {
          throw new BadRequestException('rejected_by and rejectionReason are required for rejecting an activity');
        }
        updateData.rejected_by = rejected_by;
        updateData.rejectionReason = rejectionReason;
        updateData.approved_by = null;
      } else if (verificationStatus === 'PENDING') {
        updateData.approved_by = null;
        updateData.rejected_by = null;
        updateData.rejectionReason = null;
      }
    }

    const updated = await this.activityModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    if (!updated) throw new NotFoundException('Activity not found');
    return updated;
  }

  // Delete activity
  async remove(id: string): Promise<void> {
    const res = await this.activityModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Activity not found');
  }

  // Faculty verification approver
  async approve(id: string, facultyId: string) {
    return this.activityModel.findByIdAndUpdate(
      id,
      {
        verificationStatus: 'APPROVED',
        approved_by: facultyId,
        rejected_by: null,
        rejectionReason: null,
      },
      { new: true },
    );
  }

  // Reject activity
  async reject(id: string, facultyId: string, reason: string) {
    return this.activityModel.findByIdAndUpdate(
      id,
      {
        verificationStatus: 'REJECTED',
        rejected_by: facultyId,
        rejectionReason: reason,
        approved_by: null,
      },
      { new: true },
    );
  }
}
