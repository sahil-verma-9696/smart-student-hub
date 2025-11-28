import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schema/admin.schema';
import { Model, Types } from 'mongoose';
import { IAdminService } from './types/service.interface';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { USER_ROLE } from 'src/user/types/enum';
import { InstituteService } from 'src/institute/institute.service';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private readonly userService: UserService,
    private readonly instituteService: InstituteService,
  ) {}

  async create(userId: string) {
    const admin = await this.adminModel.create({
      basicUserDetails: userId,
    });
    await admin.save();
    return admin;
  }

  async createAdmin(dto: CreateAdminDto): Promise<AdminDocument> {
    const userDto: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: USER_ROLE.ADMIN,
      gender: dto.gender,
      contactInfo: dto.contactInfo,
    };
    const user = await this.userService.createUser(userDto);

    if (!user) {
      throw new Error('User not created');
    }

    const admin = await this.adminModel.create({
      basicUserDetails: user._id, // correct field name from your schema
      institute: null, // assigned later in joinInstitute()
    });

    return admin;
  }

  async deleteAdmin(adminId: string): Promise<void> {
    await this.adminModel.deleteOne({ _id: adminId }).exec();
  }

  async getAdminById(adminId: string): Promise<AdminDocument> {
    const admin = await this.adminModel.findById(adminId).exec();
    if (!admin) {
      throw new Error('Admin not found');
    }
    return admin;
  }

  async getAdminsByInstitute(instituteId: string): Promise<AdminDocument[]> {
    const admin = await this.adminModel.find({ institute: instituteId }).exec();
    if (!admin) {
      throw new Error('Admin not found');
    }
    return admin;
  }

  async joinInstitute(
    adminId: string,
    instituteId: string,
  ): Promise<AdminDocument> {
    // 1. Validate existing admin
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new NotFoundException(`Admin ${adminId} not found`);
    }

    // 2. Validate existing institute
    const institute = await this.instituteService.getInstituteById(instituteId);
    if (!institute) {
      throw new NotFoundException(`Institute ${instituteId} not found`);
    }

    // 3. Update admin.institute (Admin owns the relationship)
    admin.institute = new Types.ObjectId(instituteId);
    await admin.save();

    // 4. Update institute.admins[] (for bidirectional reference)
    await this.instituteService.addAdminToInstitute(instituteId, adminId);

    // 5. Return updated admin (with populated user details if needed)
    const updatedAdmin = await this.adminModel
      .findById(adminId)
      .populate('basicUserDetails')
      .populate('institute');

    if (!updatedAdmin) {
      throw new NotFoundException(`Admin ${adminId} not found`);
    }

    return updatedAdmin;
  }

  async updateAdmin(
    adminId: string,
    dto: UpdateAdminDto,
  ): Promise<AdminDocument> {
    const admin = await this.adminModel.findByIdAndUpdate(adminId, dto, {
      new: true,
    });
    if (!admin) {
      throw new NotFoundException(`Admin ${adminId} not found`);
    }
    return this.adminModel
      .findById(adminId)
      .populate('userBasicDetails')
      .exec()
      .then((admin) => {
        if (!admin) {
          throw new NotFoundException(`Admin ${adminId} not found`);
        }
        return admin;
      });
  }
}
