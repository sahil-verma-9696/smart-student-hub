import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from './schema/student.schema';
import { ClientSession, Model, Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { USER_ROLE } from 'src/user/types/enum';
import { CreateStudentDto } from './dto/create-basic-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    private readonly userService: UserService,
  ) {}

  /******************************
   * 1. Create Single Student
   *    - Create user (role: STUDENT)
   *    - Create student profile
   ******************************/
  // async create(
  //   dto: CreateStudentDto,
  //   session?: ClientSession,
  // ): Promise<StudentDocument> {
  //   /***** 1. Create User *****/
  //   const userDto: CreateUserDto = {
  //     name: dto.name,
  //     email: dto.email,
  //     password: dto.password,
  //     gender: dto.gender,
  //     role: USER_ROLE.STUDENT,
  //     contactInfo: dto.contactInfo,
  //   };

  //   const user = await this.userService.createUser(userDto, session);

  //   /***** 2. Create Student Profile *****/
  //   const created = await this.studentModel.create(
  //     [
  //       {
  //         basicUserDetails: user._id,
  //         institute: dto.instituteId
  //           ? new Types.ObjectId(dto.instituteId)
  //           : null,
  //       },
  //     ],
  //     { session },
  //   );

  //   return created[0];
  // }

  /******************************
   * 2. Create Students in Bulk
   *    - Create users first
   *    - Then create student entries
   ******************************/
  // async createBulk(
  //   students: CreateStudentDto[],
  //   session?: ClientSession,
  // ): Promise<StudentDocument[]> {
  //   if (!students?.length) {
  //     throw new Error('No student records provided for bulk upload');
  //   }

  //   const createdStudents: StudentDocument[] = [];

  //   for (const s of students) {
  //     /***** Create User for each student *****/
  //     const userDto: CreateUserDto = {
  //       name: s.name,
  //       email: s.email,
  //       password: s.password,
  //       gender: s.gender,
  //       role: USER_ROLE.STUDENT,
  //       contactInfo: s.contactInfo,
  //     };

  //     const user = await this.userService.createUser(userDto, session);

  //     /***** Create Student Profile *****/
  //     const student = await this.studentModel.create(
  //       [
  //         {
  //           basicUserDetails: user._id,
  //           institute: s.instituteId ? new Types.ObjectId(s.instituteId) : null,
  //         },
  //       ],
  //       { session },
  //     );

  //     createdStudents.push(student[0]);
  //   }

  //   return createdStudents;
  // }

  /******************************
   * 3. Find One Student
   ******************************/
  // async findOne(id: string) {
  //   const student = await this.studentModel
  //     .findById(id)
  //     .populate('basicUserDetails')
  //     .populate('institute');

  //   if (!student) {
  //     throw new NotFoundException(`Student ${id} not found`);
  //   }

  //   return student;
  // }

  /******************************
   * 4. Find All Students
   ******************************/
  // async findAll() {
  //   return this.studentModel
  //     .find()
  //     .populate('basicUserDetails')
  //     .populate('institute');
  // }

  /******************************
   * 5. Delete Student
   ******************************/
  // async remove(id: string) {
  //   const res = await this.studentModel.deleteOne({ _id: id });
  //   if (res.deletedCount === 0) {
  //     throw new NotFoundException(`Student ${id} not found`);
  //   }
  //   return true;
  // }

  async getByUserId(userId: string): Promise<StudentDocument> {
    const student = (await this.studentModel
      .findOne({ basicUserDetails: userId })
      .populate<{ basicUserDetails: any }>('basicUserDetails')
      .populate<{ institute: any }>('institute')
      .exec()) as StudentDocument;

    if (!student) {
      throw new NotFoundException(`Student with userId ${userId} not found`);
    }

    return student;
  }
}
