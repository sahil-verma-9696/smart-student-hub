import { Admin } from './types/auth.type';
import InstitueRegistrationDto from './dto/instituteRegistration.dto';
export declare class AuthService {
    instituteRegistration(data: InstitueRegistrationDto): {
        data: InstitueRegistrationDto;
        msg: string;
    };
    adminRegistration(data: Admin): Promise<unknown>;
}
