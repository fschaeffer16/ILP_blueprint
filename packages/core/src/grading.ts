/**
 * Grading engine (blueprint §12; build spec §36).
 *
 * The load-bearing rule (AC-06, GRD-02): **AI can recommend, but only a teacher decision
 * releases a final grade.** This module makes that true by construction:
 *
 *   - `SubmissionGrader` (a pluggable seam) produces a `GradingRecommendation` — which is
 *     explicitly non-authoritative and has no way to become a grade.
 *   - `releaseFinalGrade` is the ONLY function that produces a `FinalGrade`, and it
 *     requires a `TeacherGradingDecision`. A `reject` / `request_second_review` decision
 *     returns `null` — no grade is released.
 *
 * A reference grader (deterministic, no AI) is provided so the engine runs and tests
 * without a model. It is intentionally simple keyword-evidence scoring; a real grader
 * (model gateway) implements the same interface.
 */

import type { Rubric, RubricCriterion } from './assessment.js';
import type { MasteryRule, ObjectiveVersion } from './types.js';

export interface Submission {
  readonly submissionId: string;
  readonly studentId: string;
  readonly assignmentId: string;
  readonly objectiveId: string;
  readonly objectiveVersion: number;
  readonly response: string;
  /** Adaptation/help ids used; help never lowers a grade — recorded for evidence only. */
  readonly supportsUsed: readonly string[];
  readonly submittedAt: string;
  readonly itemId?: string;
}

export type GradingFlag =
  | 'factual_error'
  | 'unsupported_reasoning'
  | 'prompt_mismatch'
  | 'possible_ambiguity'
  | 'low_confidence'
  | 'polished_but_shallow';

export interface CriterionRecommendation {
  readonly criterionId: string;
  readonly recommendedPoints: number;
  readonly maxPoints: number;
  /** Exact supporting text from the submission (never an unexplained total). */
  readonly evidence: string;
  readonly confidence: number;
  readonly flags: readonly GradingFlag[];
}

/** A non-authoritative first-pass analysis. It is NOT a grade and cannot become one
 * without a teacher decision. */
export interface GradingRecommendation {
  readonly submissionId: string;
  readonly rubricId: string;
  readonly objectiveId: string;
  readonly objectiveVersion: number;
  readonly criteria: readonly CriterionRecommendation[];
  readonly overallConfidence: number;
  /** Provenance: which grader/model version produced this. */
  readonly graderId: string;
}

export interface SubmissionGrader {
  readonly id: string;
  grade(input: {
    submission: Submission;
    rubric: Rubric;
    objective: ObjectiveVersion;
  }): GradingRecommendation;
}

// ---------------------------------------------------------------------------
// Reference grader (deterministic, no AI)
// ---------------------------------------------------------------------------

const tokenize = (s: string): string[] => (s.toLowerCase().match(/[a-z]+/g) ?? []);
const REASONING_MARKERS = ['because', 'since', 'therefore', 'so that', 'which means', 'shows that'];

/** Keywords a criterion expects to see, derived from its trace + description. */
function expectedKeywords(criterion: RubricCriterion): string[] {
  const base = [criterion.objectiveTrace, ...tokenize(criterion.description)].filter((w) => w.length > 3);
  return Array.from(new Set(base));
}

export const referenceGrader: SubmissionGrader = {
  id: 'reference-grader@0',
  grade({ submission, rubric, objective }) {
    const responseTokens = new Set(tokenize(submission.response));
    const lower = submission.response.toLowerCase();

    const criteria = rubric.criteria.map((c): CriterionRecommendation => {
      const keywords = expectedKeywords(c);
      const matched = keywords.filter((k) => responseTokens.has(k));
      const ratio = keywords.length === 0 ? 0 : matched.length / keywords.length;
      let points = Math.round(c.maxPoints * ratio * 10) / 10;

      const flags: GradingFlag[] = [];
      const isReasoning = ['explain', 'transfer', 'reason', 'justify'].some((r) =>
        c.objectiveTrace.toLowerCase().includes(r),
      );
      const hasReasoningMarker = REASONING_MARKERS.some((m) => lower.includes(m));
      if (isReasoning && !hasReasoningMarker && submission.response.length > 0) {
        flags.push('unsupported_reasoning');
        points = Math.min(points, c.maxPoints * 0.5); // reasoning claims need visible reasoning
      }
      // Polished but shallow: long response, little matched content evidence.
      if (submission.response.length > 120 && ratio < 0.34 && !c.isMechanics) {
        flags.push('polished_but_shallow');
      }
      const confidence = clamp01(0.5 + 0.5 * ratio - (flags.length ? 0.15 : 0));
      if (confidence < 0.6) flags.push('low_confidence');

      const evidence = matched.length
        ? `Matched expected evidence: ${matched.join(', ')}.`
        : 'No expected evidence terms found in the response.';

      return {
        criterionId: c.id,
        recommendedPoints: clamp(points, 0, c.maxPoints),
        maxPoints: c.maxPoints,
        evidence,
        confidence,
        flags,
      };
    });

    const overallConfidence =
      criteria.length === 0 ? 0 : criteria.reduce((s, c) => s + c.confidence, 0) / criteria.length;

    return {
      submissionId: submission.submissionId,
      rubricId: rubric.rubricId,
      objectiveId: objective.objectiveId,
      objectiveVersion: objective.version,
      criteria,
      overallConfidence: Math.round(overallConfidence * 100) / 100,
      graderId: this.id,
    };
  },
};

// ---------------------------------------------------------------------------
// Teacher decision → final grade (the only path to a grade)
// ---------------------------------------------------------------------------

export type TeacherAction = 'accept' | 'modify' | 'reject' | 'request_second_review';

export interface TeacherGradingDecision {
  readonly submissionId: string;
  readonly action: TeacherAction;
  /** Points the teacher sets per criterion when action is 'modify'. */
  readonly criterionOverrides?: readonly { readonly criterionId: string; readonly points: number }[];
  readonly reason?: string;
  readonly teacherId: string;
  readonly decidedAt: string;
}

export interface FinalGrade {
  readonly submissionId: string;
  readonly points: number;
  readonly maxPoints: number;
  readonly fraction: number;
  readonly masteryMet: boolean;
  readonly evidenceTypesMet: number;
  readonly transferSatisfied: boolean;
  readonly basis: 'accept' | 'modify';
  readonly releasedByTeacherId: string;
  readonly releasedAt: string;
}

/**
 * The ONLY producer of a `FinalGrade`. Returns `null` when the teacher rejected or
 * asked for a second review — i.e. no grade is released. A `GradingRecommendation`
 * on its own can never become a grade.
 */
export function releaseFinalGrade(
  recommendation: GradingRecommendation,
  decision: TeacherGradingDecision,
  rubric: Rubric,
  objective: ObjectiveVersion,
): FinalGrade | null {
  if (decision.submissionId !== recommendation.submissionId) {
    throw new Error('Teacher decision does not match the recommendation submission.');
  }
  if (decision.action === 'reject' || decision.action === 'request_second_review') {
    return null; // no grade released
  }

  const overrides = new Map((decision.criterionOverrides ?? []).map((o) => [o.criterionId, o.points]));
  const maxByCriterion = new Map(rubric.criteria.map((c) => [c.id, c.maxPoints]));
  const traceByCriterion = new Map(rubric.criteria.map((c) => [c.id, c.objectiveTrace.toLowerCase()]));

  let points = 0;
  let maxPoints = 0;
  const evidenceTraces = new Set<string>();
  let transferSatisfied = !objective.mastery.transferRequired;

  for (const rec of recommendation.criteria) {
    const cap = maxByCriterion.get(rec.criterionId) ?? rec.maxPoints;
    const finalPoints =
      decision.action === 'modify' && overrides.has(rec.criterionId)
        ? clamp(overrides.get(rec.criterionId)!, 0, cap)
        : rec.recommendedPoints;
    points += finalPoints;
    maxPoints += cap;
    // An evidence type counts toward mastery when it scored at least half its points.
    if (finalPoints >= cap / 2) {
      const trace = traceByCriterion.get(rec.criterionId);
      if (trace) {
        evidenceTraces.add(trace);
        if (trace.includes('transfer')) transferSatisfied = true;
      }
    }
  }

  const fraction = maxPoints === 0 ? 0 : Math.round((points / maxPoints) * 1000) / 1000;
  const masteryMet = meetsMastery(fraction, evidenceTraces.size, transferSatisfied, objective.mastery);

  return {
    submissionId: recommendation.submissionId,
    points: Math.round(points * 10) / 10,
    maxPoints,
    fraction,
    masteryMet,
    evidenceTypesMet: evidenceTraces.size,
    transferSatisfied,
    basis: decision.action,
    releasedByTeacherId: decision.teacherId,
    releasedAt: decision.decidedAt,
  };
}

function meetsMastery(
  fraction: number,
  evidenceTypesMet: number,
  transferSatisfied: boolean,
  rule: MasteryRule,
): boolean {
  return (
    fraction >= rule.threshold &&
    evidenceTypesMet >= rule.minimumEvidenceTypes &&
    (!rule.transferRequired || transferSatisfied)
  );
}

// ---------------------------------------------------------------------------
// Append-only audit trail (AC-12)
// ---------------------------------------------------------------------------

export type GradingAuditEvent =
  | { readonly kind: 'recommendation'; readonly at: string; readonly submissionId: string; readonly graderId: string; readonly snapshot: GradingRecommendation }
  | { readonly kind: 'decision'; readonly at: string; readonly submissionId: string; readonly teacherId: string; readonly snapshot: TeacherGradingDecision }
  | { readonly kind: 'release'; readonly at: string; readonly submissionId: string; readonly teacherId: string; readonly snapshot: FinalGrade };

/**
 * Append an event, returning a NEW array. History is never rewritten: a later teacher
 * correction is a new `decision`/`release` event, and the original recommendation stays
 * in the log ("improve future recommendations without silently rewriting history", §12).
 */
export function appendAudit(
  log: readonly GradingAuditEvent[],
  event: GradingAuditEvent,
): GradingAuditEvent[] {
  return [...log, event];
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
function clamp01(n: number): number {
  return clamp(Math.round(n * 100) / 100, 0, 1);
}
