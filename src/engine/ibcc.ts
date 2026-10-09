export interface IBCCGradeResult {
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
  subjectCount: number;
  hasFailedSubject: boolean;
  failedSubjects: string[];
  isEligible: boolean;
  ineligibilityReason?: string;
}

export const IBCC_GRADE_POINTS: Record<string, number> = {
  'A*': 90,
  'A': 85,
  'B': 75,
  'C': 65,
  'D': 55,
  'E': 45,
  'U': 0
};

/**
 * Calculates IBCC equivalent marks for Cambridge O-Level subjects out of 1100.
 * In accordance with IBCC Equivalence Regulations (Clause 3.2):
 * A candidate with a grade 'U' (Ungraded/Fail) in ANY required subject is NOT eligible for an Equivalence Certificate.
 */
export function calculateIBCCEquivalence(grades: string[], subjects?: string[]): IBCCGradeResult {
  const validGrades = grades.filter(g => g in IBCC_GRADE_POINTS);
  if (validGrades.length === 0) {
    return {
      obtainedMarks: 0,
      totalMarks: 1100,
      percentage: 0,
      subjectCount: 0,
      hasFailedSubject: false,
      failedSubjects: [],
      isEligible: false,
      ineligibilityReason: 'No valid grades provided.'
    };
  }

  // Identify failed subjects ('U' = Ungraded / Fail)
  const failedSubjects: string[] = [];
  grades.forEach((g, idx) => {
    if (g === 'U' || g === 'F') {
      const subjName = subjects && subjects[idx] ? subjects[idx] : `Subject ${idx + 1}`;
      failedSubjects.push(subjName);
    }
  });

  const hasFailedSubject = failedSubjects.length > 0;
  const isEligible = !hasFailedSubject;
  const ineligibilityReason = hasFailedSubject
    ? `Under official IBCC regulations, candidates with Grade 'U' (Ungraded/Fail) in any compulsory or elective subject (${failedSubjects.join(', ')}) cannot be issued an Equivalence Certificate. You are strictly ineligible for university admission in Pakistan until this subject is passed.`
    : undefined;

  const sumPoints = validGrades.reduce((sum, g) => sum + IBCC_GRADE_POINTS[g], 0);
  const maxPossible = validGrades.length * 100;
  const percentage = (sumPoints / maxPossible) * 100;
  const obtainedMarks = Math.round((percentage / 100) * 1100);

  return {
    obtainedMarks,
    totalMarks: 1100,
    percentage: Number(percentage.toFixed(2)),
    subjectCount: validGrades.length,
    hasFailedSubject,
    failedSubjects,
    isEligible,
    ineligibilityReason
  };
}

/**
 * Calculates IBCC equivalent marks for Cambridge A-Level subjects out of 1100.
 * Requires minimum 3 principal subjects. Grade 'U' in any subject results in rejection of HSSC Equivalence.
 */
export function calculateALevelEquivalence(grades: string[], subjects?: string[]): IBCCGradeResult {
  const validGrades = grades.filter(g => g in IBCC_GRADE_POINTS);
  if (validGrades.length === 0) {
    return {
      obtainedMarks: 0,
      totalMarks: 1100,
      percentage: 0,
      subjectCount: 0,
      hasFailedSubject: false,
      failedSubjects: [],
      isEligible: false,
      ineligibilityReason: 'No valid A-Level grades provided.'
    };
  }

  const failedSubjects: string[] = [];
  grades.forEach((g, idx) => {
    if (g === 'U' || g === 'F') {
      const subjName = subjects && subjects[idx] ? subjects[idx] : `A-Level Subject ${idx + 1}`;
      failedSubjects.push(subjName);
    }
  });

  const hasFailedSubject = failedSubjects.length > 0;
  const isEligible = !hasFailedSubject;
  const ineligibilityReason = hasFailedSubject
    ? `Under official IBCC regulations, a grade 'U' in any principal A-Level subject (${failedSubjects.join(', ')}) results in HSSC Equivalence rejection. Candidate cannot be admitted to any university in Pakistan until cleared.`
    : undefined;

  const sumPoints = validGrades.reduce((sum, g) => sum + IBCC_GRADE_POINTS[g], 0);
  const maxPossible = validGrades.length * 100;
  const percentage = (sumPoints / maxPossible) * 100;
  const obtainedMarks = Math.round((percentage / 100) * 1100);

  return {
    obtainedMarks,
    totalMarks: 1100,
    percentage: Number(percentage.toFixed(2)),
    subjectCount: validGrades.length,
    hasFailedSubject,
    failedSubjects,
    isEligible,
    ineligibilityReason
  };
}
