import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './schema/student.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { AcademicService } from 'src/academic/academic.service';
import { CreateStudentAdminDto } from './dto/create-student-admin.dto';
import { JwtPayload } from 'src/auth/types/auth.type';
import * as multer from 'multer';
export interface BulkUploadError {
    student: any;
    error: any;
}
export declare class StudentService {
    private studentModel;
    private readonly userService;
    private readonly academicService;
    constructor(studentModel: Model<Student>, userService: UserService, academicService: AcademicService);
    createProfile(userId: string, institute: string): Promise<import("mongoose").Document<unknown, {}, Student, {}, {}> & Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findById(id: string): Promise<(import("mongoose").FlattenMaps<{
        basicUserDetails: import("mongoose").Types.ObjectId;
        acadmicDetails: import("mongoose").Types.ObjectId;
        assignedFaculty: import("mongoose").Types.ObjectId;
        activities: import("mongoose").Types.ObjectId[];
        instituteId: import("mongoose").Types.ObjectId;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    createStudentFromAdmin(dto: CreateStudentAdminDto): Promise<(import("mongoose").Document<unknown, {}, Student, {}, {}> & Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    create(dto: CreateStudentAdminDto): Promise<(import("mongoose").Document<unknown, {}, Student, {}, {}> & Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    uploadBulk(file: multer.File, user: JwtPayload): Promise<{
        message: string;
        createdCount: number;
        errorCount: number;
        errors: BulkUploadError[];
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Student, {}, {}> & Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, Student, {}, {}> & Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    update(id: string, updateStudentDto: UpdateStudentDto): Promise<(import("mongoose").Document<unknown, {}, Student, {}, {}> & Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    remove(id: string): Promise<string>;
    addActivity(studentId: string, activityId: string): Promise<(import("mongoose").Document<unknown, {}, Student, {}, {}> & Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
