import {
  IsString,
  IsEmail,
  Matches,
  Length,
  IsEnum,
} from 'class-validator';
import { IsValidYearForCourse } from '../validators/course-year.validator';
import { IsValidSemesterForCourse } from '../validators/course-year-semester.validator';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class CreateStudentAdminDto {
  @IsString()
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message: 'studentId may contain only letters, numbers, hyphens and underscores',
  })
  studentId: string;

  @IsString()
  @Matches(/^[A-Za-z ]+$/, {
    message: 'Name must contain letters only',
  })
  @Length(3, 50)
  name: string;

  @IsString()
  @Matches(/^[a-fA-F0-9]{24}$/, {
    message: 'Invalid instituteId (must be a MongoDB ObjectId)',
  })
  instituteId: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsEnum(Gender, { message: 'Gender must be male, female, or other' })
  gender: Gender;

  @Matches(/^(?!(\d)\1{9})(\+91[\s-]?)?[6-9]\d{9}$/, {
    message: 'Invalid phone number',
  })
  phone: string;

  @IsString()
  @Matches(/^[A-Za-z ]+$/, { message: 'Course must contain letters only' })
  course: string;

  @IsString()
  @IsValidYearForCourse({ message: 'Invalid year for the selected course' })
  year: string;

  @IsString()
  @IsValidSemesterForCourse({
    message: 'Invalid semester for the selected course and year',
  })
  semester: string;

  @IsString()
  @Matches(/^[A-Za-z]$/, {
    message: 'Section must be a single letter (A-Z)',
  })
  section: string;

  @IsString()
  @Matches(/^[A-Za-z ]+$/, { message: 'Branch must contain letters only' })
  branch: string;
}
