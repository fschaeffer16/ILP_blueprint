import { describe, expect, it } from 'vitest';
import { aggregate, rollupBy, buildRollups } from '../src/index.js';
import type { OutcomeRecord } from '../src/index.js';
import { SAMPLE_OUTCOMES } from '../src/fixtures/index.js';

const rec = (o: Partial<OutcomeRecord>): OutcomeRecord => ({
  studentId: 'S', studentName: 'S', className: 'C', grade: '3', school: 'Sch', district: 'D',
  objectiveId: 'O', masteryMet: false, fraction: 0.5, ...o,
});

describe('aggregate', () => {
  it('computes counts, mastery %, and average', () => {
    const a = aggregate([
      rec({ studentId: 'a', masteryMet: true, fraction: 0.9 }),
      rec({ studentId: 'b', masteryMet: false, fraction: 0.5 }),
      rec({ studentId: 'c', masteryMet: true, fraction: 0.8 }),
    ]);
    expect(a.n).toBe(3);
    expect(a.students).toBe(3);
    expect(a.mastered).toBe(2);
    expect(a.masteredPct).toBeCloseTo(0.667, 2);
    expect(a.avgFraction).toBeCloseTo(0.733, 2);
  });

  it('handles the empty set without dividing by zero', () => {
    const a = aggregate([]);
    expect(a).toMatchObject({ n: 0, masteredPct: 0, avgFraction: 0, medianTimeToMastery: null });
  });

  it('takes the median of times-to-mastery, ignoring unmastered', () => {
    const a = aggregate([
      rec({ masteryMet: true, timeToMasteryDays: 4 }),
      rec({ masteryMet: true, timeToMasteryDays: 10 }),
      rec({ masteryMet: false }),
    ]);
    expect(a.medianTimeToMastery).toBe(7);
  });
});

describe('rollupBy', () => {
  it('groups by a dimension and aggregates each group', () => {
    const rows = rollupBy(
      [rec({ school: 'X', masteryMet: true }), rec({ school: 'X' }), rec({ school: 'Y', masteryMet: true })],
      'school',
    );
    expect(rows.map((r) => r.key)).toEqual(['X', 'Y']); // sorted, stable
    expect(rows.find((r) => r.key === 'X')!.agg.n).toBe(2);
    expect(rows.find((r) => r.key === 'Y')!.agg.masteredPct).toBe(1);
  });
});

describe('buildRollups over the synthetic district', () => {
  const r = buildRollups(SAMPLE_OUTCOMES);

  it('rolls the same records up through every level consistently', () => {
    expect(r.overall.n).toBe(SAMPLE_OUTCOMES.length);
    // Every level partitions the same records → same total n.
    for (const level of [r.byDistrict, r.bySchool, r.byGrade, r.byClass, r.byStudent, r.byObjective]) {
      expect(level.reduce((s, row) => s + row.agg.n, 0)).toBe(SAMPLE_OUTCOMES.length);
    }
  });

  it('produces the expected shape of the district (two schools, grades 2-4)', () => {
    expect(r.byDistrict).toHaveLength(1);
    expect(r.bySchool).toHaveLength(2);
    expect(r.byGrade.map((g) => g.key)).toEqual(['2', '3', '4']);
  });

  it('is deterministic', () => {
    expect(JSON.stringify(buildRollups(SAMPLE_OUTCOMES))).toBe(JSON.stringify(r));
  });
});
