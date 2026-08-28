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

import type { TeacherConstraints } from './types.js';

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
