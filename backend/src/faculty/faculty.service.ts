import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Faculty } from './schemas/faculty.schema';
import { isValidObjectId } from 'mongoose';
import { UpdateFacultyDto } from './dto/update-faculty.dto';

@Injectable()
export class FacultyService {
  constructor(
    @InjectModel(Faculty.name) private facultyModel: Model<Faculty>,
  ) {}

  async create(userId: string) {
    const faculty = await this.facultyModel.create({
      basicUserDetails: userId,
    });
    return faculty;
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

    const faculty = await this.facultyModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!faculty) throw new NotFoundException('Faculty not found');
    return faculty;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid faculty id');
    }

    const faculty = await this.facultyModel.findByIdAndDelete(id);
    if (!faculty) throw new NotFoundException('Faculty not found');
    return 'Faculty deleted successfully';
  }
}
