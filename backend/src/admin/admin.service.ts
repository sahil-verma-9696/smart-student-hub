import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schema/admin.schema';
import { ClientSession, Model, Types } from 'mongoose';
import { IAdminService } from './types/service.interface';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { USER_ROLE } from 'src/user/types/enum';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UserDocument } from 'src/user/schema/user.schema';
import { InstituteDocument } from 'src/institute/schemas/institute.schema';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private readonly userService: UserService,
  ) {}

  async createAdmin(
    dto: CreateAdminDto,
    session?: ClientSession,
  ): Promise<AdminDocument> {
    /***********************
     * 1. Create base user
     ***********************/
    const userDto: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: USER_ROLE.ADMIN,
      gender: dto.gender,
      contactInfo: dto.contactInfo,
    };

    const user = await this.userService.createUser(userDto, session);

    if (!user) {
      throw new Error('User not created');
    }

    /***********************
     * 2. Create admin profile
     ***********************/
    const admin = await this.adminModel
      .create(
        [
          {
            basicUserDetails: user._id, // ← correct field name
            institute: null,
          },
        ],
        { session },
      )
      .then((res) => res[0]); // because create([...]) returns an array

    return admin;
  }

  async deleteAdmin(adminId: string): Promise<void> {
    await this.adminModel.deleteOne({ _id: adminId }).exec();
  }

  async getAdminById(adminId: string): Promise<AdminDocument> {
    const admin = await this.adminModel
      .findById(new Types.ObjectId(adminId))
      .populate<{ basicUserDetails: UserDocument }>('basicUserDetails')
      .populate<{ institute: InstituteDocument }>('institute')
      .exec();
    if (!admin) {
      throw new Error('Admin not found');
    }
    return admin;
  }

  async getAdminsByInstitute(instituteId: string): Promise<AdminDocument[]> {

    const admin = await this.adminModel
      .find({ institute: new Types.ObjectId(instituteId) })
      .exec();

    if (!admin) {
      throw new Error('Admin not found');
    }
    return admin;
  }

  async getByUserId(userId: string): Promise<AdminDocument> {
    const admin = await this.adminModel
      .findOne({ basicUserDetails: new Types.ObjectId(userId) })
      .populate<{ basicUserDetails: UserDocument }>('basicUserDetails')
      .populate<{ institute: InstituteDocument }>('institute')
      .exec();

    if (!admin) {
      throw new NotFoundException(`Admin with userId ${userId} not found`);
    }

    return admin;
  }

  async joinInstitute(
    adminId: string,
    instituteId: string,
    session?: ClientSession,
  ): Promise<AdminDocument> {
    // 1. Validate admin exists
    const admin = await this.adminModel
      .findById(adminId)
      .session(session ?? null);
    if (!admin) {
      throw new NotFoundException(`Admin ${adminId} not found`);
    }

    // 3. Update admin.institute inside transaction
    await this.adminModel.updateOne(
      { _id: adminId },
      { $set: { institute: new Types.ObjectId(instituteId) } },
      { session },
    );

    // 5. Return updated, populated admin
    const updatedAdmin = await this.adminModel
      .findById(adminId)
      .populate('basicUserDetails', '-passwordHash') // correct field
      .populate('institute')
      .session(session ?? null);

    if (!updatedAdmin) {
      throw new NotFoundException(`Admin ${adminId} not found after update`);
    }

    return updatedAdmin;
  }

  async updateAdmin(
    adminId: string,
    dto: UpdateAdminDto,
  ): Promise<AdminDocument> {
    // USER only have basicUserDetails so we need to update User only
    const admin = await this.getAdminById(adminId);

    if (!admin || !admin.basicUserDetails) {
      throw new NotFoundException(
        `Admin or Admin.basicUserDetails ${adminId} not found`,
      );
    }

    const userAsAdmin = await this.userService.getUserById(
      admin.basicUserDetails._id.toString(),
    );

    const userUpdatePayload: Partial<UpdateUserDto> = {
      name: dto.name,
      email: dto.email,
      password: dto.password,
      gender: dto.gender,
      contactInfo: dto.contactInfo,
    };

    await this.userService.updateUser(
      userAsAdmin._id.toString(),
      userUpdatePayload,
    );

    return this.adminModel
      .findById(adminId)
      .populate('basicUserDetails', '-passwordHash')
      .exec()
      .then((admin) => {
        if (!admin) {
          throw new NotFoundException(`Admin ${adminId} not found`);
        }
        return admin;
      });
  }
}
