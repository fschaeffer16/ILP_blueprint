/**
 * Assignment-bot ("Navi") flag intake + teacher summary.
 *
 * When the grounded help bot can't answer a student's question — or the student
 * keeps asking around the same idea — it flags the question for the teacher (blueprint
 * P1 teacher authority; P6 remediation is mandatory). This module turns that raw stream
 * of flagged questions into the signal a teacher can act on: which objective, which idea
 * within it, how many students, and whether it has crossed a reteach threshold.
 *
 * This is a *leading* indicator. Where the 75% classwide-failure rule reacts to an
 * assessment after the fact, Navi flags surface confusion while it is still forming —
 * before the graded task — so a teacher can reteach in time.
 *
 * The model carries the question text, the objective/section it came from, and a
 * per-class student alias (a teacher may see which of *their own* students asked; it is
 * never cross-class, and no student ever sees another's questions). It deliberately holds
 * no free-form profile data beyond the question itself.
 */

import type { ObjectiveVersion } from './types.js';

export type NaviFlagReason = 'unanswered' | 'answer_seeking' | 'stuck' | 'repeated';

export interface NaviFlag {
  readonly id: string;
  /** The student's question, verbatim. */
  readonly question: string;
  readonly objectiveId: string;
  readonly objectiveVersion: number;
  /** The lesson section/topic the student was on (from the bot's KB_INDEX). */
  readonly section: string;
  /** Per-class alias — never a real name or cross-class identifier. */
  readonly studentAlias: string;
  /** Why the bot escalated it. */
  readonly reason: NaviFlagReason;
  /** ISO timestamp (fixtures use fixed values; the runtime stamps at flag time). */
  readonly createdAt: string;
}

export interface FlagTheme {
  /** The essential-knowledge idea this cluster is about (or 'other'). */
  readonly idea: string;
  readonly count: number;
  readonly sampleQuestions: readonly string[];
}

export interface ObjectiveFlagSummary {
  readonly objectiveId: string;
  readonly objectiveVersion: number;
  readonly standardRefs: readonly string[];
  readonly outcome: string;
  readonly flagCount: number;
  readonly studentCount: number;
  readonly reasons: Readonly<Record<NaviFlagReason, number>>;
  readonly themes: readonly FlagTheme[];
  /** True once enough distinct students flagged this objective to warrant a reteach. */
  readonly reteachSignal: boolean;
  readonly flags: readonly NaviFlag[];
}

export interface NaviFlagReport {
  readonly totalFlags: number;
  readonly studentsNeedingHelp: number;
  readonly objectivesTouched: number;
  /** Objectives ranked by distinct students flagging, then flag count. */
  readonly byObjective: readonly ObjectiveFlagSummary[];
}

export interface FlagSummaryOptions {
  /** Distinct students on one objective at/above which a reteach is signalled. Default 3. */
  readonly reteachStudentThreshold?: number;
}

const norm = (s: string) => s.toLowerCase();

/** Cluster an objective's flags by the essential-knowledge idea each question mentions. */
function themesFor(flags: readonly NaviFlag[], objective: ObjectiveVersion | undefined): FlagTheme[] {
  const ideas = objective ? objective.essentialKnowledge : [];
  const buckets = new Map<string, NaviFlag[]>();
  for (const f of flags) {
    const q = norm(f.question);
    const idea = ideas.find((k) => q.includes(norm(k))) ?? 'other';
    const list = buckets.get(idea) ?? [];
    list.push(f);
    buckets.set(idea, list);
  }
  return [...buckets.entries()]
    .map(([idea, list]) => ({
      idea,
      count: list.length,
      sampleQuestions: list.slice(0, 3).map((f) => f.question),
    }))
    .sort((a, b) => b.count - a.count);
}

function emptyReasons(): Record<NaviFlagReason, number> {
  return { unanswered: 0, answer_seeking: 0, stuck: 0, repeated: 0 };
}

/**
 * Summarize a stream of bot flags into per-objective teacher signal, ranked by how many
 * distinct students are stuck. Pure and deterministic.
 */
export function summarizeAssistantFlags(
  flags: readonly NaviFlag[],
  objectives: readonly ObjectiveVersion[],
  options: FlagSummaryOptions = {},
): NaviFlagReport {
  const reteachThreshold = options.reteachStudentThreshold ?? 3;
  const objById = new Map(objectives.map((o) => [o.objectiveId, o]));

  const byObjId = new Map<string, NaviFlag[]>();
  for (const f of flags) {
    const list = byObjId.get(f.objectiveId) ?? [];
    list.push(f);
    byObjId.set(f.objectiveId, list);
  }

  const byObjective: ObjectiveFlagSummary[] = [];
  for (const [objectiveId, list] of byObjId) {
    const obj = objById.get(objectiveId);
    const students = new Set(list.map((f) => f.studentAlias));
    const reasons = emptyReasons();
    for (const f of list) reasons[f.reason] += 1;
    byObjective.push({
      objectiveId,
      objectiveVersion: list[0]!.objectiveVersion,
      standardRefs: obj?.standardRefs ?? [],
      outcome: obj?.studentOutcome ?? '(objective not in this pack)',
      flagCount: list.length,
      studentCount: students.size,
      reasons,
      themes: themesFor(list, obj),
      reteachSignal: students.size >= reteachThreshold,
      flags: list,
    });
  }

  byObjective.sort((a, b) => b.studentCount - a.studentCount || b.flagCount - a.flagCount);

  return {
    totalFlags: flags.length,
    studentsNeedingHelp: new Set(flags.map((f) => f.studentAlias)).size,
    objectivesTouched: byObjective.length,
    byObjective,
  };
}
