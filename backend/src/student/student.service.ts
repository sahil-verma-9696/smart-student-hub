import { Injectable, BadRequestException } from '@nestjs/common';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from './schema/student.schema';
import { Model, ClientSession } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { AcademicService } from 'src/academic/academic.service';
import { CreateStudentAdminDto } from './dto/create-student-admin.dto';
import * as xlsx from 'xlsx';
import { JwtPayload } from 'src/auth/types/auth.type';
import * as multer from 'multer';

export interface BulkUploadError {
  student: any;
  error: any;
}

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    private readonly userService: UserService,
    private readonly academicService: AcademicService,
  ) { }

  // Create student profile only (used by auth service)
  async createProfile(userId: string) {
    const student = await this.studentModel.create({
      basicUserDetails: userId,
    });
    await student.save();
    return student;
  }

  // Legacy method name for compatibility
  async create(userId: string) {
    return this.createProfile(userId);
  }

  async createStudentFromAdmin(dto: CreateStudentAdminDto) {
    console.log('DTO received:', dto);

    // 1️⃣ Create User using UserService
    const user = await this.userService.create({
      userId: dto.studentId,
      name: dto.name,
      email: dto.email,
      passwordHash: dto.email,
      gender: dto.gender,
      role: 'student',
      contactInfo: {
        phone: dto.phone,
      },
      instituteId: dto.instituteId
    });
   

    // 2️⃣ Create Academic Details using AcademicService
    const academic = await this.academicService.create({
      course: dto.course,
      branch: dto.branch,
      year: parseInt(dto.year),
      universityId: '',
      semester: dto.semester,
      section: dto.section,
    } as any);
   
    // 3️⃣ Create Student (your current schema)
    const student = await this.studentModel.create({
      basicUserDetails: user._id,
      acadmicDetails: academic._id,
      assignedFaculty: null,  // (optional now)
      activities: [],
    });
   

    const data = await this.studentModel
      .findById(student._id)
      .populate('basicUserDetails', '-passwordHash')  // ❌ remove password field
      .populate('acadmicDetails');
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
    

    const createdStudents: any[] = [];
    const errors: BulkUploadError[] = [];

    for (const row of data as any[]) {
      
      try {
        const dto = new CreateStudentAdminDto();
        dto.studentId = row['studentId'];
        dto.name = row['name'];
        dto.email = row['email'];
        dto.gender = row['gender'];
        dto.phone = row['phone'];
        dto.course = row['course'];
        dto.branch = row['branch'];
        dto.year = row['year'];
        dto.semester = row['semester'];
        dto.section = row['section'];
        dto.instituteId = user.instituteId;

        const createdStudent = await this.createStudentFromAdmin(dto);
        if(createdStudent) {
            createdStudents.push(createdStudent);
        }
      } catch (error) {
        errors.push({ student: row, error: error.message });
      }
    }

    return {
      message: 'Bulk upload completed',
      createdCount: createdStudents.length,
      errorCount: errors.length,
      errors,
    };
  }

  async findAll() {
  return await this.studentModel
    .find()
    .populate('basicUserDetails', '-passwordHash')   // 🔥 REMOVE PASSWORD
    .populate('acadmicDetails');
}



  async findOne(id: string) {
    return await this.studentModel.findById(id).populate('basicUserDetails');
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    return await this.studentModel.findByIdAndUpdate(id, updateStudentDto, { new: true });
  }

  async remove(id: string) {
    const session: ClientSession = await this.studentModel.db.startSession();
    try {
      let resultMessage = '';
      await session.withTransaction(async () => {
        // 1️⃣ Find student & populate user and academic details (within session)
        const student = await this.studentModel
          .findById(id)
          .populate('basicUserDetails')
          .populate('acadmicDetails')
          .session(session)
          .exec();

        if (!student) {
          throw new BadRequestException('Student not found');
        }

        // 2️⃣ Extract userId and academicId
        const userId = student.basicUserDetails?._id;
        const academicId = student.acadmicDetails?._id;

        // 3️⃣ Delete user using UserService with session
        if (userId) {
          await this.userService.remove(userId.toString(), session);
        }

        // 4️⃣ Delete academic details using AcademicService with session
        if (academicId) {
          await this.academicService.remove(academicId.toString(), session);
        }

        // 5️⃣ Finally delete student (in same session)
        await this.studentModel.findByIdAndDelete(id, { session }).exec();

        resultMessage = 'Student & associated user and academic records deleted successfully';
      });

      return resultMessage;
    } finally {
      await session.endSession();
    }
  }
}
