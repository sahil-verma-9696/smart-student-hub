import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { Academic } from './schema/academic.schema';
import { CreateAcademicDto } from './dto/create-academic.dto';

import { NotFoundException } from '@nestjs/common';

@Injectable()
export class AcademicService {
  constructor(
    @InjectModel(Academic.name) private academicModel: Model<Academic>,
  ) {}

  // CREATE
  async create(dto: CreateAcademicDto): Promise<Academic> {
    const academic = new this.academicModel(dto);
    return academic.save();
  }

  // READ all
  async findAll(): Promise<Academic[]> {
    return this.academicModel.find().exec();
  }

  // READ by ID
  async findOne(id: string): Promise<Academic> {
    const academic = await this.academicModel.findById(id).exec();
    if (!academic) throw new NotFoundException('Academic record not found');
    return academic;
  }

  // UPDATE
  async update(id: string, dto: CreateAcademicDto): Promise<Academic> {
    const updated = await this.academicModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!updated) throw new NotFoundException('Academic record not found');
    return updated;
  }

  // DELETE
  async remove(id: string, session?: ClientSession): Promise<Academic> {
    const deleted = session
      ? await this.academicModel.findByIdAndDelete(id, { session }).exec()
      : await this.academicModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Academic record not found');
    return deleted;
  }
}

