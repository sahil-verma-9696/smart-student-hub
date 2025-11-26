import {
  ValidateNested,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsUrl,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

/* ===========================
   MOOC
=========================== */
export class MoocDetailsDto {
  @IsString() platform: string;
  @IsString() courseName: string;

  @IsOptional() @IsString()
  instructor?: string;

  @IsOptional() @IsNumber()
  durationHours?: number;

  @IsOptional() @IsNumber()
  scorePercent?: number;

  @IsOptional() @IsString()
  certificateId?: string;

  @IsOptional() @IsUrl()
  verificationLink?: string;
}

/* ===========================
   CERTIFICATION
=========================== */
export class CertificationDetailsDto {
  @IsString() certifyingBody: string;
  @IsString() certificateName: string;

  @IsOptional() @IsString()
  certificateId?: string;

  @IsOptional() @IsUrl()
  verificationLink?: string;

  @IsOptional() @IsDateString()
  issueDate?: string;

  @IsOptional() @IsDateString()
  expiryDate?: string;
}

/* ===========================
   CONFERENCE
=========================== */
export class ConferenceDetailsDto {
  @IsString() conferenceName: string;
  @IsString() organizer: string;
  @IsString() mode: string;

  @IsOptional() @IsString()
  location?: string;

  @IsOptional() @IsDateString()
  date?: string;
}

/* ===========================
   CONFERENCE PAPER
=========================== */
export class AuthorsDto {
  @IsString()
  firstAuthor: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  coAuthors?: string[];
}

export class ConferencePaperDetailsDto {
  @IsString()
  paperTitle: string;

  @IsString()
  conferenceName: string;

  @IsString()
  presentationType: string;

  @IsOptional()
  @IsString()
  indexing?: string;

  @IsOptional()
  @IsString()
  doi?: string;

  @IsOptional()
  @IsString()
  proceedings_isbn?: string;

  @ValidateNested()
  @Type(() => AuthorsDto)
  authors: AuthorsDto;
}


/* ===========================
   WORKSHOP
=========================== */
export class WorkshopDetailsDto {
  @IsString() workshopName: string;
  @IsString() organizer: string;
  @IsString() mode: string;

  @IsOptional() @IsNumber()
  durationHours?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skillsGained?: string[];
}

/* ===========================
   WEBINAR
=========================== */
export class WebinarDetailsDto {
  @IsString() topic: string;
  @IsString() speaker: string;
  @IsString() organizer: string;

  @IsOptional() @IsDateString()
  date?: string;
}

/* ===========================
   COMPETITION
=========================== */
export class CompetitionDetailsDto {
  @IsString() eventName: string;
  @IsString() organizer: string;

  @IsOptional() @IsString()
  level?: string;

  @IsOptional() @IsString()
  position?: string;

  @IsOptional() @IsNumber()
  teamSize?: number;
}

/* ===========================
   INTERNSHIP
=========================== */
export class InternshipDetailsDto {
  @IsString() organization: string;
  @IsString() role: string;
  @IsDateString() startDate: string;
  @IsDateString() endDate: string;

  @IsOptional() @IsNumber()
  stipend?: number;
}

/* ===========================
   LEADERSHIP
=========================== */
export class LeadershipDetailsDto {
  @IsString() roleTitle: string;
  @IsString() organization: string;
  @IsDateString() tenureStart: string;

  @IsOptional() @IsDateString()
  tenureEnd?: string;

  @IsOptional() @IsNumber()
  teamSize?: number;
}

/* ===========================
   VOLUNTEERING
=========================== */
export class VolunteeringDetailsDto {
  @IsString() organization: string;

  @IsOptional() @IsString()
  eventName?: string;

  @IsOptional() @IsNumber()
  hoursServed?: number;

  @IsOptional() @IsString()
  role?: string;
}

/* ===========================
   CLUB ACTIVITY
=========================== */
export class ClubActivityDetailsDto {
  @IsString() clubName: string;
  @IsString() eventName: string;

  @IsOptional() @IsString()
  role?: string;
}

/* ===========================
   PROJECT
=========================== */
export class ProjectDetailsDto {
  @IsString() projectTitle: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];

  @IsOptional() @IsUrl()
  githubUrl?: string;
}

/* ===========================
   SPORTS
=========================== */
export class SportsDetailsDto {
  @IsString() sportName: string;

  @IsOptional() @IsString()
  eventName?: string;

  @IsOptional() @IsString()
  level?: string;

  @IsOptional() @IsString()
  position?: string;
}

/* ===========================
   CULTURAL
=========================== */
export class CulturalDetailsDto {
  @IsString() eventName: string;

  @IsOptional() @IsString()
  category?: string;

  @IsOptional() @IsString()
  organizer?: string;

  @IsOptional() @IsString()
  level?: string;

  @IsOptional() @IsString()
  position?: string;
}

/* ===========================
   RESEARCH
=========================== */
export class ResearchDetailsDto {
  @IsString() title: string;
  @IsString() journal: string;

  @IsOptional() @IsString()
  indexing?: string;

  @IsOptional() @IsString()
  doi?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  authors?: string[];

  @IsString()
  status: string;
}

/* ===========================
   PATENT
=========================== */
export class PatentDetailsDto {
  @IsString() patentTitle: string;

  @IsOptional() @IsString()
  applicationNumber?: string;

  @IsDateString()
  filingDate: string;

  @IsString()
  status: string;

  @IsArray()
  @IsString({ each: true })
  inventors: string[];
}

/* ===========================
   OTHER ACTIVITY
=========================== */
export class OtherActivityDetailsDto {
  @IsString() activityName: string;

  @IsOptional() @IsString()
  organizer?: string;

  @IsOptional() @IsDateString()
  date?: string;

  @IsOptional() @IsString()
  location?: string;
}

/* ===========================
   UNION TYPE
=========================== */
export type ActivityDetailsDto =
  | MoocDetailsDto
  | CertificationDetailsDto
  | ConferenceDetailsDto
  | ConferencePaperDetailsDto
  | WorkshopDetailsDto
  | WebinarDetailsDto
  | CompetitionDetailsDto
  | InternshipDetailsDto
  | LeadershipDetailsDto
  | VolunteeringDetailsDto
  | ClubActivityDetailsDto
  | ProjectDetailsDto
  | SportsDetailsDto
  | CulturalDetailsDto
  | ResearchDetailsDto
  | PatentDetailsDto
  | OtherActivityDetailsDto;
