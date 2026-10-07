export interface IBCCGradeResult {
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
  subjectCount: number;
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
 * Calculates IBCC equivalent marks for Cambridge O-Level subjects out of 1100
 */
export function calculateIBCCEquivalence(grades: string[]): IBCCGradeResult {
  const validGrades = grades.filter(g => g in IBCC_GRADE_POINTS);
  if (validGrades.length === 0) {
    return { obtainedMarks: 0, totalMarks: 1100, percentage: 0, subjectCount: 0 };
  }

  const sumPoints = validGrades.reduce((sum, g) => sum + IBCC_GRADE_POINTS[g], 0);
  const maxPossible = validGrades.length * 100;
  const percentage = (sumPoints / maxPossible) * 100;
  const obtainedMarks = Math.round((percentage / 100) * 1100);

  return {
    obtainedMarks,
    totalMarks: 1100,
    percentage: Number(percentage.toFixed(2)),
    subjectCount: validGrades.length
  };
}
