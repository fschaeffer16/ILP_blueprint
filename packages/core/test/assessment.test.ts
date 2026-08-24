import { describe, expect, it } from 'vitest';
import { checkItemIntegrity, isDeliverable, runGenerationGate, referenceItemGenerator } from '../src/index.js';
import type { AssessmentItem } from '../src/index.js';
import { OBJ_M3_NF_01, SAMPLE_ASSESSMENT_SPEC, SAMPLE_MC_ITEM } from '../src/fixtures/index.js';

describe('item integrity gate', () => {
  it('passes a clean, approved, aligned item', () => {
    expect(checkItemIntegrity(SAMPLE_MC_ITEM, OBJ_M3_NF_01)).toHaveLength(0);
    expect(isDeliverable(SAMPLE_MC_ITEM, OBJ_M3_NF_01)).toBe(true);
  });

  it('blocks an item whose evidence claim is not traceable to the objective', () => {
    const item: AssessmentItem = { ...SAMPLE_MC_ITEM, evidenceClaim: 'photosynthesis' };
    const findings = checkItemIntegrity(item, OBJ_M3_NF_01);
    expect(findings.some((f) => f.code === 'ITEM_NOT_TRACEABLE' && f.severity === 'blocking')).toBe(true);
    expect(isDeliverable(item, OBJ_M3_NF_01)).toBe(false);
  });

  it('blocks answer-key / distractor conflicts', () => {
    const item: AssessmentItem = { ...SAMPLE_MC_ITEM, distractors: ['1/4', '1/3'] };
    const findings = checkItemIntegrity(item, OBJ_M3_NF_01);
    expect(findings.some((f) => f.code === 'ANSWER_KEY_CONFLICT')).toBe(true);
  });

  it('blocks an item whose prompt leaks its own answer', () => {
    const item: AssessmentItem = { ...SAMPLE_MC_ITEM, prompt: 'Which fraction? The answer is 1/4.' };
    const findings = checkItemIntegrity(item, OBJ_M3_NF_01);
    expect(findings.some((f) => f.code === 'ANSWER_LEAK')).toBe(true);
  });

  it('blocks a prompt containing a prohibited clue (a known misconception)', () => {
    const item: AssessmentItem = {
      ...SAMPLE_MC_ITEM,
      prompt: 'Remember, larger denominator means larger fraction. Which shows 1 of 4 equal slices?',
    };
    const findings = checkItemIntegrity(item, OBJ_M3_NF_01);
    expect(findings.some((f) => f.code === 'PROHIBITED_CLUE')).toBe(true);
  });

  it('blocks a multiple-choice item with no answer key', () => {
    const item: AssessmentItem = { ...SAMPLE_MC_ITEM, answerKey: [] };
    expect(checkItemIntegrity(item, OBJ_M3_NF_01).some((f) => f.code === 'ITEM_NOT_ANSWERABLE')).toBe(true);
  });

  it('an unapproved (draft) item is never deliverable even if clean', () => {
    const draft: AssessmentItem = { ...SAMPLE_MC_ITEM, status: 'draft' };
    expect(checkItemIntegrity(draft, OBJ_M3_NF_01)).toHaveLength(0);
    expect(isDeliverable(draft, OBJ_M3_NF_01)).toBe(false);
  });
});

describe('generation gate', () => {
  it('produces a candidate that always requires teacher approval and is never auto-approved', () => {
    const result = runGenerationGate(referenceItemGenerator, SAMPLE_ASSESSMENT_SPEC, OBJ_M3_NF_01, 'represent');
    expect(result.requiresApproval).toBe(true);
    expect(result.candidate.status).toBe('draft');
    expect(result.candidate.objectiveId).toBe(OBJ_M3_NF_01.objectiveId);
    // The generated item traces to the objective (aligned).
    expect(result.findings.some((f) => f.code === 'ITEM_NOT_TRACEABLE')).toBe(false);
  });
});
