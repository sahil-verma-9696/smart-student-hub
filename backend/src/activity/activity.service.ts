// activity.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity } from './schemas/activity.schema';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<Activity>,
  ) {}

  async create(data: CreateActivityDto): Promise<Activity> {
    return await this.activityModel.create(data);
  }

  async findAll(): Promise<Activity[]> {
    return await this.activityModel.find().exec();
  }

  async findOne(id: string): Promise<Activity> {
    const activity = await this.activityModel.findById(id);
    if (!activity) throw new NotFoundException('Activity not found');
    return activity;
  }

  async update(id: string, data: UpdateActivityDto): Promise<Activity> {
    const activity = await this.activityModel.findByIdAndUpdate(id, data, { new: true });
    if (!activity) throw new NotFoundException('Activity not found');
    return activity;
  }

  async remove(id: string): Promise<void> {
    const result = await this.activityModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Activity not found');
  }
}
