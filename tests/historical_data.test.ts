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
});
