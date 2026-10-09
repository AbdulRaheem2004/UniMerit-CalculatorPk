import { describe, it, expect } from 'vitest';
import { calculateUniversityAggregate } from '../src/engine/calculator';
import universitiesJson from '../data/universities.json';
import { UniversityConfig, AcademicInput } from '../src/engine/types';

const universities = universitiesJson as UniversityConfig[];
const nust = universities.find(u => u.id === 'nust')!;
const fastCs = universities.find(u => u.id === 'fast_cs')!;
const fastEng = universities.find(u => u.id === 'fast_eng')!;
const comsats = universities.find(u => u.id === 'comsats')!;
const giki = universities.find(u => u.id === 'giki')!;
const pucit = universities.find(u => u.id === 'pucit')!;
const uet = universities.find(u => u.id === 'uet')!;

describe('Forward Aggregate Calculator Engine', () => {
  it('ENG-01: calculates NUST aggregate accurately (10% Matric + 15% FSc + 75% NET)', () => {
    // Matric: 980/1100 (89.0909%), FSc: 920/1100 (83.6364%), NET: 155/200 (77.5%)
    // Expected: 8.909 + 12.545 + 58.125 = 79.579%
    const input: AcademicInput = {
      matricObtained: 980,
      matricTotal: 1100,
      fscObtained: 920,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { nust: 155 }
    };
    const result = calculateUniversityAggregate(input, nust);
    expect(result.aggregate).toBeCloseTo(79.58, 1);
    expect(result.isEligible).toBe(true);
    expect(result.breakdown.testType).toBe('local');
  });

  it('ENG-02: calculates FAST Computing aggregate accurately (10% Matric + 40% FSc + 50% Test)', () => {
    // Matric: 1000/1100 (90.909%), FSc: 900/1100 (81.818%), NU Test: 70/100 (70.0%)
    // Expected: 9.091 + 32.727 + 35.000 = 76.818%
    const input: AcademicInput = {
      matricObtained: 1000,
      matricTotal: 1100,
      fscObtained: 900,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { fast_cs: 70 }
    };
    const result = calculateUniversityAggregate(input, fastCs);
    expect(result.aggregate).toBeCloseTo(76.82, 1);
    expect(result.isEligible).toBe(true);
  });

  it('ENG-02-ENG: calculates FAST Engineering aggregate accurately (17% Matric + 50% FSc + 33% Test)', () => {
    // Matric: 1000/1100 (90.909%), FSc: 900/1100 (81.818%), NU Test: 70/100 (70.0%)
    // Expected: 15.455 + 40.909 + 23.100 = 79.464%
    const input: AcademicInput = {
      matricObtained: 1000,
      matricTotal: 1100,
      fscObtained: 900,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { fast_eng: 70 }
    };
    const result = calculateUniversityAggregate(input, fastEng);
    expect(result.aggregate).toBeCloseTo(79.46, 1);
  });

  it('ENG-02-SAT: calculates FAST Computing with Digital SAT (out of 1600)', () => {
    // Matric: 1000/1100 (90.909%), FSc: 900/1100 (81.818%), SAT: 1300/1600 (81.25%)
    // Expected: 9.091 + 32.727 + (81.25 * 0.50 = 40.625) = 82.443%
    const input: AcademicInput = {
      matricObtained: 1000,
      matricTotal: 1100,
      fscObtained: 900,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: true,
      satScore: 1300,
      entryTestScores: {}
    };
    const result = calculateUniversityAggregate(input, fastCs);
    expect(result.aggregate).toBeCloseTo(82.44, 1);
    expect(result.breakdown.testType).toBe('sat');
    expect(result.breakdown.testPct).toBeCloseTo(81.25, 2);
  });

  it('ENG-03: calculates COMSATS aggregate accurately (10% Matric + 40% FSc + 50% NTS)', () => {
    const input: AcademicInput = {
      matricObtained: 950,
      matricTotal: 1100,
      fscObtained: 900,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { comsats: 75 }
    };
    const result = calculateUniversityAggregate(input, comsats);
    // (950/1100*10) + (900/1100*40) + (75*0.5) = 8.636 + 32.727 + 37.5 = 78.863%
    expect(result.aggregate).toBeCloseTo(78.86, 1);
  });

  it('ENG-04: calculates GIKI aggregate accurately (15% SSC + 85% Test)', () => {
    const input: AcademicInput = {
      matricObtained: 1050,
      matricTotal: 1100, // 95.454%
      fscObtained: 920,
      fscTotal: 1100, // FSc not in aggregate, eligibility check only
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { giki: 150 } // 150/200 = 75%
    };
    const result = calculateUniversityAggregate(input, giki);
    // (95.454 * 0.15) + (75 * 0.85) = 14.318 + 63.750 = 78.068%
    expect(result.aggregate).toBeCloseTo(78.07, 1);
    expect(result.breakdown.fscContribution).toBe(0);
  });

  it('ENG-05: calculates PUCIT aggregate accurately with Hafiz-e-Quran bonus', () => {
    // Academic Numerator: (0.25 * 900) + 850 + 20 = 225 + 850 + 20 = 1095
    // Academic Denominator: (0.25 * 1100) + 1100 = 275 + 1100 = 1375
    // Academic Pct: (1095 / 1375) * 100 = 79.636%
    // 75% Academic = 59.727%
    // Test: 65/100 -> 25% Test = 16.25%
    // Total: 59.727 + 16.25 = 75.977%
    const input: AcademicInput = {
      matricObtained: 900,
      matricTotal: 1100,
      fscObtained: 850,
      fscTotal: 1100,
      hafizQuran: true,
      useSat: false,
      satScore: 0,
      entryTestScores: { pucit: 65 }
    };
    const result = calculateUniversityAggregate(input, pucit);
    expect(result.aggregate).toBeCloseTo(75.98, 1);
  });

  it('ENG-06: calculates UET Lahore ECAT aggregate accurately (17% Matric + 50% FSc + 33% ECAT)', () => {
    // Matric: 1000/1100 (90.909%), FSc: 950/1100 (86.363%), ECAT: 280/400 (70.0%)
    // (90.909*0.17) + (86.363*0.50) + (70*0.33) = 15.455 + 43.182 + 23.100 = 81.737%
    const input: AcademicInput = {
      matricObtained: 1000,
      matricTotal: 1100,
      fscObtained: 950,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { uet: 280 }
    };
    const result = calculateUniversityAggregate(input, uet);
    expect(result.aggregate).toBeCloseTo(81.74, 1);
  });

  it('ENG-07: handles boundary 100% perfect scores', () => {
    const input: AcademicInput = {
      matricObtained: 1100,
      matricTotal: 1100,
      fscObtained: 1100,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { nust: 200 }
    };
    const result = calculateUniversityAggregate(input, nust);
    expect(result.aggregate).toBe(100);
  });

  it('ENG-08: flags academic eligibility warning when below minimum threshold', () => {
    // 55% in FSc is below 60% requirement for NUST
    const input: AcademicInput = {
      matricObtained: 550,
      matricTotal: 1100,
      fscObtained: 550,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { nust: 160 }
    };
    const result = calculateUniversityAggregate(input, nust);
    expect(result.isEligible).toBe(false);
    expect(result.eligibilityMessage).toContain('Eligibility warning');
  });

  it('ENG-09: flags ineligibility when SAT score is below FAST minimum threshold (1200)', () => {
    const input: AcademicInput = {
      matricObtained: 900,
      matricTotal: 1100,
      fscObtained: 850,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: true,
      satScore: 1150, // Below FAST CS minimum of 1200
      entryTestScores: {}
    };
    const result = calculateUniversityAggregate(input, fastCs);
    expect(result.isEligible).toBe(false);
    expect(result.eligibilityMessage).toContain('below FAST Computing\'s minimum eligibility threshold of 1200');
  });

  it('ENG-10: flags ineligibility when applying with SAT to universities that do not support SAT (PUCIT / UET)', () => {
    const input: AcademicInput = {
      matricObtained: 950,
      matricTotal: 1100,
      fscObtained: 900,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: true,
      satScore: 1400,
      entryTestScores: {}
    };
    const pucitResult = calculateUniversityAggregate(input, pucit);
    expect(pucitResult.isEligible).toBe(false);
    expect(pucitResult.eligibilityMessage).toContain('does not accept Digital SAT');

    const uetResult = calculateUniversityAggregate(input, uet);
    expect(uetResult.isEligible).toBe(false);
    expect(uetResult.eligibilityMessage).toContain('does not accept Digital SAT');
  });

  it('ENG-11: calculates NUST aggregate accurately on Digital SAT basis (75% SAT + 15% FSc + 10% Matric)', () => {
    // Matric: 980/1100 (89.0909%), FSc: 920/1100 (83.6364%), SAT: 1400/1600 (87.5%)
    // Expected: (89.0909*0.10) + (83.6364*0.15) + (87.5*0.75) = 8.909 + 12.545 + 65.625 = 87.079%
    const input: AcademicInput = {
      matricObtained: 980,
      matricTotal: 1100,
      fscObtained: 920,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: true,
      satScore: 1400,
      entryTestScores: {}
    };
    const result = calculateUniversityAggregate(input, nust);
    expect(result.aggregate).toBeCloseTo(87.08, 1);
    expect(result.isEligible).toBe(true);
    expect(result.breakdown.testType).toBe('sat');
  });

  it('ENG-12: calculates aggregate accurately with new 1200 marks scheme (Tarjuma-tul-Quran)', () => {
    // Matric: 1080/1200 (90.0%), FSc: 1020/1200 (85.0%), NET: 160/200 (80.0%)
    // Expected: (90.0 * 0.10) + (85.0 * 0.15) + (80.0 * 0.75) = 9.0 + 12.75 + 60.0 = 81.75%
    const input: AcademicInput = {
      matricObtained: 1080,
      matricTotal: 1200,
      fscObtained: 1020,
      fscTotal: 1200,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { nust: 160 }
    };
    const result = calculateUniversityAggregate(input, nust);
    expect(result.aggregate).toBeCloseTo(81.75, 2);
    expect(result.breakdown.matricContribution).toBeCloseTo(9.0, 2);
    expect(result.breakdown.fscContribution).toBeCloseTo(12.75, 2);
    expect(result.breakdown.testContribution).toBeCloseTo(60.0, 2);
  });

  it('ENG-13: calculates aggregate accurately with Part-1 only (550 / 520 marks scheme)', () => {
    // Matric: 1000/1100 (90.909%), FSc Part-1: 495/550 (90.0%), NU Test: 75/100 (75.0%)
    // FAST CS: 10% Matric + 40% FSc + 50% Test
    // Expected: (90.909 * 0.10) + (90.0 * 0.40) + (75.0 * 0.50) = 9.091 + 36.0 + 37.5 = 82.591%
    const input: AcademicInput = {
      matricObtained: 1000,
      matricTotal: 1100,
      fscObtained: 495,
      fscTotal: 550,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { fast_cs: 75 }
    };
    const result = calculateUniversityAggregate(input, fastCs);
    expect(result.aggregate).toBeCloseTo(82.59, 1);
  });

  it('ENG-14: calculates Medical aggregate accurately using PMDC standard (50% MDCAT + 40% FSc + 10% Matric)', () => {
    const uhs = universities.find(u => u.id === 'uhs')!;
    // Matric: 1000/1100 (90.909%), FSc: 980/1100 (89.091%), MDCAT: 175/200 (87.5%)
    // Expected: (90.909 * 0.10) + (89.091 * 0.40) + (87.5 * 0.50) = 9.091 + 35.636 + 43.75 = 88.477%
    const input: AcademicInput = {
      matricObtained: 1000,
      matricTotal: 1100,
      fscObtained: 980,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { mdcat: 175 }
    };
    const result = calculateUniversityAggregate(input, uhs);
    expect(result.aggregate).toBeCloseTo(88.48, 1);
    expect(result.isEligible).toBe(true);
    expect(result.breakdown.matricContribution).toBeCloseTo(9.09, 1);
    expect(result.breakdown.fscContribution).toBeCloseTo(35.64, 1);
    expect(result.breakdown.testContribution).toBeCloseTo(43.75, 1);
  });

  it('ENG-15: applies +20 marks Hafiz-e-Quran bonus to FSc in PMDC medical aggregate', () => {
    const uhs = universities.find(u => u.id === 'uhs')!;
    // Matric: 1000/1100, FSc: 950/1100 -> with Hafiz: (950 + 20) = 970/1100 (88.182%)
    const inputNoHafiz: AcademicInput = {
      matricObtained: 1000,
      matricTotal: 1100,
      fscObtained: 950,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { mdcat: 170 }
    };
    const inputWithHafiz: AcademicInput = {
      ...inputNoHafiz,
      hafizQuran: true
    };
    const resNo = calculateUniversityAggregate(inputNoHafiz, uhs);
    const resHafiz = calculateUniversityAggregate(inputWithHafiz, uhs);
    // Difference in FSc contribution: (20 / 1100) * 100 * 0.40 = 0.727%
    expect(resHafiz.aggregate - resNo.aggregate).toBeCloseTo(0.727, 2);
  });

  it('ENG-16: flags PMDC ineligibility when MDCAT is below 100/200 (< 50%)', () => {
    const uhs = universities.find(u => u.id === 'uhs')!;
    const input: AcademicInput = {
      matricObtained: 1000,
      matricTotal: 1100,
      fscObtained: 950,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { mdcat: 95 } // Below 100 minimum threshold
    };
    const result = calculateUniversityAggregate(input, uhs);
    expect(result.isEligible).toBe(false);
    expect(result.eligibilityMessage).toContain('below PMDC minimum pass threshold');
  });

  it('ENG-17: calculates NED University formula accurately (60% Test + 40% HSC + 0% SSC)', () => {
    const ned = universities.find(u => u.id === 'ned')!;
    // Matric: 1000/1100 (not counted), FSc: 880/1100 (80.0%), NED Test: 80/100 (80.0%)
    // Expected: (80.0 * 0.40) + (80.0 * 0.60) = 32.0 + 48.0 = 80.0%
    const input: AcademicInput = {
      matricObtained: 1000,
      matricTotal: 1100,
      fscObtained: 880,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { ned: 80 }
    };
    const result = calculateUniversityAggregate(input, ned);
    expect(result.aggregate).toBeCloseTo(80.0, 1);
    expect(result.breakdown.matricContribution).toBeCloseTo(0.0, 1);
  });

  it('ENG-18: calculates PIEAS Islamabad aggregate accurately (60% Written Test + 25% FSc + 15% Matric)', () => {
    const pieas = universities.find(u => u.id === 'pieas')!;
    // Matric: 990/1100 (90.0%), FSc: 880/1100 (80.0%), Test: 75/100 (75.0%)
    // Expected: (90.0 * 0.15) + (80.0 * 0.25) + (75.0 * 0.60) = 13.5 + 20.0 + 45.0 = 78.5%
    const input: AcademicInput = {
      matricObtained: 990,
      matricTotal: 1100,
      fscObtained: 880,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { pieas: 75 }
    };
    const result = calculateUniversityAggregate(input, pieas);
    expect(result.aggregate).toBeCloseTo(78.5, 1);
  });

  it('ENG-19: calculates IBA Karachi aggregate based on Aptitude Test (100% test determination)', () => {
    const iba = universities.find(u => u.id === 'iba_cs')!;
    const input: AcademicInput = {
      matricObtained: 950,
      matricTotal: 1100,
      fscObtained: 900,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { iba_cs: 84 }
    };
    const result = calculateUniversityAggregate(input, iba);
    expect(result.aggregate).toBeCloseTo(84.0, 1);
    expect(result.isEligible).toBe(true);
  });

  it('ENG-20: flags ineligibility and sets aggregate to 0 when hasFailedSubject is true', () => {
    const input: AcademicInput = {
      matricObtained: 950,
      matricTotal: 1100,
      fscObtained: 900,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { nust: 160 },
      hasFailedSubject: true,
      failedSubjectDetails: 'Failed Mathematics in A-Levels'
    };
    const result = calculateUniversityAggregate(input, nust);
    expect(result.isEligible).toBe(false);
    expect(result.aggregate).toBe(0);
    expect(result.eligibilityMessage).toContain('Failed Mathematics in A-Levels');
  });

  it('ENG-21: rejects negative marks with an explicit error', () => {
    const input: AcademicInput = {
      matricObtained: -50,
      matricTotal: 1100,
      fscObtained: 900,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { nust: 160 }
    };
    const result = calculateUniversityAggregate(input, nust);
    expect(result.isEligible).toBe(false);
    expect(result.aggregate).toBe(0);
    expect(result.eligibilityMessage).toContain('cannot be negative');
  });

  it('ENG-22: rejects total marks <= 0 with an explicit error', () => {
    const input: AcademicInput = {
      matricObtained: 800,
      matricTotal: 0,
      fscObtained: 900,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { nust: 160 }
    };
    const result = calculateUniversityAggregate(input, nust);
    expect(result.isEligible).toBe(false);
    expect(result.aggregate).toBe(0);
    expect(result.eligibilityMessage).toContain('must be greater than zero');
  });

  it('ENG-23: rejects obtained marks exceeding total marks', () => {
    const input: AcademicInput = {
      matricObtained: 1250,
      matricTotal: 1100,
      fscObtained: 900,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: { nust: 160 }
    };
    const result = calculateUniversityAggregate(input, nust);
    expect(result.isEligible).toBe(false);
    expect(result.aggregate).toBe(0);
    expect(result.eligibilityMessage).toContain('cannot exceed total marks');
  });

  it('ENG-24: rejects negative SAT score', () => {
    const input: AcademicInput = {
      matricObtained: 1000,
      matricTotal: 1100,
      fscObtained: 900,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: true,
      satScore: -50,
      entryTestScores: {}
    };
    const result = calculateUniversityAggregate(input, fastCs);
    expect(result.isEligible).toBe(false);
    expect(result.aggregate).toBe(0);
    expect(result.eligibilityMessage).toContain('Invalid SAT score');
  });
});

