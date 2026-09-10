/**
 * The support facilitator's day — step 5 of the IEP build (ese-program.md §4,
 * §5, §7 "service fidelity").
 *
 * The behavior tech / support facilitator carries the child's day on their own
 * phone: the schedule, the transitions, the supports the plan promises for each
 * block. Every promised support is logged — delivered, partial, or missed — and
 * the fidelity record answers the question every IEP meeting should be able to
 * answer and rarely can: *were the supports delivered exactly as the plan
 * promised?*
 *
 * Two rules keep this layer honest:
 *   1. **Fidelity grades the service, never the child.** There is no score,
 *      grade, or correctness anywhere in this module — a missed entry is an
 *      adult's promise not kept, surfaced, not buried.
 *   2. **Incident-free days accrue on the record** — the quiet good days become
 *      data (the placement's safety record), instead of only the bad days ever
 *      being written down.
 */

export type SupportBlock =
  | 'arrival'
  | 'transition'
  | 'class'
  | 'pull_aside'
  | 'lunch'
  | 'regulation_break'
  | 'dismissal';

/** One promised support in the child's day plan. */
export interface SupportTask {
  readonly taskId: string;
  readonly studentId: string;
  readonly time: string; // 'HH:MM' 24h
  readonly block: SupportBlock;
  readonly title: string;
  readonly detail: string;
  /** Adaptation ids the plan carries for this block (e.g. the AAC channel in class). */
  readonly planAccommodationIds: readonly string[];
}

export type ServiceStatus = 'delivered' | 'partial' | 'missed';

export interface ServiceLogEntry {
  readonly taskId: string;
  readonly studentId: string;
  readonly date: string; // ISO date
  readonly status: ServiceStatus;
  readonly loggedBy: string; // role, e.g. 'behavior_tech'
  readonly note?: string;
}

export interface FacilitatorDayItem {
  readonly task: SupportTask;
  readonly status: ServiceStatus | 'pending';
  readonly note?: string;
}

export interface ServiceFidelity {
  readonly promised: number;
  readonly delivered: number;
  readonly partial: number;
  readonly missed: number;
  readonly pending: number;
  /** delivered / logged — pending promises are not yet counted either way. */
  readonly rate: number;
}

export interface FacilitatorDay {
  readonly studentId: string;
  readonly date: string;
  readonly items: readonly FacilitatorDayItem[];
  readonly fidelity: ServiceFidelity;
}

const byTime = (a: SupportTask, b: SupportTask) =>
  a.time < b.time ? -1 : a.time > b.time ? 1 : a.taskId.localeCompare(b.taskId);

export function computeFidelity(items: readonly FacilitatorDayItem[]): ServiceFidelity {
  const delivered = items.filter((i) => i.status === 'delivered').length;
  const partial = items.filter((i) => i.status === 'partial').length;
  const missed = items.filter((i) => i.status === 'missed').length;
  const pending = items.filter((i) => i.status === 'pending').length;
  const logged = delivered + partial + missed;
  return {
    promised: items.length,
    delivered,
    partial,
    missed,
    pending,
    rate: logged === 0 ? 0 : delivered / logged,
  };
}

/** Merge the day plan with the day's log: unlogged promises stay `pending`. */
export function buildFacilitatorDay(
  studentId: string,
  tasks: readonly SupportTask[],
  logs: readonly ServiceLogEntry[],
  date: string,
): FacilitatorDay {
  const todays = new Map(
    logs.filter((l) => l.studentId === studentId && l.date === date).map((l) => [l.taskId, l]),
  );
  const items: FacilitatorDayItem[] = tasks
    .filter((t) => t.studentId === studentId)
    .sort(byTime)
    .map((task) => {
      const log = todays.get(task.taskId);
      return { task, status: log?.status ?? 'pending', note: log?.note };
    });
  return { studentId, date, items, fidelity: computeFidelity(items) };
}

/** A behavior incident on the record. Absence of these, day after day, IS the data. */
export interface IncidentRecord {
  readonly studentId: string;
  readonly date: string; // ISO date
  readonly note: string;
}

/**
 * Consecutive school days, counting back from the most recent, with no incident.
 * `schoolDays` must be the dated school calendar (ISO), any order.
 */
export function incidentFreeStreak(
  studentId: string,
  schoolDays: readonly string[],
  incidents: readonly IncidentRecord[],
): number {
  const bad = new Set(incidents.filter((i) => i.studentId === studentId).map((i) => i.date));
  const days = [...schoolDays].sort();
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    if (day !== undefined && !bad.has(day)) streak++;
    else break;
  }
  return streak;
}
