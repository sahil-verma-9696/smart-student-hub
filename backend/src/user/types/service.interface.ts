import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDocument } from '../schema/user.schema';

export interface IUserService {
  /**
   * Create a new base user account.
   * - Hashes password
   * - Validates unique email
   * - Sets role (admin/faculty/student)
   */
  createUser(dto: CreateUserDto): Promise<UserDocument>;

  /**
   * Fetch a user by ID.
   * Commonly used by AdminService, StudentService, FacultyService and AuthService.
   */
  getUserById(userId: string): Promise<UserDocument>;

  /**
   * Fetch a user by email.
   * Mainly used for login and validation.
   */
  getUserByEmail(email: string): Promise<UserDocument>;

  /**
   * Update basic user details.
   * Allows updating: name, gender, password, email.
   * (Role should NOT be updated casually, only by domain services.)
   */
  updateUser(userId: string, dto: UpdateUserDto): Promise<UserDocument>;

  /**
   * Validate a user's credentials during login.
   * - Fetch by email
   * - Compare hashed password
   * Returns the user if valid, throws error if invalid.
   */
  validateUserCredentials(
    email: string,
    password: string,
  ): Promise<UserDocument>;

  /**
   * Remove a user from the system.
   * Typically called after removing domain-specific profile (Admin/Student/Faculty).
   */
  deleteUser(userId: string): Promise<void>;
}
