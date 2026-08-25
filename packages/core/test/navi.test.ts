import { describe, expect, it } from 'vitest';
import { summarizeAssistantFlags } from '../src/index.js';
import { SAMPLE_NAVI_FLAGS, CONTENT_LIBRARY } from '../src/fixtures/index.js';

describe('Navi flag summary (teacher signal)', () => {
  const report = summarizeAssistantFlags(SAMPLE_NAVI_FLAGS, CONTENT_LIBRARY.objectives);

  it('counts total flags and distinct students needing help', () => {
    expect(report.totalFlags).toBe(SAMPLE_NAVI_FLAGS.length);
    const distinct = new Set(SAMPLE_NAVI_FLAGS.map((f) => f.studentAlias)).size;
    expect(report.studentsNeedingHelp).toBe(distinct);
  });

  it('ranks objectives by how many distinct students are stuck', () => {
    const top = report.byObjective[0];
    expect(top.objectiveId).toBe('M3.NF.01'); // the seeded cluster
    for (let i = 1; i < report.byObjective.length; i++) {
      const prev = report.byObjective[i - 1];
      const cur = report.byObjective[i];
      expect(prev.studentCount * 1000 + prev.flagCount).toBeGreaterThanOrEqual(cur.studentCount * 1000 + cur.flagCount);
    }
  });

  it('raises a reteach signal only once enough distinct students flag an objective', () => {
    const nf = report.byObjective.find((o) => o.objectiveId === 'M3.NF.01')!;
    expect(nf.studentCount).toBeGreaterThanOrEqual(3);
    expect(nf.reteachSignal).toBe(true);
    // A single-student objective must not trip the reteach signal.
    const single = report.byObjective.find((o) => o.studentCount === 1);
    if (single) expect(single.reteachSignal).toBe(false);
  });

  it('clusters flags into themes tied to the objective’s essential knowledge', () => {
    const nf = report.byObjective.find((o) => o.objectiveId === 'M3.NF.01')!;
    // "denominator" is essential knowledge for M3.NF.01 and several questions mention it.
    const denom = nf.themes.find((t) => t.idea === 'denominator');
    expect(denom).toBeDefined();
    expect(denom!.count).toBeGreaterThanOrEqual(2);
  });

  it('carries every flag reason through into the per-objective breakdown', () => {
    const totalByReason = report.byObjective.reduce(
      (n, o) => n + o.reasons.unanswered + o.reasons.answer_seeking + o.reasons.stuck + o.reasons.repeated,
      0,
    );
    expect(totalByReason).toBe(SAMPLE_NAVI_FLAGS.length);
  });

  it('respects a custom reteach threshold', () => {
    const strict = summarizeAssistantFlags(SAMPLE_NAVI_FLAGS, CONTENT_LIBRARY.objectives, { reteachStudentThreshold: 99 });
    expect(strict.byObjective.every((o) => !o.reteachSignal)).toBe(true);
  });
});
