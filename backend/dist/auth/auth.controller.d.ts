import { AuthService } from './auth.service';
import InstitueRegistrationDto from './dto/institute-registration.dto';
import FacultyRegistrationDto from './dto/faculty-registration.dto';
import StudentRegistrationBodyDto from './dto/student-registration-body.dto';
export declare class AuthController {
    authService: AuthService;
    constructor(authService: AuthService);
    register(body: InstitueRegistrationDto): Promise<{
        msg: string;
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
        user: import("mongoose").Document<unknown, {}, import("../user/schema/user.schema").User, {}, {}> & import("../user/schema/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        token: string;
    }>;
    studentRegistration(body: StudentRegistrationBodyDto, instituteId: string): Promise<{
        msg: string;
        user: import("mongoose").Document<unknown, {}, import("../user/schema/user.schema").User, {}, {}> & import("../user/schema/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        studentData: import("mongoose").Document<unknown, {}, import("../student/schema/student.schema").Student, {}, {}> & import("../student/schema/student.schema").Student & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    facultyRegistration(body: FacultyRegistrationDto): Promise<{
        msg: string;
        facultyData: any;
    }>;
}
