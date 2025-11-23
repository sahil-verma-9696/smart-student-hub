import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import InstitueRegistrationDto from './dto/institute-registration.dto';
import { InstituteService } from 'src/institute/institute.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from 'src/student/student.service';
import StudentRegistrationBodyDto from './dto/student-registration-body.dto';
import { UserLoginBodyDto } from './dto/user-login-body.dto.';

@Injectable()
export class AuthService {
  constructor(
    private readonly instituteService: InstituteService,
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly studentService: StudentService,
  ) {}
  /************************************
   * Register Institute + User + Admin + Token
   * @returns {Promise<{data:{institute, admin, user, token, expires_in}, msg:string}>}
   *********************************/
  async instituteRegistration(data: InstitueRegistrationDto) {
    /************************************
     * STEP 0: Destructure data
     *********************************/
    const {
      admin_name,
      admin_email,
      admin_password,
      admin_contactInfo,
      admin_gender,
      ...instituteData
    } = data || {};

    /************************************
     * STEP 1: Create Institute
     *********************************/
    const institute = await this.instituteService.create(instituteData);

    /************************************
     * STEP 2: Create User (role = admin)
     *********************************/
    const user = await this.userService.create({
      userId: institute._id.toString(),
      email: admin_email,
      passwordHash: admin_password,
      name: admin_name,
      role: 'admin',
      contactInfo: admin_contactInfo,
      gender: admin_gender,
      instituteId: institute._id.toString(),
    });

    /**
     * STEP 3: Create Admin profile
     */
    const admin = await this.adminService.create(user._id.toString());

    /**
     * STEP 3: Generate JWT
     */
    const token = this.jwtService.sign({
      user_id: user._id,
      institute_id: institute._id,
      role: 'admin',
    });

    return {
      data: {
        institute,
        admin,
        user,
        token,
        expires_in: process.env.JWT_EXPIRES_IN_MILI,
      },
      msg: 'Institute Successfully Registered',
    };
  }

  async studentRegistration(
    data: StudentRegistrationBodyDto,
    instituteId: string,
  ) {
    const { password } = data || {};
    /************************************
     * STEP 1: Create User (role = admin)
     *********************************/
    const user = await this.userService.create({
      passwordHash: password,
      userId: '22CSME017',
      instituteId,
      contactInfo: data.contactInfo,
      email: data.email,
      name: data.name,
      role: 'student',
      gender: data.gender,
    });

    /********************************
     * STEP 2: Create Student profile
     ********************************/
    const studentData = await this.studentService.create(user._id.toString());

    /********************************
     * STEP 3: Generate JWT
     ********************************/
    const token = this.jwtService.sign({
      user_id: user._id,
      role: 'student',
    });

    return {
      data: { user, studentData, token },
      msg: 'Student Successfully Registered',
    };
  }

  async userLogin(userLoginDto: UserLoginBodyDto) {
    const { email, password } = userLoginDto;

    /*********************
     * Validate input
     *********************/
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    /*********************
     * Find user
     *********************/
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    /*********************
     * Validate Password
     *********************/
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    /*********************
     * Generate Token
     *********************/
    const token = this.jwtService.sign({
      sub: user._id.toString(), // Standard JWT claim
      role: user.role,
      instituteId: user.instituteId,
    });

    /*********************
     * Remove passwordHash before returning
     *********************/
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...sanitizedUser } = user.toObject();

    return {
      user: sanitizedUser,
      token,
      expires_in: Number(process.env.JWT_EXPIRES_IN_MILI),
      msg: `User ${user.name} (role: ${user.role}) successfully logged in`,
    };
  }

  // facultyRegistration(data: any) {
  //   return {
  //     data,
  //     msg: 'Faculty Successfully Registered',
  //   };
  // }
}
