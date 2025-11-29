import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto) {
    const user = await this.userModel.create(dto);
    await user.save();
    return user;
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return await this.userModel.findById(id).populate('instituteId').exec();
  }

  async remove(id: string, session?: ClientSession) {
    if (session) {
      return await this.userModel.findByIdAndDelete(id, { session }).exec();
    }
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}
