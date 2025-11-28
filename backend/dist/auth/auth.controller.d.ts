import { AuthService } from './auth.service';
import * as authType from './types/auth.type';
import { RegisterInstituteDto } from './dto/register-institute.dto';
export declare class AuthController {
    authService: AuthService;
    constructor(authService: AuthService);
    register(body: RegisterInstituteDto): Promise<authType.AuthResponse>;
}
