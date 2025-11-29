import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Academic, AcademicDocument } from './schema/academic.schema';

@Injectable()
export class AcademicService {
  constructor(
    @InjectModel(Academic.name)
    private readonly academicModel: Model<AcademicDocument>,
  ) {}

  async create(details: {
    department?: string | null;
    course?: string;
    year?: number;
    section?: string;
    backlogs?: number; // 🔥 NEW

    studentId?: string | null;
  }): Promise<AcademicDocument> {
    const created = await this.academicModel.create({
      department: details.department,
      course: details.course,
      year: details.year,
      section: details.section,
      backlogs: details.backlogs ?? 0, // 🔥 NEW
      student: details.studentId ? new Types.ObjectId(details.studentId) : null,
    });

    return created;
  }

  async getByStudent(studentId: string): Promise<AcademicDocument> {
    const record = await this.academicModel.findOne({
      student: new Types.ObjectId(studentId),
    });

    if (!record) {
      throw new NotFoundException(
        `AcademicDetails not found for student: ${studentId}`,
      );
    }

    return record;
  }

  async updateStudentId(academicId: Types.ObjectId, studentId: Types.ObjectId) {
    await this.academicModel.updateOne(
      { _id: academicId },
      { student: studentId },
    );
  }

  async updateForStudent(
    studentId: string,
    updateData: Partial<AcademicDocument>,
  ): Promise<AcademicDocument> {
    const updated = await this.academicModel.findOneAndUpdate(
      { student: new Types.ObjectId(studentId) },
      updateData,
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(
        `AcademicDetails not found for student: ${studentId}`,
      );
    }

    return updated;
  }

  async delete(studentId: string): Promise<boolean> {
    const res = await this.academicModel.deleteOne({ student: studentId });

    return res.deletedCount > 0;
  }
}
