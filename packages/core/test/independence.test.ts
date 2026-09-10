import { describe, expect, it } from 'vitest';
import {
  INDEPENDENCE_WEIGHT,
  buildIndependenceTrend,
  type PromptedAttempt,
} from '../src/index.js';
import { ESE_INDEPENDENCE_ATTEMPTS } from '../src/fixtures/index.js';

const KEY = { objectiveId: 'M3.NF.02', moduleId: 'M2' };

describe('prompt-level evidence & the independence trend (IEP build step 3)', () => {
  it('independence weights are strictly ordered from independent down to full support', () => {
    expect(INDEPENDENCE_WEIGHT.independent).toBeGreaterThan(INDEPENDENCE_WEIGHT.gestural_prompt);
    expect(INDEPENDENCE_WEIGHT.gestural_prompt).toBeGreaterThan(INDEPENDENCE_WEIGHT.modeled);
    expect(INDEPENDENCE_WEIGHT.modeled).toBeGreaterThan(INDEPENDENCE_WEIGHT.full_support);
  });

  it('prompt level never changes correctness — full-support corrects still count correct', () => {
    const t = buildIndependenceTrend(ESE_INDEPENDENCE_ATTEMPTS, { studentId: 'E-MAYA', ...KEY });
    expect(t.correctRate).toBe(1); // all correct, none independent
    expect(t.independentMasteryRate).toBe(0); // …but independent mastery is separate
  });

  it('Leo is gaining independence, and the last three attempts support a fade conversation', () => {
    const t = buildIndependenceTrend(ESE_INDEPENDENCE_ATTEMPTS, { studentId: 'E-LEO', ...KEY });
    expect(t.direction).toBe('gaining_independence');
    expect(t.readyToFade).toBe(true);
    expect(t.latestLevel).toBe('independent');
    expect(t.lateIndependence).toBeGreaterThan(t.earlyIndependence);
  });

  it('Zara is steady — no fade signal from a mixed record', () => {
    const t = buildIndependenceTrend(ESE_INDEPENDENCE_ATTEMPTS, { studentId: 'E-ZARA', ...KEY });
    expect(t.direction).toBe('steady');
    expect(t.readyToFade).toBe(false);
  });

  it('correct-only-with-support is flagged — supported mastery, not independence', () => {
    const maya = buildIndependenceTrend(ESE_INDEPENDENCE_ATTEMPTS, { studentId: 'E-MAYA', ...KEY });
    expect(maya.correctOnlyWithSupport).toBe(true);
    const leo = buildIndependenceTrend(ESE_INDEPENDENCE_ATTEMPTS, { studentId: 'E-LEO', ...KEY });
    expect(leo.correctOnlyWithSupport).toBe(false);
  });

  it('fewer than four attempts is insufficient evidence, and readyToFade needs a full window', () => {
    const short: PromptedAttempt[] = ESE_INDEPENDENCE_ATTEMPTS.filter(
      (a) => a.studentId === 'E-LEO',
    ).slice(-2);
    const t = buildIndependenceTrend(short, { studentId: 'E-LEO', ...KEY });
    expect(t.direction).toBe('insufficient_evidence');
    expect(t.readyToFade).toBe(false); // two independent corrects are not a window
  });

  it('input order is irrelevant — the trend sorts by date', () => {
    const shuffled = [...ESE_INDEPENDENCE_ATTEMPTS].reverse();
    expect(buildIndependenceTrend(shuffled, { studentId: 'E-LEO', ...KEY })).toEqual(
      buildIndependenceTrend(ESE_INDEPENDENCE_ATTEMPTS, { studentId: 'E-LEO', ...KEY }),
    );
  });
});
