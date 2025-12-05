import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId, ClientSession } from 'mongoose';
import { Faculty } from './schemas/faculty.schema';
import { FacultySpecialization, FacultySpecializationDocument } from './schemas/faculty-specialization.schema';
import { UserService } from 'src/user/user.service';
import { CreateFacultyAdminDto } from './dto/create-faculty-admin.dto';
import * as xlsx from 'xlsx';
import { JwtPayload } from 'src/auth/types/auth.type';
import * as multer from 'multer';

export interface BulkUploadError {
  faculty: any;
  error: any;
}

@Injectable()
export class FacultyService {
  constructor(
    @InjectModel(Faculty.name) private facultyModel: Model<Faculty>,
    @InjectModel(FacultySpecialization.name) private specializationModel: Model<FacultySpecializationDocument>,
    private readonly userService: UserService,
  ) { }

  // Get faculty specializations
  async getSpecializations(facultyId: string) {
    return this.specializationModel.findOne({ facultyId }).lean();
  }

  // Update faculty specializations
  async updateSpecializations(facultyId: string, dto: any) {
    const { activityTypes, departments, expertise, institute } = dto;
    return this.specializationModel.findOneAndUpdate(
      { facultyId },
      { 
        facultyId,
        activityTypes,
        departments,
        expertise,
        institute
      },
      { new: true, upsert: true }
    ).lean();
  }

  // Get available faculty based on filters
  async getAvailableFaculty(filters: any) {
    const query: any = {};
    
    if (filters.department) {
      query.department = filters.department;
    }
    
    if (filters.institute) {
      query.institute = filters.institute;
    }

    // If filtering by activity type, we need to check specializations first
    if (filters.activityType) {
      const specializedFaculty = await this.specializationModel.find({
        activityTypes: filters.activityType
      }).distinct('facultyId');
      
      query._id = { $in: specializedFaculty };
    }

    return this.facultyModel.find(query)
      .populate('basicUserDetails', 'name email')
      .lean();
  }

  // 🟢 Create Faculty profile only (used by auth service)
  async createProfile(userId: string, institute: string) {
    const faculty = await this.facultyModel.create({
      basicUserDetails: userId,
      instituteId: institute,
    });
    await faculty.save();

    // Update user with facultyId reference
    await this.userService.updateUserProfile(userId, { facultyId: faculty._id });

    return faculty;
  }

  // 🟢 Create Faculty from frontend form (creates user + faculty profile)
  async create(dto: CreateFacultyAdminDto) {
    const user = await this.userService.create({
      userId: dto.facultyId,
      name: dto.name,
      email: dto.email,
      passwordHash: dto.email,
      gender: dto.gender,
      role: 'faculty',
      contactInfo: {
        phone: dto.phone,
      },
    });

    const faculty = await this.facultyModel.create({
      basicUserDetails: user._id,
      otherDetails: null,
      department: dto.department,
      designation: dto.designation,
      instituteId: dto.institute,
    });

    // Update user with facultyId reference
    await this.userService.updateUserProfile(user._id.toString(), { facultyId: faculty._id });

    const data = await this.facultyModel
      .findById(faculty._id)
      .populate('basicUserDetails', '-passwordHash'); // ❌ remove password field

    return data;
  }

  // Find faculty by ID
  async findById(id: string) {
    return this.facultyModel.findById(id).lean();
  }

  async uploadBulk(file: multer.File, user: JwtPayload) {
    if (!file) {
      throw new BadRequestException('No file received');
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const createdFaculties: any[] = [];
    const errors: BulkUploadError[] = [];

    for (const row of data as any[]) {
      try {
        const dto = new CreateFacultyAdminDto();
        // Match CSV template column names: facultyId, name, email, gender, phone, department, designation
        dto.facultyId = row['facultyId'] || row['Faculty ID'] || row['FacultyID'];
        dto.name = row['name'] || row['Full Name'] || row['Name'];
        dto.email = row['email'] || row['Email'];

        // Convert to lowercase for enum validation
        const genderValue = row['gender'] || row['Gender'];
        dto.gender = genderValue?.toString().toLowerCase();

        // Convert number to string if needed
        const phoneValue = row['phone'] || row['Phone'];
        dto.phone = String(phoneValue);
        
        dto.department = row['department'] || row['Department'];
        dto.designation = row['designation'] || row['Designation'];
        dto.institute = user.instituteId;

        const createdFaculty = await this.create(dto);
        if (createdFaculty) {
          createdFaculties.push(createdFaculty);
        }
      } catch (error) {
        console.error('Faculty bulk upload error:', error);
        errors.push({ faculty: row, error: error.message || String(error) });
      }
    }


    return {
      message: 'Bulk upload completed',
      createdCount: createdFaculties.length,
      errorCount: errors.length,
      errors,
    };
  }

  // 🔵 Get all faculty (only faculty users populated)
  async findAllFaculty() {
    return this.facultyModel
      .find()
      .populate('basicUserDetails', '-passwordHash')

  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    const faculty = await this.facultyModel.findById(id).populate('basicUserDetails');

    if (!faculty) throw new NotFoundException('Faculty not found');
    return faculty;
  }

  async update(id: string, dto: any) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');

    // If updating basic details (name, email, phone), update User model
    if (dto.name || dto.email || dto.phone) {
      const faculty = await this.facultyModel.findById(id);
      if (faculty && faculty.basicUserDetails) {
        await this.userService.updateUserProfile(faculty.basicUserDetails.toString(), {
          name: dto.name,
          email: dto.email,
          contactInfo: { phone: dto.phone }
        });
      }
    }

    return await this.facultyModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');

    const session: ClientSession = await this.facultyModel.db.startSession();
    try {
      let resultMessage = '';
      await session.withTransaction(async () => {
        // 1️⃣ Find faculty & populate user details (within session)
        const faculty = await this.facultyModel
          .findById(id)
          .populate('basicUserDetails')
          .session(session)
          .exec();
        if (!faculty) throw new NotFoundException('Faculty not found');

        // 2️⃣ Extract userId from faculty
        const userId = faculty.basicUserDetails?._id;

        // 3️⃣ Delete user first (if exists) using UserService (participates in same session)
        if (userId) {
          await this.userService.remove(userId.toString(), session);
        }

        // 4️⃣ Now delete faculty (in same session)
        await this.facultyModel.findByIdAndDelete(id, { session }).exec();

        resultMessage = 'Faculty & associated user deleted successfully';
      });

      return resultMessage;
    } finally {
      await session.endSession();
    }
  }

}
