import { AcademicInput, UniversityConfig, UniversityCalculationResult } from './types';

/**
 * Calculates academic percentage safely
 */
export function calculatePercentage(obtained: number, total: number): number {
  if (total <= 0 || obtained < 0) return 0;
  const clampedObtained = Math.min(obtained, total);
  return Number(((clampedObtained / total) * 100).toFixed(4));
}

/**
 * Calculates aggregate for a university given academic inputs
 */
export function calculateUniversityAggregate(
  input: AcademicInput,
  uni: UniversityConfig
): UniversityCalculationResult {
  const matricPct = calculatePercentage(input.matricObtained, input.matricTotal);
  const fscMarksEffective = (input.hafizQuran && uni.disciplineCategory === 'medical')
    ? Math.min(input.fscTotal, input.fscObtained + 20)
    : input.fscObtained;
  const fscPct = calculatePercentage(fscMarksEffective, input.fscTotal);
  
  // Eligibility check (Academic criteria: usually FSc & Matric must meet threshold)
  let isEligible = fscPct >= uni.eligibilityMinAcademicPct && matricPct >= uni.eligibilityMinAcademicPct;
  let eligibilityMessage = isEligible
    ? undefined
    : `Eligibility warning: Requires minimum ${uni.eligibilityMinAcademicPct}% in Intermediate / Matric. Your FSc is ${fscPct.toFixed(1)}%.`;

  // Test score evaluation: Local test vs Digital SAT
  const isUsingSat = input.useSat && !!uni.satSupported && input.satScore > 0;
  let testPct = 0;
  const testType: 'local' | 'sat' = input.useSat && !!uni.satSupported ? 'sat' : 'local';

  // Specific SAT validations
  if (input.useSat && !uni.satSupported) {
    isEligible = false;
    eligibilityMessage = `${uni.shortName} does not accept Digital SAT for regular domestic seats. Admission requires ${uni.testName}.`;
  } else if (input.useSat && uni.satSupported && uni.satMinScore && input.satScore > 0 && input.satScore < uni.satMinScore) {
    isEligible = false;
    eligibilityMessage = `SAT score (${input.satScore}/1600) is below ${uni.shortName}'s minimum eligibility threshold of ${uni.satMinScore}/1600.`;
  }

  if (isUsingSat) {
    testPct = calculatePercentage(input.satScore, uni.satTotal ?? 1600);
  } else {
    let rawScore = input.entryTestScores[uni.id];
    if (rawScore === undefined || rawScore === 0) {
      if (uni.disciplineCategory === 'medical' || ['uhs', 'duhs', 'kmu', 'stmu', 'aku'].includes(uni.id)) {
        rawScore = input.entryTestScores['mdcat'] ?? input.entryTestScores[uni.id] ?? 0;
      } else if (uni.id === 'nums') {
        rawScore = input.entryTestScores['nums'] ?? input.entryTestScores['mdcat'] ?? 0;
      } else if (uni.id.startsWith('nust')) {
        rawScore = input.entryTestScores['nust'] ?? input.entryTestScores[uni.id] ?? 0;
      } else if (uni.id.startsWith('fast')) {
        rawScore = input.entryTestScores['fast_cs'] ?? input.entryTestScores['fast'] ?? input.entryTestScores[uni.id] ?? 0;
      } else if (uni.id.startsWith('comsats')) {
        rawScore = input.entryTestScores['comsats'] ?? input.entryTestScores[uni.id] ?? 0;
      } else if (uni.id.startsWith('iba')) {
        rawScore = input.entryTestScores['iba'] ?? input.entryTestScores[uni.id] ?? 0;
      } else if (uni.id.startsWith('lums')) {
        rawScore = input.entryTestScores['lums'] ?? input.entryTestScores[uni.id] ?? 0;
      } else if (rawScore === undefined) {
        rawScore = input.entryTestScores[uni.testName] ?? 0;
      }
    }
    testPct = calculatePercentage(rawScore, uni.testTotal);
  }

  // Medical MDCAT specific check: PMDC requires minimum 50% for BDS, 55% for MBBS
  if (uni.disciplineCategory === 'medical') {
    const mdcatScore = input.entryTestScores['mdcat'] ?? input.entryTestScores[uni.id] ?? 0;
    if (mdcatScore > 0 && mdcatScore < 100) {
      isEligible = false;
      eligibilityMessage = `MDCAT score (${mdcatScore}/200) is below PMDC minimum pass threshold of 50% (100 marks for BDS, 110 for MBBS).`;
    }
  }

  // PUCIT custom formula
  if (uni.customFormula === 'pucit_standard') {
    const hafizBonus = input.hafizQuran ? 20 : 0;
    const clampedMatric = Math.min(Math.max(0, input.matricObtained), input.matricTotal);
    const clampedFsc = Math.min(Math.max(0, input.fscObtained), input.fscTotal);
    const academicNumerator = (0.25 * clampedMatric) + clampedFsc + hafizBonus;
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
