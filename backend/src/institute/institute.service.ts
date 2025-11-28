import { Injectable, NotFoundException } from '@nestjs/common';
// import { UpdateInstituteDto } from './dto/update-institute.dto';
import { InjectModel } from '@nestjs/mongoose';
import Institute, { InstituteDocument } from './schemas/institute.schema';
import { Model, Types } from 'mongoose';
import CreateInstituteDto from './dto/create-institute.dto';
import { IInstituteService } from './types/service.interface';
import { ClientSession } from 'mongoose';

@Injectable()
export class InstituteService implements IInstituteService {
  constructor(
    @InjectModel(Institute.name) private instituteModel: Model<Institute>,
  ) {}

  async create(createInstituteDto: CreateInstituteDto) {
    /**
     * Check Already exists
     */
    const instituteExists = await this.instituteModel.findOne({
      official_email: createInstituteDto.official_email,
    });

    if (instituteExists) {
      throw new Error('Institute already exists');
    }

    const newInstitute = new this.instituteModel(createInstituteDto);
    await newInstitute.save();
    return newInstitute;
  }

  // async register() {
  //   const newInstitute = await this.create();
  //   const newAdmin = await this.adminService.create();
  //   const admin = await this.adminService.linkToInstitute();
  //   const inistitue = await this.registerAdmin();
  //   return inistitue;
  // }

  async createInstitute(
    dto: CreateInstituteDto,
    session?: ClientSession,
  ): Promise<InstituteDocument> {
    const created = await this.instituteModel.create([dto], { session });
    return created[0]; // this is already saved in the transaction
  }

  async getInstituteById(
    instituteId: string,
    session?: ClientSession,
  ): Promise<InstituteDocument> {
    const institute = await this.instituteModel
      .findById(instituteId)
      .session(session ?? null);

    if (!institute) {
      throw new NotFoundException('Institute not found');
    }

    return institute;
  }

  async addAdminToInstitute(
    instituteId: string,
    adminId: string,
    session?: ClientSession,
  ): Promise<InstituteDocument> {
    const updatedInstitute = await this.instituteModel
      .findByIdAndUpdate(
        instituteId,
        { $addToSet: { admins: new Types.ObjectId(adminId) } }, // atomic
        { new: true, session },
      )
      .populate('admins')
      .session(session ?? null);

    if (!updatedInstitute) {
      throw new NotFoundException(`Institute ${instituteId} not found`);
    }

    return updatedInstitute;
  }
}
