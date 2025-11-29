import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import InstitueRegistrationDto from './dto/institute-registration-body.dto';
import { InstituteService } from 'src/institute/institute.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from 'src/student/student.service';
import StudentRegistrationBodyDto from './dto/student-registration-body.dto';
import { UserLoginBodyDto } from './dto/user-login-body.dto.';
import FacultyRegistrationDto from './dto/faculty-registration-body.dto';
import { FacultyService } from 'src/faculty/faculty.service';
import { User } from 'src/user/schema/user.schema';
import { JwtPayload } from './types/auth.type';

@Injectable()
export class AuthService {
  /************************************
   * Dependencies injection
   *********************************/
  constructor(
    private readonly instituteService: InstituteService,
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly studentService: StudentService,
    private readonly facultyService: FacultyService,
  ) {}

  /*******************************************
   * Register Institute + User + Admin + Token
   *******************************************/
  async instituteRegistration(data: InstitueRegistrationDto) {
    /************************************
     *  Destructure data
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
     *  Create Institute
     *********************************/
    const institute = await this.instituteService.create(instituteData);

    /************************************
     *  Create User (role = admin)
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
     *  Create Admin profile
     */
    const admin = await this.adminService.create(user._id);

    /****** Sanitize User **************/

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...sanitizedUser } = user.toObject();

    /****** Generate Token **************/
    const payload = this.buildJwtPayload(user);
    const token = this.jwtService.sign(payload);
    return {
      institute,
      admin,
      user,
      token,
      expires_in: process.env.JWT_EXPIRES_IN_MILI,
      msg: 'Institute Successfully Registered',
    };
  }

  /*******************************************
   * Register User & Student & Token
   *******************************************/
  async studentRegistration(
    data: StudentRegistrationBodyDto,
    instituteId: string,
  ) {
    const { password } = data || {};
    /************************************
     *  Create User (role = admin)
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
     *  Create Student profile
     ********************************/
    const studentData = await this.studentService.create(user._id.toString());

    /****** Sanitize User **************/
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...sanitizedUser } = user.toObject();

    /****** Generate Token **************/
    const payload = this.buildJwtPayload(user);
    const token = this.jwtService.sign(payload);
    return {
      user: sanitizedUser,
      studentData,
      token,
      expires_in: process.env.JWT_EXPIRES_IN_MILI,
      msg: 'Student Successfully Registered',
    };
  }

  /*******************************************
   *Register User & Faculty & Token
   *******************************************/
  async facultyRegistration(data: FacultyRegistrationDto, instituteId: string) {
    const { password } = data;

    /********************************
     *  Create User (role = faculty)
     ********************************/
    const user = await this.userService.create({
      userId: 'FAC001', // or generate automatically
      email: data.email,
      name: data.name,
      gender: data.gender,
      contactInfo: data.contactInfo,
      passwordHash: password,
      role: 'faculty',
      instituteId,
    });

    /** Create Faculty profile */
    const faculty = await this.facultyService.createProfile(user._id.toString());

    /********************************
     *  Sanitize User
     ********************************/
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...sanitizedUser } = user.toObject();

    /****** Generate Token **************/
    const payload = this.buildJwtPayload(user);
    const token = this.jwtService.sign(payload);

    return {
      user: sanitizedUser,
      faculty,
      token,
      expires_in: Number(process.env.JWT_EXPIRES_IN_MILI),
      msg: 'Faculty Successfully Registered',
    };
  }

  /*******************************************
   * User Login
   *******************************************/
  async userLogin(userLoginDto: UserLoginBodyDto) {
    const { email, password } = userLoginDto;

    /****** Validate input **************/
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    /****** Find User **************/
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    /****** Validate Password **************/
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    /****** Sanitize User **************/
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...sanitizedUser } = user.toObject();

    /****** Generate Token **************/
    const payload = this.buildJwtPayload(user);
    const token = this.jwtService.sign(payload);

    return {
      user: sanitizedUser,
      token,
      expires_in: Number(process.env.JWT_EXPIRES_IN_MILI),
      msg: `User ${user.name} (role: ${user.role}) successfully logged in`,
    };
  }

  async me(user: JwtPayload) {
    const userData = await this.userService.findById(user.sub);

    if (!userData) {
      throw new NotFoundException('User not found');
    }

    // Convert document → plain object
    const obj = userData.toObject();

    // Remove password from output
    const { passwordHash, ...sanitizedUser } = obj;

    return {
      userData: user,
      msg: `User ${user.name} (role: ${user.role}) authenticated successfully`,
    };
  }

  private buildJwtPayload(user: User): JwtPayload {
    return {
      sub: user._id.toString() as string,
      userId: user.userId,
      email: user.email,
      role: user.role,
      instituteId: user.instituteId.toString(),
      name: user.name,
    };
  }
}
