import { StudentDocument } from './schema/student.schema';
import { ClientSession, Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { CreateStudentDto } from './dto/create-basic-student.dto';
export declare class StudentService {
    private readonly studentModel;
    private readonly userService;
    private readonly logger;
    constructor(studentModel: Model<StudentDocument>, userService: UserService);
    private validateInstitute;
    createStudent(dto: CreateStudentDto, session?: ClientSession): Promise<StudentDocument>;
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
