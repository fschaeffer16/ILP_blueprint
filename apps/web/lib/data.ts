/**
 * Server-only data layer for the teacher command center.
 *
 * Every number and status on the screens comes from running the REAL @ilp/core engine
 * on the synthetic fixtures — the compiler, the reference grader, the final-grade gate
 * and the 75% rule. Nothing here is mocked UI state; it is the same code path a district
 * would deploy, pointed at synthetic data.
 */

import 'server-only';

import {
  compileAssignment,
  evaluateClasswideFailure,
  referenceGrader,
  releaseFinalGrade,
  type CompileResult,
  type DeliveryManifest,
  type FinalGrade,
  type GradingRecommendation,
  type ClasswideFailureOutcome,
} from '@ilp/core';
import {
  OBJ_M3_NF_01,
  SAMPLE_ADAPTATIONS,
  SAMPLE_ASSIGNMENT,
  SAMPLE_OBJECTIVES,
  SAMPLE_ROSTER,
  SAMPLE_RUBRIC,
  SAMPLE_SUBMISSIONS,
} from '@ilp/core/fixtures';

const TEACHER_ID = 'T-100';
const DECIDED_AT = '2026-09-01T15:00:00Z';

export const objective = OBJ_M3_NF_01;
export const rubric = SAMPLE_RUBRIC;
export const assignment = SAMPLE_ASSIGNMENT;

export function nameFor(studentId: string): string {
  return SAMPLE_ROSTER.find((s) => s.studentId === studentId)?.displayName ?? studentId;
}

/** The assign-once compile result for the class (assign preview, class overview, today). */
export function getCompile(): CompileResult {
  return compileAssignment({
    assignment: SAMPLE_ASSIGNMENT,
    objectives: SAMPLE_OBJECTIVES,
    roster: SAMPLE_ROSTER,
    adaptationCatalog: SAMPLE_ADAPTATIONS,
  });
}

export interface GradingRow {
  readonly studentId: string;
  readonly name: string;
  readonly response: string;
  readonly supportsUsed: readonly string[];
  readonly recommendation: GradingRecommendation;
  /** The grade the teacher WOULD release on accept — shown for review, not yet released. */
  readonly proposedOnAccept: FinalGrade;
}

/** First-pass AI grading for every submission (non-authoritative recommendations). */
export function getGradingRows(): GradingRow[] {
  return SAMPLE_SUBMISSIONS.map((submission) => {
    const recommendation = referenceGrader.grade({ submission, rubric: SAMPLE_RUBRIC, objective: OBJ_M3_NF_01 });
    const proposedOnAccept = releaseFinalGrade(
      recommendation,
      { submissionId: submission.submissionId, action: 'accept', teacherId: TEACHER_ID, decidedAt: DECIDED_AT },
      SAMPLE_RUBRIC,
      OBJ_M3_NF_01,
    )!;
    return {
      studentId: submission.studentId,
      name: nameFor(submission.studentId),
      response: submission.response,
      supportsUsed: submission.supportsUsed,
      recommendation,
      proposedOnAccept,
    };
  });
}

/** The 75% classwide-failure outcome, computed from the accept-path grades. */
export function getClasswideOutcome(): ClasswideFailureOutcome {
  const rows = getGradingRows();
  return evaluateClasswideFailure({
    objectiveId: OBJ_M3_NF_01.objectiveId,
    objectiveVersion: OBJ_M3_NF_01.version,
    itemGroupId: `${SAMPLE_ASSIGNMENT.assignmentId}/written`,
    results: rows.map((r) => ({
      studentId: r.studentId,
      masteryMet: r.proposedOnAccept.masteryMet,
      fraction: r.proposedOnAccept.fraction,
    })),
  });
}

export interface ClassStudentRow {
  readonly studentId: string;
  readonly name: string;
  readonly manifest: DeliveryManifest;
  readonly masteryMet: boolean;
  readonly fraction: number;
}

/** Per-student status combining the compiled manifest and the proposed grade. */
export function getClassRows(): ClassStudentRow[] {
  const compile = getCompile();
  const grading = new Map(getGradingRows().map((g) => [g.studentId, g]));
  return compile.manifests.map((manifest) => {
    const g = grading.get(manifest.studentId);
    return {
      studentId: manifest.studentId,
      name: nameFor(manifest.studentId),
      manifest,
      masteryMet: g?.proposedOnAccept.masteryMet ?? false,
      fraction: g?.proposedOnAccept.fraction ?? 0,
    };
  });
}
