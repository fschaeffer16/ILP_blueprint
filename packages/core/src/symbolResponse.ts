/**
 * Picture-response items — step 1 of the IEP build (ese-program.md §8;
 * ese-applied-design.md).
 *
 * A nonverbal or semi-verbal student answers the SAME approved assessment item as
 * their classmates by tapping picture buttons instead of reading text options.
 * Design rules, inherited from the ESE layer and enforced here:
 *
 *   - The channel changes; the item does not. A symbol rendering carries exactly
 *     the text item's answer set — same key, same distractors. Rendering never
 *     adds, drops, or edits a choice.
 *   - Meaning is preserved: every picture button's label IS the answer value it
 *     stands for. Glyphs are a display layer; in a deployed district build they
 *     map to the child's own AAC symbol set — honored, not replaced.
 *   - Only deliverable items render (approved + no blocking integrity findings),
 *     so the picture channel can never smuggle an unvetted item to a student.
 *   - Choice order is deterministic per item (reproducible renders) but derived
 *     from a hash, so the correct answer holds no fixed position.
 *   - Scoring is the same rule as text: tapped value vs. answer key. Evidence
 *     records the response channel and the prompt level, so mastery shown through
 *     a symbol tap counts identically — and visibly — in module tracking.
 */

import type { ObjectiveVersion } from './types.js';
import type { AssessmentItem, ItemFinding } from './assessment.js';
import { isDeliverable } from './assessment.js';
import { moduleTag } from './examAnalysis.js';

/** One picture button. `label` is the exact answer value the picture stands for. */
export interface SymbolToken {
  readonly glyph: string;
  readonly label: string;
}

/** A vocabulary of picture buttons — the demo set here; the child's AAC set in production. */
export interface SymbolVocabulary {
  readonly vocabId: string;
  readonly symbols: readonly SymbolToken[];
}

export interface SymbolChoice {
  readonly choiceId: string;
  /** The answer value this button stands for (identical to the text option). */
  readonly value: string;
  readonly symbol: SymbolToken;
}

/** The picture-response version of one multiple-choice item. */
export interface SymbolRendering {
  readonly itemId: string;
  readonly objectiveId: string;
  readonly vocabId: string;
  readonly promptText: string;
  readonly choices: readonly SymbolChoice[];
}

export interface SymbolRenderingResult {
  readonly rendering: SymbolRendering | null;
  readonly findings: readonly ItemFinding[];
}

/** How much help the student needed for this attempt (IEP evidence, never a grade). */
export type PromptLevel = 'independent' | 'gestural_prompt' | 'modeled' | 'full_support';

export const PROMPT_LEVELS: readonly PromptLevel[] = [
  'independent',
  'gestural_prompt',
  'modeled',
  'full_support',
];

/** A scored symbol tap — the same mastery evidence a typed answer produces. */
export interface SymbolResponseEvidence {
  readonly itemId: string;
  readonly objectiveId: string;
  /** `_M#` module tag parsed from the item id, when present — feeds exam analysis. */
  readonly moduleId: string | null;
  readonly choiceId: string;
  readonly value: string;
  readonly correct: boolean;
  readonly responseChannel: 'symbol_tap';
  readonly promptLevel: PromptLevel;
}

const norm = (s: string) => s.trim().toLowerCase();

/** FNV-1a — deterministic, dependency-free ordering seed. */
const fnv = (s: string): number => {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
};

/**
 * Render a deliverable multiple-choice item as picture buttons in the given
 * vocabulary. Fails closed: any gap produces findings and no rendering.
 */
export function renderSymbolItem(
  item: AssessmentItem,
  vocab: SymbolVocabulary,
  objective: ObjectiveVersion,
): SymbolRenderingResult {
  const findings: ItemFinding[] = [];
  const at = (code: string, message: string) =>
    findings.push({ code, severity: 'blocking', message, itemId: item.itemId });

  if (item.format !== 'multiple_choice') {
    at(
      'SYMBOL_FORMAT_UNSUPPORTED',
      `Item ${item.itemId} is ${item.format}; picture-response rendering supports multiple_choice.`,
    );
  }
  if (!isDeliverable(item, objective)) {
    at(
      'SYMBOL_ITEM_NOT_DELIVERABLE',
      `Item ${item.itemId} is not deliverable (unapproved or failing the integrity gate); the picture channel never bypasses the gate.`,
    );
  }
  if (findings.length > 0) return { rendering: null, findings };

  const byLabel = new Map(vocab.symbols.map((s) => [norm(s.label), s]));
  const values = [...item.answerKey, ...item.distractors];
  const resolved: { value: string; symbol: SymbolToken }[] = [];
  for (const value of values) {
    const symbol = byLabel.get(norm(value));
    if (!symbol) {
      at(
        'SYMBOL_VOCAB_GAP',
        `Vocabulary ${vocab.vocabId} has no picture for answer value "${value}" of item ${item.itemId}.`,
      );
    } else {
      resolved.push({ value, symbol });
    }
  }
  if (findings.length > 0) return { rendering: null, findings };

  // Deterministic per-item order; the key earns no fixed slot.
  const ordered = [...resolved].sort(
    (a, b) => fnv(`${item.itemId}::${norm(a.value)}`) - fnv(`${item.itemId}::${norm(b.value)}`),
  );
  const choices = ordered.map((r, i) => ({
    choiceId: `${item.itemId}#c${i + 1}`,
    value: r.value,
    symbol: r.symbol,
  }));

  return {
    rendering: {
      itemId: item.itemId,
      objectiveId: item.objectiveId,
      vocabId: vocab.vocabId,
      promptText: item.prompt,
      choices,
    },
    findings,
  };
}

/**
 * Score one tapped picture button — the same correctness rule as the text item.
 * Returns null for a choice id that does not belong to the rendering.
 */
export function scoreSymbolResponse(
  item: AssessmentItem,
  rendering: SymbolRendering,
  choiceId: string,
  promptLevel: PromptLevel = 'independent',
): SymbolResponseEvidence | null {
  if (rendering.itemId !== item.itemId) return null;
  const choice = rendering.choices.find((c) => c.choiceId === choiceId);
  if (!choice) return null;
  const keys = new Set(item.answerKey.map(norm));
  return {
    itemId: item.itemId,
    objectiveId: item.objectiveId,
    moduleId: moduleTag(item.itemId),
    choiceId: choice.choiceId,
    value: choice.value,
    correct: keys.has(norm(choice.value)),
    responseChannel: 'symbol_tap',
    promptLevel,
  };
}
