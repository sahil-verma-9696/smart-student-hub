import { Injectable, NotFoundException } from '@nestjs/common';
// import { UpdateInstituteDto } from './dto/update-institute.dto';
import { InjectModel } from '@nestjs/mongoose';
import Institute, { InstituteDocument } from './schemas/institute.schema';
import { Model, Types } from 'mongoose';
import CreateInstituteDto from './dto/create-institute.dto';
import { IInstituteService } from './types/service.interface';
import { ClientSession } from 'mongoose';
import { UpdateInstituteDto } from 'src/auth/dto/update-institute.dto';
import { AdminService } from 'src/admin/admin.service';
import { UpdateAdminDto } from 'src/admin/dto/update-admin.dto';
import { AcademicService } from 'src/academic/academic.service';
// `inst3admin@gmail.com
@Injectable()
export class InstituteService implements IInstituteService {
  constructor(
    @InjectModel(Institute.name) private instituteModel: Model<Institute>,
    private readonly adminService: AdminService,
    private readonly academicService: AcademicService,
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

  async updateInstitute(dto: UpdateInstituteDto, instituteId: string) {
    const updatedInstitutePayload: Partial<InstituteDocument> = {
      official_email: dto.email,
      official_phone: dto.phone,
      alternatePhone: dto.alternatePhone,
      website: dto.website,
      address_line1: dto.addressLine1,
      addressLine2: dto.addressLine2,
      city: dto.city,
      state: dto.state,
      pincode: dto.pincode,
      logo: dto.logo,
    };

    // institute basic details updated
    const updatedInstitute = await this.instituteModel.findByIdAndUpdate(
      new Types.ObjectId(instituteId),
      updatedInstitutePayload,
      {
        new: true,
      },
    );

    // update institue admin details
    const updatedAdminPayload: UpdateAdminDto = {
      name: dto.adminName as string,
      email: dto.adminEmail as string,
      contactInfo: {
        phone: dto.adminPhone as string,
      },
    };

    const instituteAdmins =
      await this.adminService.getAdminsByInstitute(instituteId);

    if (instituteAdmins.length === 0) {
      return { message: 'Institute admin not found' };
    }

    const updatedAdmin = await this.adminService.updateAdmin(
      instituteAdmins[0]._id.toString(),
      updatedAdminPayload,
    );

    // update programs
    const programPayload: UpdateInstituteDto = {
      programs: dto.programs,
      departments: dto.departments,
    };

    await this.academicService.upsertFullStructure(programPayload, instituteId);
    // update departments

    return {
      updatedInstitute,
      updatedAdmin,
      message: 'Institute updated successfully',
    };
  }

  // async getInstituteFullStructure(instituteId: string) {
  //   const result = await this.instituteModel.aggregate([
  //     {
  //       $match: { _id: new Types.ObjectId(instituteId) },
  //     },

  //     // ========== Departments ==========
  //     {
  //       $lookup: {
  //         from: 'departments',
  //         localField: '_id',
  //         foreignField: 'institute',
  //         as: 'departments',
  //       },
  //     },

  //     // ========== Programs ==========
  //     {
  //       $lookup: {
  //         from: 'programs',
  //         localField: '_id',
  //         foreignField: 'institute',
  //         as: 'programs',
  //       },
  //     },

  //     // ========== Degrees ==========
  //     {
  //       $lookup: {
  //         from: 'degrees',
  //         let: { programIds: '$programs._id' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: { $in: ['$program', '$$programIds'] },
  //             },
  //           },
  //         ],
  //         as: 'degrees',
  //       },
  //     },

  //     // ========== Branches ==========
  //     {
  //       $lookup: {
  //         from: 'branches',
  //         let: { degreeIds: '$degrees._id' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: { $in: ['$degree', '$$degreeIds'] },
  //             },
  //           },
  //         ],
  //         as: 'branches',
  //       },
  //     },

  //     // ========== Specializations ==========
  //     {
  //       $lookup: {
  //         from: 'specializations',
  //         let: { branchIds: '$branches._id' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: { $in: ['$branch', '$$branchIds'] },
  //             },
  //           },
  //         ],
  //         as: 'specializations',
  //       },
  //     },

  //     // ========== Year Levels ==========
  //     {
  //       $lookup: {
  //         from: 'yearlevels',
  //         let: { degreeIds: '$degrees._id' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: { $in: ['$degree', '$$degreeIds'] },
  //             },
  //           },
  //         ],
  //         as: 'yearLevels',
  //       },
  //     },

  //     // ========== Semesters ==========
  //     {
  //       $lookup: {
  //         from: 'semesters',
  //         let: { yearIds: '$yearLevels._id' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: { $in: ['$year', '$$yearIds'] },
  //             },
  //           },
  //         ],
  //         as: 'semesters',
  //       },
  //     },

  //     // ========== Sections ==========
  //     {
  //       $lookup: {
  //         from: 'sections',
  //         let: { semIds: '$semesters._id' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: { $in: ['$semester', '$$semIds'] },
  //             },
  //           },
  //         ],
  //         as: 'sections',
  //       },
  //     },

  //     // ========== FINAL MERGE INTO YOUR DESIRED STRUCTURE ==========
  //     {
  //       $addFields: {
  //         programs: {
  //           $map: {
  //             input: '$programs',
  //             as: 'p',
  //             in: {
  //               id: '$$p._id',
  //               name: '$$p.name',
  //               degrees: {
  //                 $map: {
  //                   input: {
  //                     $filter: {
  //                       input: '$degrees',
  //                       cond: { $eq: ['$$this.program', '$$p._id'] },
  //                     },
  //                   },
  //                   as: 'd',
  //                   in: {
  //                     id: '$$d._id',
  //                     name: '$$d.name',
  //                     branches: {
  //                       $map: {
  //                         input: {
  //                           $filter: {
  //                             input: '$branches',
  //                             cond: { $eq: ['$$this.degree', '$$d._id'] },
  //                           },
  //                         },
  //                         as: 'b',
  //                         in: {
  //                           id: '$$b._id',
  //                           name: '$$b.name',
  //                           specializations: {
  //                             $filter: {
  //                               input: '$specializations',
  //                               cond: { $eq: ['$$this.branch', '$$b._id'] },
  //                             },
  //                           },
  //                         },
  //                       },
  //                     },
  //                     yearLevels: {
  //                       $map: {
  //                         input: {
  //                           $filter: {
  //                             input: '$yearLevels',
  //                             cond: { $eq: ['$$this.degree', '$$d._id'] },
  //                           },
  //                         },
  //                         as: 'y',
  //                         in: {
  //                           id: '$$y._id',
  //                           year: '$$y.year',
  //                           semesters: {
  //                             $map: {
  //                               input: {
  //                                 $filter: {
  //                                   input: '$semesters',
  //                                   cond: { $eq: ['$$this.year', '$$y._id'] },
  //                                 },
  //                               },
  //                               as: 's',
  //                               in: {
  //                                 id: '$$s._id',
  //                                 semNumber: '$$s.semNumber',
  //                                 sections: {
  //                                   $filter: {
  //                                     input: '$sections',
  //                                     cond: {
  //                                       $eq: ['$$this.semester', '$$s._id'],
  //                                     },
  //                                   },
  //                                 },
  //                               },
  //                             },
  //                           },
  //                         },
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },

  //     {
  //       $project: {
  //         departments: 1,
  //         programs: 1,
  //         instituteId: 1,
  //         instituteName: 1,
  //         instituteCode: 1,
  //         accreditationStatus: 1,
  //         addressLine1: 1,
  //         addressLine2: 1,
  //         city: 1,
  //         state: 1,
  //         pincode: 1,
  //         email: 1,
  //         phone: 1,
  //         alternatePhone: 1,
  //         adminName: 1,
  //         adminEmail: 1,
  //         adminPhone: 1,
  //         adminDesignation: 1,
  //         verification: 1,
  //       },
  //     },
  //   ]);

  //   return result[0] || null;
  // }
}
