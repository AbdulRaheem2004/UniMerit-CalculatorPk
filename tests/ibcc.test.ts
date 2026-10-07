import { describe, it, expect } from 'vitest';
import { calculateIBCCEquivalence } from '../src/engine/ibcc';

describe('IBCC O/A-Level Equivalence Engine', () => {
  it('IBCC-01: calculates 8 straight A* grades correctly', () => {
    // 8 * 90 = 720 / 800 = 90% -> 990/1100 marks
    const grades = ['A*', 'A*', 'A*', 'A*', 'A*', 'A*', 'A*', 'A*'];
    const result = calculateIBCCEquivalence(grades);
    expect(result.percentage).toBe(90.0);
    expect(result.obtainedMarks).toBe(990);
    expect(result.totalMarks).toBe(1100);
    expect(result.subjectCount).toBe(8);
  });

  it('IBCC-02: calculates mixed grades (4 A*, 4 A)', () => {
    // (4 * 90 + 4 * 85) = (360 + 340) = 700 / 800 = 87.5% -> 87.5% of 1100 = 963 marks
    const grades = ['A*', 'A*', 'A*', 'A*', 'A', 'A', 'A', 'A'];
    const result = calculateIBCCEquivalence(grades);
    expect(result.percentage).toBe(87.5);
    expect(result.obtainedMarks).toBe(963);
  });

  it('IBCC-03: handles empty grades safely', () => {
    const result = calculateIBCCEquivalence([]);
    expect(result.obtainedMarks).toBe(0);
    expect(result.percentage).toBe(0);
  });
});
