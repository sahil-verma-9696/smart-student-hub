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
        user: never;
        token: string;
        expires_in: string | undefined;
        msg: string;
    }>;
    userLogin(userLoginDto: UserLoginBodyDto): Promise<{
        user: any;
        token: string;
        expires_in: number;
        msg: string;
    }>;
    studentRegistration(body: StudentRegistrationBodyDto, instituteId: string): Promise<{
        user: any;
        studentData: import("mongoose").Document<unknown, {}, import("../student/schema/student.schema").Student, {}, {}> & import("../student/schema/student.schema").Student & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        token: string;
        expires_in: string | undefined;
        msg: string;
    }>;
    facultyRegistration(body: FacultyRegistrationDto, institueId: string): Promise<{
        user: any;
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
        userData: null;
        payload: authType.JwtPayload;
        msg: string;
    }>;
}
