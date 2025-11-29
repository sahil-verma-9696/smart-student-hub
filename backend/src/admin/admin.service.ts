import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schema/admin.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}

  // Create admin profile only (used by auth service)
  async createProfile(userId: string) {
    const admin = await this.adminModel.create({
      basicUserDetails: userId,
    });
    await admin.save();
    return admin;
  }

  // Legacy method name for compatibility
  async create(userId: string) {
    return this.createProfile(userId);
  }
}
