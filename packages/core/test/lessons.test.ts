import { describe, expect, it } from 'vitest';
import { validateLessonPlan } from '../src/index.js';
import type { LessonPlan } from '../src/index.js';
import { OBJ_M3_NF_01, SAMPLE_LESSON_PLAN, SAMPLE_SOURCES } from '../src/fixtures/index.js';

const ctx = { objective: OBJ_M3_NF_01, approvedSources: SAMPLE_SOURCES };
const codes = (r: { issues: readonly { code: string }[] }) => r.issues.map((i) => i.code);

describe('lesson-plan authoring gate', () => {
  it('passes a plan that teaches, assesses, is sourced, and covers the reasoning', () => {
    const r = validateLessonPlan(SAMPLE_LESSON_PLAN, ctx);
    expect(r.ok).toBe(true);
    expect(r.coverage.every((c) => c.covered)).toBe(true);
  });

  it('blocks a plan with no mastery task', () => {
    const plan: LessonPlan = { ...SAMPLE_LESSON_PLAN, blocks: SAMPLE_LESSON_PLAN.blocks.filter((b) => b.kind !== 'mastery_task') };
    const r = validateLessonPlan(plan, ctx);
    expect(r.ok).toBe(false);
    expect(codes(r)).toContain('NO_MASTERY_TASK');
  });

  it('blocks a plan with no instruction', () => {
    const plan: LessonPlan = { ...SAMPLE_LESSON_PLAN, blocks: SAMPLE_LESSON_PLAN.blocks.filter((b) => b.kind !== 'instruction' && b.kind !== 'worked_example') };
    const r = validateLessonPlan(plan, ctx);
    expect(codes(r)).toContain('NO_INSTRUCTION');
  });

  it('blocks when a required-reasoning element is never taught', () => {
    // Drop the mastery task that carries "transfer" and any transfer target elsewhere.
    const blocks = SAMPLE_LESSON_PLAN.blocks.map((b) => ({ ...b, targets: b.targets.filter((t) => t !== 'transfer') }));
    const r = validateLessonPlan({ ...SAMPLE_LESSON_PLAN, blocks }, ctx);
    expect(r.ok).toBe(false);
    expect(r.issues.some((i) => i.code === 'MISSING_COVERAGE' && i.message.includes('transfer'))).toBe(true);
    expect(r.coverage.find((c) => c.target === 'transfer')?.covered).toBe(false);
  });

  it('blocks a block that cites an unapproved source', () => {
    const blocks = SAMPLE_LESSON_PLAN.blocks.map((b) => (b.id === 'B2' ? { ...b, sourceIds: ['SRC-DRAFT'] } : b));
    const r = validateLessonPlan({ ...SAMPLE_LESSON_PLAN, blocks }, ctx);
    expect(codes(r)).toContain('SOURCE_NOT_APPROVED');
  });

  it('blocks a plan targeting the wrong objective version', () => {
    const r = validateLessonPlan({ ...SAMPLE_LESSON_PLAN, objectiveVersion: 9 }, ctx);
    expect(codes(r)).toContain('LESSON_OBJECTIVE_MISMATCH');
  });
});
