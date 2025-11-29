import { InstituteService } from 'src/institute/institute.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from 'src/student/student.service';
import { FacultyService } from 'src/faculty/faculty.service';
import { UserDocument } from 'src/user/schema/user.schema';
import { AuthResponse, JwtPayload } from './types/auth.type';
import { RegisterInstituteDto } from './dto/register-institute.dto';
import { Connection } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { StudentDocument } from 'src/student/schema/student.schema';
import { AdminDocument } from 'src/admin/schema/admin.schema';
import { FacultyDocument } from 'src/faculty/schemas/faculty.schema';
export declare class AuthService {
    private readonly instituteService;
    private readonly adminService;
    private readonly userService;
    private readonly jwtService;
    private readonly studentService;
    private readonly facultyService;
    private readonly connection;
    constructor(instituteService: InstituteService, adminService: AdminService, userService: UserService, jwtService: JwtService, studentService: StudentService, facultyService: FacultyService, connection: Connection);
    userLogin(userLoginDto: LoginDto): Promise<{
        user: UserDocument;
        token: string;
        expires_in: number;
        msg: string;
    }>;
    me(user: JwtPayload): Promise<{
        userData: FacultyDocument | StudentDocument | AdminDocument;
        msg: string;
    }>;
    registerInstitute(dto: RegisterInstituteDto): Promise<AuthResponse>;
}
