import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from './schema/student.schema';
import { ClientSession, Model, Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { USER_ROLE } from 'src/user/types/enum';
import { CreateStudentDto } from './dto/create-student.dto';
import * as fs from 'fs';
import * as csv from 'fast-csv';
import { AcademicService } from 'src/academic/academic.service';
import { CSV_FIELD_MAP } from './constants';
import { BulkCreateStudentDto } from './dto/create-student-bulk.dto';
import { StudentQueryDto } from './dto/query.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserDocument } from 'src/user/schema/user.schema';
import { InstituteDocument } from 'src/institute/schemas/institute.schema';
import { AcademicDocument } from 'src/academic/schema/academic.schema';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,

    // Services
    private readonly userService: UserService,
    private readonly academicService: AcademicService,
  ) {}

  /***************************************
   * VALIDATE instituteId BEFORE creating
   ***************************************/
  private async validateInstitute(instituteId: string): Promise<void> {
    if (!Types.ObjectId.isValid(instituteId)) {
      throw new Error(`Invalid instituteId: ${instituteId}`);
    }

    const exists = await this.studentModel.db
      .collection('institutes')
      .findOne({ _id: new Types.ObjectId(instituteId) });

    if (!exists) {
      throw new Error(`Institute not found for ID: ${instituteId}`);
    }
  }

  /***************************************
   * CREATE SINGLE STUDENT WITH ACADEMIC
   ***************************************/
  async createStudent(
    dto: CreateStudentDto,
    session?: ClientSession,
  ): Promise<StudentDocument> {
    await this.studentModel.syncIndexes();

    // Validate institute
    await this.validateInstitute(dto.instituteId);

    /** STEP 1 — Create User */
    const userDto: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: dto.password,
      gender: dto.gender,
      role: USER_ROLE.STUDENT,
      contactInfo: dto.contactInfo,
    };

    const user = await this.userService.createUser(userDto, session);

    /** STEP 2 — Create AcademicDetails using AcademicService */
    const academic = await this.academicService.create({
      studentId: null,
    });

    /** STEP 3 — Create Student with academicDetails ref */
    const createdStudent = await this.studentModel.create(
      [
        {
          basicUserDetails: new Types.ObjectId(user._id),
          institute: new Types.ObjectId(dto.instituteId),
          academicDetails: new Types.ObjectId(academic._id),
          roll_number: dto.roll_number,
        },
      ],
      { session },
    );

    const student = createdStudent[0];

    /** STEP 4 — Update academic.student reference */
    await this.academicService.updateStudentId(academic._id, student._id);

    return student.populate(['basicUserDetails', 'academicDetails']);
  }

  /***************************************
   * BULK UPLOAD STUDENTS WITH ACADEMIC + JSON Input
   ***************************************/
  async bulkCreateStudents(dto: BulkCreateStudentDto) {
    const { instituteId, students } = dto;

    if (!Array.isArray(students)) {
      throw new Error('Invalid students array');
    }

    const successes: {
      email: string;
      roll_number?: string;
      studentId?: string;
    }[] = [];
    const failures: {
      email: string;
      roll_number?: string;
      reason?: string;
    }[] = [];

    for (const entry of students) {
      try {
        // prepare single student creation DTO
        const singleDto: CreateStudentDto = {
          name: entry.name,
          email: entry.email,
          password: entry.password,
          gender: entry.gender,
          contactInfo: entry.contactInfo,
          roll_number: entry.roll_number,
          instituteId,
          branch: entry.branch,
          degree: entry.degree,
          program: entry.program,
        };

        const created = await this.createStudent(singleDto);

        successes.push({
          email: entry.email,
          roll_number: entry.roll_number,
          studentId: created._id.toString(),
        });
      } catch (error: any) {
        failures.push({
          email: entry.email,
          roll_number: entry.roll_number,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          reason: (error.message as string | undefined) ?? 'Unknown error',
        });

        // continue loop, do NOT stop processing
        continue;
      }
    }

    return {
      status:
        failures.length === 0
          ? 'success'
          : successes.length > 0
            ? 'partial'
            : 'failed',

      total: students.length,
      created: successes.length,
      failed: failures.length,

      successes,
      failures,
    };
  }

  /***************************************
   * BULK UPLOAD STUDENTS WITH ACADEMIC
   ***************************************/
  async bulkUploadStudents(csvPath: string): Promise<{
    total: number;
    successCount: number;
    failedCount: number;
    success: StudentDocument[];
    failed: Array<{
      rowNumber: number;
      row: CreateStudentDto;
      reason: string;
    }>;
  }> {
    const rows = await this.parseCsv(csvPath);

    const success: StudentDocument[] = [];
    const failed: Array<{
      rowNumber: number;
      row: CreateStudentDto;
      reason: string;
    }> = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const dto = this.mapCsvRowToStudentDto(row);

      try {
        const createdStudent = await this.createStudent(dto);
        success.push(createdStudent);
      } catch (err: unknown) {
        const reason =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
              ? err
              : JSON.stringify(err);

        this.logger.error(
          `CSV row ${i + 1} FAILED | Email: ${dto.email} | Reason: ${reason}`,
        );

        failed.push({ rowNumber: i + 1, row: dto, reason });
      }
    }

    /** Remove CSV file */
    await fs.promises
      .unlink(csvPath)
      .catch((err) =>
        this.logger.warn(`Failed to delete CSV ${csvPath}: ${err}`),
      );

    return {
      total: rows.length,
      successCount: success.length,
      failedCount: failed.length,
      success,
      failed,
    };
  }

  /***************************************
   * PARSE CSV ACCORDING TO FIELD MAP
   ***************************************/
  private parseCsv(filePath: string): Promise<Record<string, string>[]> {
    const REQUIRED = Object.values(CSV_FIELD_MAP)
      .filter((f) => f.required)
      .map((f) => f.csv);

    return new Promise((resolve, reject) => {
      const rows: Record<string, string>[] = [];
      let headersVerified = false;

      fs.createReadStream(filePath)
        .pipe(
          csv.parse({
            headers: true,
            ignoreEmpty: true,
          }),
        )
        .on('headers', (headers: string[]) => {
          const missing = REQUIRED.filter((col) => !headers.includes(col));

          if (missing.length > 0) {
            return reject(
              new Error(`CSV missing required columns: ${missing.join(', ')}`),
            );
          }

          headersVerified = true;
        })
        .on('error', reject)
        .on('data', (data) => rows.push(data))
        .on('end', () => {
          if (!headersVerified) {
            reject(new Error('CSV headers not detected.'));
          } else {
            resolve(rows);
          }
        });
    });
  }

  /***************************************
   * MAP CSV → DTO ACCORDING TO FIELD MAP
   ***************************************/
  private mapCsvRowToStudentDto(row: Record<string, string>): CreateStudentDto {
    const mapped: any = {};

    for (const [key, conf] of Object.entries(CSV_FIELD_MAP)) {
      mapped[key] = row[conf.csv]?.trim() ?? null;
    }

    return {
      name: mapped.name,
      email: mapped.email,
      password: mapped.password,
      gender: mapped.gender,
      instituteId: mapped.instituteId,
      roll_number: mapped.roll_number,
      branch: mapped.branch,
      program: mapped.program,
      degree: mapped.degree,
      contactInfo: {
        phone: mapped.phone,
        alternatePhone: mapped.alternatePhone,
        address: mapped.address,
      },
    };
  }

  /***************************************
   * GETTERS
   ***************************************/
  async getByUserId(userId: string) {
    const student = await this.studentModel
      .findOne({ basicUserDetails: new Types.ObjectId(userId) })
      .populate<{ basicUserDetails: UserDocument }>('basicUserDetails')
      .populate<{ institute: InstituteDocument }>('institute')
      .populate<{ adademicDetails: AcademicDocument }>('academicDetails')
      .exec();

    if (!student) {
      throw new NotFoundException(
        `Student with basicUserDetails ${userId} not found`,
      );
    }

    return student;
  }
  async getById(studentId: string) {
    const student = await this.studentModel
      .findOne({ _id: new Types.ObjectId(studentId) })
      .populate<{ basicUserDetails: UserDocument }>('basicUserDetails')
      .populate<{ institute: InstituteDocument }>('institute')
      .populate<{ adademicDetails: AcademicDocument }>('academicDetails')
      .exec();

    if (!student) {
      throw new NotFoundException(
        `Student with basicUserDetails ${studentId} not found`,
      );
    }

    return student;
  }

  /************************************************************
   * *********** GET ALL STUDENTS ACCORDING TO QUERY ***********
   *************************************************************/
  async findStudents(query: StudentQueryDto): Promise<StudentDocument[]> {
    const filter: StudentFilter = {};

    if (query.instituteId) {
      filter.institute = new Types.ObjectId(query.instituteId);
    }

    if (query.gender) {
      filter['basicUserDetails.gender'] = query.gender;
    }

    if (query.department) {
      filter['academicDetails.department'] = query.department;
    }

    if (query.roll_number) {
      filter.roll_number = query.roll_number;
    }

    return this.studentModel
      .find(filter)
      .populate('basicUserDetails', '-passwordHash')
      .populate('academicDetails')
      .populate('institute')
      .exec();
  }

  async updateStudentAcademicDetails(studentId: string, dto: UpdateStudentDto) {
    const instituteId = dto.instituteId;

    if (!instituteId) {
      throw new BadRequestException('instituteId is required');
    }
    // Find student by ID & institute
    const student = await this.studentModel.findOne({
      _id: new Types.ObjectId(studentId),
      institute: new Types.ObjectId(instituteId),
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Update AcademicDetails of student
    // if (dto.academicDetails) {
    //   await this.academicService.updateById(
    //     student.academicDetails.toString(),
    //     dto.academicDetails,
    //   );
    // }

    // Separate student-specific fields from user fields
    const studentFields: Partial<Student> = {};
    const userFields: any = {};

    // Student-specific fields
    if (dto.roll_number !== undefined)
      studentFields.roll_number = dto.roll_number;

    // User-specific fields (stored in basicUserDetails)
    if (dto.name !== undefined) userFields.name = dto.name;
    if (dto.email !== undefined) userFields.email = dto.email;
    if (dto.gender !== undefined) userFields.gender = dto.gender;
    if (dto.contactInfo !== undefined) userFields.contactInfo = dto.contactInfo;

    // Update student document if there are student fields
    if (Object.keys(studentFields).length > 0) {
      Object.assign(student, studentFields);
      await student.save();
    }

    // Update user document if there are user fields
    if (Object.keys(userFields).length > 0) {
      await this.userService.updateUser(
        student.basicUserDetails.toString(),
        userFields,
      );
    }

    // Return updated student with populated user details
    return await this.studentModel
      .findById(studentId)
      .populate('basicUserDetails', '-passwordHash')
      .populate('academicDetails');
  }
}
type StudentFilter = Record<string, unknown>;
