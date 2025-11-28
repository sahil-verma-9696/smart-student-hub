import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InstituteService } from 'src/institute/institute.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from 'src/student/student.service';
import { FacultyService } from 'src/faculty/faculty.service';
import { UserDocument } from 'src/user/schema/user.schema';
import { AuthResponse, JwtPayload } from './types/auth.type';
import { RegisterInstituteDto } from './dto/register-institute.dto';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import CreateInstituteDto from 'src/institute/dto/create-institute.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { StudentDocument } from 'src/student/schema/student.schema';
import { AdminDocument } from 'src/admin/schema/admin.schema';
import { FacultyDocument } from 'src/faculty/schemas/faculty.schema';
import { USER_ROLE } from 'src/user/types/enum';

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
    @InjectConnection() private readonly connection: Connection,
  ) {}
  /*******************************************
   * User Login
   *******************************************/
  async userLogin(userLoginDto: LoginDto) {
    const { email, password } = userLoginDto;

    /****** Validate input **************/
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    /****** Find User **************/
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    /****** Validate Password **************/
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: user._id.toString(),
      role: user.role,
      name: user.name,
      userId: user._id.toString(),
    };

    /****** Generate Token **************/
    const token = this.jwtService.sign(payload);

    return {
      user,
      token,
      expires_in: Number(process.env.JWT_EXPIRES_IN_MILI),
      msg: `User ${user.name} (role: ${user.role}) successfully logged in`,
    };
  }

  async me(user: JwtPayload) {
    let userData: StudentDocument | AdminDocument | FacultyDocument | null =
      null;
    const role = user.role as USER_ROLE;

    switch (role) {
      case USER_ROLE.STUDENT:
        userData = await this.studentService.getByUserId(user.userId);
        break;
      case USER_ROLE.FACULTY:
        userData = await this.facultyService.getByUserId(user.userId);
        break;
      case USER_ROLE.ADMIN:
        userData = await this.adminService.getByUserId(user.userId);
        break;
      default:
        break;
    }
    if (!userData) {
      throw new NotFoundException('User not found');
    }

    return {
      userData,
      msg: `User ${user.name} (role: ${user.role}) authenticated successfully`,
    };
  }

  async registerInstitute(dto: RegisterInstituteDto): Promise<AuthResponse> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      /****** 1. Create user + admin profile **************/
      const createAdminDto: CreateAdminDto = {
        contactInfo: dto.admin_contactInfo,
        email: dto.admin_email,
        gender: dto.admin_gender,
        name: dto.admin_name,
        password: dto.admin_password,
      };

      const admin = await this.adminService.createAdmin(
        createAdminDto,
        session,
      );

      /****** 2. Create institute **************/
      const createInstituteDto: CreateInstituteDto = {
        address_line1: dto.inst_address_line1,
        city: dto.inst_city,
        institute_name: dto.inst_name,
        institute_type: dto.inst_type,
        official_email: dto.inst_email,
        official_phone: dto.inst_phone,
        pincode: dto.inst_pincode,
        state: dto.inst_state,
        is_affiliated: dto.inst_is_affiliated,
        affiliation_id: dto.inst_affiliation_id,
        affiliation_university: dto.inst_affiliation_university,
      };

      const institute = await this.instituteService.createInstitute(
        createInstituteDto,
        session,
      );

      /****** 3. Link admin <-> institute **************/
      const joinedAdmin = await this.adminService.joinInstitute(
        admin._id.toString(),
        institute._id.toString(),
        session,
      );

      if (!joinedAdmin) {
        throw new NotFoundException('Admin not found after linking');
      }

      /****** 4. COMMIT TRANSACTION **************/
      await session.commitTransaction();
      session.endSession();

      /****** 5. Generate auth token **************/
      const user = joinedAdmin.basicUserDetails as UserDocument;

      const payload: JwtPayload = {
        email: user.email,
        name: user.name,
        role: user.role,
        sub: joinedAdmin._id.toString(),
        userId: joinedAdmin._id.toString(),
      };

      const token = this.jwtService.sign(payload);

      return {
        user: joinedAdmin,
        institute,
        token,
        expires_in: process.env.JWT_EXPIRES_IN_MILI!,
        msg: 'Institute Successfully Registered',
      };
    } catch (error) {
      /****** ROLLBACK ON FAILURE **************/
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
