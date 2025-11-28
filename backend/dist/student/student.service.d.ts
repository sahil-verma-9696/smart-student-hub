import { StudentDocument } from './schema/student.schema';
import { ClientSession, Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { CreateStudentDto } from './dto/create-basic-student.dto';
export declare class StudentService {
    private studentModel;
    private readonly userService;
    constructor(studentModel: Model<StudentDocument>, userService: UserService);
    create(dto: CreateStudentDto, session?: ClientSession): Promise<StudentDocument>;
    getByUserId(userId: string): Promise<StudentDocument>;
}
