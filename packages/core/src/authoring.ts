/**
 * Objective authoring gate (blueprint §8 "objective graph"; §17 editorial governance).
 *
 * This is the guardrail behind the objective-builder screen. A curriculum author fills
 * in a draft; `validateObjectiveDraft` decides whether it may be published. Publishing
 * an objective freezes its rigor for every downstream feature, so the gate is strict:
 *
 *   - it must pass the schema (well-formed, no permitted/prohibited overlap);
 *   - it must be mapped to at least one standard (objectives come from standards, not
 *     from a teacher's guess);
 *   - every cited source must be an APPROVED, usably-licensed SourceRecord (nothing
 *     unvetted reaches a student);
 *   - no permitted adaptation may be a rigor-changing `objective_modification` (P3).
 *
 * The gate is pure and deterministic, so the builder can validate live and the same
 * rules can run in tests and on the server.
 */

import { ZodError } from 'zod';
import { objectiveVersionSchema } from './schema.js';
import { DELIVERABLE_LICENSES } from './types.js';
import type {
  Adaptation,
  ObjectiveVersion,
  SourceRecord,
  WarningSeverity,
} from './types.js';

export interface ObjectiveIssue {
  readonly code: string;
  readonly severity: WarningSeverity;
  readonly message: string;
  readonly field?: string;
}

export interface ObjectiveValidation {
  readonly ok: boolean; // no blocking issues → publishable
  readonly issues: readonly ObjectiveIssue[];
}

export interface AuthoringContext {
  readonly catalog: readonly Adaptation[];
  readonly approvedSources: readonly SourceRecord[];
}

/**
 * Validate a draft objective for publication. `draft` is untrusted (it comes from a
 * form), so it is schema-parsed first; structural errors are returned as blocking
 * issues rather than thrown.
 */
export function validateObjectiveDraft(
  draft: unknown,
  ctx: AuthoringContext,
): ObjectiveValidation {
  const issues: ObjectiveIssue[] = [];

  // 1. Schema. On failure, return the field-level errors and stop — later checks
  //    assume a well-formed object.
  const parsed = objectiveVersionSchema.safeParse(draft);
  if (!parsed.success) {
    for (const e of (parsed.error as ZodError).issues) {
      issues.push({
        code: 'SCHEMA',
        severity: 'blocking',
        message: e.message,
        field: e.path.join('.') || undefined,
      });
    }
    return { ok: false, issues };
  }
  const obj: ObjectiveVersion = parsed.data;

  // 2. Standard mapping — objectives come from standards.
  if (obj.standardRefs.length === 0) {
    issues.push({
      code: 'STANDARD_UNMAPPED',
      severity: 'blocking',
      message: 'Map the objective to at least one standard benchmark before publishing.',
      field: 'standardRefs',
    });
  }

  // 3. Approved, usably-licensed sources.
  const byId = new Map(ctx.approvedSources.map((s) => [s.id, s]));
  if (obj.sourceIds.length === 0) {
    issues.push({
      code: 'NO_SOURCE',
      severity: 'blocking',
      message: 'Cite at least one approved source before publishing.',
      field: 'sourceIds',
    });
  }
  for (const id of obj.sourceIds) {
    const src = byId.get(id);
    if (!src) {
      issues.push({
        code: 'SOURCE_NOT_FOUND',
        severity: 'blocking',
        message: `Source "${id}" is not in the vetted library.`,
        field: 'sourceIds',
      });
      continue;
    }
    if (src.reviewStatus !== 'approved') {
      issues.push({
        code: 'SOURCE_NOT_APPROVED',
        severity: 'blocking',
        message: `Source "${src.title}" is ${src.reviewStatus}, not approved. It cannot reach students yet.`,
        field: 'sourceIds',
      });
    }
    if (!DELIVERABLE_LICENSES.includes(src.license)) {
      issues.push({
        code: 'SOURCE_LICENSE',
        severity: 'blocking',
        message: `Source "${src.title}" has license "${src.license}", which does not permit student delivery.`,
        field: 'sourceIds',
      });
    }
  }

  // 4. No permitted adaptation may change rigor (P3).
  const catalog = new Map(ctx.catalog.map((a) => [a.id, a]));
  for (const id of obj.permittedAdaptations) {
    const a = catalog.get(id);
    if (a && a.adaptationClass === 'objective_modification') {
      issues.push({
        code: 'RIGOR_ADAPTATION_PERMITTED',
        severity: 'blocking',
        message: `Adaptation "${a.label}" changes the expected learning and cannot be a permitted adaptation. Objective modifications are teacher-authorized per student, never baked into the objective.`,
        field: 'permittedAdaptations',
      });
    }
  }

  // 5. Advisory quality checks (non-blocking).
  if (obj.misconceptions.length === 0) {
    issues.push({
      code: 'NO_MISCONCEPTIONS',
      severity: 'warning',
      message: 'No common misconceptions listed. Remediation and item design are weaker without them.',
      field: 'misconceptions',
    });
  }
  if (obj.permittedAdaptations.length === 0) {
    issues.push({
      code: 'NO_ADAPTATIONS',
      severity: 'warning',
      message: 'No permitted adaptations. The objective can only be delivered as the core version.',
      field: 'permittedAdaptations',
    });
  }

  return { ok: issues.every((i) => i.severity !== 'blocking'), issues };
}
