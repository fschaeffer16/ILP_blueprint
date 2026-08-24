/**
 * The assign-once assignment compiler.
 *
 * This is the heart of ILP and its differentiator from a menu of AI generators: the
 * teacher assigns ONE objective to a class, and the compiler produces a reproducible,
 * individualized delivery manifest for every student — while locking the objective,
 * essential knowledge, required reasoning and mastery rule identically across all of
 * them.
 *
 * The output is a *proposal* (`ready_for_teacher_review`). Nothing here reaches a
 * student; a teacher reviews the class summary and publishes (P1). If any manifest
 * fails an objective-integrity check, the whole result is `blocked`.
 */

import { indexCatalog, selectAdaptations, DEFAULT_POLICY } from './adaptation.js';
import type { AdaptationPolicy } from './adaptation.js';
import { buildLockedContract, checkManifestIntegrity } from './integrity.js';
import type {
  Adaptation,
  Assignment,
  CompileResult,
  CompileWarning,
  DeliveryManifest,
  DeliveryPattern,
  ObjectiveVersion,
  StudentILP,
} from './types.js';

export interface CompileInput {
  readonly assignment: Assignment;
  /** Published objective versions referenced by the assignment, keyed by objectiveId. */
  readonly objectives: readonly ObjectiveVersion[];
  readonly roster: readonly StudentILP[];
  readonly adaptationCatalog: readonly Adaptation[];
  readonly policy?: AdaptationPolicy;
  /** Injected for deterministic tests; defaults to now. */
  readonly today?: Date;
}

const EMPTY_PATTERN_COUNTS: () => Record<DeliveryPattern, number> = () => ({
  core: 0,
  vocabulary_supported: 0,
  visual_first: 0,
  guided_practice: 0,
  advanced_transfer: 0,
});

/**
 * Compile one teacher assignment across a class roster.
 *
 * Note: the MVP compiles a single objective per assignment (the first element of
 * `objectiveVersionRefs`); multi-objective assignments are a later-phase concern and
 * emit an informational warning so the behavior is never silent.
 */
export function compileAssignment(input: CompileInput): CompileResult {
  const { assignment, roster } = input;
  const policy = input.policy ?? DEFAULT_POLICY;
  const today = input.today ?? new Date();
  const catalog = indexCatalog(input.adaptationCatalog);
  const warnings: CompileWarning[] = [];

  const ref = assignment.objectiveVersionRefs[0];
  if (assignment.objectiveVersionRefs.length > 1) {
    warnings.push({
      code: 'MULTI_OBJECTIVE_ASSIGNMENT',
      severity: 'info',
      message: `Assignment references ${assignment.objectiveVersionRefs.length} objectives; the MVP compiler individualizes the first (${ref?.objectiveId}).`,
    });
  }

  const objective = input.objectives.find(
    (o) => ref && o.objectiveId === ref.objectiveId && o.version === ref.version,
  );

  // Objective must exist and be published before it can reach students.
  if (!objective) {
    return blocked(assignment, [
      {
        code: 'OBJECTIVE_NOT_FOUND',
        severity: 'blocking',
        message: `Objective ${ref?.objectiveId} v${ref?.version} was not found among published objectives.`,
      },
      ...warnings,
    ]);
  }
  if (objective.status !== 'published') {
    return blocked(assignment, [
      {
        code: 'OBJECTIVE_NOT_PUBLISHED',
        severity: 'blocking',
        message: `Objective ${objective.objectiveId} v${objective.version} has status "${objective.status}"; only published objectives can be assigned.`,
      },
      ...warnings,
    ]);
  }

  const teacherForced = new Set(assignment.teacherConstraints.forceAdaptations ?? []);
  const lockedContract = buildLockedContract(objective);
  const manifests: DeliveryManifest[] = [];
  const patternCounts = EMPTY_PATTERN_COUNTS();
  let objectiveModifications = 0;
  let integrityFailed = false;

  for (const student of roster) {
    const selection = selectAdaptations(
      objective,
      student,
      catalog,
      assignment.teacherConstraints,
      policy,
      today,
    );

    const manifest: DeliveryManifest = {
      assignmentId: assignment.assignmentId,
      studentId: student.studentId,
      objective: { objectiveId: objective.objectiveId, version: objective.version },
      lockedContract,
      appliedAdaptationIds: selection.selected.map((a) => a.id),
      pattern: selection.pattern,
      objectiveModified: selection.objectiveModified,
      rationale: selection.rationale,
    };

    // Enforce objective integrity on every manifest before it can count as ready.
    const violations = checkManifestIntegrity(objective, manifest, catalog, teacherForced);
    if (violations.length > 0) integrityFailed = true;

    warnings.push(...selection.warnings, ...violations);
    if (selection.warnings.some((w) => w.severity === 'blocking')) integrityFailed = true;

    manifests.push(manifest);
    patternCounts[manifest.pattern] += 1;
    if (manifest.objectiveModified) objectiveModifications += 1;
  }

  const status = integrityFailed ? 'blocked' : 'ready_for_teacher_review';
  return {
    assignmentId: assignment.assignmentId,
    classId: assignment.classId,
    status,
    objectiveIntegrity: integrityFailed ? 'fail' : 'pass',
    studentCount: roster.length,
    patternCounts,
    objectiveModifications,
    warnings,
    manifests,
  };
}

function blocked(assignment: Assignment, warnings: CompileWarning[]): CompileResult {
  return {
    assignmentId: assignment.assignmentId,
    classId: assignment.classId,
    status: 'blocked',
    objectiveIntegrity: 'fail',
    studentCount: 0,
    patternCounts: EMPTY_PATTERN_COUNTS(),
    objectiveModifications: 0,
    warnings,
    manifests: [],
  };
}
