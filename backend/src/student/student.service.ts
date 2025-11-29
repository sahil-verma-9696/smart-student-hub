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

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
    private readonly userService: UserService,
  ) {}

  /********************************************
   * VALIDATE instituteId BEFORE creating user
   ********************************************/
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

  /********************************************
   * 1. CREATE SINGLE STUDENT
   ********************************************/
  async createStudent(
    dto: CreateStudentDto,
    session?: ClientSession,
  ): Promise<StudentDocument> {
    await this.studentModel.syncIndexes();

    // Ensure valid institute
    await this.validateInstitute(dto.instituteId);

    // Create user
    const userDto: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: dto.password,
      gender: dto.gender,
      role: USER_ROLE.STUDENT,
      contactInfo: dto.contactInfo,
    };

    const user = await this.userService.createUser(userDto, session);

    // Create student profile
    const created = await this.studentModel.create(
      [
        {
          basicUserDetails: user._id,
          institute: new Types.ObjectId(dto.instituteId),
        },
      ],
      { session },
    );

    return created[0].populate('basicUserDetails');
  }

  /********************************************
   * 2. BULK UPLOAD CSV
   ********************************************/
  async bulkUploadStudents(csvPath: string): Promise<{
    total: number;
    successCount: number;
    failedCount: number;
    success: StudentDocument[];
    failed: Array<{ rowNumber: number; row: CreateStudentDto; reason: string }>;
  }> {
    const rows = await this.parseCsv(csvPath);

    const success: StudentDocument[] = [];
    const failed: Array<{
      rowNumber: number;
      row: CreateStudentDto;
      reason: string;
    }> = [];

    // Loop with row number
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const dto = this.mapCsvRowToStudentDto(row);

      try {
        const createdStudent = await this.createStudent(dto);
        success.push(createdStudent);
      } catch (err: unknown) {
        // Extract readable error
        const reason =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
              ? err
              : JSON.stringify(err);

        this.logger.error(
          `Bulk student row ${i + 1} failed | Email: ${dto.email} | Reason: ${reason}`,
        );

        failed.push({
          rowNumber: i + 1,
          row: dto,
          reason,
        });
      }
    }

    // Delete CSV file
    await fs.promises.unlink(csvPath).catch((err) => {
      this.logger.warn(`Failed to delete CSV ${csvPath}: ${err}`);
    });

    return {
      total: rows.length,
      successCount: success.length,
      failedCount: failed.length,
      success,
      failed,
    };
  }

  /********************************************
   * PARSE CSV STRICTLY
   ********************************************/
  private parseCsv(filePath: string): Promise<Record<string, string>[]> {
    const REQUIRED_COLUMNS = [
      'name',
      'email',
      'password',
      'gender',
      'phone',
      'instituteId',
    ];

    return new Promise((resolve, reject) => {
      const rows: Record<string, string>[] = [];
      let headersVerified = false;

      fs.createReadStream(filePath)
        .pipe(
          csv.parse<Record<string, string>, Record<string, string>>({
            headers: true,
            ignoreEmpty: true,
          }),
        )
        .on('headers', (headers: string[]) => {
          const missing = REQUIRED_COLUMNS.filter(
            (col) => !headers.includes(col),
          );

          if (missing.length > 0) {
            reject(
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

  /********************************************
   * MAP CSV → STUDENT DTO
   ********************************************/
  private mapCsvRowToStudentDto(row: Record<string, string>): CreateStudentDto {
    return {
      name: row.name.trim(),
      email: row.email.trim(),
      password: row.password.trim(),
      gender: row.gender.trim(),
      instituteId: row.instituteId.trim(),
      contactInfo: {
        phone: row.phone.trim(),
        alternatePhone: row.alternatePhone?.trim(),
        address: row.address?.trim(),
      },
    };
  }

  /********************************************
   * GET BY USER
   ********************************************/
  async getByUserId(userId: string): Promise<StudentDocument> {
    const student = await this.studentModel
      .findOne({ basicUserDetails: userId })
      .populate('basicUserDetails')
      .populate('institute')
      .exec();

    if (!student) {
      throw new NotFoundException(`Student with userId ${userId} not found`);
    }

    return student;
  }

  async getAllStudents(): Promise<StudentDocument[]> {
    return this.studentModel.find().populate('basicUserDetails').exec();
  }
}
