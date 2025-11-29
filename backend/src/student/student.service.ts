import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from './schema/student.schema';
import { ClientSession, Model, Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { USER_ROLE } from 'src/user/types/enum';
import { CreateStudentDto } from './dto/create-basic-student.dto';
import * as fs from 'fs';
import * as csv from 'fast-csv';
import { AcademicService } from 'src/academic/academic.service';
import { CSV_FIELD_MAP } from './constants';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,

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
      department: dto.department ?? null,
      backlogs: dto.backlogs ?? 0, // 🔥 NEW
      studentId: null, // will assign after student is created
    });

    /** STEP 3 — Create Student with academicDetails ref */
    const createdStudent = await this.studentModel.create(
      [
        {
          basicUserDetails: user._id,
          institute: new Types.ObjectId(dto.instituteId),
          academicDetails: academic._id,
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

      department: mapped.department,
      backlogs: mapped.backlogs ? Number(mapped.backlogs) : 0, // 🔥 NEW

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
  async getByUserId(userId: string): Promise<StudentDocument> {
    const student = await this.studentModel
      .findOne({ basicUserDetails: new Types.ObjectId(userId) })
      .populate(['basicUserDetails', 'academicDetails', 'institute'])
      .exec();

    if (!student) {
      throw new NotFoundException(
        `Student with basicUserDetails ${userId} not found`,
      );
    }

    return student;
  }

  async getAllStudents(): Promise<StudentDocument[]> {
    return this.studentModel
      .find()
      .populate(['basicUserDetails', 'academicDetails'])
      .exec();
  }
}
