import { AcademicInput, UniversityConfig, UniversityCalculationResult } from './types';

/**
 * Calculates academic percentage safely
 */
export function calculatePercentage(obtained: number, total: number): number {
  if (total <= 0 || obtained < 0) return 0;
  return Number(((obtained / total) * 100).toFixed(4));
}

/**
 * Calculates aggregate for a university given academic inputs
 */
export function calculateUniversityAggregate(
  input: AcademicInput,
  uni: UniversityConfig
): UniversityCalculationResult {
  const matricPct = calculatePercentage(input.matricObtained, input.matricTotal);
  const fscPct = calculatePercentage(input.fscObtained, input.fscTotal);
  
  // Eligibility check (Academic criteria: usually FSc & Matric must meet threshold)
  const isEligible = fscPct >= uni.eligibilityMinAcademicPct && matricPct >= uni.eligibilityMinAcademicPct;
  const eligibilityMessage = isEligible
    ? undefined
    : `Eligibility warning: Requires minimum ${uni.eligibilityMinAcademicPct}% in Intermediate / Matric. Your FSc is ${fscPct.toFixed(1)}%.`;

  // Test score evaluation: Local test vs Digital SAT
  const isUsingSat = input.useSat && !!uni.satSupported && input.satScore > 0;
  let testPct = 0;
  const testType: 'local' | 'sat' = isUsingSat ? 'sat' : 'local';

  if (isUsingSat) {
    testPct = calculatePercentage(input.satScore, uni.satTotal ?? 1600);
  } else {
    const rawScore = input.entryTestScores[uni.id] ?? input.entryTestScores[uni.testName] ?? 0;
    testPct = calculatePercentage(rawScore, uni.testTotal);
  }

  // PUCIT custom formula
  if (uni.customFormula === 'pucit_standard') {
    const hafizBonus = input.hafizQuran ? 20 : 0;
    const academicNumerator = (0.25 * input.matricObtained) + input.fscObtained + hafizBonus;
    const academicDenominator = (0.25 * input.matricTotal) + input.fscTotal;
    const academicPct = academicDenominator > 0 ? (academicNumerator / academicDenominator) * 100 : 0;
    
    const academicContribution = Number((academicPct * 0.75).toFixed(3));
    const testContribution = Number((testPct * 0.25).toFixed(3));
    const aggregate = Number((academicContribution + testContribution).toFixed(3));

    return {
      university: uni,
      aggregate,
      isEligible,
      eligibilityMessage,
      breakdown: {
        matricPct,
        matricContribution: Number((academicPct * 0.25 * 0.75).toFixed(3)),
        fscPct,
        fscContribution: Number((academicPct * 0.75).toFixed(3)),
        testPct,
        testContribution,
        testType
      }
    };
  }

  // Standard weighted calculation
  const weights = uni.weights ?? { matric: 0.10, fsc: 0.40, test: 0.50 };
  const matricContribution = Number((matricPct * weights.matric).toFixed(3));
  const fscContribution = Number((fscPct * weights.fsc).toFixed(3));
  const testContribution = Number((testPct * weights.test).toFixed(3));
  const aggregate = Number((matricContribution + fscContribution + testContribution).toFixed(3));

  return {
    university: uni,
    aggregate,
    isEligible,
    eligibilityMessage,
    breakdown: {
      matricPct,
      matricContribution,
      fscPct,
      fscContribution,
      testPct,
      testContribution,
      testType
    }
  };
}
