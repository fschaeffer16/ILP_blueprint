import { describe, expect, it } from 'vitest';
import { referenceGrader, releaseFinalGrade, appendAudit } from '../src/index.js';
import type { Submission, TeacherGradingDecision, GradingAuditEvent } from '../src/index.js';
import { OBJ_M3_NF_01, SAMPLE_RUBRIC, SAMPLE_SUBMISSIONS } from '../src/fixtures/index.js';

const strong = SAMPLE_SUBMISSIONS.find((s) => s.submissionId === 'SUB-001')!;
const weak = SAMPLE_SUBMISSIONS.find((s) => s.submissionId === 'SUB-003')!;
const now = '2026-09-01T15:00:00Z';

function grade(sub: Submission) {
  return referenceGrader.grade({ submission: sub, rubric: SAMPLE_RUBRIC, objective: OBJ_M3_NF_01 });
}

describe('grading recommendations', () => {
  it('produces one criterion recommendation per rubric criterion, with evidence and confidence', () => {
    const rec = grade(strong);
    expect(rec.criteria).toHaveLength(SAMPLE_RUBRIC.criteria.length);
    for (const c of rec.criteria) {
      expect(c.recommendedPoints).toBeLessThanOrEqual(c.maxPoints);
      expect(c.recommendedPoints).toBeGreaterThanOrEqual(0);
      expect(c.confidence).toBeGreaterThanOrEqual(0);
      expect(c.confidence).toBeLessThanOrEqual(1);
      expect(typeof c.evidence).toBe('string');
    }
    expect(rec.graderId).toBe('reference-grader@0'); // provenance recorded
  });

  it('scores a rich, reasoned response higher than a bare answer', () => {
    expect(grade(strong).overallConfidence).toBeGreaterThan(grade(weak).overallConfidence);
  });

  it('flags reasoning criteria that lack any visible reasoning', () => {
    const rec = grade(weak);
    const flags = rec.criteria.flatMap((c) => c.flags);
    expect(flags).toContain('unsupported_reasoning');
  });

  it('is deterministic', () => {
    expect(JSON.stringify(grade(strong))).toBe(JSON.stringify(grade(strong)));
  });
});

describe('AI can recommend but only a teacher decision releases a grade (AC-06 / GRD-02)', () => {
  const rec = grade(strong);

  it('a reject releases NO grade', () => {
    const d: TeacherGradingDecision = { submissionId: rec.submissionId, action: 'reject', teacherId: 'T-1', decidedAt: now };
    expect(releaseFinalGrade(rec, d, SAMPLE_RUBRIC, OBJ_M3_NF_01)).toBeNull();
  });

  it('a request_second_review releases NO grade', () => {
    const d: TeacherGradingDecision = { submissionId: rec.submissionId, action: 'request_second_review', teacherId: 'T-1', decidedAt: now };
    expect(releaseFinalGrade(rec, d, SAMPLE_RUBRIC, OBJ_M3_NF_01)).toBeNull();
  });

  it('an accept releases a grade attributed to the teacher', () => {
    const d: TeacherGradingDecision = { submissionId: rec.submissionId, action: 'accept', teacherId: 'T-1', decidedAt: now };
    const grade = releaseFinalGrade(rec, d, SAMPLE_RUBRIC, OBJ_M3_NF_01);
    expect(grade).not.toBeNull();
    expect(grade!.releasedByTeacherId).toBe('T-1');
    expect(grade!.basis).toBe('accept');
    expect(grade!.fraction).toBeGreaterThanOrEqual(0);
    expect(grade!.fraction).toBeLessThanOrEqual(1);
  });

  it('a modify applies the teacher overrides and can change mastery', () => {
    const d: TeacherGradingDecision = {
      submissionId: rec.submissionId,
      action: 'modify',
      teacherId: 'T-1',
      decidedAt: now,
      criterionOverrides: SAMPLE_RUBRIC.criteria.map((c) => ({ criterionId: c.id, points: c.maxPoints })),
    };
    const grade = releaseFinalGrade(rec, d, SAMPLE_RUBRIC, OBJ_M3_NF_01)!;
    expect(grade.basis).toBe('modify');
    expect(grade.fraction).toBe(1); // full marks after override
    expect(grade.masteryMet).toBe(true); // meets threshold, evidence types and transfer
  });

  it('clamps overrides to the criterion max', () => {
    const d: TeacherGradingDecision = {
      submissionId: rec.submissionId,
      action: 'modify',
      teacherId: 'T-1',
      decidedAt: now,
      criterionOverrides: SAMPLE_RUBRIC.criteria.map((c) => ({ criterionId: c.id, points: c.maxPoints + 100 })),
    };
    const grade = releaseFinalGrade(rec, d, SAMPLE_RUBRIC, OBJ_M3_NF_01)!;
    expect(grade.points).toBe(grade.maxPoints); // never exceeds the rubric maximum
  });

  it('rejects a decision for a different submission', () => {
    const d: TeacherGradingDecision = { submissionId: 'SOMETHING-ELSE', action: 'accept', teacherId: 'T-1', decidedAt: now };
    expect(() => releaseFinalGrade(rec, d, SAMPLE_RUBRIC, OBJ_M3_NF_01)).toThrow();
  });
});

describe('audit trail is append-only (AC-12)', () => {
  it('keeps the original recommendation after a later modify', () => {
    const rec = grade(strong);
    let log: GradingAuditEvent[] = [];
    log = appendAudit(log, { kind: 'recommendation', at: now, submissionId: rec.submissionId, graderId: rec.graderId, snapshot: rec });
    const d: TeacherGradingDecision = { submissionId: rec.submissionId, action: 'accept', teacherId: 'T-1', decidedAt: now };
    log = appendAudit(log, { kind: 'decision', at: now, submissionId: rec.submissionId, teacherId: 'T-1', snapshot: d });
    const finalGrade = releaseFinalGrade(rec, d, SAMPLE_RUBRIC, OBJ_M3_NF_01)!;
    log = appendAudit(log, { kind: 'release', at: now, submissionId: rec.submissionId, teacherId: 'T-1', snapshot: finalGrade });
    expect(log.map((e) => e.kind)).toEqual(['recommendation', 'decision', 'release']);
    expect(log[0]!.kind).toBe('recommendation'); // history not rewritten
  });
});
