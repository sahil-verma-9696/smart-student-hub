import { StudentDocument } from './schema/student.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
export declare class StudentService {
    private studentModel;
    private readonly userService;
    constructor(studentModel: Model<StudentDocument>, userService: UserService);
    getByUserId(userId: string): Promise<StudentDocument>;
}
