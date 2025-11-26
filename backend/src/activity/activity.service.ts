import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Activity, ActivityDocument } from './schema/activity.schema';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

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
    return this.activityModel.create(dto);
  }

  // -----------------------------
  // FIND ALL
  // -----------------------------
  async findAll() {
    return this.activityModel
      .find()
      .populate('student')
      .exec();
  }

  // -----------------------------
  // FIND ONE
  // -----------------------------
  async findOne(id: string) {
    const activity = await this.activityModel
      .findById(id)
      .populate('student')
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
}
