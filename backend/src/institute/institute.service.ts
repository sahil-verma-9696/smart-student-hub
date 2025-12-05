import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateInstituteDto } from './dto/update-institute.dto';
import { InjectModel } from '@nestjs/mongoose';
import {Institute} from './schemas/institute.schema';
import { Model, isValidObjectId } from 'mongoose';
import CreateInstituteDto from './dto/create-institute.dto';

@Injectable()
export class InstituteService {
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
      throw new BadRequestException('Institute already exists with this email');
    }

    const newInstitute = new this.instituteModel(createInstituteDto);
    await newInstitute.save();
    return newInstitute;
  }

  async findAll() {
    return await this.instituteModel.find().populate('programs');
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid institute ID');
    }

    const institute = await this.instituteModel.findById(id).populate('programs');
    if (!institute) {
      throw new NotFoundException('Institute not found');
    }

    return institute;
  }

  async update(id: string, updateInstituteDto: UpdateInstituteDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid institute ID');
    }

    const institute = await this.instituteModel.findByIdAndUpdate(
      id,
      updateInstituteDto,
      { new: true },
    ).populate('programs');

    if (!institute) {
      throw new NotFoundException('Institute not found');
    }

    return institute;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid institute ID');
    }

    const institute = await this.instituteModel.findByIdAndDelete(id);
    if (!institute) {
      throw new NotFoundException('Institute not found');
    }

    return { message: 'Institute deleted successfully' };
  }

  // 🎓 Add program to institute
  async addProgram(instituteId: string, programId: string) {
    if (!isValidObjectId(instituteId) || !isValidObjectId(programId)) {
      throw new BadRequestException('Invalid ID');
    }

    const institute = await this.instituteModel.findByIdAndUpdate(
      instituteId,
      { $addToSet: { programs: programId } },
      { new: true },
    ).populate('programs');

    if (!institute) {
      throw new NotFoundException('Institute not found');
    }

    return institute;
  }

  // ➖ Remove program from institute
  async removeProgram(instituteId: string, programId: string) {
    if (!isValidObjectId(instituteId) || !isValidObjectId(programId)) {
      throw new BadRequestException('Invalid ID');
    }

    const institute = await this.instituteModel.findByIdAndUpdate(
      instituteId,
      { $pull: { programs: programId } },
      { new: true },
    ).populate('programs');

    if (!institute) {
      throw new NotFoundException('Institute not found');
    }

    return institute;
  }
}
