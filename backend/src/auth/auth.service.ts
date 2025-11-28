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
   * User Login
   *******************************************/
  // async userLogin(userLoginDto: UserLoginBodyDto) {
  //   const { email, password } = userLoginDto;

  //   /****** Validate input **************/
  //   if (!email || !password) {
  //     throw new BadRequestException('Email and password are required');
  //   }

  //   /****** Find User **************/
  //   const user = await this.userService.findByEmail(email);

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   /****** Validate Password **************/
  //   const isValidPassword = await user.comparePassword(password);

  //   if (!isValidPassword) {
  //     throw new UnauthorizedException('Invalid email or password');
  //   }

  //   /****** Sanitize User **************/
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   const { passwordHash, ...sanitizedUser } = user.toObject();

  //   /****** Generate Token **************/
  //   const token = this.jwtService.sign(payload);

  //   return {
  //     user: sanitizedUser,
  //     token,
  //     expires_in: Number(process.env.JWT_EXPIRES_IN_MILI),
  //     msg: `User ${user.name} (role: ${user.role}) successfully logged in`,
  //   };
  // }

  // async me(user: JwtPayload) {
  //   const userData = await this.userService.findById(user.sub);

  //   if (!userData) {
  //     throw new NotFoundException('User not found');
  //   }

  //   // Convert document → plain object
  //   const obj = userData.toObject();

  //   // Remove password from output
  //   const { passwordHash, ...sanitizedUser } = obj;

  //   return {
  //     userData: sanitizedUser,
  //     msg: `User ${user.name} (role: ${user.role}) authenticated successfully`,
  //   };
  // }

  async registerInstitute(dto: RegisterInstituteDto): Promise<AuthResponse> {
    console.log(dto, 'dto');

    /****** 1. Create admin profile **************/
    const createAdminDto: CreateAdminDto = {
      contactInfo: dto.admin_contactInfo,
      email: dto.admin_email,
      gender: dto.admin_gender,
      name: dto.admin_name,
      password: dto.admin_password,
    };
    const admin = await this.adminService.createAdmin(createAdminDto);

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
    const institute =
      await this.instituteService.createInstitute(createInstituteDto);

    /****** 3. Link admin <-> institute **************/
    const joinedAdmin = await this.adminService.joinInstitute(
      admin._id.toString(),
      institute._id.toString(),
    );

    if (!joinedAdmin) {
      throw new NotFoundException('Admin not found');
    }

    /****** 4. Generate auth token **************/
    const user = joinedAdmin.basicUserDetails as UserDocument;

    const payload: JwtPayload = {
      email: user.email,
      name: user.name,
      role: user.role,
      instituteId: joinedAdmin.institute!._id.toString(),
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
  }
}
