import { AuthService } from './auth.service';
import InstitueRegistrationDto from './dto/institute-registration-body.dto';
import StudentRegistrationBodyDto from './dto/student-registration-body.dto';
import { UserLoginBodyDto } from './dto/user-login-body.dto.';
import FacultyRegistrationDto from './dto/faculty-registration-body.dto';
import * as authType from './types/auth.type';
export declare class AuthController {
    authService: AuthService;
    constructor(authService: AuthService);
    register(body: InstitueRegistrationDto): Promise<{
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
        user: import("mongoose").Document<unknown, {}, import("../user/schema/user.schema").UserDocument, {}, {}> & import("../user/schema/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & import("../user/schema/user.schema").UserMethods & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        token: string;
        expires_in: string | undefined;
        msg: string;
    }>;
    userLogin(userLoginDto: UserLoginBodyDto): Promise<{
        user: {
            userId: string;
            name: string;
            email: string;
            role: string;
            gender: string;
            contactInfo: import("../user/dto/contact-info.dto").ContactInfoDto;
            instituteId: import("mongoose").Types.ObjectId;
            adminId?: import("mongoose").Types.ObjectId;
            studentId?: import("mongoose").Types.ObjectId;
            facultyId?: import("mongoose").Types.ObjectId;
            _id: any;
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
    studentRegistration(body: StudentRegistrationBodyDto, instituteId: string): Promise<{
        user: {
            userId: string;
            name: string;
            email: string;
            role: string;
            gender: string;
            contactInfo: import("../user/dto/contact-info.dto").ContactInfoDto;
            instituteId: import("mongoose").Types.ObjectId;
            adminId?: import("mongoose").Types.ObjectId;
            studentId?: import("mongoose").Types.ObjectId;
            facultyId?: import("mongoose").Types.ObjectId;
            _id: any;
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
        studentData: import("mongoose").Document<unknown, {}, import("../student/schema/student.schema").Student, {}, {}> & import("../student/schema/student.schema").Student & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        token: string;
        expires_in: string | undefined;
        msg: string;
    }>;
    facultyRegistration(body: FacultyRegistrationDto, institueId: string): Promise<{
        user: {
            userId: string;
            name: string;
            email: string;
            role: string;
            gender: string;
            contactInfo: import("../user/dto/contact-info.dto").ContactInfoDto;
            instituteId: import("mongoose").Types.ObjectId;
            adminId?: import("mongoose").Types.ObjectId;
            studentId?: import("mongoose").Types.ObjectId;
            facultyId?: import("mongoose").Types.ObjectId;
            _id: any;
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
        faculty: import("mongoose").Document<unknown, {}, import("../faculty/schemas/faculty.schema").Faculty, {}, {}> & import("../faculty/schemas/faculty.schema").Faculty & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        token: string;
        expires_in: number;
        msg: string;
    }>;
    getMe(req: authType.AuthenticatedRequest): Promise<{
        userData: authType.JwtPayload;
        msg: string;
    }>;
}
