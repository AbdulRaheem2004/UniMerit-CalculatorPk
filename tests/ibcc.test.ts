import { describe, it, expect } from 'vitest';
import { calculateIBCCEquivalence, calculateALevelEquivalence } from '../src/engine/ibcc';

describe('IBCC O/A-Level Equivalence Engine', () => {
  it('IBCC-01: calculates 8 straight A* grades correctly', () => {
    // 8 * 90 = 720 / 800 = 90% -> 990/1100 marks
    const grades = ['A*', 'A*', 'A*', 'A*', 'A*', 'A*', 'A*', 'A*'];
    const result = calculateIBCCEquivalence(grades);
    expect(result.percentage).toBe(90.0);
    expect(result.obtainedMarks).toBe(990);
    expect(result.totalMarks).toBe(1100);
    expect(result.subjectCount).toBe(8);
    expect(result.isEligible).toBe(true);
    expect(result.hasFailedSubject).toBe(false);
  });

  it('IBCC-02: calculates mixed grades (4 A*, 4 A)', () => {
    // (4 * 90 + 4 * 85) = (360 + 340) = 700 / 800 = 87.5% -> 87.5% of 1100 = 963 marks
    const grades = ['A*', 'A*', 'A*', 'A*', 'A', 'A', 'A', 'A'];
    const result = calculateIBCCEquivalence(grades);
    expect(result.percentage).toBe(87.5);
    expect(result.obtainedMarks).toBe(963);
    expect(result.isEligible).toBe(true);
    expect(result.hasFailedSubject).toBe(false);
  });

  it('IBCC-03: handles empty grades safely', () => {
    const result = calculateIBCCEquivalence([]);
    expect(result.obtainedMarks).toBe(0);
    expect(result.percentage).toBe(0);
    expect(result.isEligible).toBe(false);
  });

  it('IBCC-04: flags ineligibility when ANY O-Level subject is Grade U (Fail)', () => {
    // 7 A* + 1 U
    const grades = ['A*', 'A*', 'A*', 'A*', 'A*', 'A*', 'A*', 'U'];
    const subjects = ['English', 'Math', 'Urdu', 'Islamiyat', 'PakStudies', 'Physics', 'Chemistry', 'Biology'];
    const result = calculateIBCCEquivalence(grades, subjects);
    expect(result.hasFailedSubject).toBe(true);
    expect(result.isEligible).toBe(false);
    expect(result.failedSubjects).toContain('Biology');
    expect(result.ineligibilityReason).toContain('IBCC regulations');
    expect(result.ineligibilityReason).toContain('Grade \'U\'');
  });

  it('IBCC-05: calculates 3 passing A-Level subjects correctly', () => {
    // A* (90), A (85), B (75) -> 250 / 300 = 83.333% -> 917/1100 marks
    const grades = ['A*', 'A', 'B'];
    const subjects = ['Mathematics', 'Physics', 'Chemistry'];
    const result = calculateALevelEquivalence(grades, subjects);
    expect(result.percentage).toBeCloseTo(83.33, 1);
    expect(result.obtainedMarks).toBe(917);
    expect(result.isEligible).toBe(true);
    expect(result.hasFailedSubject).toBe(false);
  });

  it('IBCC-06: flags ineligibility when any A-Level subject is Grade U (Fail)', () => {
    // A* (90), A (85), U (0) -> Failed subject in A-Levels
    const grades = ['A*', 'A', 'U'];
    const subjects = ['Mathematics', 'Physics', 'Chemistry'];
    const result = calculateALevelEquivalence(grades, subjects);
    expect(result.hasFailedSubject).toBe(true);
    expect(result.isEligible).toBe(false);
    expect(result.failedSubjects).toContain('Chemistry');
    expect(result.ineligibilityReason).toContain('HSSC Equivalence rejection');
  });
});
