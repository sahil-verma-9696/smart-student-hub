import { StudentService } from './student.service';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateStudentDto: UpdateStudentDto): string;
    remove(id: string): string;
}
