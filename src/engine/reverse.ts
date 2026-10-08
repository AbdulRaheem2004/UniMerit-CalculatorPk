import { AcademicInput, UniversityConfig, ReverseTargetResult } from './types';
import { calculatePercentage } from './calculator';

/**
 * Solves the exact test score required to hit a desired aggregate
 */
export function solveRequiredTestScore(
  input: AcademicInput,
  uni: UniversityConfig,
  targetAggregate: number,
  preferSat: boolean = false
): ReverseTargetResult {
  const isSat = preferSat && !!uni.satSupported;

  if (preferSat && !uni.satSupported) {
    return {
      targetScore: 0,
      targetPercentage: 0,
      maxScore: 1600,
      testType: 'sat',
      status: 'impossible',
      message: `${uni.shortName} does not accept Digital SAT for general domestic seats. You must take ${uni.testName}.`
    };
  }

  const maxScore = isSat ? (uni.satTotal ?? 1600) : uni.testTotal;
  const testType: 'local' | 'sat' = isSat ? 'sat' : 'local';

  const matricPct = calculatePercentage(input.matricObtained, input.matricTotal);
  const fscPct = calculatePercentage(input.fscObtained, input.fscTotal);

  if (uni.customFormula === 'pucit_standard') {
    const hafizBonus = input.hafizQuran ? 20 : 0;
    const academicNumerator = (0.25 * input.matricObtained) + input.fscObtained + hafizBonus;
    const academicDenominator = (0.25 * input.matricTotal) + input.fscTotal;
    const academicPct = academicDenominator > 0 ? (academicNumerator / academicDenominator) * 100 : 0;
    const academicContribution = academicPct * 0.75;
    const remainingNeeded = targetAggregate - academicContribution;

    if (remainingNeeded <= 0) {
      return {
        targetScore: 0,
        targetPercentage: 0,
        maxScore,
        testType,
        status: 'already_achieved',
        message: 'Mubarak! Your academic marks alone already meet or exceed this target aggregate.'
      };
    }

    // remainingNeeded = (targetScore / maxScore) * 100 * 0.25
    // targetScore = (remainingNeeded / 25) * maxScore
    const targetPct = (remainingNeeded / 0.25);
    const rawScore = (targetPct / 100) * maxScore;
    const targetScore = Math.ceil(rawScore);

    if (targetScore > maxScore) {
      return {
        targetScore,
        targetPercentage: Number(targetPct.toFixed(2)),
        maxScore,
        testType,
        status: 'impossible',
        message: `Mathematically requires ${targetScore}/${maxScore} (${targetPct.toFixed(1)}%), exceeding the maximum possible score.`
      };
    }

    return {
      targetScore,
      targetPercentage: Number(targetPct.toFixed(2)),
      maxScore,
      testType,
      status: 'achievable',
      message: `You need at least ${targetScore}/${maxScore} marks (${targetPct.toFixed(1)}%) on the PU Test to achieve ${targetAggregate.toFixed(2)}%.`
    };
  }

  // Standard weighted calculation
  const weights = uni.weights ?? { matric: 0.10, fsc: 0.40, test: 0.50 };
  const academicContribution = (matricPct * weights.matric) + (fscPct * weights.fsc);
  const remainingNeeded = targetAggregate - academicContribution;

  if (remainingNeeded <= 0) {
    if (isSat && uni.satMinScore) {
      return {
        targetScore: uni.satMinScore,
        targetPercentage: Number(((uni.satMinScore / maxScore) * 100).toFixed(2)),
        maxScore,
        testType,
        status: 'achievable',
        message: `Your academics alone reach this target, but ${uni.shortName} requires a mandatory minimum SAT score of ${uni.satMinScore}/1600.`
      };
    }
    return {
      targetScore: 0,
      targetPercentage: 0,
      maxScore,
      testType,
      status: 'already_achieved',
      message: 'Mubarak! Your academic marks alone already exceed this cutoff aggregate.'
    };
  }

  // remainingNeeded = (targetScore / maxScore) * 100 * weights.test
  const targetPct = remainingNeeded / weights.test;
  const rawScore = (targetPct / 100) * maxScore;
  let targetScore = Math.ceil(rawScore);

  if (targetScore > maxScore) {
    return {
      targetScore,
      targetPercentage: Number(targetPct.toFixed(2)),
      maxScore,
      testType,
      status: 'impossible',
      message: `Requires ${targetScore}/${maxScore} (${targetPct.toFixed(1)}%), which exceeds maximum possible test marks.`
    };
  }

  let note = '';
  if (isSat && uni.satMinScore && targetScore < uni.satMinScore) {
    targetScore = uni.satMinScore;
    note = ` (Adjusted to meet ${uni.shortName}'s minimum cutoff threshold of ${uni.satMinScore})`;
  }

  const testNameDisplay = isSat ? 'Digital SAT' : uni.testName;
  return {
    targetScore,
    targetPercentage: Number(((targetScore / maxScore) * 100).toFixed(2)),
    maxScore,
    testType,
    status: 'achievable',
    message: `You need at least ${targetScore}/${maxScore} (${((targetScore / maxScore) * 100).toFixed(1)}%) in ${testNameDisplay} to hit ${targetAggregate.toFixed(2)}%${note}.`
  };
}
