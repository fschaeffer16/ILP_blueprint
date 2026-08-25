/**
 * Baseline task delivery (blueprint §7 baseline system).
 *
 * The screener (`baseline.ts`) consumes `BaselineObservation`s. This module produces
 * them from a child's actual responses to age-appropriate tasks — so the scores are
 * earned, not synthetic. Two task formats keep it developmentally honest:
 *   - `single_choice` — a game/tablet task the child answers directly.
 *   - `observation_scale` — a structured teacher observation (0..1), used where a
 *     multiple-choice item would be the wrong instrument (fluency, attention, oral
 *     language). This matches the blueprint's K–3 design: game-like tasks plus
 *     structured observation, never one long diagnostic.
 *
 * Delivery is deterministic: the same responses always score the same way, so a demo,
 * a test, and a live session agree.
 */

import type { BaselineObservation, ObservationMethod, ProcessingDomain } from './baseline.js';

export interface TaskChoice {
  readonly id: string;
  readonly label: string;
}

export type TaskFormat = 'single_choice' | 'observation_scale';

export interface BaselineTask {
  readonly id: string;
  readonly domain: ProcessingDomain;
  /** Which of the (up to three) short sessions this task belongs to. */
  readonly session: 1 | 2 | 3;
  readonly method: ObservationMethod;
  readonly format: TaskFormat;
  readonly prompt: string;
  /** For single_choice. */
  readonly choices?: readonly TaskChoice[];
  readonly correctChoiceId?: string;
  /** For observation_scale — what the observer is rating. */
  readonly scaleHint?: string;
}

export interface TaskResponse {
  readonly taskId: string;
  /** single_choice: the chosen option id. */
  readonly choiceId?: string;
  /** observation_scale: a 0..1 rating from the observer. */
  readonly scaleValue?: number;
}

/** Score one response, 0..1. Unanswered or unmatched → 0. */
export function scoreTaskResponse(task: BaselineTask, response: TaskResponse | undefined): number {
  if (!response) return 0;
  if (task.format === 'single_choice') {
    return response.choiceId && response.choiceId === task.correctChoiceId ? 1 : 0;
  }
  // observation_scale
  const v = response.scaleValue ?? 0;
  return Math.max(0, Math.min(1, v));
}

export interface AdministerInput {
  readonly studentId: string;
  readonly date: string;
  readonly tasks: readonly BaselineTask[];
  readonly responses: readonly TaskResponse[];
}

/**
 * Turn a set of task responses into baseline observations the screener can use.
 * Only answered tasks produce observations (a skipped task is simply not evidence).
 */
export function administer(input: AdministerInput): BaselineObservation[] {
  const byTask = new Map(input.responses.map((r) => [r.taskId, r]));
  const out: BaselineObservation[] = [];
  for (const task of input.tasks) {
    const response = byTask.get(task.id);
    if (!response) continue;
    out.push({
      studentId: input.studentId,
      domain: task.domain,
      sessionId: `BS-${task.session}`,
      date: input.date,
      score: scoreTaskResponse(task, response),
      method: task.method,
      evidenceId: `EV-${task.id}`,
    });
  }
  return out;
}
