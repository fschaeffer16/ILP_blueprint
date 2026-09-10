/**
 * Prompt-level evidence and the independence trend — step 3 of the IEP build
 * (ese-program.md §3 step 5, §7).
 *
 * Every attempt a student makes is tagged with how much help they needed
 * (independent → full support). Two rules keep this honest:
 *
 *   1. **Prompt level never changes correctness.** A correct answer with full
 *      support is still a correct answer on the item — the level is context for
 *      the IEP team, never a grade penalty. What it *does* gate is
 *      `independentMastery`: mastery the program will claim a scaffold can fade
 *      on requires correct AND independent.
 *   2. **The trend is evidence, not a decision.** `readyToFade` flags a scaffold
 *      whose last attempts are all correct and independent; the teacher and the
 *      team decide. Access channels are exempt by construction — they never fade,
 *      so nothing here ever recommends fading one.
 */

import type { PromptLevel } from './symbolResponse.js';

export type ResponseChannel = 'text' | 'symbol_tap' | 'speech' | 'handwriting';

/** One attempt on one item, with the support the adult noted. */
export interface PromptedAttempt {
  readonly studentId: string;
  readonly itemId: string;
  readonly objectiveId: string;
  /** `_M#` module tag of the item, when present. */
  readonly moduleId: string | null;
  readonly date: string; // ISO date
  readonly correct: boolean;
  readonly promptLevel: PromptLevel;
  readonly responseChannel: ResponseChannel;
}

/** independent=1.0 … full_support=0.0 — the independence weight of one attempt. */
export const INDEPENDENCE_WEIGHT: Record<PromptLevel, number> = {
  independent: 1,
  gestural_prompt: 2 / 3,
  modeled: 1 / 3,
  full_support: 0,
};

export type IndependenceDirection =
  | 'gaining_independence'
  | 'steady'
  | 'losing_independence'
  | 'insufficient_evidence';

export interface IndependenceTrend {
  readonly studentId: string;
  readonly objectiveId: string;
  readonly moduleId: string | null;
  readonly attempts: number;
  /** Share of attempts correct — prompt level does NOT discount this. */
  readonly correctRate: number;
  /** Share of attempts both correct AND independent — what fading may rest on. */
  readonly independentMasteryRate: number;
  /** Mean independence weight of the first and last halves of the record. */
  readonly earlyIndependence: number;
  readonly lateIndependence: number;
  readonly direction: IndependenceDirection;
  readonly latestLevel: PromptLevel;
  /** Last `FADE_WINDOW` attempts all correct and independent → a scaffold-fade
   * conversation is supported by evidence. Never set with fewer attempts. */
  readonly readyToFade: boolean;
  /** Correct answers are coming, but not independently — mastery is real and
   * supported; do not mistake it for independent mastery, in either direction. */
  readonly correctOnlyWithSupport: boolean;
}

const MIN_TREND_ATTEMPTS = 4;
const FADE_WINDOW = 3;
const TREND_DELTA = 0.15;

const byDate = (a: PromptedAttempt, b: PromptedAttempt) =>
  a.date < b.date ? -1 : a.date > b.date ? 1 : a.itemId.localeCompare(b.itemId);

const mean = (xs: readonly number[]) => (xs.length === 0 ? 0 : xs.reduce((s, x) => s + x, 0) / xs.length);

/**
 * Build the independence trend for one student on one objective (optionally one
 * module) from their dated attempts. Deterministic; order of input irrelevant.
 */
export function buildIndependenceTrend(
  attempts: readonly PromptedAttempt[],
  key: { studentId: string; objectiveId: string; moduleId?: string | null },
): IndependenceTrend {
  const rows = attempts
    .filter(
      (a) =>
        a.studentId === key.studentId &&
        a.objectiveId === key.objectiveId &&
        (key.moduleId === undefined || a.moduleId === key.moduleId),
    )
    .sort(byDate);

  const n = rows.length;
  const weights = rows.map((a) => INDEPENDENCE_WEIGHT[a.promptLevel]);
  const correctRate = n === 0 ? 0 : rows.filter((a) => a.correct).length / n;
  const independentMasteryRate =
    n === 0 ? 0 : rows.filter((a) => a.correct && a.promptLevel === 'independent').length / n;

  let direction: IndependenceDirection = 'insufficient_evidence';
  let early = 0;
  let late = 0;
  if (n >= MIN_TREND_ATTEMPTS) {
    const half = Math.floor(n / 2);
    early = mean(weights.slice(0, half));
    late = mean(weights.slice(n - half));
    const delta = late - early;
    direction = delta >= TREND_DELTA ? 'gaining_independence' : delta <= -TREND_DELTA ? 'losing_independence' : 'steady';
  }

  const tail = rows.slice(-FADE_WINDOW);
  const readyToFade =
    tail.length === FADE_WINDOW && tail.every((a) => a.correct && a.promptLevel === 'independent');

  const correctOnlyWithSupport =
    n >= MIN_TREND_ATTEMPTS && correctRate >= 0.75 && independentMasteryRate < 0.25;

  return {
    studentId: key.studentId,
    objectiveId: key.objectiveId,
    moduleId: key.moduleId ?? (rows[0]?.moduleId ?? null),
    attempts: n,
    correctRate,
    independentMasteryRate,
    earlyIndependence: early,
    lateIndependence: late,
    direction,
    latestLevel: rows[n - 1]?.promptLevel ?? 'independent',
    readyToFade,
    correctOnlyWithSupport,
  };
}
