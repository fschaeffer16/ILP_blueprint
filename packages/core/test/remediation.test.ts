import { describe, expect, it } from 'vitest';
import { evaluateClasswideFailure, checkRemediationPlan, isRemediationValid } from '../src/index.js';
import type { GradeSection, RemediationPlan } from '../src/index.js';
import { SAMPLE_ASSESSMENT_SPEC, SAMPLE_REASSESSMENT_SPEC } from '../src/fixtures/index.js';

function section(masteryFlags: boolean[]): GradeSection {
  return {
    objectiveId: 'M3.NF.01',
    objectiveVersion: 1,
    itemGroupId: 'grp-1',
    results: masteryFlags.map((m, i) => ({ studentId: `S-${i}`, masteryMet: m, fraction: m ? 0.9 : 0.4 })),
  };
}

describe('the 75% classwide-failure rule', () => {
  it('fires classwide when ≥75% miss: suspends the grade and opens an integrity audit', () => {
    const o = evaluateClasswideFailure(section([false, false, false, false, true])); // 80% miss
    expect(o.mode).toBe('classwide');
    expect(o.gradeSuspended).toBe(true);
    expect(o.requiresIntegrityAudit).toBe(true);
    expect(o.reteachRequired).toBe(true);
    expect(o.reassessmentRequired).toBe(true);
  });

  it('exactly 75% triggers the classwide path', () => {
    const o = evaluateClasswideFailure(section([false, false, false, true])); // 75% miss
    expect(o.mode).toBe('classwide');
  });

  it('below threshold falls back to individual remediation without suspending grades', () => {
    const o = evaluateClasswideFailure(section([false, true, true, true])); // 25% miss
    expect(o.mode).toBe('individual');
    expect(o.gradeSuspended).toBe(false);
    expect(o.requiresIntegrityAudit).toBe(false);
    expect(o.failingStudentIds).toEqual(['S-0']);
  });

  it('all mastered → no remediation', () => {
    const o = evaluateClasswideFailure(section([true, true, true]));
    expect(o.mode).toBe('none');
    expect(o.reteachRequired).toBe(false);
  });
});

describe('remediation plan guardrails (AC-07)', () => {
  const base: RemediationPlan = {
    objectiveId: 'M3.NF.01',
    objectiveVersion: 1,
    diagnosis: 'Missing partitioning prerequisite; denominator-size misconception.',
    failedMethodPattern: 'core',
    newMethodPattern: 'visual_first',
    successCriterion: 'Independently represents a unit fraction on two new wholes.',
    reassessmentSpec: SAMPLE_REASSESSMENT_SPEC,
  };

  it('accepts a materially-different reteach with an equivalent, new reassessment', () => {
    expect(isRemediationValid(base, SAMPLE_ASSESSMENT_SPEC)).toBe(true);
  });

  it('rejects a "recoloring" reteach that reuses the failed lesson pattern', () => {
    const plan = { ...base, newMethodPattern: 'core' as const };
    const findings = checkRemediationPlan(plan, SAMPLE_ASSESSMENT_SPEC);
    expect(findings.some((f) => f.code === 'REMEDIATION_NOT_DIFFERENT' && f.severity === 'blocking')).toBe(true);
    expect(isRemediationValid(plan, SAMPLE_ASSESSMENT_SPEC)).toBe(false);
  });

  it('rejects reusing the exact failed assessment spec as the reassessment', () => {
    const plan = { ...base, reassessmentSpec: SAMPLE_ASSESSMENT_SPEC };
    const findings = checkRemediationPlan(plan, SAMPLE_ASSESSMENT_SPEC);
    expect(findings.some((f) => f.code === 'REASSESSMENT_SAME_SPEC')).toBe(true);
  });

  it('rejects a reassessment that measures different evidence claims', () => {
    const plan = {
      ...base,
      reassessmentSpec: { ...SAMPLE_REASSESSMENT_SPEC, evidenceClaims: ['represent'] },
    };
    const findings = checkRemediationPlan(plan, SAMPLE_ASSESSMENT_SPEC);
    expect(findings.some((f) => f.code === 'REASSESSMENT_NOT_EQUIVALENT')).toBe(true);
  });
});
