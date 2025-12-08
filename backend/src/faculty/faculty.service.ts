import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, PipelineStage, Types } from 'mongoose';
import { Faculty, FacultyDocument } from './schemas/faculty.schema';
import { isValidObjectId } from 'mongoose';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { UserService } from 'src/user/user.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { USER_ROLE } from 'src/user/types/enum';
import { BulkCreateFacultyDto } from './dto/create-faculty-bulk.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { FacultyQueryDto } from './dto/query.dto';
import { UserDocument } from 'src/user/schema/user.schema';
import { InstituteDocument } from 'src/institute/schemas/institute.schema';

@Injectable()
export class FacultyService {
  constructor(
    @InjectModel(Faculty.name) private facultyModel: Model<Faculty>,

    private readonly userService: UserService,
  ) {}

  /***************************************
   * VALIDATE instituteId BEFORE creating
   ***************************************/
  private async validateInstitute(instituteId: string): Promise<void> {
    if (!Types.ObjectId.isValid(instituteId)) {
      throw new Error(`Invalid instituteId: ${instituteId}`);
    }

    const exists = await this.facultyModel.db
      .collection('institutes')
      .findOne({ _id: new Types.ObjectId(instituteId) });

    if (!exists) {
      throw new Error(`Institute not found for ID: ${instituteId}`);
    }
  }

  /***************************************
   * CREATE SINGLE FACULTY WITH ACADEMIC
   ***************************************/
  async createFaculty(
    dto: CreateFacultyDto,
    session?: ClientSession,
  ): Promise<FacultyDocument> {
    await this.facultyModel.syncIndexes();

    // Validate institute
    await this.validateInstitute(dto.instituteId);

    /** STEP 1 — Create User */
    const userDto: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: dto.password,
      gender: dto.gender,
      role: USER_ROLE.FACULTY,
      contactInfo: dto.contactInfo,
    };

    const user = await this.userService.createUser(userDto, session);

    /** STEP 2 — Create Faculty */
    const createdFaculty = await this.facultyModel.create(
      [
        {
          basicUserDetails: new Types.ObjectId(user._id),
          institute: new Types.ObjectId(dto.instituteId),
          employee_code: dto.employee_code,
          department: dto.department,
          designation: dto.designation,
        },
      ],
      { session },
    );

    const faculty = createdFaculty[0];

    /** STEP 4 — Update academic.student reference */
    return faculty.populate(['basicUserDetails', 'institute']);
  }

  /***************************************
   * BULK UPLOAD FACULTIES+ JSON Input
   ***************************************/
  async bulkCreateFaculties(dto: BulkCreateFacultyDto) {
    const { instituteId, faculties } = dto;

    if (!Array.isArray(faculties)) {
      throw new Error('Invalid faculty array');
    }

    const successes: {
      email: string;
      employee_code?: string;
      facultyId?: string;
    }[] = [];
    const failures: {
      email: string;
      employee_code?: string;
      reason?: string;
    }[] = [];

    for (const entry of faculties) {
      try {
        // prepare single student creation DTO
        const singleDto: CreateFacultyDto = {
          name: entry.name,
          email: entry.email,
          password: entry.password,
          gender: entry.gender,
          contactInfo: entry.contactInfo,
          employee_code: entry.employee_code,
          department: entry.department,
          designation: entry.designation,
          instituteId,
        };

        const created = await this.createFaculty(singleDto);

        successes.push({
          email: entry.email,
          employee_code: entry.employee_code,
          facultyId: created._id.toString(),
        });
      } catch (error: any) {
        failures.push({
          email: entry.email,
          employee_code: entry.employee_code,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          reason: (error.message as string | undefined) ?? 'Unknown error',
        });

        // continue loop, do NOT stop processing
      }
    }

    return {
      status:
        failures.length === 0
          ? 'success'
          : successes.length > 0
            ? 'partial'
            : 'failed',

      total: faculties.length,
      created: successes.length,
      failed: failures.length,

      successes,
      failures,
    };
  }

  async findAll() {
    return await this.facultyModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid faculty id');
    }

    const faculty = await this.facultyModel.findById(id);
    if (!faculty) throw new NotFoundException('Faculty not found');
    return faculty;
  }

  async update(id: string, dto: UpdateFacultyDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid faculty id');
    }

    const faculty = await this.facultyModel.findById(id);
    if (!faculty) throw new NotFoundException('Faculty not found');

    // Separate faculty-specific fields from user fields
    const facultyFields: Partial<Faculty> = {};
    const userFields: any = {};

    // Faculty-specific fields
    if (dto.department !== undefined)
      facultyFields.department = new Types.ObjectId(dto.department);
    if (dto.designation !== undefined)
      facultyFields.designation = dto.designation;
    if (dto.employee_code !== undefined)
      facultyFields.employee_code = dto.employee_code;

    // User-specific fields
    if (dto.name !== undefined) userFields.name = dto.name;
    if (dto.email !== undefined) userFields.email = dto.email;
    if (dto.gender !== undefined) userFields.gender = dto.gender;
    if (dto.contactInfo !== undefined) userFields.contactInfo = dto.contactInfo;

    // Update faculty document if there are faculty fields
    if (Object.keys(facultyFields).length > 0) {
      Object.assign(faculty, facultyFields);
      await faculty.save();
    }

    // Update user document if there are user fields
    if (Object.keys(userFields).length > 0) {
      await this.userService.updateUser(
        faculty.basicUserDetails.toString(),
        userFields,
      );
    }

    // Return updated faculty with populated user details
    return await this.facultyModel
      .findById(id)
      .populate('basicUserDetails', '-passwordHash');
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid faculty id');
    }

    const faculty = await this.facultyModel.findByIdAndDelete(id);
    if (!faculty) throw new NotFoundException('Faculty not found');
    return 'Faculty deleted successfully';
  }

  async getByUserId(userId: string) {
    const faculty = await this.facultyModel
      .findOne({ basicUserDetails: new Types.ObjectId(userId) })
      .populate<{ basicUserDetails: UserDocument }>('basicUserDetails')
      .populate<{ institute: InstituteDocument }>('institute')
      .populate<{ department: any }>('department')
      .exec();

    if (!faculty) {
      throw new NotFoundException(`Faculty with userId ${userId} not found`);
    }

    return faculty;
  }

  /************************************************************
   * *********** GET ALL Faculties ACCORDING TO QUERY ***********
   *************************************************************/

  async getFacultiesByQuery(query: FacultyQueryDto) {
    const pipeline: PipelineStage[] = [];

    // ---------- BASE FACULTY FILTER ----------
    const matchFaculty: Record<string, any> = {};

    if (query.instituteId) {
      matchFaculty.institute = new Types.ObjectId(query.instituteId);
    }

    if (query.department) {
      matchFaculty.department = query.department;
    }

    if (query.employee_code) {
      matchFaculty.employee_code = query.employee_code;
    }

    pipeline.push({ $match: matchFaculty });

    // ---------- JOIN basicUserDetails ----------
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'basicUserDetails',
        foreignField: '_id',
        as: 'basicUserDetails',
      },
    });

    pipeline.push({ $unwind: '$basicUserDetails' });

    // ---------- MATCH user fields ----------
    const matchUser: Record<string, any> = {};

    if (query.gender) {
      matchUser['basicUserDetails.gender'] = query.gender;
    }

    if (query.name) {
      matchUser['basicUserDetails.name'] = {
        $regex: query.name,
        $options: 'i',
      };
    }

    if (query.email) {
      matchUser['basicUserDetails.email'] = {
        $regex: query.email,
        $options: 'i',
      };
    }

    if (Object.keys(matchUser).length > 0) {
      pipeline.push({ $match: matchUser });
    }

    // ---------- JOIN institute ----------
    pipeline.push({
      $lookup: {
        from: 'institutes',
        localField: 'institute',
        foreignField: '_id',
        as: 'institute',
      },
    });

    pipeline.push({ $unwind: '$institute' });

    // ---------- SORTING ----------
    if (query.sortBy) {
      const sortDir = query.sortOrder === 'desc' ? -1 : 1;
      pipeline.push({ $sort: { [query.sortBy]: sortDir } });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    // ---------- PAGINATION ----------
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 20;
    const skip = (page - 1) * limit;

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    return this.facultyModel.aggregate(pipeline).exec();
  }
}
