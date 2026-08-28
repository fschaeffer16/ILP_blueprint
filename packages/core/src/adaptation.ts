/**
 * The adaptation engine.
 *
 * Implements the blueprint's "adaptation decision order" (build spec §32):
 *   1. Lock the objective's essential knowledge, required reasoning and mastery rule.
 *   2. Retrieve the student ILP hypotheses that apply and are inside their review dates.
 *   3. Rank permitted adaptations by evidence strength, prior effectiveness and policy.
 *   4. Select the smallest set of supports needed to provide access.
 *   5. Add one capacity-development target when a weakness should be strengthened.
 *   6/7. (compiler.ts) compile + validate the manifest and summarize for the teacher.
 *
 * The engine is pure and deterministic: same objective + ILP + catalog + constraints
 * → same selection. That determinism is what lets the teacher trust the class summary
 * and what makes the behavior auditable (P7) and testable.
 *
 * It never applies an `objective_modification` on its own. If access looks impossible
 * even with every permitted support, it *proposes* a modification and defers to the
 * teacher (P1, P3).
 */

import type {
  Adaptation,
  CompileWarning,
  DeliveryPattern,
  EvidenceDomain,
  ILPHypothesis,
  ObjectiveVersion,
  StudentILP,
  TeacherConstraints,
} from './types.js';

/**
 * District-tunable thresholds. Exposed so a district can retune individualization
 * aggressiveness without changing objective contracts or engine code.
 */
export interface AdaptationPolicy {
  /** At/above this objective-mastery readiness, a student is enrichment-eligible. */
  readonly advancedReadiness: number;
  /** At/below this readiness in an essential domain, access is at risk. */
  readonly accessRiskReadiness: number;
  /** Max number of support adaptations to stack before the load itself is a barrier. */
  readonly maxSupports: number;
  /**
   * Essential domains for access. If a student is at/below `accessRiskReadiness`
   * across all of these *and* no permitted support triggers, propose modification.
   */
  readonly essentialAccessDomains: readonly EvidenceDomain[];
}

export const DEFAULT_POLICY: AdaptationPolicy = {
  advancedReadiness: 0.85,
  accessRiskReadiness: 0.25,
  maxSupports: 3,
  essentialAccessDomains: ['prerequisite_knowledge', 'objective_mastery'],
};

/** Precedence used to name a manifest's single delivery pattern. */
const PATTERN_PRECEDENCE: readonly DeliveryPattern[] = [
  'advanced_transfer',
  'aac_supported', // the access channel defines the delivery when present
  'guided_practice',
  'visual_first',
  'vocabulary_supported',
  'core',
];

export interface AdaptationSelection {
  readonly selected: readonly Adaptation[];
  readonly pattern: DeliveryPattern;
  readonly objectiveModified: boolean;
  readonly rationale: readonly string[];
  readonly warnings: readonly CompileWarning[];
}

function isExpired(hypothesis: ILPHypothesis, today: Date): boolean {
  const review = new Date(hypothesis.reviewAt);
  return !Number.isNaN(review.getTime()) && review.getTime() < today.getTime();
}

/** The active (non-expired) hypothesis for a domain, if any. */
function readinessFor(
  student: StudentILP,
  domain: EvidenceDomain,
  today: Date,
): ILPHypothesis | undefined {
  return student.hypotheses.find((h) => h.domain === domain && !isExpired(h, today));
}

/** Does the adaptation's trigger fire for this student? */
function triggerMatches(
  adaptation: Adaptation,
  student: StudentILP,
  today: Date,
): { matched: boolean; score: number; domain?: EvidenceDomain } {
  let best = { matched: false, score: 0 } as {
    matched: boolean;
    score: number;
    domain?: EvidenceDomain;
  };
  for (const trigger of adaptation.triggers) {
    const h = readinessFor(student, trigger.domain, today);
    if (!h) continue;
    const belowMax = trigger.maxReadiness !== undefined && h.readiness <= trigger.maxReadiness;
    const aboveMin = trigger.minReadiness !== undefined && h.readiness >= trigger.minReadiness;
    if (!belowMax && !aboveMin) continue;
    // Evidence strength: how strongly the ILP justifies acting, weighted by confidence.
    // Support need grows as readiness falls; enrichment need grows as readiness rises.
    const need = belowMax ? 1 - h.readiness : h.readiness;
    let score = need * h.confidence;
    // Prior effectiveness boosts a support the student has responded to before.
    if (h.effectiveSupports?.includes(adaptation.id)) score += 0.5;
    // Teacher-confirmed hypotheses carry more weight than unreviewed inferences.
    if (h.teacherConfirmed) score += 0.1;
    if (score > best.score) best = { matched: true, score, domain: trigger.domain };
  }
  return best;
}

/**
 * Select adaptations for one student against one published objective.
 */
export function selectAdaptations(
  objective: ObjectiveVersion,
  student: StudentILP,
  catalog: ReadonlyMap<string, Adaptation>,
  constraints: TeacherConstraints = {},
  policy: AdaptationPolicy = DEFAULT_POLICY,
  today: Date = new Date(),
): AdaptationSelection {
  const rationale: string[] = [];
  const warnings: CompileWarning[] = [];

  // (1) The objective is already published + locked by the caller (compiler).
  // (2)+(3) Build the candidate set: only adaptations the district approved for this
  // objective, minus anything the objective prohibits, minus teacher-disabled ones.
  const disabled = new Set(constraints.disableAdaptations ?? []);
  const prohibited = new Set(objective.prohibitedAdaptations);
  const candidateIds = objective.permittedAdaptations.filter(
    (id) => !prohibited.has(id) && !disabled.has(id),
  );

  const scored: Array<{ adaptation: Adaptation; score: number }> = [];
  for (const id of candidateIds) {
    const adaptation = catalog.get(id);
    if (!adaptation) {
      warnings.push({
        code: 'UNKNOWN_ADAPTATION',
        severity: 'warning',
        message: `Objective ${objective.objectiveId} permits adaptation "${id}" which is not in the catalog.`,
        studentId: student.studentId,
      });
      continue;
    }
    if (adaptation.adaptationClass === 'objective_modification') continue; // handled below
    const { matched, score } = triggerMatches(adaptation, student, today);
    if (matched) scored.push({ adaptation, score });
  }

  // (4) Smallest set for access: strongest-justified supports first, deduped so we
  // never stack two adaptations that contribute the same delivery pattern, capped so
  // the support load does not itself become a barrier (P9 — technology serves learning).
  scored.sort((a, b) => b.score - a.score);
  const selected: Adaptation[] = [];
  const usedPatterns = new Set<DeliveryPattern>();
  const supportClasses = new Set(['access', 'scaffold']);
  for (const { adaptation } of scored) {
    if (!supportClasses.has(adaptation.adaptationClass)) continue;
    if (usedPatterns.has(adaptation.contributesToPattern)) continue;
    if (selected.length >= policy.maxSupports) break;
    selected.push(adaptation);
    usedPatterns.add(adaptation.contributesToPattern);
    rationale.push(
      `Applied "${adaptation.label}" (${adaptation.adaptationClass}) — ${adaptation.permittedChange}.`,
    );
  }

  // (5) Enrichment / capacity development: if the student is ready to advance, add one
  // in-objective difficulty adaptation (advanced transfer) rather than a support.
  const mastery = readinessFor(student, 'objective_mastery', today);
  const enrichmentEligible = !!mastery && mastery.readiness >= policy.advancedReadiness && selected.length === 0;
  if (enrichmentEligible) {
    const enrich = scored.find(
      ({ adaptation }) =>
        adaptation.adaptationClass === 'difficulty' &&
        adaptation.contributesToPattern === 'advanced_transfer',
    );
    if (enrich) {
      selected.push(enrich.adaptation);
      rationale.push(
        `Applied "${enrich.adaptation.label}" — student shows readiness ${mastery.readiness.toFixed(
          2,
        )}; extending within the objective via transfer (rigor unchanged).`,
      );
    } else {
      rationale.push('Student ready to advance; no advanced-transfer adaptation permitted for this objective.');
    }
  }

  // Teacher force-enables: honored unless the objective prohibits them (guardrail).
  for (const id of constraints.forceAdaptations ?? []) {
    if (prohibited.has(id)) {
      warnings.push({
        code: 'FORCED_PROHIBITED_ADAPTATION',
        severity: 'blocking',
        message: `Teacher forced adaptation "${id}" but objective ${objective.objectiveId} prohibits it. Not applied.`,
        studentId: student.studentId,
      });
      continue;
    }
    const adaptation = catalog.get(id);
    if (adaptation && !selected.some((s) => s.id === id)) {
      selected.push(adaptation);
      rationale.push(`Teacher force-enabled "${adaptation.label}" for the class.`);
    }
  }

  // Objective modification (P3): never automatic. Detect the case, defer to teacher.
  let objectiveModified = false;
  const authorized = new Set(constraints.objectiveModificationAuthorizedFor ?? []);
  const accessAtRisk = policy.essentialAccessDomains.every((d) => {
    const h = readinessFor(student, d, today);
    return h !== undefined && h.readiness <= policy.accessRiskReadiness;
  });
  if (accessAtRisk && selected.length === 0) {
    if (authorized.has(student.studentId)) {
      objectiveModified = true;
      rationale.push(
        'Teacher-authorized objective modification applied. This student\'s result CANNOT be reported as equivalent mastery.',
      );
      warnings.push({
        code: 'OBJECTIVE_MODIFIED',
        severity: 'info',
        message: `Objective modified for ${student.displayName} under teacher authorization.`,
        studentId: student.studentId,
      });
    } else {
      warnings.push({
        code: 'OBJECTIVE_MODIFICATION_SUGGESTED',
        severity: 'warning',
        message: `${student.displayName} may not be able to access ${objective.objectiveId} even with permitted supports. Teacher authorization required before modifying the objective.`,
        studentId: student.studentId,
      });
    }
  }

  if (selected.length === 0 && !objectiveModified && rationale.length === 0) {
    rationale.push('No adaptation warranted; delivering the core version of the objective.');
  }

  const pattern = namePattern(selected);
  return { selected, pattern, objectiveModified, rationale, warnings };
}

/** Reduce a set of selected adaptations to a single, teacher-facing pattern label. */
export function namePattern(selected: readonly Adaptation[]): DeliveryPattern {
  const patterns = new Set(selected.map((a) => a.contributesToPattern));
  for (const p of PATTERN_PRECEDENCE) {
    if (patterns.has(p)) return p;
  }
  return 'core';
}

/** Build an id→Adaptation map from a catalog array. */
export function indexCatalog(catalog: readonly Adaptation[]): Map<string, Adaptation> {
  return new Map(catalog.map((a) => [a.id, a]));
}
