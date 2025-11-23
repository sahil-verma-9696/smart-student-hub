import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './schema/student.schema';
import { Model } from 'mongoose';
export declare class StudentService {
    private studentModel;
    constructor(studentModel: Model<Student>);
    create(userId: string): Promise<import("mongoose").Document<unknown, {}, Student, {}, {}> & Student & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateStudentDto: UpdateStudentDto): string;
    remove(id: number): string;
}
