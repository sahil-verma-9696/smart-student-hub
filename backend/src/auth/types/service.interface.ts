import { UserDocument } from 'src/user/schema/user.schema';
import { RegisterInstituteDto } from '../dto/register-institute.dto';
import { AuthResponse } from './auth.type';
import { LoginDto } from '../dto/login.dto';

export interface IAuthService {
  /**
   * Register a new institute along with its first admin.
   * Steps:
   * 1. Create admin profile (AdminService.createAdmin)
   * 2. Create institute (InstituteService.createInstitute)
   * 3. Link admin <-> institute (AdminService.joinInstitute)
   * 4. Generate auth token
   */
  registerInstitute(dto: RegisterInstituteDto): Promise<AuthResponse>;

  /**
   * Login a user using email + password.
   * Steps:
   * 1. Fetch user by email
   * 2. Validate password
   * 3. Generate access token
   */
  login(dto: LoginDto): Promise<AuthResponse>;

  /**
   * Validates a user's credentials.
   * Uses UserService.validateUserCredentials().
   */
  validateUser(email: string, password: string): Promise<UserDocument>;

  /**
   * Generate JWT token for any user.
   * Should include userId + role + instituteId (if exists).
   */
  generateToken(user: UserDocument): Promise<string>;

  /**
   * Refresh access token if your system supports refresh tokens.
   */
  refreshToken(refreshToken: string): Promise<AuthResponse>;
}
