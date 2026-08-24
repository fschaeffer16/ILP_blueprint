/**
 * Assessment engine (blueprint §12; build spec §36).
 *
 * Two responsibilities, both deterministic and testable:
 *   1. Model rubrics, assessment specs and assessment items.
 *   2. Enforce the *item integrity gate* — the deterministic checks from the
 *      assessment generation gate (§36) that every item must pass before it can reach
 *      a student: objective alignment, answerability, answer-key consistency,
 *      prohibited clues / answer leakage, and equivalence-band presence.
 *
 * Item *generation* is a pluggable seam (`ItemGenerator`) so an AI model gateway can
 * produce candidate items later; a deterministic reference generator is provided so
 * the engine runs and tests without any model. Generated items are always run through
 * the gate and, for the pilot, require teacher/curriculum approval before delivery.
 */

import type { ObjectiveVersion, WarningSeverity } from './types.js';

export type ItemFormat =
  | 'multiple_choice'
  | 'constructed_response'
  | 'representation'
  | 'explanation';

/** A rubric criterion. `objectiveTrace` ties the criterion to a specific piece of the
 * objective's required reasoning or essential knowledge (traceability, P2). */
export interface RubricCriterion {
  readonly id: string;
  readonly description: string;
  readonly maxPoints: number;
  /** The objective element this criterion measures, e.g. 'represent' or 'numerator'. */
  readonly objectiveTrace: string;
  /** Mechanics (spelling/grammar) — weighting is teacher-controlled and objective-dependent. */
  readonly isMechanics?: boolean;
}

export interface Rubric {
  readonly rubricId: string;
  readonly objectiveId: string;
  readonly objectiveVersion: number;
  readonly criteria: readonly RubricCriterion[];
}

export interface AssessmentSpec {
  readonly specId: string;
  readonly objectiveId: string;
  readonly objectiveVersion: number;
  /** What this assessment must measure — each claim maps to objective reasoning/knowledge. */
  readonly evidenceClaims: readonly string[];
  readonly equivalenceBand: string;
  readonly rubricId: string;
  readonly itemConstraints: {
    readonly formats: readonly ItemFormat[];
    readonly itemCount: number;
  };
}

export interface AssessmentItem {
  readonly itemId: string;
  readonly objectiveId: string;
  readonly objectiveVersion: number;
  readonly format: ItemFormat;
  readonly prompt: string;
  /** The single evidence claim this item measures (must trace to the objective). */
  readonly evidenceClaim: string;
  /** Acceptable answers. Required for auto-scored formats (multiple_choice). */
  readonly answerKey: readonly string[];
  /** Incorrect options for multiple_choice. */
  readonly distractors: readonly string[];
  readonly equivalenceBand: string;
  readonly sourceIds: readonly string[];
  /** Phrases that would give the answer away and must not appear in the prompt. */
  readonly prohibitedClues: readonly string[];
  readonly status: 'draft' | 'approved';
}

export interface ItemFinding {
  readonly code: string;
  readonly severity: WarningSeverity;
  readonly message: string;
  readonly itemId: string;
}

const norm = (s: string) => s.trim().toLowerCase();

/**
 * The deterministic item integrity gate (§36 steps 4). Returns all findings; a
 * `blocking` finding means the item must not reach a student.
 */
export function checkItemIntegrity(
  item: AssessmentItem,
  objective: ObjectiveVersion,
): ItemFinding[] {
  const findings: ItemFinding[] = [];
  const at = (code: string, severity: WarningSeverity, message: string) =>
    findings.push({ code, severity, message, itemId: item.itemId });

  // 1. Alignment: the item must belong to this objective version, and its evidence
  //    claim must trace to the objective's required reasoning or essential knowledge.
  if (item.objectiveId !== objective.objectiveId || item.objectiveVersion !== objective.version) {
    at(
      'ITEM_OBJECTIVE_MISMATCH',
      'blocking',
      `Item ${item.itemId} references ${item.objectiveId} v${item.objectiveVersion} but was checked against ${objective.objectiveId} v${objective.version}.`,
    );
  }
  const traceable = new Set(
    [...objective.requiredReasoning, ...objective.essentialKnowledge].map(norm),
  );
  if (!traceable.has(norm(item.evidenceClaim))) {
    at(
      'ITEM_NOT_TRACEABLE',
      'blocking',
      `Item ${item.itemId} measures "${item.evidenceClaim}", which is not in the objective's required reasoning or essential knowledge.`,
    );
  }

  // 2. Answerability: auto-scored formats need a key and options.
  if (item.format === 'multiple_choice') {
    if (item.answerKey.length === 0) {
      at('ITEM_NOT_ANSWERABLE', 'blocking', `Multiple-choice item ${item.itemId} has no answer key.`);
    }
    if (item.distractors.length === 0) {
      at('ITEM_NO_DISTRACTORS', 'blocking', `Multiple-choice item ${item.itemId} has no distractors.`);
    }
    // 3. Answer-key consistency: correct answers must not appear among distractors.
    const keys = new Set(item.answerKey.map(norm));
    const overlap = item.distractors.filter((d) => keys.has(norm(d)));
    if (overlap.length > 0) {
      at(
        'ANSWER_KEY_CONFLICT',
        'blocking',
        `Item ${item.itemId} lists ${overlap.join(', ')} as both a correct answer and a distractor.`,
      );
    }
    // 4a. Answer leakage: the correct answer appears verbatim in the prompt.
    for (const k of item.answerKey) {
      if (k.length > 1 && norm(item.prompt).includes(norm(k))) {
        at('ANSWER_LEAK', 'blocking', `Item ${item.itemId} prompt contains its own answer ("${k}").`);
        break;
      }
    }
    // duplicate keys
    if (new Set(item.answerKey.map(norm)).size !== item.answerKey.length) {
      at('DUPLICATE_ANSWER_KEY', 'warning', `Item ${item.itemId} has duplicate answer-key entries.`);
    }
  }

  // 4b. Prohibited clues must not appear in the prompt.
  for (const clue of item.prohibitedClues) {
    if (clue.length > 0 && norm(item.prompt).includes(norm(clue))) {
      at('PROHIBITED_CLUE', 'blocking', `Item ${item.itemId} prompt contains a prohibited clue ("${clue}").`);
    }
  }

  // 5. Equivalence band must be declared so versions can be compared.
  if (norm(item.equivalenceBand).length === 0) {
    at('MISSING_EQUIVALENCE_BAND', 'warning', `Item ${item.itemId} has no equivalence band.`);
  }

  // Source grounding: student-facing items should cite approved sources.
  if (item.sourceIds.length === 0) {
    at('ITEM_NO_SOURCE', 'warning', `Item ${item.itemId} cites no approved source.`);
  }

  return findings;
}

/** True only when the item is approved and has no blocking integrity findings. */
export function isDeliverable(item: AssessmentItem, objective: ObjectiveVersion): boolean {
  if (item.status !== 'approved') return false;
  return checkItemIntegrity(item, objective).every((f) => f.severity !== 'blocking');
}

// ---------------------------------------------------------------------------
// Pluggable item generation seam
// ---------------------------------------------------------------------------

export interface ItemGenerationResult {
  readonly candidate: AssessmentItem;
  readonly findings: readonly ItemFinding[];
  /** Pilot rule: generated items require teacher/curriculum approval before delivery. */
  readonly requiresApproval: boolean;
}

/**
 * The seam a real model gateway implements. `id` records provenance (model/version).
 */
export interface ItemGenerator {
  readonly id: string;
  generate(spec: AssessmentSpec, objective: ObjectiveVersion, evidenceClaim: string): AssessmentItem;
}

/**
 * Run the generation gate: generate a candidate, run the integrity checks, and mark it
 * as requiring approval. Never returns an approved item — approval is a teacher action.
 */
export function runGenerationGate(
  generator: ItemGenerator,
  spec: AssessmentSpec,
  objective: ObjectiveVersion,
  evidenceClaim: string,
): ItemGenerationResult {
  const candidate = generator.generate(spec, objective, evidenceClaim);
  const findings = checkItemIntegrity(candidate, objective);
  return { candidate, findings, requiresApproval: true };
}

/**
 * A deterministic reference generator (no AI). It emits a constructed-response item that
 * asks the student to demonstrate the evidence claim, grounded in the objective's
 * sources. Real generators (model gateway) implement the same interface.
 */
export const referenceItemGenerator: ItemGenerator = {
  id: 'reference-generator@0',
  generate(spec, objective, evidenceClaim) {
    return {
      itemId: `${spec.specId}-${norm(evidenceClaim).replace(/\s+/g, '_')}`,
      objectiveId: objective.objectiveId,
      objectiveVersion: objective.version,
      format: 'constructed_response',
      prompt: `Show that you can ${evidenceClaim} for: "${objective.studentOutcome}". Explain your reasoning.`,
      evidenceClaim,
      answerKey: [],
      distractors: [],
      equivalenceBand: spec.equivalenceBand,
      sourceIds: [...objective.sourceIds],
      prohibitedClues: [...objective.misconceptions],
      status: 'draft',
    };
  },
};
