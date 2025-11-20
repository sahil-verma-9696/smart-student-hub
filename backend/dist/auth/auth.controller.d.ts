import { AuthService } from './auth.service';
import AdminRegistrationDto from './dto/adminRegistration.dto';
import InstitueRegistrationDto from './dto/instituteRegistration.dto';
export declare class AuthController {
    authService: AuthService;
    constructor(authService: AuthService);
    register(istituteRegistrationDto: InstitueRegistrationDto): {
        data: InstitueRegistrationDto;
        msg: string;
    };
    adminRegistration(adminRegisterDto: AdminRegistrationDto): Promise<unknown>;
    studentRegistration(adminRegisterDto: AdminRegistrationDto): Promise<unknown>;
}
