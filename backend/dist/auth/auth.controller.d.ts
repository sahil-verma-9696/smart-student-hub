import { AuthService } from './auth.service';
import InstitueRegistrationDto from './dto/institute-registration-body.dto';
import StudentRegistrationBodyDto from './dto/student-registration-body.dto';
import { UserLoginBodyDto } from './dto/user-login-body.dto.';
import FacultyRegistrationDto from './dto/faculty-registration-body.dto';
export declare class AuthController {
    authService: AuthService;
    constructor(authService: AuthService);
    register(body: InstitueRegistrationDto): Promise<any>;
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
    studentRegistration(body: StudentRegistrationBodyDto, instituteId: string): Promise<any>;
    facultyRegistration(body: FacultyRegistrationDto, institueId: string): Promise<{
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
        faculty: import("mongoose").Document<unknown, {}, import("../faculty/schemas/faculty.schema").Faculty, {}, {}> & import("../faculty/schemas/faculty.schema").Faculty & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        token: string;
        expires_in: number;
        msg: string;
    }>;
}
