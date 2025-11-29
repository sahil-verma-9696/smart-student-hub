import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Program } from './schema/program.schema';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import * as xlsx from 'xlsx';
import { JwtPayload } from 'src/auth/types/auth.type';
import * as multer from 'multer';
import Institute from 'src/institute/schemas/institute.schema';

export interface BulkUploadError {
  program: any;
  error: string;
}

@Injectable()
export class ProgramService {
  constructor(
    @InjectModel(Program.name) private programModel: Model<Program>,
    @InjectModel(Institute.name) private instituteModel: Model<Institute>,
  ) {}

  // ➕ CREATE PROGRAM (Admin adds after institute registration)
  async create(dto: CreateProgramDto) {
    // Validate instituteId exists
    if (!isValidObjectId(dto.instituteId)) {
      throw new BadRequestException('Invalid institute ID');
    }

    const institute = await this.instituteModel.findById(dto.instituteId);
    if (!institute) {
      throw new NotFoundException('Institute not found');
    }

    // Check if same program (level + degree + branch + specialization) exists for this institute
    const existingProgram = await this.programModel.findOne({
      level: dto.level,
      degree: dto.degree,
      branch: dto.branch,
      specialization: dto.specialization || null,
      instituteId: dto.instituteId,
    });

    if (existingProgram) {
      throw new BadRequestException(
        `Program ${dto.degree} - ${dto.branch}${dto.specialization ? ` (${dto.specialization})` : ''} already exists for this institute`,
      );
    }

    const program = await this.programModel.create({
      level: dto.level,
      degree: dto.degree,
      branch: dto.branch,
      specialization: dto.specialization || null,
      intake: dto.intake,
      instituteId: dto.instituteId,
    });

    // Add program reference to institute
    await this.instituteModel.findByIdAndUpdate(dto.instituteId, {
      $push: { programs: program._id },
    });

    return program;
  }

  // 📥 BULK UPLOAD PROGRAMS (Admin uploads Excel/CSV)
  async uploadBulk(file: multer.File, user: JwtPayload) {
    if (!file) {
      throw new BadRequestException('No file received');
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const createdPrograms: any[] = [];
    const errors: BulkUploadError[] = [];

    for (const row of data as any[]) {
      try {
        const dto = new CreateProgramDto();
        dto.level = row['Level'] || row['level'];
        dto.degree = row['Degree'] || row['degree'];
        dto.branch = row['Branch'] || row['branch'];
        dto.specialization = row['Specialization'] || row['specialization'] || null;
        dto.intake = Number(row['Intake'] || row['intake']);
        dto.instituteId = user.instituteId;

        const created = await this.create(dto);
        createdPrograms.push(created);
      } catch (error) {
        errors.push({ program: row, error: error.message });
      }
    }

    return {
      message: 'Bulk upload completed',
      createdCount: createdPrograms.length,
      errorCount: errors.length,
      errors,
    };
  }

  // 📋 FIND ALL PROGRAMS
  async findAll() {
    return await this.programModel.find().populate('instituteId', 'institute_name');
  }

  // 📋 FIND PROGRAMS BY INSTITUTE
  async findByInstitute(instituteId: string) {
    if (!isValidObjectId(instituteId)) {
      throw new BadRequestException('Invalid institute ID');
    }

    return await this.programModel.find({ instituteId }).populate('instituteId', 'institute_name');
  }

  // 📋 FIND PROGRAMS BY LEVEL (UG, PG, etc.)
  async findByLevel(level: string) {
    return await this.programModel.find({ level }).populate('instituteId', 'institute_name');
  }

  // 📋 FIND PROGRAMS BY DEGREE (BTech, BCA, etc.)
  async findByDegree(degree: string) {
    return await this.programModel.find({ degree }).populate('instituteId', 'institute_name');
  }

  // 🔍 FIND ONE PROGRAM
  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid program ID');
    }

    const program = await this.programModel.findById(id).populate('instituteId', 'institute_name');
    if (!program) {
      throw new NotFoundException('Program not found');
    }

    return program;
  }

  // ✏️ UPDATE PROGRAM
  async update(id: string, dto: UpdateProgramDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid program ID');
    }

    const program = await this.programModel.findByIdAndUpdate(id, dto, { new: true });
    if (!program) {
      throw new NotFoundException('Program not found');
    }

    return program;
  }

  // 🗑️ DELETE PROGRAM
  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid program ID');
    }

    const program = await this.programModel.findById(id);
    if (!program) {
      throw new NotFoundException('Program not found');
    }

    // Remove program reference from institute
    await this.instituteModel.findByIdAndUpdate(program.instituteId, {
      $pull: { programs: program._id },
    });

    await this.programModel.findByIdAndDelete(id);

    return { message: 'Program deleted successfully' };
  }

  // 📊 UPDATE INTAKE (Admin can update seat count)
  async updateIntake(id: string, intake: number) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid program ID');
    }

    if (intake < 1) {
      throw new BadRequestException('Intake must be at least 1');
    }

    const program = await this.programModel.findByIdAndUpdate(
      id,
      { intake },
      { new: true },
    );

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    return program;
  }
}
