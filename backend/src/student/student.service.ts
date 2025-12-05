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
  async createProfile(userId: string, institute: string) {
    const student = await this.studentModel.create({
      basicUserDetails: userId,
      institute,
    });
    await student.save();

    // Update user with studentId reference
    await this.userService.updateUserProfile(userId, { studentId: student._id });

    return student;
  }

  // Legacy method name for compatibility
  // async create(userId: string, instituteId: string) {
  //   return this.createProfile(userId, instituteId);
  // }

  // Find student by ID
  async findById(id: string) {
    return this.studentModel.findById(id).lean();
  }

  async createStudentFromAdmin(dto: CreateStudentAdminDto) {
    console.log('DTO received:', dto);
    // We'll track created resources so we can clean up on failure
    let createdUser: any = null;
    let createdAcademic: any = null;
    let createdStudent: any = null;

    try {
      // 1️⃣ Create User using UserService
      createdUser = await this.userService.create({
        userId: dto.studentId,
        name: dto.name,
        email: dto.email,
        passwordHash: dto.email,
        gender: dto.gender,
        role: 'student',
        contactInfo: {
          phone: dto.phone,
        },
      });

      // 2️⃣ Create Academic Details using AcademicService
      createdAcademic = await this.academicService.create({
        course: dto.course,
        branch: dto.branch,
        year: parseInt(dto.year),
        universityId: '',
        semester: dto.semester,
        section: dto.section,
      } as any);

      // 3️⃣ Create Student (your current schema)
      createdStudent = await this.studentModel.create({
        basicUserDetails: createdUser._id,
        acadmicDetails: createdAcademic._id,
        assignedFaculty: null, // (optional now)
        activities: [],
        instituteId: dto.institute,
      });

      // 4️⃣ Update user with studentId reference
      await this.userService.updateUserProfile(createdUser._id.toString(), { studentId: createdStudent._id });

      const data = await this.studentModel
        .findById(createdStudent._id)
        .populate('basicUserDetails', '-passwordHash')
        .populate('acadmicDetails');

      return data;
    } catch (err) {
      // If any step failed, attempt to clean up created resources to avoid orphaned users/academics
      console.error('createStudentFromAdmin failed, cleaning up partially created resources:', err);

      try {
        if (createdStudent && createdStudent._id) {
          await this.studentModel.findByIdAndDelete(createdStudent._id).exec();
        }
      } catch (e) {
        console.error('Failed to remove created student during cleanup:', e);
      }

      try {
        if (createdAcademic && createdAcademic._id) {
          await this.academicService.remove(createdAcademic._id.toString());
        }
      } catch (e) {
        console.error('Failed to remove created academic during cleanup:', e);
      }

      try {
        if (createdUser && createdUser._id) {
          await this.userService.remove(createdUser._id.toString());
        }
      } catch (e) {
        console.error('Failed to remove created user during cleanup:', e);
      }

      // rethrow so caller can record the error
      throw err;
    }
  }

  // Create student from admin DTO (same behavior as faculty.create)
  async create(dto: CreateStudentAdminDto) {
    // Normalize inputs
    dto.studentId = (dto.studentId || '').toString();
    dto.name = (dto.name || '').toString();
    dto.email = (dto.email || '').toString();
    // dto.gender = (dto.gender || '').toString().toLowerCase();
    dto.phone = dto.phone ? String(dto.phone) : '';
    dto.course = (dto.course || '').toString();
    dto.branch = (dto.branch || '').toString();
    dto.year = (dto.year || '').toString();
    dto.semester = (dto.semester || '').toString();
    dto.section = (dto.section || '').toString();

    let createdUser: any = null;
    let createdAcademic: any = null;
    let createdStudent: any = null;

    try {
      // create user
      createdUser = await this.userService.create({
        userId: dto.studentId,
        name: dto.name,
        email: dto.email,
        passwordHash: dto.email,
        gender: dto.gender,
        role: 'student',
        contactInfo: {
          phone: dto.phone,
        },
      });

      // create academic
      createdAcademic = await this.academicService.create({
        course: dto.course,
        branch: dto.branch,
        year: parseInt(dto.year) || 0,
        universityId: '',
        semester: dto.semester,
        section: dto.section,
      } as any);

      // create student profile
      createdStudent = await this.studentModel.create({
        basicUserDetails: createdUser._id,
        acadmicDetails: createdAcademic._id,
        assignedFaculty: null,
        activities: [],
        instituteId: dto.institute,
      });

      // update user with studentId
      await this.userService.updateUserProfile(createdUser._id.toString(), { studentId: createdStudent._id });

      const data = await this.studentModel
        .findById(createdStudent._id)
        .populate('basicUserDetails', '-passwordHash')
        .populate('acadmicDetails');

      return data;
    } catch (err) {
      // cleanup partial creations
      console.error('Student.create failed, cleaning up:', err);
      try {
        if (createdStudent && createdStudent._id) {
          await this.studentModel.findByIdAndDelete(createdStudent._id).exec();
        }
      } catch (e) {
        console.error('Failed to cleanup createdStudent', e);
      }
      try {
        if (createdAcademic && createdAcademic._id) {
          await this.academicService.remove(createdAcademic._id.toString());
        }
      } catch (e) {
        console.error('Failed to cleanup createdAcademic', e);
      }
      try {
        if (createdUser && createdUser._id) {
          await this.userService.remove(createdUser._id.toString());
        }
      } catch (e) {
        console.error('Failed to cleanup createdUser', e);
      }
      throw err;
    }
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
        // Match CSV template column names: studentId, name, email, gender, phone, course, branch, year, semester, section
        dto.studentId = row['studentId'] || row['Student ID'] || row['StudentID'];
        dto.name = row['name'] || row['Name'];
        dto.email = row['email'] || row['Email'];
        
        // Convert to lowercase for enum validation
        const genderValue = row['gender'] || row['Gender'];
        dto.gender = genderValue?.toString().toLowerCase();
        
        // Convert number to string if needed
        const phoneValue = row['phone'] || row['Phone'];
        dto.phone = String(phoneValue);
        
        dto.course = row['course'] || row['Course'];
        dto.branch = row['branch'] || row['Branch'];
        
        // Convert to string for validation
        dto.year = String(row['year'] || row['Year']);
        dto.semester = String(row['semester'] || row['Semester']);
        dto.section = String(row['section'] || row['Section']);
        dto.institute = user.instituteId;

        // Basic validation before attempting creation to provide clearer row-level errors
        const missing: string[] = [];
        if (!dto.studentId) missing.push('studentId');
        if (!dto.name) missing.push('name');
        if (!dto.email) missing.push('email');
        if (!dto.gender) missing.push('gender');
        if (!dto.phone) missing.push('phone');
        if (!dto.course) missing.push('course');
        if (!dto.branch) missing.push('branch');
        if (!dto.year) missing.push('year');
        if (!dto.semester) missing.push('semester');
        if (!dto.section) missing.push('section');

        if (missing.length > 0) {
          errors.push({ student: row, error: `Missing required fields: ${missing.join(', ')}` });
          continue;
        }

        // Normalize and validate gender
        const validGenders = ['male', 'female', 'other'];
        if (!validGenders.includes(dto.gender)) {
          errors.push({ student: row, error: `Invalid gender value: ${dto.gender}` });
          continue;
        }

        // Attempt creation (mirrors faculty flow)
        const createdStudent = await this.create(dto);
        if (createdStudent) {
          createdStudents.push(createdStudent);
        }
      } catch (error) {
        console.error('Student bulk upload error:', error);
        errors.push({ student: row, error: error.message || String(error) });
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
    return await this.studentModel.findById(id).populate('basicUserDetails').populate('acadmicDetails');
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    // Find student and get related IDs
    const student = await this.studentModel.findById(id).populate('acadmicDetails').populate('basicUserDetails');

    if (!student) {
      throw new BadRequestException('Student not found');
    }

    // 1️⃣ Update user details if provided (name, email, phone)
    const userFields: any = {};
    if (updateStudentDto.name) userFields.name = updateStudentDto.name;
    if (updateStudentDto.email) userFields.email = updateStudentDto.email;
    if (updateStudentDto.phone) {
      userFields['contactInfo.phone'] = updateStudentDto.phone;
    }

    if (Object.keys(userFields).length > 0) {
      const userId = student.basicUserDetails?._id;
      if (userId) {
        await this.userService.updateUserProfile(userId.toString(), userFields);
      }
    }

    // 2️⃣ Update academic details if provided
    const academicFields: any = {};
    if (updateStudentDto.course) academicFields.course = updateStudentDto.course;
    if (updateStudentDto.branch) academicFields.branch = updateStudentDto.branch;
    if (updateStudentDto.year) academicFields.year = updateStudentDto.year;
    if (updateStudentDto.semester) academicFields.semester = updateStudentDto.semester;
    if (updateStudentDto.section) academicFields.section = updateStudentDto.section;

    if (Object.keys(academicFields).length > 0) {
      const academicId = student.acadmicDetails?._id;
      if (academicId) {
        await this.academicService.update(academicId.toString(), academicFields);
      }
    }

    // Return updated student with populated data
    return await this.studentModel
      .findById(id)
      .populate('basicUserDetails', '-passwordHash')
      .populate('acadmicDetails');
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

  async addActivity(studentId: string, activityId: string) {
    return this.studentModel.findByIdAndUpdate(
      studentId,
      { $push: { activities: activityId } },
      { new: true }
    );
  }
}
