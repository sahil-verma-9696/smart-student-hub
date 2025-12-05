import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Academic, AcademicDocument } from './schema/academic.schema';
import { UpdateAcademicDto } from './dto/update-academic.dto';
import { Program, ProgramDocument } from './schema/program.schema';
import { Branch, BranchDocument } from './schema/branch.schema';
import { Department, DepartmentDocument } from './schema/department.schema';
import {
  Specialization,
  SpecializationDocument,
} from './schema/specialization.schema';
import { YearLevel, YearLevelDocument } from './schema/year-level.schema';
import { Degree, DegreeDocument } from './schema/degree.schema';
import { Section, SectionDocument } from './schema/section.schema';
import { Semester, SemesterDocument } from './schema/semester.schema';
import { UpdateProgramDto } from 'src/auth/dto/sub/update-program.dto';
import { UpdateDegreeDto } from 'src/auth/dto/sub/update-degree.dto';
import { UpdateBranchDto } from 'src/auth/dto/sub/update-branch.dto';
import { UpdateSpecializationDto } from 'src/auth/dto/sub/update-specialization.dto';
import { UpdateYearLevelDto } from 'src/auth/dto/sub/update-year-level.dto';
import { UpdateSemesterDto } from 'src/auth/dto/sub/update-semester.dto';
import { UpdateSectionDto } from 'src/auth/dto/sub/update-section.dto';
import { UpdateInstituteDto } from 'src/auth/dto/update-institute.dto';
import { UpdateDepartmentDto } from 'src/auth/dto/sub/update-department.dto';

@Injectable()
export class AcademicService {
  constructor(
    @InjectModel(Academic.name)
    private readonly academicModel: Model<AcademicDocument>,

    @InjectModel(Program.name)
    private readonly programModel: Model<ProgramDocument>,

    @InjectModel(Branch.name)
    private readonly branchModel: Model<BranchDocument>,

    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,

    @InjectModel(Specialization.name)
    private readonly specializationModel: Model<SpecializationDocument>,

    @InjectModel(YearLevel.name)
    private readonly yearLevelModel: Model<YearLevelDocument>,

    @InjectModel(Degree.name)
    private readonly degreeModel: Model<DegreeDocument>,

    @InjectModel(Section.name)
    private readonly sectionModel: Model<SectionDocument>,

    @InjectModel(Semester.name)
    private readonly semesterModel: Model<SemesterDocument>,
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

  async updateById(
    id: string,
    dto: UpdateAcademicDto,
  ): Promise<AcademicDocument> {
    const updated = await this.academicModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { $set: dto },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(
        `AcademicDetails not found for student: ${id}`,
      );
    }

    return updated;
  }

  /* ============================================================
                        PROGRAM CRUD
  ============================================================ */
  async createProgram(instituteId: string, dto: { name: string }) {
    return this.programModel.create({
      name: dto.name,
      institute: instituteId,
    });
  }

  async getPrograms(instituteId: string) {
    return this.programModel.find({ institute: instituteId });
  }

  async updateProgram(id: string, dto: any) {
    const program = await this.programModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!program) throw new NotFoundException('Program not found');
    return program;
  }

  async deleteProgram(id: string) {
    const deleted = await this.programModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Program not found');
    return { message: 'Program deleted' };
  }

  /* ============================================================
                        DEGREE CRUD
  ============================================================ */
  async createDegree(
    programId: string,
    instituteId: string,
    dto: { name: string },
  ) {
    return this.degreeModel.create({
      name: dto.name,
      program: programId,
      institute: instituteId,
    });
  }

  async getDegrees(programId: string) {
    return this.degreeModel.find({ program: programId });
  }

  async updateDegree(id: string, dto: any) {
    const degree = await this.degreeModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!degree) throw new NotFoundException('Degree not found');
    return degree;
  }

  async deleteDegree(id: string) {
    const deleted = await this.degreeModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Degree not found');
    return { message: 'Degree deleted' };
  }

  /* ============================================================
                        DEPARTMENT CRUD
  ============================================================ */
  async createDepartment(instituteId: string, dto: { name: string }) {
    return this.departmentModel.create({
      name: dto.name,
      institute: instituteId,
    });
  }

  async getDepartments(instituteId: string) {
    return this.departmentModel.find({ institute: instituteId });
  }

  async updateDepartment(id: string, dto: any) {
    const dept = await this.departmentModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }

  async deleteDepartment(id: string) {
    const deleted = await this.departmentModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Department not found');
    return { message: 'Department deleted' };
  }

  /* ============================================================
                        BRANCH CRUD
  ============================================================ */
  async createBranch(
    degreeId: string,
    departmentId: string,
    dto: { name: string },
  ) {
    return this.branchModel.create({
      name: dto.name,
      degree: degreeId,
      department: departmentId,
    });
  }

  async getBranches(degreeId: string) {
    return this.branchModel.find({ degree: degreeId }).populate('department');
  }

  async updateBranch(id: string, dto: any) {
    const branch = await this.branchModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }

  async deleteBranch(id: string) {
    const deleted = await this.branchModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Branch not found');
    return { message: 'Branch deleted' };
  }

  /* ============================================================
                        SPECIALIZATION CRUD
  ============================================================ */
  async createSpecialization(branchId: string, dto: { name: string }) {
    return this.specializationModel.create({
      name: dto.name,
      branch: branchId,
    });
  }

  async getSpecializations(branchId: string) {
    return this.specializationModel.find({ branch: branchId });
  }

  async updateSpecialization(id: string, dto: any) {
    const spec = await this.specializationModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!spec) throw new NotFoundException('Specialization not found');
    return spec;
  }

  async deleteSpecialization(id: string) {
    const deleted = await this.specializationModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Specialization not found');
    return { message: 'Specialization deleted' };
  }

  /* ============================================================
                        YEAR LEVEL CRUD
  ============================================================ */
  async createYearLevel(degreeId: string, dto: { year: number }) {
    return this.yearLevelModel.create({
      year: dto.year,
      degree: degreeId,
    });
  }

  async getYearLevels(degreeId: string) {
    return this.yearLevelModel.find({ degree: degreeId });
  }

  async updateYearLevel(id: string, dto: any) {
    const year = await this.yearLevelModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!year) throw new NotFoundException('Year level not found');
    return year;
  }

  async deleteYearLevel(id: string) {
    const deleted = await this.yearLevelModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Year level not found');
    return { message: 'Year level deleted' };
  }

  /* ============================================================
                        SEMESTER CRUD
  ============================================================ */
  async createSemester(yearId: string, dto: { semNumber: number }) {
    return this.semesterModel.create({
      semNumber: dto.semNumber,
      year: yearId,
    });
  }

  async getSemesters(yearId: string) {
    return this.semesterModel.find({ year: yearId });
  }

  async updateSemester(id: string, dto: any) {
    const sem = await this.semesterModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!sem) throw new NotFoundException('Semester not found');
    return sem;
  }

  async deleteSemester(id: string) {
    const deleted = await this.semesterModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Semester not found');
    return { message: 'Semester deleted' };
  }

  /* ============================================================
                        SECTION CRUD
  ============================================================ */
  async createSection(
    specId: string,
    semesterId: string,
    dto: { name: string; seatCapacity: number },
  ) {
    return this.sectionModel.create({
      name: dto.name,
      seatCapacity: dto.seatCapacity,
      specialization: specId,
      semester: semesterId,
    });
  }

  async getSections(specId: string) {
    return this.sectionModel
      .find({ specialization: specId })
      .populate('semester');
  }

  async updateSection(id: string, dto: any) {
    const section = await this.sectionModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!section) throw new NotFoundException('Section not found');
    return section;
  }

  async deleteSection(id: string) {
    const deleted = await this.sectionModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Section not found');
    return { message: 'Section deleted' };
  }

  // -----------------------------
  // AUTO CREATE or UPDATE PROGRAM
  // -----------------------------
  async upsertProgram(
    programDto: UpdateProgramDto,
    instituteId: Types.ObjectId,
  ) {
    let program: ProgramDocument | null;

    if (programDto.id) {
      program = await this.programModel.findByIdAndUpdate(
        programDto.id,
        { name: programDto.name },
        { new: true },
      );
    } else {
      program = await this.programModel.create({
        name: programDto.name,
        institute: instituteId,
      });
    }

    console.log(program, 'program');

    if (!program) throw new NotFoundException('Program not found');

    // Upsert Degrees
    for (const degreeDto of programDto.degrees ?? []) {
      await this.upsertDegree(degreeDto, program._id, instituteId);
    }

    return program;
  }

  // -----------------------------
  // AUTO CREATE or UPDATE DEGREE
  // -----------------------------
  async upsertDegree(
    dto: UpdateDegreeDto,
    programId: Types.ObjectId,
    instituteId: Types.ObjectId,
  ) {
    let degree: DegreeDocument | null;

    if (dto.id) {
      degree = await this.degreeModel.findByIdAndUpdate(
        dto.id,
        { name: dto.name },
        { new: true },
      );
    } else {
      degree = await this.degreeModel.create({
        name: dto.name,
        program: programId,
        institute: new Types.ObjectId(instituteId),
      });
    }

    if (!degree) throw new NotFoundException('Degree not found');

    // Branches
    for (const branchDto of dto.branches ?? []) {
      await this.upsertBranch(branchDto, degree._id);
    }

    // Year Levels
    for (const yearDto of dto.yearLevels ?? []) {
      await this.upsertYear(yearDto, degree?._id);
    }

    return degree;
  }

  // -----------------------------
  // AUTO CREATE or UPDATE BRANCH
  // -----------------------------
  async upsertBranch(dto: UpdateBranchDto, degreeId: Types.ObjectId) {
    let branch: BranchDocument | null;

    if (dto.id) {
      branch = await this.branchModel.findByIdAndUpdate(
        dto.id,
        { name: dto.name },
        { new: true },
      );
    } else {
      branch = await this.branchModel.create({
        name: dto.name,
        degree: new Types.ObjectId(degreeId),
        department: new Types.ObjectId(dto.departmentId),
      });
    }

    if (!branch) throw new NotFoundException('Branch not found');

    // Specializations
    for (const specDto of dto.specializations ?? []) {
      await this.upsertSpecialization(specDto, branch._id);
    }

    return branch;
  }

  // -----------------------------
  // AUTO CREATE or UPDATE SPECIALIZATION
  // -----------------------------
  async upsertSpecialization(
    dto: UpdateSpecializationDto,
    branchId: Types.ObjectId,
  ) {
    if (dto.id) {
      return this.specializationModel.findByIdAndUpdate(
        dto.id,
        { name: dto.name },
        { new: true },
      );
    }

    return this.specializationModel.create({
      name: dto.name,
      branch: branchId,
    });
  }

  // -----------------------------
  // AUTO CREATE or UPDATE YEAR LEVEL
  // -----------------------------
  async upsertYear(dto: UpdateYearLevelDto, degreeId: Types.ObjectId) {
    let year: YearLevelDocument | null;

    if (dto.id) {
      year = await this.yearLevelModel.findByIdAndUpdate(
        dto.id,
        { year: dto.year },
        { new: true },
      );
    } else {
      year = await this.yearLevelModel.create({
        year: dto.year,
        degree: degreeId,
      });
    }

    if (!year) throw new NotFoundException('Year Level not found');

    // Semesters
    for (const semDto of dto.semesters ?? []) {
      await this.upsertSemester(semDto, year._id);
    }

    return year;
  }

  // -----------------------------
  // AUTO CREATE or UPDATE SEMESTER
  // -----------------------------
  async upsertSemester(dto: UpdateSemesterDto, yearId: Types.ObjectId) {
    let semester: SemesterDocument | null;

    if (dto.id) {
      semester = await this.semesterModel.findByIdAndUpdate(
        dto.id,
        { semNumber: dto.semNumber },
        { new: true },
      );
    } else {
      semester = await this.semesterModel.create({
        semNumber: dto.semNumber,
        year: yearId,
      });
    }

    if (!semester) throw new NotFoundException('Semester not found');

    // Sections
    for (const secDto of dto.sections ?? []) {
      await this.upsertSection(secDto, semester._id);
    }

    return semester;
  }

  // -----------------------------
  // AUTO CREATE or UPDATE SECTION
  // -----------------------------
  async upsertSection(dto: UpdateSectionDto, semesterId: Types.ObjectId) {
    if (dto.id) {
      return this.sectionModel.findByIdAndUpdate(
        dto.id,
        {
          name: dto.name,
          seatCapacity: dto.seatCapacity,
        },
        { new: true },
      );
    }

    return this.sectionModel.create({
      name: dto.name,
      seatCapacity: dto.seatCapacity,
      specialization: dto.specializationId,
      semester: semesterId,
    });
  }

  // =========================================
  // AUTO CREATE or UPDATE DEPARTMENT
  // =========================================
  async upsertDepartment(
    dto: UpdateDepartmentDto,
    instituteId: Types.ObjectId,
  ) {
    let department: DepartmentDocument | null;

    // If frontend sent an id → update
    if (dto.id) {
      department = await this.departmentModel.findByIdAndUpdate(
        dto.id,
        { name: dto.name },
        { new: true },
      );

      // If record not found → create new one
      if (!department) {
        department = await this.departmentModel.create({
          name: dto.name,
          institute: instituteId,
        });
      }
    }

    // If no id → always create a new department
    else {
      department = await this.departmentModel.create({
        name: dto.name,
        institute: instituteId,
      });
    }

    return department;
  }

  // -----------------------------
  // MAIN ENTRY POINT
  // -----------------------------
  async upsertFullStructure(dto: UpdateInstituteDto, instituteId: string) {
    const instituteObjectId = new Types.ObjectId(instituteId);

    // 🔥 Upsert Departments
    // for (const deptDto of dto.departments ?? []) {
    //   await this.upsertDepartment(deptDto, instituteObjectId);
    // }

    // 🔥 Upsert Programs (already exists)
    for (const programDto of dto.programs ?? []) {
      await this.upsertProgram(programDto, instituteObjectId);
    }

    return { message: 'Institute structure updated successfully' };
  }
}
