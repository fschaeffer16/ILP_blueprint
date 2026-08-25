/**
 * Parent engagement summary (blueprint §4 parent role; §15 collaboration network;
 * §19 privacy). Guardians get "plain-language growth summaries and safety controls" —
 * awareness with **no surprises**.
 *
 * Privacy line (important, and enforced by the shape of this data): a parent sees
 * *patterns and time* — how long their child spent in each part of ILP, how they
 * collaborated, how they did — and is alerted to anything that needs attention. A
 * parent does NOT see raw transcripts of their child's conversations with peers. That
 * matches the blueprint's rule that teachers receive "a concise pattern summary, not a
 * transcript dump," and it protects the other children in the room. There is
 * deliberately no `messages` field anywhere in this module.
 */

/** Where a student spends time in ILP. "collaboration" is the verified, moderated,
 * district-contained academic space — never an open, infinite social feed. */
export type ActivitySurface =
  | 'lesson'
  | 'practice'
  | 'assessment'
  | 'collaboration'
  | 'simulation'
  | 'reflection'
  | 'bot_help';

export interface ActivitySession {
  readonly studentId: string;
  readonly surface: ActivitySurface;
  readonly minutes: number;
  readonly date: string; // ISO date
}

export interface SurfaceTime {
  readonly surface: ActivitySurface;
  readonly minutes: number;
}

/** How the student worked *with* peers. Independent-mastery checks after collaboration
 * are the key signal: they show collaboration built understanding rather than replacing it. */
export interface CollaborationActivity {
  readonly threadsJoined: number;
  readonly contributions: number;
  readonly peersHelped: number;
  readonly helpReceived: number;
  readonly independentChecksPassed: number;
  readonly independentChecksTotal: number;
}

/** Branching-simulation problem-solving. Revisions and recoveries are growth, not failure. */
export interface SimulationActivity {
  readonly scenariosCompleted: number;
  readonly decisions: number;
  readonly revisions: number;
  readonly recoveries: number;
}

export interface WellbeingSummary {
  /** Total moderation events involving the student (as reporter or subject). */
  readonly moderationFlags: number;
  /** How many are still open. 0 means everything was handled. */
  readonly unresolvedFlags: number;
}

export interface GrowthSummary {
  readonly mastered: number;
  readonly inProgress: number;
  readonly baselineAvg: number; // 0..1 start-of-year
  readonly currentAvg: number; // 0..1 now
}

export type WorkStatus = 'in_progress' | 'submitted' | 'mastered' | 'needs_reteach';

export interface TodaysWorkItem {
  readonly objectiveId: string;
  readonly title: string;
  readonly status: WorkStatus;
}

export type FlagKind = 'celebrate' | 'watch' | 'attention';

export interface ParentFlag {
  readonly kind: FlagKind;
  readonly message: string;
}

export interface ParentSummary {
  readonly studentName: string;
  readonly asOf: string;
  readonly timeBySurface: readonly SurfaceTime[];
  readonly totalMinutes: number;
  readonly collaborationMinutes: number;
  /** Share of active time spent in the collaboration space (0..1). */
  readonly collaborationShare: number;
  readonly todaysWork: readonly TodaysWorkItem[];
  readonly collaboration: CollaborationActivity;
  readonly simulation: SimulationActivity;
  readonly wellbeing: WellbeingSummary;
  readonly growth: GrowthSummary;
  readonly flags: readonly ParentFlag[];
}

/** Sum minutes per surface, largest first. */
export function aggregateTime(sessions: readonly ActivitySession[]): {
  bySurface: SurfaceTime[];
  totalMinutes: number;
} {
  const totals = new Map<ActivitySurface, number>();
  for (const s of sessions) totals.set(s.surface, (totals.get(s.surface) ?? 0) + s.minutes);
  const bySurface = [...totals.entries()]
    .map(([surface, minutes]) => ({ surface, minutes }))
    .sort((a, b) => b.minutes - a.minutes);
  const totalMinutes = bySurface.reduce((sum, s) => sum + s.minutes, 0);
  return { bySurface, totalMinutes };
}

export interface ParentSummaryInput {
  readonly studentName: string;
  readonly asOf: string;
  readonly sessions: readonly ActivitySession[];
  readonly todaysWork: readonly TodaysWorkItem[];
  readonly collaboration: CollaborationActivity;
  readonly simulation: SimulationActivity;
  readonly wellbeing: WellbeingSummary;
  readonly growth: GrowthSummary;
}

/**
 * Assemble the parent summary and derive its plain-language flags. Flags implement
 * "no surprises": anything a parent would want to know — good or concerning — is
 * surfaced, in words, not buried in a number.
 */
export function buildParentSummary(input: ParentSummaryInput): ParentSummary {
  const { bySurface, totalMinutes } = aggregateTime(input.sessions);
  const collaborationMinutes = bySurface.find((s) => s.surface === 'collaboration')?.minutes ?? 0;
  const collaborationShare = totalMinutes === 0 ? 0 : round(collaborationMinutes / totalMinutes);

  const flags: ParentFlag[] = [];

  // Celebrate real growth.
  const gain = input.growth.currentAvg - input.growth.baselineAvg;
  if (gain >= 0.1) {
    flags.push({ kind: 'celebrate', message: `Scores are up ${Math.round(gain * 100)} points since the start of the year.` });
  }
  if (input.collaboration.peersHelped >= 3) {
    flags.push({ kind: 'celebrate', message: `Helped ${input.collaboration.peersHelped} classmates understand their work this week.` });
  }

  // Watch: work that stalled, or collaboration that isn't turning into independent understanding.
  const stalled = input.todaysWork.filter((w) => w.status === 'needs_reteach');
  for (const w of stalled) {
    flags.push({ kind: 'watch', message: `${w.title} needs another look — the teacher is preparing a different way to learn it.` });
  }
  const { independentChecksPassed: passed, independentChecksTotal: total } = input.collaboration;
  if (total > 0 && passed / total < 0.6) {
    flags.push({ kind: 'watch', message: `After working with classmates, independent checks are passing ${passed}/${total} — worth a conversation about doing a bit more solo first.` });
  }
  if (collaborationShare > 0.5) {
    flags.push({ kind: 'watch', message: `Over half of ILP time this week was in the collaboration space. It's academic and supervised, but a good balance check.` });
  }

  // Attention: anything safety-related that is still open.
  if (input.wellbeing.unresolvedFlags > 0) {
    flags.push({ kind: 'attention', message: `${input.wellbeing.unresolvedFlags} safety item needs review — the school has been notified and will contact you.` });
  }

  return {
    studentName: input.studentName,
    asOf: input.asOf,
    timeBySurface: bySurface,
    totalMinutes,
    collaborationMinutes,
    collaborationShare,
    todaysWork: input.todaysWork,
    collaboration: input.collaboration,
    simulation: input.simulation,
    wellbeing: input.wellbeing,
    growth: input.growth,
    flags,
  };
}

/** Human label for a surface. */
export const SURFACE_LABEL: Record<ActivitySurface, string> = {
  lesson: 'Lessons',
  practice: 'Practice',
  assessment: 'Assessments',
  collaboration: 'Collaboration lab',
  simulation: 'Simulations',
  reflection: 'Reflection',
  bot_help: 'Help from the assignment helper',
};

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}
