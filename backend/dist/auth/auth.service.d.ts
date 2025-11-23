import InstitueRegistrationDto from './dto/institute-registration.dto';
import { InstituteService } from 'src/institute/institute.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from 'src/student/student.service';
import StudentRegistrationBodyDto from './dto/student-registration-body.dto';
import { UserLoginBodyDto } from './dto/user-login-body.dto.';
export declare class AuthService {
    private readonly instituteService;
    private readonly adminService;
    private readonly userService;
    private readonly jwtService;
    private readonly studentService;
    constructor(instituteService: InstituteService, adminService: AdminService, userService: UserService, jwtService: JwtService, studentService: StudentService);
    instituteRegistration(data: InstitueRegistrationDto): Promise<{
        data: {
            institute: import("mongoose").Document<unknown, {}, import("../institute/schemas/institute.schema").default, {}, {}> & import("../institute/schemas/institute.schema").default & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            };
            admin: import("mongoose").Document<unknown, {}, import("../admin/schema/admin.schema").Admin, {}, {}> & import("../admin/schema/admin.schema").Admin & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            };
            user: import("mongoose").Document<unknown, {}, import("../user/schema/user.schema").UserDocument, {}, {}> & import("../user/schema/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & import("../user/schema/user.schema").UserMethods & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            };
            token: string;
            expires_in: string | undefined;
        };
        msg: string;
    }>;
    studentRegistration(data: StudentRegistrationBodyDto, instituteId: string): Promise<{
        data: {
            user: import("mongoose").Document<unknown, {}, import("../user/schema/user.schema").UserDocument, {}, {}> & import("../user/schema/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & import("../user/schema/user.schema").UserMethods & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            };
            studentData: import("mongoose").Document<unknown, {}, import("../student/schema/student.schema").Student, {}, {}> & import("../student/schema/student.schema").Student & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            };
            token: string;
        };
        msg: string;
    }>;
    userLogin(userLoginDto: UserLoginBodyDto): Promise<{
        user: {
            userId: string;
            name: string;
            email: string;
            role: string;
            gender: string;
            contactInfo: import("../user/schema/user.schema").ContactInfo;
            instituteId: import("mongoose").Types.ObjectId;
            adminId?: import("mongoose").Types.ObjectId;
            studentId?: import("mongoose").Types.ObjectId;
            facultyId?: import("mongoose").Types.ObjectId;
            _id: import("mongoose").Types.ObjectId;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            id?: any;
            isNew: boolean;
            schema: import("mongoose").Schema;
            comparePassword(plainPassword: string): Promise<boolean>;
            __v: number;
        };
        token: string;
        expires_in: number;
        msg: string;
    }>;
}
