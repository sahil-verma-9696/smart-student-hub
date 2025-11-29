import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId, ClientSession } from 'mongoose';
import { Faculty } from './schemas/faculty.schema';
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
    private readonly userService: UserService,
  ) {}

  // 🟢 Create Faculty profile only (used by auth service)
  async createProfile(userId: string) {
    const faculty = await this.facultyModel.create({
      basicUserDetails: userId,
    });
    await faculty.save();
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
      instituteId: dto.instituteId,
    });

    const faculty = await this.facultyModel.create({
      basicUserDetails: user._id,
      assignedStudent: null,
      otherDetails: null,
      department: dto.department,
      designation: dto.designation,
    });
    const data = await this.facultyModel
      .findById(faculty._id)
      .populate('basicUserDetails', '-passwordHash'); // ❌ remove password field

    return data;
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
    dto.facultyId = row['Faculty ID'];
    dto.name = row['Full Name'];
    dto.email = row['Email'];
    
    // FIX ⚠ (convert M / F to lowercase)
    dto.gender = row['Gender']?.toLowerCase();   

    dto.phone = String(row['Phone']); // ⚠ convert number → string
    dto.department = row['Department'];
    dto.designation = row['Designation'];
    dto.instituteId = user.instituteId;

    const createdFaculty = await this.create(dto);
    if (createdFaculty) {
      createdFaculties.push(createdFaculty);
    }
  } catch (error) {
    errors.push({ faculty: row, error: error.message });
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
