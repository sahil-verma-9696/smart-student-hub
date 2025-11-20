import { Injectable } from '@nestjs/common';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Institute } from './schemas/institute.schema';
import { Model } from 'mongoose';

@Injectable()
export class InstituteService {
  constructor(
    @InjectModel(Institute.name) private instituteModel: Model<Institute>,
  ) {}

  async create(createInstituteDto: CreateInstituteDto) {
    const newInstitute = new this.instituteModel(createInstituteDto);
    await newInstitute.save();
    return newInstitute;
  }

  findAll() {
    return `This action returns all institute`;
  }

  findOne(id: number) {
    return `This action returns a #${id} institute`;
  }

  update(id: number, updateInstituteDto: UpdateInstituteDto) {
    return `This action updates a #${id} institute`;
  }

  remove(id: number) {
    return `This action removes a #${id} institute`;
  }
}
