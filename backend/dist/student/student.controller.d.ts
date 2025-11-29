import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-basic-student.dto';
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
    findAll(): Promise<import("./schema/student.schema").StudentDocument[]>;
}
