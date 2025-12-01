import { StudentDocument } from './schema/student.schema';
import { ClientSession, Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { CreateStudentDto } from './dto/create-basic-student.dto';
import { AcademicService } from 'src/academic/academic.service';
import { BulkCreateStudentDto } from './dto/create-basic-student-bulk.dto';
export declare class StudentService {
    private readonly studentModel;
    private readonly userService;
    private readonly academicService;
    private readonly logger;
    constructor(studentModel: Model<StudentDocument>, userService: UserService, academicService: AcademicService);
    private validateInstitute;
    createStudent(dto: CreateStudentDto, session?: ClientSession): Promise<StudentDocument>;
    bulkCreateStudents(dto: BulkCreateStudentDto): Promise<{
        status: string;
        total: number;
        created: number;
        failed: number;
        successes: {
            email: string;
            roll_number?: string;
            studentId?: string;
        }[];
        failures: {
            email: string;
            roll_number?: string;
            reason?: string;
        }[];
    }>;
    bulkUploadStudents(csvPath: string): Promise<{
        total: number;
        successCount: number;
        failedCount: number;
        success: StudentDocument[];
        failed: Array<{
            rowNumber: number;
            row: CreateStudentDto;
            reason: string;
        }>;
    }>;
    private parseCsv;
    private mapCsvRowToStudentDto;
    getByUserId(userId: string): Promise<StudentDocument>;
    getAllStudents(): Promise<StudentDocument[]>;
}
