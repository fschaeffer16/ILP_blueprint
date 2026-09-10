import { describe, expect, it } from 'vitest';
import { goalProgressFrom, validateIEPGoal, type IEPGoal } from '../src/index.js';
import { ESE_IEP_GOALS, ESE_INDEPENDENCE_ATTEMPTS, SAMPLE_MODULES } from '../src/fixtures/index.js';

const goal = (id: string) => ESE_IEP_GOALS.find((g) => g.goalId === id)!;

describe('IEP goals as module chains (IEP build step 4)', () => {
  it('every fixture goal passes the goal gate against the class modules', () => {
    for (const g of ESE_IEP_GOALS) {
      expect(validateIEPGoal(g, SAMPLE_MODULES), g.goalId).toHaveLength(0);
    }
  });

  it('a goal chained to an unknown module, or without the plan’s words, blocks', () => {
    const bad: IEPGoal = { ...goal('G-LEO-1'), goalId: 'G-X', moduleIds: ['M99'], goalText: ' ' };
    const f = validateIEPGoal(bad, SAMPLE_MODULES);
    expect(f.some((x) => x.code === 'UNKNOWN_MODULE' && x.severity === 'blocking')).toBe(true);
    expect(f.some((x) => x.code === 'EMPTY_GOAL_TEXT' && x.severity === 'blocking')).toBe(true);
  });

  it('Leo’s goal is met: three-plus consecutive criterion sessions at gestural-or-above', () => {
    const p = goalProgressFrom(goal('G-LEO-1'), ESE_INDEPENDENCE_ATTEMPTS);
    expect(p.status).toBe('met');
    expect(p.consecutiveCriterionSessions).toBeGreaterThanOrEqual(3);
    expect(p.qualifyingAttempts).toBe(5);
    expect(p.supportedAttempts).toBe(3); // the early supported work stays visible
    expect(p.accuracyAtCriterionLevel).toBe(1);
  });

  it('the criterion’s prompt level is enforced: Maya’s independence goal has no qualifying evidence yet', () => {
    const p = goalProgressFrom(goal('G-MAYA-1'), ESE_INDEPENDENCE_ATTEMPTS);
    expect(p.qualifyingAttempts).toBe(0); // 100% correct — but never independent
    expect(p.supportedAttempts).toBe(6);
    expect(p.status).toBe('insufficient_evidence');
  });

  it('Zara is progressing: below criterion, evidence still accruing', () => {
    const p = goalProgressFrom(goal('G-ZARA-1'), ESE_INDEPENDENCE_ATTEMPTS);
    expect(p.status).toBe('progressing');
    expect(p.consecutiveCriterionSessions).toBeLessThan(3);
  });

  it('per-module rollup accrues on the chain, and input order is irrelevant', () => {
    const p = goalProgressFrom(goal('G-LEO-1'), ESE_INDEPENDENCE_ATTEMPTS);
    expect(p.perModule).toHaveLength(1);
    expect(p.perModule[0]).toMatchObject({ moduleId: 'M2', attempts: 8 });
    const shuffled = goalProgressFrom(goal('G-LEO-1'), [...ESE_INDEPENDENCE_ATTEMPTS].reverse());
    expect(shuffled).toEqual(p);
  });
});
