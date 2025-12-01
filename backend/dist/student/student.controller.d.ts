import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-basic-student.dto';
import { BulkCreateStudentDto } from './dto/create-basic-student-bulk.dto';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    create(createStudentDto: CreateStudentDto): Promise<import("./schema/student.schema").StudentDocument>;
    createOrBulkUpload(file: Express.Multer.File | undefined): Promise<{
        total: number;
        successCount: number;
        failedCount: number;
        success: import("./schema/student.schema").StudentDocument[];
        failed: Array<{
            rowNumber: number;
            row: CreateStudentDto;
            reason: string;
        }>;
    }>;
    createOrBulkUploadJson(body: BulkCreateStudentDto): Promise<{
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
    findAll(): Promise<import("./schema/student.schema").StudentDocument[]>;
}
