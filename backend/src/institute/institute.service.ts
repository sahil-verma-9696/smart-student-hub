import { Injectable, NotFoundException } from '@nestjs/common';
// import { UpdateInstituteDto } from './dto/update-institute.dto';
import { InjectModel } from '@nestjs/mongoose';
import Institute, { InstituteDocument } from './schemas/institute.schema';
import { Model, Types } from 'mongoose';
import CreateInstituteDto from './dto/create-institute.dto';
import { IInstituteService } from './types/service.interface';

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

  async createInstitute(dto: CreateInstituteDto): Promise<InstituteDocument> {
    const institute = await this.instituteModel.create(dto);
    await institute.save();
    return institute;
  }

  async getInstituteById(instituteId: string): Promise<InstituteDocument> {
    const inistitue = await this.instituteModel.findById(instituteId).exec();
    if (!inistitue) {
      throw new NotFoundException('Institute not found');
    }
    return inistitue;
  }

  async addAdminToInstitute(
    instituteId: string,
    adminId: string,
  ): Promise<InstituteDocument> {
    // Convert IDs to ObjectId (safe for mongoose schemas)
    const adminObjectId = new Types.ObjectId(adminId);
    const instituteObjectId = new Types.ObjectId(instituteId);

    // Find the institute
    const institute = await this.instituteModel.findById(instituteObjectId);
    if (!institute) {
      throw new NotFoundException(`Institute ${instituteId} not found`);
    }

    // Prevent duplicate entry
    const alreadyExists = institute.admins?.some(
      (id) => id.toString() === adminId,
    );

    if (!alreadyExists) {
      institute.admins.push(adminObjectId);
      await institute.save();
    }

    const updatedInstitute = await this.instituteModel
      .findById(instituteId)
      .populate('admins');

    if (!updatedInstitute) {
      throw new NotFoundException(`Institute ${instituteId} not found`);
    }

    // Return updated institute
    return updatedInstitute;
  }
}
