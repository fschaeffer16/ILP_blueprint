/**
 * Remediation and the 75% classwide-failure rule (blueprint §13; build spec §37).
 *
 * The formal rule (AC-08): if 75% of a class misses the same objective/item group,
 * presume instructional or assessment failure BEFORE presuming simultaneous student
 * failure — suspend the affected grade section and open an assessment-integrity audit,
 * then require a materially-different reteach and an equivalent reassessment.
 *
 * Below the threshold, remediation is individual or small-group.
 *
 * Two guardrails are enforced as checks (AC-07):
 *   - a remediation lesson must be *materially different* from the failed lesson;
 *   - a reassessment must be *equivalent* to the original (same objective, same evidence
 *     claims, same band) but a *new* task.
 */

import type { DeliveryPattern, WarningSeverity } from './types.js';
import type { AssessmentSpec } from './assessment.js';

export interface ObjectiveResult {
  readonly studentId: string;
  readonly masteryMet: boolean;
  readonly fraction: number;
}

/** The graded results for one objective/item group across a class. */
export interface GradeSection {
  readonly objectiveId: string;
  readonly objectiveVersion: number;
  /** The item or objective group these results share. */
  readonly itemGroupId: string;
  readonly results: readonly ObjectiveResult[];
}

export type RemediationMode = 'classwide' | 'individual' | 'none';

export interface ClasswideFailureOutcome {
  readonly objectiveId: string;
  readonly itemGroupId: string;
  readonly missRate: number;
  readonly mode: RemediationMode;
  /** The affected grade section is suspended pending audit (classwide case). */
  readonly gradeSuspended: boolean;
  readonly requiresIntegrityAudit: boolean;
  readonly reteachRequired: boolean;
  readonly reassessmentRequired: boolean;
  readonly failingStudentIds: readonly string[];
  readonly rationale: string;
}

export const DEFAULT_CLASSWIDE_THRESHOLD = 0.75;

/**
 * Apply the 75% rule to one graded section.
 */
export function evaluateClasswideFailure(
  section: GradeSection,
  threshold: number = DEFAULT_CLASSWIDE_THRESHOLD,
): ClasswideFailureOutcome {
  const total = section.results.length;
  const failing = section.results.filter((r) => !r.masteryMet);
  const failingStudentIds = failing.map((r) => r.studentId);
  const missRate = total === 0 ? 0 : failing.length / total;

  if (total === 0) {
    return outcome('none', false, false, false, false, 'No results to evaluate.');
  }

  if (missRate >= threshold) {
    return outcome(
      'classwide',
      true,
      true,
      true,
      true,
      `${Math.round(missRate * 100)}% of the class missed ${section.objectiveId}/${section.itemGroupId} (≥ ${Math.round(
        threshold * 100,
      )}%). Presume instructional or assessment failure: grade suspended, integrity audit opened, reteach + equivalent reassessment required before any grade stands.`,
    );
  }

  if (failing.length > 0) {
    return outcome(
      'individual',
      false,
      false,
      true,
      true,
      `${failing.length} of ${total} students did not reach mastery. Create individual or small-group remediation with a new equivalent reassessment.`,
    );
  }

  return outcome('none', false, false, false, false, 'Whole class reached mastery; no remediation needed.');

  function outcome(
    mode: RemediationMode,
    gradeSuspended: boolean,
    requiresIntegrityAudit: boolean,
    reteachRequired: boolean,
    reassessmentRequired: boolean,
    rationale: string,
  ): ClasswideFailureOutcome {
    return {
      objectiveId: section.objectiveId,
      itemGroupId: section.itemGroupId,
      missRate: Math.round(missRate * 1000) / 1000,
      mode,
      gradeSuspended,
      requiresIntegrityAudit,
      reteachRequired,
      reassessmentRequired,
      failingStudentIds,
      rationale,
    };
  }
}

// ---------------------------------------------------------------------------
// Remediation plan + guardrail checks
// ---------------------------------------------------------------------------

export interface RemediationPlan {
  readonly objectiveId: string;
  readonly objectiveVersion: number;
  /** The shared misconception or missing prerequisite, with evidence. */
  readonly diagnosis: string;
  /** The delivery pattern of the lesson that was FAILED. */
  readonly failedMethodPattern: DeliveryPattern;
  /** The delivery pattern of the reteach — must be materially different. */
  readonly newMethodPattern: DeliveryPattern;
  /** What independent performance will close the need. */
  readonly successCriterion: string;
  /** The equivalent reassessment spec. */
  readonly reassessmentSpec: AssessmentSpec;
}

export interface RemediationFinding {
  readonly code: string;
  readonly severity: WarningSeverity;
  readonly message: string;
}

/**
 * Validate a remediation plan against the blueprint's acceptance rules (§13 table):
 * materially different method, specific diagnosis, defined success criterion, and an
 * equivalent reassessment. `originalSpec` is the assessment the student failed.
 */
export function checkRemediationPlan(
  plan: RemediationPlan,
  originalSpec: AssessmentSpec,
): RemediationFinding[] {
  const findings: RemediationFinding[] = [];
  const add = (code: string, severity: WarningSeverity, message: string) =>
    findings.push({ code, severity, message });

  // Materially different: not the same pattern as the failed lesson (not "recoloring").
  if (plan.newMethodPattern === plan.failedMethodPattern) {
    add(
      'REMEDIATION_NOT_DIFFERENT',
      'blocking',
      `Reteach uses the same delivery pattern (${plan.newMethodPattern}) as the failed lesson. Remediation must be materially different, not a recoloring.`,
    );
  }

  if (plan.diagnosis.trim().length < 8) {
    add('REMEDIATION_NO_DIAGNOSIS', 'warning', 'Remediation plan lacks a specific diagnosis (misconception or missing prerequisite).');
  }
  if (plan.successCriterion.trim().length < 8) {
    add('REMEDIATION_NO_SUCCESS_CRITERION', 'warning', 'Remediation plan lacks a success criterion for independent performance.');
  }

  // Equivalent reassessment: same objective + version, same evidence claims, same band,
  // but a DIFFERENT spec (a new task, not the one just failed).
  const rs = plan.reassessmentSpec;
  if (rs.objectiveId !== originalSpec.objectiveId || rs.objectiveVersion !== originalSpec.objectiveVersion) {
    add('REASSESSMENT_WRONG_OBJECTIVE', 'blocking', 'Reassessment does not target the same objective version as the failed assessment.');
  }
  if (!sameSet(rs.evidenceClaims, originalSpec.evidenceClaims)) {
    add('REASSESSMENT_NOT_EQUIVALENT', 'blocking', 'Reassessment measures different evidence claims than the original; it is not equivalent.');
  }
  if (rs.equivalenceBand !== originalSpec.equivalenceBand) {
    add('REASSESSMENT_DIFFERENT_BAND', 'warning', 'Reassessment equivalence band differs from the original assessment.');
  }
  if (rs.specId === originalSpec.specId) {
    add('REASSESSMENT_SAME_SPEC', 'blocking', 'Reassessment reuses the exact failed assessment spec; it must be a new equivalent task.');
  }

  return findings;
}

/** True when a remediation plan is valid to deliver (no blocking findings). */
export function isRemediationValid(plan: RemediationPlan, originalSpec: AssessmentSpec): boolean {
  return checkRemediationPlan(plan, originalSpec).every((f) => f.severity !== 'blocking');
}

function sameSet(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const bs = new Set(b.map((x) => x.toLowerCase()));
  return a.every((x) => bs.has(x.toLowerCase()));
}
