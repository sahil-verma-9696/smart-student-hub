import { StudentService } from './student.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import * as multer from 'multer';
import { CreateStudentAdminDto } from './dto/create-student-admin.dto';
import type { AuthenticatedRequest } from 'src/auth/types/auth.type';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    createStudent(dto: CreateStudentAdminDto, req: AuthenticatedRequest): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schema/student.schema").Student, {}, {}> & import("./schema/student.schema").Student & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null;
    }>;
    uploadBulk(file: multer.File, req: AuthenticatedRequest): Promise<{
        message: string;
        createdCount: number;
        errorCount: number;
        errors: import("./student.service").BulkUploadError[];
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schema/student.schema").Student, {}, {}> & import("./schema/student.schema").Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schema/student.schema").Student, {}, {}> & import("./schema/student.schema").Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    update(id: string, updateStudentDto: UpdateStudentDto): Promise<(import("mongoose").Document<unknown, {}, import("./schema/student.schema").Student, {}, {}> & import("./schema/student.schema").Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    remove(id: string): Promise<string>;
}
