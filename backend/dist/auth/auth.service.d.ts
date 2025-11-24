import InstitueRegistrationDto from './dto/institute-registration-body.dto';
import { InstituteService } from 'src/institute/institute.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from 'src/student/student.service';
import StudentRegistrationBodyDto from './dto/student-registration-body.dto';
import { UserLoginBodyDto } from './dto/user-login-body.dto.';
import FacultyRegistrationDto from './dto/faculty-registration-body.dto';
import { FacultyService } from 'src/faculty/faculty.service';
import { JwtPayload } from './types/auth.type';
export declare class AuthService {
    private readonly instituteService;
    private readonly adminService;
    private readonly userService;
    private readonly jwtService;
    private readonly studentService;
    private readonly facultyService;
    constructor(instituteService: InstituteService, adminService: AdminService, userService: UserService, jwtService: JwtService, studentService: StudentService, facultyService: FacultyService);
    instituteRegistration(data: InstitueRegistrationDto): Promise<{
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
    studentRegistration(data: StudentRegistrationBodyDto, instituteId: string): Promise<{
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
    facultyRegistration(data: FacultyRegistrationDto, instituteId: string): Promise<{
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
    userLogin(userLoginDto: UserLoginBodyDto): Promise<{
        user: any;
        token: string;
        expires_in: number;
        msg: string;
    }>;
    me(user: JwtPayload): Promise<{
        userData: null;
        payload: JwtPayload;
        msg: string;
    }>;
    private buildJwtPayload;
}
