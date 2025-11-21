// activity-details.schemas.ts

export class JournalPaperDetails {
  journalName: string;
  issn?: string;
  doi?: string;
  publisher?: string;
  indexing: 'SCI' | 'Scopus' | 'UGC' | 'Other';
  authors: string[];
  pageNumbers?: string;
}

export class ConferencePaperDetails {
  conferenceName: string;
  location?: string;
  presentationType: 'oral' | 'poster';
  publisher?: 'IEEE' | 'ACM' | 'Springer' | 'Elsevier' | 'Other';
  proceedingsISBN?: string;
  doi?: string;
}

export class OnlineCourseDetails {
  platform: 'NPTEL' | 'Udemy' | 'Coursera' | 'edX' | 'Other';
  instructorName?: string;
  durationHours?: number;
  scorePercent?: number;
  certificateId?: string;
  verificationLink?: string;
}

export class WorkshopSeminarDetails {
  organization: string;
  mode: 'online' | 'offline';
  durationDays?: number;
  role: 'participant' | 'speaker';
}

export class AchievementAwardDetails {
  awardTitle: string;
  awardedBy: string;
  eventName?: string;
  rankPosition?: string;
}

export class CertificationDetails {
  certifyingBody: string;
  validTill?: Date;
  skillCategory?: string;
}
