import { Gender, Role } from './auth.enum';
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
