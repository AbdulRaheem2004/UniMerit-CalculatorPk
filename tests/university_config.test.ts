import { describe, it, expect } from 'vitest';
import universitiesJson from '../data/universities.json';
import { UniversityConfig } from '../src/engine/types';

const universities = universitiesJson as UniversityConfig[];

describe('University Configuration, Official Criteria & Admission Portals', () => {
  it('UNI-01: contains all major Pakistani universities across disciplines', () => {
    const ids = universities.map(u => u.id);
    expect(ids).toContain('nust');
    expect(ids).toContain('fast_cs');
    expect(ids).toContain('fast_eng');
    expect(ids).toContain('comsats');
    expect(ids).toContain('giki');
    expect(ids).toContain('pucit');
    expect(ids).toContain('uet');
  });

  it('UNI-02: verifies all universities have valid official criteria URLs starting with https://', () => {
    for (const uni of universities) {
      expect(uni.sourceUrl).toBeDefined();
      expect(uni.sourceUrl).toMatch(/^https:\/\//);
      expect(uni.sourceUrl.length).toBeGreaterThan(12);
    }
  });

  it('UNI-03: verifies formula weightages sum up to 100% for standard universities', () => {
    for (const uni of universities) {
      if (uni.customFormula === 'pucit_standard') {
        // PUCIT uses custom composite formula: 75% Academic + 25% Entry Test
        expect(uni.formulaDisplay).toContain('75% Academic');
        expect(uni.formulaDisplay).toContain('25% Entry Test');
        continue;
      }
      expect(uni.weights).toBeDefined();
      if (uni.weights) {
        const sum = uni.weights.matric + uni.weights.fsc + uni.weights.test;
        expect(sum).toBeCloseTo(1.0, 2);
      }
    }
  });

  it('UNI-04: verifies multi-campus university lists are comprehensive and authentic', () => {
    const fastCs = universities.find(u => u.id === 'fast_cs')!;
    expect(fastCs.campuses).toContain('Islamabad');
    expect(fastCs.campuses).toContain('Lahore');
    expect(fastCs.campuses).toContain('Karachi');
    expect(fastCs.campuses).toContain('Peshawar');
    expect(fastCs.campuses).toContain('CFD (Faisalabad)');

    const comsats = universities.find(u => u.id === 'comsats')!;
    expect(comsats.campuses).toContain('Islamabad');
    expect(comsats.campuses).toContain('Lahore');
    expect(comsats.campuses).toContain('Abbottabad');
    expect(comsats.campuses).toContain('Wah');
  });

  it('UNI-05: verifies Digital SAT policies and min score thresholds are properly defined', () => {
    const satSupportedUnis = universities.filter(u => u.satSupported);
    expect(satSupportedUnis.length).toBeGreaterThanOrEqual(4);

    for (const uni of satSupportedUnis) {
      expect(uni.satTotal).toBe(1600);
      expect(uni.satNotes).toBeDefined();
      expect(uni.satNotes!.length).toBeGreaterThan(10);
    }

    const pucit = universities.find(u => u.id === 'pucit')!;
    expect(pucit.satSupported).toBe(false);

    const uet = universities.find(u => u.id === 'uet')!;
    expect(uet.satSupported).toBe(false);
  });

  it('UNI-06: verifies official notes document gap year policies and 2025/2026 cycle update', () => {
    const nust = universities.find(u => u.id === 'nust')!;
    expect(nust.notes).toContain('0% gap year deduction');
    expect(nust.notes).toContain('2025/2026');

    const pucit = universities.find(u => u.id === 'pucit')!;
    expect(pucit.notes).toContain('2 marks per late session');
  });
});
