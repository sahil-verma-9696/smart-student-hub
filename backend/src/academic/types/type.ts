export interface ProgramResponse {
  programInfo: ProgramInfo;
  batchYears: BatchYears;
  batches: Record<string, BatchContainer>;
  graduationStats: Record<string, YearWiseStats>;
  totalGraduationStats: Record<string, YearWiseStats>;
  placementStats: Record<string, PlacementStat>;
  placementDetails: Record<string, PlacementDetail[]>;
  interInstituteEvents: InterInstituteEvents;
  codingCompetitions: CodingCompetition[];
  universityMerit: UniversityMerit[];
}

/* -------------------- Sub Types -------------------- */

export interface ProgramInfo {
  department: string;
  programName: string;
  programmeCode: string;
  instituteName: string;
  affiliatingUniversity: string;
}

export interface BatchYears {
  CAY: string;
  CAYm1: string;
  CAYm2: string;
  CAYm3: string;
  CAYm4: string;
  CAYm5: string;
  CAYm6: string;
}

export interface BatchContainer {
  batch: Batch;
}

export interface Batch {
  sanctionedIntake: number;
  totalAdmitted: number;
  lateralEntry: number;
  separateDivision: number;
}

export interface YearWiseStats {
  yearI: string;
  yearII: string;
  yearIII: string;
  yearIV: string;
}

export interface PlacementStat {
  totalFinalYear: number;
  placed: number;
  higherStudies: number;
  entrepreneur: number;
}

export interface PlacementDetail {
  rollNo: string;
  name: string;
  company: string;
  referenceNumber: string;
}

export interface InterInstituteEvents {
  outsideState: EventDetail[];
  withinState: EventDetail[];
  prizeWinners: EventDetail[];
}

export interface EventDetail {
  rollNo: string;
  name: string;
  event: string;
  venue: string;
  date: string;
  remarks: string;
}

export interface CodingCompetition {
  name: string;
  event: string;
  venue: string;
  date: string;
  remarks: string;
}

export interface UniversityMerit {
  rollNo: string;
  name: string;
  session: string;
  percentage: string;
  rank: string;
}
