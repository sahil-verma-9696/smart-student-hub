import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    create(createStudentDto: CreateStudentDto): string;
    createBulk(createStudentDto: CreateStudentDto[]): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateStudentDto: UpdateStudentDto): string;
    remove(id: string): string;
}
