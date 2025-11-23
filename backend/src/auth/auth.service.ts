import { Injectable } from '@nestjs/common';
import { Admin } from './types/auth.type';
import InstitueRegistrationDto from './dto/institute-registration.dto';
import { InstituteService } from 'src/institute/institute.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly instituteService: InstituteService,
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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
      },
      msg: 'Institute Successfully Registered',
    };
  }

  async studentRegistration(data) {
    const studentData = { ...data, role: 'student' };
    return {
      data: { studentData },
      msg: 'Student Successfully Registered',
    };
  }
}
