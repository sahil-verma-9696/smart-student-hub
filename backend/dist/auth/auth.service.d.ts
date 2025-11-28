import { InstituteService } from 'src/institute/institute.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from 'src/student/student.service';
import { FacultyService } from 'src/faculty/faculty.service';
import { AuthResponse } from './types/auth.type';
import { RegisterInstituteDto } from './dto/register-institute.dto';
export declare class AuthService {
    private readonly instituteService;
    private readonly adminService;
    private readonly userService;
    private readonly jwtService;
    private readonly studentService;
    private readonly facultyService;
    constructor(instituteService: InstituteService, adminService: AdminService, userService: UserService, jwtService: JwtService, studentService: StudentService, facultyService: FacultyService);
    registerInstitute(dto: RegisterInstituteDto): Promise<AuthResponse>;
}
