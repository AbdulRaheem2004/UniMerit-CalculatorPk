import { describe, it, expect } from 'vitest';
import historicalDataJson from '../data/historical_merits.json';
import { HistoricalMeritRecord } from '../src/engine/types';

const records = historicalDataJson as HistoricalMeritRecord[];

describe('Historical Merit Data Integrity & Authentication (2016-2026)', () => {
  it('DAT-01: contains records spanning the required 2016-2026 window', () => {
    const years = records.map(r => r.year);
    expect(years).toContain(2026);
    expect(years).toContain(2024);
    expect(years).toContain(2020);
    expect(years).toContain(2016);
  });

  it('DAT-02: strictly validates that verified records have authenticated sources and non-null cutoffs', () => {
    const verifiedRecords = records.filter(r => r.status === 'verified');
    expect(verifiedRecords.length).toBeGreaterThan(0);

    for (const record of verifiedRecords) {
      expect(record.verificationSource).toBeDefined();
      expect(record.verificationSource?.title).toBeTruthy();
      expect(record.verificationSource?.type).toBeTruthy();
      
      // Must have either closing aggregate % or closing merit rank (e.g. NUST)
      const hasMetric = (typeof record.closingAggregate === 'number') || (typeof record.closingMeritPosition === 'number');
      expect(hasMetric).toBe(true);
    }
  });

  it('DAT-03: strictly enforces that unverified / missing years are explicitly reported with notes rather than assumed', () => {
    const notFoundRecords = records.filter(r => r.status === 'not_found' || r.status === 'special_policy_year');
    expect(notFoundRecords.length).toBeGreaterThan(0);

    for (const record of notFoundRecords) {
      // Must provide transparent notes explaining why it was not published or COVID policy
      expect(record.notes).toBeDefined();
      expect(record.notes?.length).toBeGreaterThan(15);
      // No assumed fake closing aggregates
      if (record.status === 'not_found') {
        expect(record.closingAggregate).toBeUndefined();
      }
    }
  });

  it('DAT-04: verifies concluded admission cycle records for 2025 & 2026 with authentic sources', () => {
    const records2026 = records.filter(r => r.year === 2026);
    expect(records2026.length).toBeGreaterThan(0);
    for (const rec of records2026) {
      expect(rec.status).toBe('verified');
      expect(rec.verificationSource).toBeDefined();
      expect(rec.verificationSource?.title).toBeTruthy();
      const hasMetric = (typeof rec.closingAggregate === 'number') || (typeof rec.closingMeritPosition === 'number');
      expect(hasMetric).toBe(true);
    }

    const records2025 = records.filter(r => r.year === 2025);
    expect(records2025.length).toBeGreaterThan(0);
    for (const rec of records2025) {
      expect(rec.status).toBe('verified');
      expect(rec.verificationSource).toBeDefined();
      const hasMetric = (typeof rec.closingAggregate === 'number') || (typeof rec.closingMeritPosition === 'number');
      expect(hasMetric).toBe(true);
    }
  });

  it('DAT-05: covers verified multi-campus records across major disciplines for 2024', () => {
    const verified2024 = records.filter(r => r.year === 2024 && r.status === 'verified');
    const campuses = new Set(verified2024.map(r => r.campus));
    
    // FAST multi-campus coverage
    expect(Array.from(campuses).some(c => c.includes('Islamabad'))).toBe(true);
    expect(Array.from(campuses).some(c => c.includes('Lahore'))).toBe(true);
    expect(Array.from(campuses).some(c => c.includes('Karachi'))).toBe(true);
    expect(Array.from(campuses).some(c => c.includes('Peshawar'))).toBe(true);
    expect(Array.from(campuses).some(c => c.includes('CFD'))).toBe(true);

    // COMSATS multi-campus coverage
    expect(Array.from(campuses).some(c => c.includes('Abbottabad'))).toBe(true);
    expect(Array.from(campuses).some(c => c.includes('Wah'))).toBe(true);

    // Multi-discipline coverage
    const disciplines = new Set(verified2024.map(r => r.discipline));
    expect(disciplines).toContain('BS Computer Science');
    expect(disciplines).toContain('BS Software Engineering');
    expect(disciplines).toContain('Electrical Engineering');
    expect(disciplines).toContain('BBA');
  });
});
