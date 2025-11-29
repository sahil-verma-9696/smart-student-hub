import { AuthService } from './auth.service';
import * as authType from './types/auth.type';
import { RegisterInstituteDto } from './dto/register-institute.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    authService: AuthService;
    constructor(authService: AuthService);
    register(body: RegisterInstituteDto): Promise<authType.AuthResponse>;
    userLogin(userLoginDto: LoginDto): Promise<{
        user: import("../user/schema/user.schema").UserDocument;
        token: string;
        expires_in: number;
        msg: string;
    }>;
    getMe(req: authType.AuthenticatedRequest): Promise<{
        userData: import("../faculty/schemas/faculty.schema").FacultyDocument | import("../student/schema/student.schema").StudentDocument | import("../admin/schema/admin.schema").AdminDocument;
        msg: string;
    }>;
}
