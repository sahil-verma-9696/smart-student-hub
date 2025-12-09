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

export interface BatchData {
  sanctionedIntake: number;
  totalAdmitted: number;
  lateralEntry: number;
  separateDivision: number;
}

export interface Batches {
  CAY?: { batch: BatchData };
  CAYm1?: { batch: BatchData };
  CAYm2?: { batch: BatchData };
  CAYm3?: { batch: BatchData };
  CAYm4?: { batch: BatchData };
  CAYm5?: { batch: BatchData };
  CAYm6?: { batch: BatchData };
}

export interface YearStats {
  yearI: string;
  yearII: string;
  yearIII: string;
  yearIV: string;
}

export interface GraduationStats {
  CAY?: YearStats;
  CAYm1?: YearStats;
  CAYm2?: YearStats;
  CAYm3?: YearStats;
  CAYm4?: YearStats;
  CAYm5?: YearStats;
  CAYm6?: YearStats;
}

export interface PlacementStat {
  totalFinalYear: number;
  placed: number;
  higherStudies: number;
  entrepreneur: number;
}

export interface PlacementStats {
  CAYm4?: PlacementStat;
  CAYm5?: PlacementStat;
  CAYm6?: PlacementStat;
}

export interface PlacementDetail {
  rollNo: string;
  name: string;
  company: string;
  referenceNumber: string;
}

export interface PlacementDetails {
  CAYm4?: PlacementDetail[];
  CAYm5?: PlacementDetail[];
  CAYm6?: PlacementDetail[];
}

export interface InterInstituteEvent {
  rollNo: string;
  name: string;
  event: string;
  venue: string;
  date: string;
  remarks: string;
}

export interface InterInstituteEvents {
  outsideState?: InterInstituteEvent[];
  withinState?: InterInstituteEvent[];
  prizeWinners?: InterInstituteEvent[];
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

export interface ReportData {
  programInfo: ProgramInfo;
  batchYears: BatchYears;
  batches: Batches;
  graduationStats: GraduationStats;
  totalGraduationStats: GraduationStats;
  placementStats: PlacementStats;
  placementDetails: PlacementDetails;
  interInstituteEvents?: InterInstituteEvents;
  codingCompetitions?: CodingCompetition[];
  universityMerit?: UniversityMerit[];
}
