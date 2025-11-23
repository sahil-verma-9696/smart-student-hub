import InstitueRegistrationDto from './dto/institute-registration.dto';
import { InstituteService } from 'src/institute/institute.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from 'src/student/student.service';
import StudentRegistrationBodyDto from './dto/student-registration-body.dto';
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
            user: import("mongoose").Document<unknown, {}, import("../user/schema/user.schema").User, {}, {}> & import("../user/schema/user.schema").User & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
            token: string;
            expires_in: string | undefined;
        };
        msg: string;
    }>;
    studentRegistration(data: StudentRegistrationBodyDto, instituteId: string): Promise<{
        data: {
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
            token: string;
        };
        msg: string;
    }>;
}
