import { Injectable } from '@nestjs/common';
import { Admin } from './types/auth.type';
import InstitueRegistrationDto from './dto/instituteRegistration.dto';

@Injectable()
export class AuthService {
  instituteRegistration(data: InstitueRegistrationDto) {
    return {
      data,
      msg: 'Institute Successfully Registered',
    };
  }

  async adminRegistration(data: Admin) {
    const { age, email, firstName, gender, lastName, role } = data || {};

    // console.log(data);

    if (!age || !email || !firstName || !gender || !lastName || !role) {
      return {
        data: data,
        msg: 'All fields are required',
      };
    }
    return new Promise((resolve) => {
      resolve({
        data: data,
        msg: 'Admin Successfully Registered',
      });
    });
  }

  // studentRegistration(data) {}
}
