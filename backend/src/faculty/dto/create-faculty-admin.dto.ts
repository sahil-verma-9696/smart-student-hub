import { 
  IsString, 
  IsEmail, 
  IsEnum, 
  IsOptional, 
  IsArray,
  Matches,
  Length,
  ArrayNotEmpty,
  ArrayUnique
} from 'class-validator';

// ---------------- ENUMS --------------------
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

// -------------------------------------------

export class CreateFacultyAdminDto {
  // ---------- BASIC FACULTY DETAILS ----------
  
  @IsString()
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message: 'facultyId may contain only letters, numbers, hyphens, and underscores',
  })
  facultyId: string;

  @IsString()
  @Matches(/^[A-Za-z ]+$/, {
    message: 'Name must contain letters only',
  })
  @Length(3, 50)
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsEnum(Gender, { message: 'Gender must be male, female, or other' })
  gender: Gender;

  // ------------- CONTACT DETAILS -----------------

  @Matches(/^(?!(\d)\1{9})(\+91[\s-]?)?[6-9]\d{9}$/, {
    message: 'Invalid phone number',
  })
  phone: string;

  @IsOptional()
  @Matches(/^(?!(\d)\1{9})(\+91[\s-]?)?[6-9]\d{9}$/, {
    message: 'Invalid alternate phone number',
  })
  alternatePhone?: string;

  // ------------- ACADEMIC DETAILS -----------------

  @IsString()
  @Matches(/^[A-Za-z ]+$/, {
    message: 'Department must contain letters only',
  })
  department: string;

  @IsString()
  @Matches(/^[A-Za-z .,&()-]+$/, {
    message: 'Designation contains invalid characters',
  })
  designation: string;

  @IsString()
  @Matches(/^[a-fA-F0-9]{24}$/, {
    message: 'Invalid instituteId (must be a Mongo ObjectId)',
  })
  instituteId: string;

  // ------------- ASSIGNED STUDENTS -----------------

  @IsOptional()
  @IsArray({ message: 'assignedStudentIds must be an array' })
  @ArrayUnique({ message: 'Student IDs must not be duplicated' })
  @Matches(/^[A-Za-z0-9_-]+$/, {
    each: true,
    message: 'Each student ID must contain letters, numbers, hyphens, and underscores only',
  })
  assignedStudentIds?: string[];
}
