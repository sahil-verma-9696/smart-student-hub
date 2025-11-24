import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsDateString,
  IsUrl,
  IsObject,
  IsIn,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// Details DTOs
export class AuthorsDto {
  @IsString()
  @IsNotEmpty()
  firstAuthor: string;

  @IsString({ each: true })
  @IsOptional()
  coAuthors?: string[];
}

export class JournalPaperDetailsDto {
  @IsString()
  @IsNotEmpty()
  journalName: string;

  @IsString()
  @IsOptional()
  issn?: string;

  @IsString()
  @IsOptional()
  doi?: string;

  @IsString()
  @IsOptional()
  publisher?: string;

  @IsIn(['SCI', 'Scopus', 'UGC', 'Other'])
  @IsNotEmpty()
  indexing: 'SCI' | 'Scopus' | 'UGC' | 'Other';

  @IsNotEmpty()
  authors: AuthorsDto;

  @IsString()
  @IsOptional()
  pageNumbers?: string;
}



export class ConferencePaperDetailsDto {
  @IsString()
  @IsNotEmpty()
  conferenceName: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsIn(['oral', 'poster'])
  @IsNotEmpty()
  presentationType: 'oral' | 'poster';

  @IsIn(['IEEE', 'ACM', 'Springer', 'Elsevier', 'Other'])
  @IsOptional()
  publisher?: 'IEEE' | 'ACM' | 'Springer' | 'Elsevier' | 'Other';

  @IsString()
  @IsOptional()
  proceedingsISBN?: string;

  @IsString()
  @IsOptional()
  doi?: string;
}

export class OnlineCourseDetailsDto {
  @IsIn(['NPTEL', 'Udemy', 'Coursera', 'edX', 'Other'])
  @IsNotEmpty()
  platform: 'NPTEL' | 'Udemy' | 'Coursera' | 'edX' | 'Other';

  @IsString()
  @IsOptional()
  instructorName?: string;

  @IsOptional()
  durationHours?: number;

  @IsOptional()
  scorePercent?: number;

  @IsString()
  @IsOptional()
  certificateId?: string;

  @IsUrl()
  @IsOptional()
  verificationLink?: string;

  @IsString()
  @IsOptional()
  courseCategory?: string;

  @IsUrl()
  @IsOptional()
  courseUrl?: string;

  @IsDateString()
  @IsOptional()
  completionDate?: string;
}

export class WorkshopSeminarDetailsDto {
  @IsString()
  @IsNotEmpty()
  organization: string;

  @IsIn(['online', 'offline'])
  @IsNotEmpty()
  mode: 'online' | 'offline';

  @IsOptional()
  durationDays?: number;

  @IsIn(['participant', 'speaker'])
  @IsNotEmpty()
  role: 'participant' | 'speaker';

  @IsString()
  @IsOptional()
  skillGained?: string;

  @IsString()
  @IsOptional()
  organizerContact?: string;

  @IsUrl()
  @IsOptional()
  attendanceCertificateUrl?: string;
}

export class AchievementAwardDetailsDto {
  @IsString()
  @IsNotEmpty()
  awardTitle: string;

  @IsString()
  @IsNotEmpty()
  awardedBy: string;

  @IsString()
  @IsOptional()
  eventName?: string;

  @IsString()
  @IsOptional()
  rankPosition?: string;

  @IsString()
  @IsOptional()
  skilledGained?: string;

  @IsUrl()
  @IsOptional()
  awardCertificateUrl?: string;
}

export class CertificationDetailsDto {
  @IsString()
  @IsNotEmpty()
  certifyingBody: string;

  @IsDateString()
  @IsOptional()
  validTill?: string;

  @IsString()
  @IsOptional()
  skillCategory?: string;

  @IsUrl()
  @IsOptional()
  verificationLink?: string;
}

// Union type for details
export type ActivityDetailsDto =
  | JournalPaperDetailsDto
  | ConferencePaperDetailsDto
  | OnlineCourseDetailsDto
  | WorkshopSeminarDetailsDto
  | AchievementAwardDetailsDto
  | CertificationDetailsDto;

// Main Create DTO
export class CreateActivityDto {
  @IsString()
  @IsOptional()
  activityId?: string;

  @IsString()
  @IsOptional()
  studentId?: string;

  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  title: string;

  @IsIn(
    ['JournalPaper', 'ConferencePaper', 'OnlineCourse', 'WorkshopSeminar', 'AchievementAward', 'Certification'],
    { message: 'Invalid activity type' }
  )
  @IsNotEmpty({ message: 'Activity type is required' })
  activityType: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dateStart?: string;

  @IsDateString()
  @IsOptional()
  dateEnd?: string;

  @IsIn(['Completed', 'Ongoing', 'Published', 'Submitted', 'Won', 'Participated'])
  @IsOptional()
  status?: string;

  @IsIn(['pending', 'approved', 'rejected'])
  @IsOptional()
  state?: string;

  @IsUrl()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  certificateUrl?: string;

  @IsUrl()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  documentUrl?: string;

  @IsString()
  @IsOptional()
  remarks?: string;

  // Accept a plain object for details (validation of the inner shape
  // is intentionally relaxed to avoid whitelist/forbidNonWhitelisted rejections
  // — consider adding discriminated nested validation if you need strict checks)
  @IsObject()
  @IsOptional()
  details?: Record<string, any>;
}
