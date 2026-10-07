import { describe, it, expect } from 'vitest';
import { solveRequiredTestScore } from '../src/engine/reverse';
import universitiesJson from '../data/universities.json';
import { UniversityConfig, AcademicInput } from '../src/engine/types';

const universities = universitiesJson as UniversityConfig[];
const nust = universities.find(u => u.id === 'nust')!;
const fastCs = universities.find(u => u.id === 'fast_cs')!;

describe('Reverse Target Score Solver Engine', () => {
  it('REV-01: calculates required NET score for a realistic target', () => {
    // Student: Matric 980/1100 (89.09%), FSc 900/1100 (81.82%)
    // Current academic contribution: (8.909 + 12.273) = 21.182%
    // Target NUST CS: 78.50%
    // Remaining needed: 78.50 - 21.182 = 57.318%
    // NET weight: 75% -> required test pct = 57.318 / 0.75 = 76.42%
    // NET raw score = 76.42% of 200 = 152.85 -> ceil = 153/200
    const input: AcademicInput = {
      matricObtained: 980,
      matricTotal: 1100,
      fscObtained: 900,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: {}
    };

    const result = solveRequiredTestScore(input, nust, 78.50);
    expect(result.status).toBe('achievable');
    expect(result.targetScore).toBe(153);
    expect(result.maxScore).toBe(200);
    expect(result.testType).toBe('local');
  });

  it('REV-02: identifies mathematically impossible target scores', () => {
    // If student has low intermediate marks and aims for 95% aggregate
    const input: AcademicInput = {
      matricObtained: 600,
      matricTotal: 1100,
      fscObtained: 600,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: {}
    };

    const result = solveRequiredTestScore(input, nust, 95.0);
    expect(result.status).toBe('impossible');
    expect(result.targetScore).toBeGreaterThan(200);
    expect(result.message).toContain('exceeds maximum possible');
  });

  it('REV-03: identifies when student already qualifies without needing test', () => {
    const input: AcademicInput = {
      matricObtained: 1100,
      matricTotal: 1100,
      fscObtained: 1100,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: false,
      satScore: 0,
      entryTestScores: {}
    };

    // For a low target cutoff where academics alone are enough
    const result = solveRequiredTestScore(input, fastCs, 40.0);
    expect(result.status).toBe('already_achieved');
    expect(result.targetScore).toBe(0);
  });

  it('REV-04: solves required SAT score out of 1600 for FAST Computing', () => {
    const input: AcademicInput = {
      matricObtained: 980,
      matricTotal: 1100,
      fscObtained: 920,
      fscTotal: 1100,
      hafizQuran: false,
      useSat: true,
      satScore: 0,
      entryTestScores: {}
    };

    // Target FAST CS cutoff: 75.0%
    const result = solveRequiredTestScore(input, fastCs, 75.0, true);
    expect(result.status).toBe('achievable');
    expect(result.testType).toBe('sat');
    expect(result.maxScore).toBe(1600);
    expect(result.targetScore).toBeGreaterThan(1000);
    expect(result.targetScore).toBeLessThanOrEqual(1600);
  });
});
