import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schema/admin.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}

  async create(userId: string) {
    const admin = await this.adminModel.create({
      basicUserDetails: userId,
    });
    await admin.save();
    return admin;
  }
}
