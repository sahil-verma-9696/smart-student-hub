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
  ) { }

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
    });

    /**
     *  Create Admin profile
     */
    const admin = await this.adminService.create(user._id, institute._id.toString());

    // Refetch user to get updated adminId
    const updatedUser = await this.userService.findById(user._id.toString());

    if (!updatedUser) {
      throw new BadRequestException('Failed to fetch updated user');
    }

    /****** Sanitize User **************/

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...sanitizedUser } = user.toObject();

    /****** Generate Token **************/
    const payload = await this.buildJwtPayload(updatedUser);
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
     *  Create User (role = student)
     *********************************/
    const user = await this.userService.create({
      passwordHash: password,
      userId: `STU${Date.now()}`, // Generate unique userId
      contactInfo: data.contactInfo,
      email: data.email,
      name: data.name,
      role: 'student',
      gender: data.gender,
    });

    /********************************
     *  Create Student Profile
     ********************************/
    const student = await this.studentService.createProfile(user._id.toString(), instituteId);

    // Refetch user to get updated studentId
    const updatedUser = await this.userService.findById(user._id.toString());

    if (!updatedUser) {
      throw new BadRequestException('Failed to fetch updated user');
    }

    /****** Sanitize User **************/
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...sanitizedUser } = user.toObject();

    /****** Generate Token **************/
    const payload = await this.buildJwtPayload(updatedUser);
    const token = this.jwtService.sign(payload);
    return {
      user: sanitizedUser,
      student,
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
      userId: `FAC${Date.now()}`, // Generate unique userId
      email: data.email,
      name: data.name,
      gender: data.gender,
      contactInfo: data.contactInfo,
      passwordHash: password,
      role: 'faculty',
    });

    /** Create Faculty profile */
    const faculty = await this.facultyService.createProfile(user._id.toString(), instituteId);

    // Refetch user to get updated facultyId
    const updatedUser = await this.userService.findById(user._id.toString());

    if (!updatedUser) {
      throw new BadRequestException('Failed to fetch updated user');
    }

    /********************************
     *  Sanitize User
     ********************************/
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...sanitizedUser } = user.toObject();

    /****** Generate Token **************/
    const payload = await this.buildJwtPayload(updatedUser);
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
    const payload = await this.buildJwtPayload(user);
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

    // Rebuild the JWT payload with fresh data from the database
    // This ensures the frontend gets the latest instituteId, studentId, facultyId, adminId
    const freshPayload = await this.buildJwtPayload(userData);
    
    return {
      userData: freshPayload,
      msg: `User ${freshPayload.name} (role: ${freshPayload.role}) authenticated successfully`,
    };
  }

  private async buildJwtPayload(user: User): Promise<JwtPayload> {
    let instituteId = '';
    let studentId: string | undefined = undefined;
    let facultyId: string | undefined = undefined;
    let adminId: string | undefined = undefined;

    // Get instituteId from role-specific profile
    if (user.role === 'admin' && user.adminId) {
      const admin = await this.adminService.findById(user.adminId.toString());
      instituteId = admin?.instituteId?.toString() || '';
      adminId = user.adminId.toString();
    } else if (user.role === 'student' && user.studentId) {
      const student = await this.studentService.findById(user.studentId.toString());
      instituteId = student?.instituteId?.toString() || '';
      studentId = user.studentId.toString();
    } else if (user.role === 'faculty' && user.facultyId) {
      const faculty = await this.facultyService.findById(user.facultyId.toString());
      instituteId = faculty?.instituteId?.toString() || '';
      facultyId = user.facultyId.toString();
    }

    return {
      sub: user._id.toString() as string,
      userId: user.userId,
      email: user.email,
      role: user.role,
      instituteId,
      name: user.name,
      studentId,
      facultyId,
      adminId,
    };
  }
}
