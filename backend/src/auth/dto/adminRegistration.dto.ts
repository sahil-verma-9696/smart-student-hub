import { Gender, Role } from '../types/auth.enum';

export default class AdminRegistrationDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: Role.Admin;
  age: number;
  gender: Gender;
}
