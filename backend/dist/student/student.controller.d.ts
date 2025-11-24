import { StudentService } from './student.service';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    findAll(): string;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schema/student.schema").Student, {}, {}> & import("./schema/student.schema").Student & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    update(id: string, updateStudentDto: UpdateStudentDto): string;
    remove(id: string): string;
}
