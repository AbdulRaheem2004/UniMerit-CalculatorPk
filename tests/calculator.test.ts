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
});
