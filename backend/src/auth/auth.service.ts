import { Injectable } from '@nestjs/common';
import { Admin } from './types/auth.type';
import InstitueRegistrationDto from './dto/institute-registration.dto';
import { InstituteService } from 'src/institute/institute.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from 'src/student/student.service';
import StudentRegistrationDto from './dto/student-registration-body.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly instituteService: InstituteService,
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly studentService: StudentService,
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
    const { password } = data || {};
    /************************************
     * STEP 1: Create User (role = admin)
     *********************************/
    const user = await this.userService.create({
      passwordHash: password,
      userId: '22CSME017',
      ...data,
    });

    /**
     * STEP 2: Create Student profile
     */
    const studentData = await this.studentService.create(user._id.toString());
    return {
      data: { user, studentData },
      msg: 'Student Successfully Registered',
    };
  }

  async facultyRegistration(data) {
    const facultyData = { ...data, role: 'faculty' };
    return {
      data: { facultyData },
      msg: 'Faculty Successfully Registered',
    };
  }
}
