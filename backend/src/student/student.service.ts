import { Injectable } from '@nestjs/common';
import { CreateBasicStudentDto } from './dto/create-basic-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from './schema/student.schema';
import { Model } from 'mongoose';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  async create(userId: string) {
    const student = await this.studentModel.create({
      basicUserDetails: userId,
    });
    await student.save();
    console.log(userId);
    // createStudentDto.
    return student;
  }

  // createBulk(createStudentDto: CreateStudentDto[]) {
  //   return 'This action adds a new student in bulk';
  // }

  findAll() {
    return `This action returns all student`;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
