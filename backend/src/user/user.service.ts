import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserService } from './types/service.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto) {
    const user = await this.userModel.create(dto);
    await user.save();
    return user;
  }

  async createUser(
    dto: CreateUserDto,
    session?: ClientSession,
  ): Promise<UserDocument> {
    // Use array syntax so session works properly
    const created = await this.userModel.create(
      [
        {
          passwordHash: dto.password, // pre-save hook will hash it
          name: dto.name,
          email: dto.email,
          role: dto.role,
          gender: dto.gender,
          contactInfo: dto.contactInfo,
        },
      ],
      { session },
    );

    // create() returns an array when used with [data]
    const user = created[0];

    if (!user) {
      throw new Error('User not created');
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userModel.deleteOne({ _id: userId }).exec();
  }
  async getUserById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return user;
  }

  async updateUser(userId: string, dto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new Error('User not found');
    }

    if (dto.name && dto.email && dto.gender && dto.contactInfo) {
      user.name = dto.name;
      user.email = dto.email;
      user.gender = dto.gender;
      user.contactInfo = dto.contactInfo;
    }

    await user.save();
    return user;
  }
}
