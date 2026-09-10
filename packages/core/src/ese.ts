/**
 * ESE layer: the IEP (or 504 plan) as a live input to the assign-once compiler.
 *
 * The design rule (docs/ese-applied-design.md): the algorithm never guesses a child's
 * communication channel or legally-required supports — the IEP declares them. An imported
 * plan's accommodations become *forced adaptations* the compiler applies on every
 * assignment (and its exclusions become disabled adaptations, e.g. no read-aloud for a
 * Deaf student), so an IEP accommodation can never be forgotten on test day.
 *
 * Everything here lives in the ACCOMMODATION lane: the objective stays locked and
 * `objectiveModified` stays false. Modifications (Access Points / alternate standards)
 * are a separate, human-authorized state this module deliberately cannot express.
 */

import type { Adaptation, TeacherConstraints, WarningSeverity } from './types.js';

export interface IEPAccommodation {
  /** The adaptation the platform enacts for this accommodation. */
  readonly adaptationId: string;
  /** The accommodation as written in the plan — kept verbatim for the audit trail. */
  readonly planText: string;
  /** 'access' channels never fade; 'support' scaffolds may fade on evidence. */
  readonly kind: 'access' | 'support';
}

export interface IEPPlan {
  readonly studentId: string;
  readonly planType: 'iep' | '504';
  /** Accommodations the compiler must apply on every assignment. */
  readonly accommodations: readonly IEPAccommodation[];
  /** Adaptations that must never be auto-selected for this student
   * (e.g. read-aloud for a Deaf student who reads print fluently). */
  readonly excludedAdaptations?: readonly string[];
  /** Set ONLY by the IEP team: this student works toward alternate standards
   * (Access Points). The engine never sets this; it only reads it. */
  readonly alternateStandards?: {
    readonly authorizedBy: string;
    readonly authorizedOn: string; // ISO date
    readonly note: string;
  };
}

/**
 * Merge a plan into the compiler's teacher constraints. The teacher's own choices are
 * preserved; the plan's accommodations are additive and its exclusions are absolute.
 */
export function iepToConstraints(plan: IEPPlan, base: TeacherConstraints = {}): TeacherConstraints {
  const force = new Set([...(base.forceAdaptations ?? []), ...plan.accommodations.map((a) => a.adaptationId)]);
  const disable = new Set([...(base.disableAdaptations ?? []), ...(plan.excludedAdaptations ?? [])]);
  for (const id of disable) force.delete(id); // an exclusion always wins over a force
  return { ...base, forceAdaptations: [...force], disableAdaptations: [...disable] };
}

// ---------------------------------------------------------------------------
// The plan gate (IEP build, step 2)
// ---------------------------------------------------------------------------

export interface PlanFinding {
  readonly code: string;
  readonly severity: WarningSeverity;
  readonly message: string;
}

/**
 * Validate a plan before it is allowed to drive the compiler. The gate keeps the
 * plan screen honest the same way the item gate keeps items honest:
 *
 *  - every accommodation must map to a real catalog adaptation, and must quote the
 *    plan's own wording (the audit trail is the accommodation);
 *  - a plan can never force an objective *modification* through the accommodation
 *    lane — modifications live only in the human-authorized alternate-standards
 *    state, which this module deliberately cannot set;
 *  - mismatches between the plan's access/support kind and the platform's fade
 *    semantics are surfaced, so nobody discovers on test day that a "channel"
 *    faded or a "scaffold" never will;
 *  - a same-id force+exclude conflict is surfaced (the exclusion wins).
 *
 * Blocking findings mean the plan must not reach `iepToConstraints`.
 */
export function validateIEPPlan(plan: IEPPlan, catalog: readonly Adaptation[]): PlanFinding[] {
  const findings: PlanFinding[] = [];
  const at = (code: string, severity: WarningSeverity, message: string) =>
    findings.push({ code, severity, message });
  const byId = new Map(catalog.map((a) => [a.id, a]));

  if (plan.accommodations.length === 0 && (plan.excludedAdaptations ?? []).length === 0) {
    at('EMPTY_PLAN', 'warning', 'The plan carries no accommodations and no exclusions — nothing for the compiler to enforce.');
  }

  const seen = new Set<string>();
  for (const acc of plan.accommodations) {
    const a = byId.get(acc.adaptationId);
    if (!a) {
      at('UNKNOWN_ADAPTATION', 'blocking', `Accommodation "${acc.adaptationId}" is not in the adaptation catalog.`);
      continue;
    }
    if (seen.has(acc.adaptationId)) {
      at('DUPLICATE_ACCOMMODATION', 'warning', `"${a.label}" appears more than once in the plan.`);
    }
    seen.add(acc.adaptationId);
    if (acc.planText.trim().length === 0) {
      at('EMPTY_PLAN_TEXT', 'blocking', `"${a.label}" must quote the plan's own wording — the accommodation IS the audit trail.`);
    }
    if (a.adaptationClass === 'objective_modification') {
      at(
        'MODIFICATION_IN_ACCOMMODATION_LANE',
        'blocking',
        `"${a.label}" modifies the Learning Objective. A plan's accommodations cannot open that lane — alternate standards are a separate, human-authorized state.`,
      );
    }
    if (acc.kind === 'access' && a.fadeRule !== null) {
      at('ACCESS_WOULD_FADE', 'warning', `The plan calls "${a.label}" an access channel, but the platform fades it (${a.fadeRule}). Confirm with the team: channels never fade.`);
    }
    if (acc.kind === 'support' && a.fadeRule === null && a.adaptationClass === 'access') {
      at('SUPPORT_IS_PERMANENT', 'warning', `The plan calls "${a.label}" a support, but it is a permanent access channel — it will never fade.`);
    }
  }

  for (const id of plan.excludedAdaptations ?? []) {
    if (!byId.has(id)) {
      at('UNKNOWN_EXCLUSION', 'blocking', `Excluded adaptation "${id}" is not in the adaptation catalog.`);
    }
    if (seen.has(id)) {
      at('FORCE_EXCLUDE_CONFLICT', 'warning', `"${byId.get(id)?.label ?? id}" is both an accommodation and an exclusion — the exclusion wins, and the accommodation will NOT be applied.`);
    }
  }

  return findings;
}

/** True when the plan has no blocking findings and may drive the compiler. */
export function isPlanUsable(plan: IEPPlan, catalog: readonly Adaptation[]): boolean {
  return validateIEPPlan(plan, catalog).every((f) => f.severity !== 'blocking');
}
