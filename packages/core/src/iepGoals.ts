/**
 * IEP goals as module chains — step 4 of the IEP build (ese-program.md §3 step 2,
 * §8; ese-applied-design.md).
 *
 * An annual IEP goal decomposes into the SAME modules the class already runs —
 * so pull-aside instruction works the same curriculum, and progress toward the
 * goal accrues automatically as a byproduct of instruction, from the same
 * prompt-level attempt records step 3 introduced. Rules kept honest here:
 *
 *   - The goal's text is carried verbatim (the audit trail), and the criterion
 *     states its prompt level explicitly: "80% accurate" means nothing until you
 *     say at what independence. Only attempts at or above the criterion's prompt
 *     level count toward the criterion — so supported success can never quietly
 *     satisfy an independence goal.
 *   - Progress is evidence for the IEP team. `met` is a data statement about the
 *     criterion, never a legal determination; reviews and decisions stay human.
 */

import type { WarningSeverity } from './types.js';
import type { ModuleDef } from './examAnalysis.js';
import type { PromptLevel } from './symbolResponse.js';
import { INDEPENDENCE_WEIGHT, type PromptedAttempt } from './independence.js';

export type GoalArea = 'academic' | 'communication' | 'behavioral_regulation' | 'motor' | 'social';

export interface GoalCriterion {
  /** Required accuracy (0..1] on qualifying attempts. */
  readonly accuracy: number;
  /** Attempts count toward the criterion only at or above this prompt level. */
  readonly promptLevelAtOrAbove: PromptLevel;
  /** Sessions (distinct dates) in a row that must meet the accuracy. */
  readonly consecutiveSessions: number;
}

export interface IEPGoal {
  readonly goalId: string;
  readonly studentId: string;
  readonly area: GoalArea;
  /** The goal as written in the plan — verbatim, the audit trail. */
  readonly goalText: string;
  /** The module chain the goal decomposes into — the class's own modules. */
  readonly moduleIds: readonly string[];
  readonly criterion: GoalCriterion;
  readonly reviewDate: string; // ISO date
}

export interface GoalFinding {
  readonly code: string;
  readonly severity: WarningSeverity;
  readonly message: string;
}

/** The goal gate: a goal must chain to real modules and carry the plan's words. */
export function validateIEPGoal(goal: IEPGoal, modules: readonly ModuleDef[]): GoalFinding[] {
  const findings: GoalFinding[] = [];
  const at = (code: string, severity: WarningSeverity, message: string) =>
    findings.push({ code, severity, message });
  const known = new Set(modules.map((m) => m.moduleId));

  if (goal.goalText.trim().length === 0) {
    at('EMPTY_GOAL_TEXT', 'blocking', `Goal ${goal.goalId} must carry the plan's own wording.`);
  }
  if (goal.moduleIds.length === 0) {
    at('NO_MODULE_CHAIN', 'blocking', `Goal ${goal.goalId} decomposes into no modules — progress cannot accrue.`);
  }
  for (const id of goal.moduleIds) {
    if (!known.has(id)) {
      at('UNKNOWN_MODULE', 'blocking', `Goal ${goal.goalId} chains to module "${id}", which does not exist.`);
    }
  }
  if (!(goal.criterion.accuracy > 0 && goal.criterion.accuracy <= 1)) {
    at('BAD_CRITERION', 'blocking', `Goal ${goal.goalId} criterion accuracy must be in (0, 1].`);
  }
  if (goal.criterion.consecutiveSessions < 1) {
    at('BAD_CRITERION', 'blocking', `Goal ${goal.goalId} must require at least one criterion session.`);
  }
  return findings;
}

export type GoalStatus = 'met' | 'on_track' | 'progressing' | 'needs_review' | 'insufficient_evidence';

export interface ModuleGoalRollup {
  readonly moduleId: string;
  readonly attempts: number;
  readonly accuracy: number;
  readonly independentMasteryRate: number;
}

export interface GoalProgress {
  readonly goalId: string;
  readonly studentId: string;
  /** Attempts on the chain at or above the criterion prompt level. */
  readonly qualifyingAttempts: number;
  /** Attempts on the chain below it — visible, never counted toward criterion. */
  readonly supportedAttempts: number;
  readonly accuracyAtCriterionLevel: number;
  /** Distinct-date sessions, newest backwards, consecutively meeting the accuracy. */
  readonly consecutiveCriterionSessions: number;
  readonly status: GoalStatus;
  readonly perModule: readonly ModuleGoalRollup[];
  readonly latestDate: string | null;
}

const MIN_EVIDENCE = 4;
const REVIEW_MIN = 8;

const mean = (xs: readonly number[]) => (xs.length === 0 ? 0 : xs.reduce((s, x) => s + x, 0) / xs.length);

/** Accrue progress toward one goal from the student's attempt log. Deterministic. */
export function goalProgressFrom(goal: IEPGoal, attempts: readonly PromptedAttempt[]): GoalProgress {
  const chain = new Set(goal.moduleIds);
  const onChain = attempts
    .filter((a) => a.studentId === goal.studentId && a.moduleId !== null && chain.has(a.moduleId))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.itemId.localeCompare(b.itemId)));

  const minWeight = INDEPENDENCE_WEIGHT[goal.criterion.promptLevelAtOrAbove];
  const qualifying = onChain.filter((a) => INDEPENDENCE_WEIGHT[a.promptLevel] >= minWeight);
  const supported = onChain.length - qualifying.length;
  const scores = qualifying.map((a) => (a.correct ? 1 : 0));
  const accuracy = mean(scores);

  // Sessions: distinct dates with qualifying attempts; a session meets criterion
  // when its own accuracy reaches the goal's bar.
  const byDate = new Map<string, number[]>();
  for (const a of qualifying) {
    const arr = byDate.get(a.date) ?? [];
    arr.push(a.correct ? 1 : 0);
    byDate.set(a.date, arr);
  }
  const sessions = [...byDate.entries()].sort(([d1], [d2]) => (d1 < d2 ? -1 : 1));
  let consecutive = 0;
  for (let i = sessions.length - 1; i >= 0; i--) {
    const session = sessions[i];
    if (session && mean(session[1]) >= goal.criterion.accuracy) consecutive++;
    else break;
  }

  let status: GoalStatus;
  const n = qualifying.length;
  if (n < MIN_EVIDENCE) {
    status = 'insufficient_evidence';
  } else if (consecutive >= goal.criterion.consecutiveSessions) {
    status = 'met';
  } else {
    const half = Math.floor(n / 2);
    const early = mean(scores.slice(0, half));
    const late = mean(scores.slice(n - half));
    if (late >= goal.criterion.accuracy) status = 'on_track';
    else if (n >= REVIEW_MIN && late <= early) status = 'needs_review';
    else status = 'progressing';
  }

  const perModule: ModuleGoalRollup[] = goal.moduleIds.map((moduleId) => {
    const rows = onChain.filter((a) => a.moduleId === moduleId);
    return {
      moduleId,
      attempts: rows.length,
      accuracy: mean(rows.map((a) => (a.correct ? 1 : 0))),
      independentMasteryRate: mean(rows.map((a) => (a.correct && a.promptLevel === 'independent' ? 1 : 0))),
    };
  });

  return {
    goalId: goal.goalId,
    studentId: goal.studentId,
    qualifyingAttempts: n,
    supportedAttempts: supported,
    accuracyAtCriterionLevel: accuracy,
    consecutiveCriterionSessions: consecutive,
    status,
    perModule,
    latestDate: onChain[onChain.length - 1]?.date ?? null,
  };
}
