import { AdminDocument } from 'src/admin/schema/admin.schema';
import { Gender, Role } from './auth.enum';
import { Request } from 'express';
import { UserDocument } from 'src/user/schema/user.schema';
import { InstituteDocument } from 'src/institute/schemas/institute.schema';
import { StudentDocument } from 'src/student/schema/student.schema';
import { FacultyDocument } from 'src/faculty/schemas/faculty.schema';

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  age: number;
  gender: Gender;
};

export type Admin = {
  role: Role.Admin;
} & User;

export type Student = {
  role: Role.Student;
  collegeId: string;
  branch: string;
  instituteId: string;
} & User;

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
  instituteId?: string;
}

export type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};

export type AuthResponse = {
  user?:
  | AdminDocument
  | UserDocument
  | StudentDocument
  | FacultyDocument;
  userData?: StudentDocument | AdminDocument | FacultyDocument;
  institute?: InstituteDocument;
  token: string;
  expires_in: string | number;
  msg: string;
};
