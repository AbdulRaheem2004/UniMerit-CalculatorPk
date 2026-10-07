export interface UniversityWeights {
  matric: number;
  fsc: number;
  test: number;
}

export interface UniversityConfig {
  id: string;
  name: string;
  shortName: string;
  campuses: string[];
  testName: string;
  testTotal: number;
  satSupported?: boolean;
  satTotal?: number;
  formulaDisplay: string;
  sourceUrl: string;
  weights?: UniversityWeights;
  customFormula?: string;
  eligibilityMinAcademicPct: number;
  notes?: string;
}

export interface AcademicInput {
  matricObtained: number;
  matricTotal: number;
  fscObtained: number;
  fscTotal: number;
  hafizQuran: boolean;
  useSat: boolean;
  satScore: number; // out of 1600
  entryTestScores: Record<string, number>; // keyed by universityId e.g. "nust": 155
}

export interface UniversityCalculationResult {
  university: UniversityConfig;
  aggregate: number;
  isEligible: boolean;
  eligibilityMessage?: string;
  breakdown: {
    matricPct: number;
    matricContribution: number;
    fscPct: number;
    fscContribution: number;
    testPct: number;
    testContribution: number;
    testType: 'local' | 'sat';
  };
}

export interface ReverseTargetResult {
  targetScore: number;
  targetPercentage: number;
  maxScore: number;
  testType: 'local' | 'sat';
  status: 'achievable' | 'impossible' | 'already_achieved';
  message: string;
}

export type VerificationStatus = 'verified' | 'not_found' | 'special_policy_year';

export interface HistoricalMeritRecord {
  year: number;
  universityId: string;
  campus: string;
  discipline: string;
  closingAggregate?: number;
  closingMeritPosition?: number;
  listNumber?: string;
  status: VerificationStatus;
  verificationSource?: {
    type: string;
    title: string;
    url?: string;
    archiveDate?: string;
  };
  notes?: string;
}
