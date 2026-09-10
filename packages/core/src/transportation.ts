/**
 * Transportation — the "Here Comes the Bus works 50/50" replacement, v1 engine
 * (docs/transportation-track.md).
 *
 * The incumbent's failure mode is structural: stale GPS shown as if fresh, ETAs
 * from static schedules, proximity-only alerts with no concept of a *delay*, and
 * a 60-90 minute robocall as the fallback. This module inverts it with rules the
 * tests pin down:
 *
 *   1. **Freshness first — "we don't know" is a status, not a silence.** Every
 *      route status carries the age of its last live fix. Past the staleness
 *      window the status becomes `signal_lost`, every unreached stop's ETA is
 *      withheld (null, never fabricated), and the last known position is shown
 *      *as* last-known with its age. Buffered (store-and-forward) pings never
 *      count as live.
 *   2. **Proactive, not proximity-only.** Lateness itself raises the alert — to
 *      the *affected, not-yet-passed stops only*, never a district blast.
 *      Critical alerts (very late, signal lost) require acknowledgment and name
 *      their escalation ladder (push → SMS → voice), reusing the parent app's
 *      acknowledge-to-clear model.
 *   3. **Custody comes from scans, never inference.** "Your child boarded" is
 *      only ever derived from a tag-on/tag-off record — the map can be wrong;
 *      the scan is a fact.
 *   4. **The bus talks to the support plan.** For a student whose day plan
 *      begins at the bus loop, a delay shifts the facilitator's arrival task —
 *      transitions stay previewed for exactly the kids surprise costs the most.
 */

// --- Model ---

export interface BusStop {
  readonly stopId: string;
  readonly name: string;
  readonly scheduledTime: string; // 'HH:MM' 24h
  readonly studentIds: readonly string[];
}

export interface BusRoute {
  readonly routeId: string;
  readonly busNumber: string;
  readonly label: string;
  readonly direction: 'am' | 'pm';
  readonly stops: readonly BusStop[];
  readonly driver: { readonly name: string; readonly substitute: boolean };
}

/** One position report. `lastDepartedStopIndex` is -1 before the first stop. */
export interface BusPing {
  readonly routeId: string;
  readonly atTime: string; // ISO datetime
  readonly lastDepartedStopIndex: number;
  /** Store-and-forward: recorded offline, uploaded later. NEVER counts as live. */
  readonly buffered?: boolean;
}

export type RouteState =
  | 'not_started'
  | 'on_time'
  | 'late'
  | 'very_late'
  | 'signal_lost'
  | 'completed';

export interface StopStatus {
  readonly stopId: string;
  readonly name: string;
  readonly scheduledTime: string;
  /** Delay-shifted ETA — null whenever the signal is lost (never fabricated). */
  readonly eta: string | null;
  readonly passed: boolean;
}

export interface RouteStatus {
  readonly routeId: string;
  readonly busNumber: string;
  readonly state: RouteState;
  /** Signed minutes vs schedule at the last live fix (negative = early). */
  readonly delayMinutes: number;
  /** Minutes since the last LIVE fix; null if no live ping yet. */
  readonly dataAgeMinutes: number | null;
  readonly stops: readonly StopStatus[];
  /** The honest one-liner the parent sees, freshness included. */
  readonly headline: string;
}

export const LATE_MIN = 5;
export const VERY_LATE_MIN = 15;
export const STALE_MIN = 6;

// --- Time helpers (deterministic, date taken from `now`) ---

const toMs = (iso: string) => new Date(iso).getTime();
const minsBetween = (a: string, b: string) => Math.round((toMs(b) - toMs(a)) / 60000);
const hhmmToIso = (now: string, hhmm: string) => `${now.slice(0, 10)}T${hhmm}:00${now.slice(19)}`;
const isoToHhmm = (iso: string) => iso.slice(11, 16);
const addMinutes = (now: string, hhmm: string, mins: number) => {
  const d = new Date(toMs(hhmmToIso(now, hhmm)) + mins * 60000);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
};

/** Compute a route's honest live status from its pings at time `now` (ISO, UTC). */
export function routeStatus(route: BusRoute, pings: readonly BusPing[], now: string): RouteStatus {
  const mine = pings
    .filter((p) => p.routeId === route.routeId && toMs(p.atTime) <= toMs(now))
    .sort((a, b) => toMs(a.atTime) - toMs(b.atTime));
  const lastLive = [...mine].reverse().find((p) => !p.buffered) ?? null;
  const lastAny = mine[mine.length - 1] ?? null;

  const dataAgeMinutes = lastLive ? minsBetween(lastLive.atTime, now) : null;
  const progressIndex = lastAny?.lastDepartedStopIndex ?? -1;

  // Delay is measured at the DEPARTURE, not mid-leg: the first live fix that
  // reported the bus past its furthest stop, against that stop's schedule.
  // (Buffered pings inform progress display but never the delay or liveness.)
  let delayMinutes = 0;
  const liveIdx = mine.filter((p) => !p.buffered).reduce((m, p) => Math.max(m, p.lastDepartedStopIndex), -1);
  if (liveIdx >= 0) {
    const departure = mine.find((p) => !p.buffered && p.lastDepartedStopIndex >= liveIdx);
    const sched = route.stops[liveIdx]?.scheduledTime;
    if (departure && sched) delayMinutes = minsBetween(hhmmToIso(now, sched), departure.atTime);
  }

  const completed = progressIndex >= route.stops.length - 1;
  const stale = dataAgeMinutes === null || dataAgeMinutes > STALE_MIN;

  let state: RouteState;
  if (completed) state = 'completed';
  else if (mine.length === 0) state = 'not_started';
  else if (stale) state = 'signal_lost';
  else if (delayMinutes >= VERY_LATE_MIN) state = 'very_late';
  else if (delayMinutes >= LATE_MIN) state = 'late';
  else state = 'on_time';

  const stops: StopStatus[] = route.stops.map((s, i) => ({
    stopId: s.stopId,
    name: s.name,
    scheduledTime: s.scheduledTime,
    passed: i <= progressIndex,
    eta:
      i <= progressIndex || state === 'signal_lost' || state === 'not_started'
        ? null
        : addMinutes(now, s.scheduledTime, Math.max(0, delayMinutes)),
  }));

  const headline =
    state === 'signal_lost'
      ? `Signal lost — last seen ${dataAgeMinutes ?? '?'} min ago (${delayMinutes >= 0 ? '+' : ''}${delayMinutes} min vs schedule at that point). No ETA will be shown until the signal returns.`
      : state === 'not_started'
        ? `Bus ${route.busNumber} has not started this run.`
        : state === 'completed'
          ? `Run complete.`
          : `Bus ${route.busNumber} is ${delayMinutes >= LATE_MIN ? `running ${delayMinutes} min late` : 'on time'} — as of ${dataAgeMinutes} min ago (${isoToHhmm(lastLive!.atTime)}).`;

  return { routeId: route.routeId, busNumber: route.busNumber, state, delayMinutes, dataAgeMinutes, stops, headline };
}

// --- Proactive notifications (affected stops only; ack on critical) ---

export interface TransportNotification {
  readonly dedupeKey: string;
  readonly routeId: string;
  readonly kind: 'running_late' | 'very_late' | 'signal_lost';
  /** Only stops the bus has NOT yet reached — never a blast. */
  readonly stopIds: readonly string[];
  readonly message: string;
  readonly requiresAcknowledgment: boolean;
  readonly escalation: 'push' | 'push_then_sms_then_voice';
}

export function routeNotifications(route: BusRoute, status: RouteStatus): TransportNotification[] {
  const affected = status.stops.filter((s) => !s.passed).map((s) => s.stopId);
  if (affected.length === 0) return [];
  const base = { routeId: route.routeId, stopIds: affected };

  if (status.state === 'signal_lost') {
    return [{
      ...base,
      kind: 'signal_lost',
      dedupeKey: `${route.routeId}:signal_lost`,
      message: `We've lost the signal from bus ${route.busNumber}. Last seen ${status.dataAgeMinutes} min ago. We will not show a guessed ETA; dispatch has been flagged.`,
      requiresAcknowledgment: true,
      escalation: 'push_then_sms_then_voice',
    }];
  }
  if (status.state === 'very_late') {
    return [{
      ...base,
      kind: 'very_late',
      dedupeKey: `${route.routeId}:very_late:${Math.floor(status.delayMinutes / 5)}`,
      message: `Bus ${route.busNumber} is running ${status.delayMinutes} minutes late to your stop. Updated ETA is shown in the app.`,
      requiresAcknowledgment: true,
      escalation: 'push_then_sms_then_voice',
    }];
  }
  if (status.state === 'late') {
    return [{
      ...base,
      kind: 'running_late',
      dedupeKey: `${route.routeId}:late:${Math.floor(status.delayMinutes / 5)}`,
      message: `Bus ${route.busNumber} is running ${status.delayMinutes} minutes late to your stop.`,
      requiresAcknowledgment: false,
      escalation: 'push',
    }];
  }
  return [];
}

// --- Rider custody: scans are facts; nothing is inferred ---

export interface RiderScan {
  readonly studentId: string;
  readonly routeId: string;
  readonly stopId: string;
  readonly direction: 'board' | 'exit';
  readonly atTime: string; // ISO datetime
}

export interface RiderStatus {
  readonly studentId: string;
  readonly state: 'not_boarded' | 'on_bus' | 'exited';
  readonly boardedAt: string | null; // 'HH:MM'
  readonly exitedAt: string | null;
  readonly routeId: string | null;
}

export function riderStatus(studentId: string, scans: readonly RiderScan[], now: string): RiderStatus {
  const mine = scans
    .filter((s) => s.studentId === studentId && toMs(s.atTime) <= toMs(now))
    .sort((a, b) => toMs(a.atTime) - toMs(b.atTime));
  const board = [...mine].reverse().find((s) => s.direction === 'board') ?? null;
  const exit = [...mine].reverse().find((s) => s.direction === 'exit') ?? null;
  const exited = !!exit && (!board || toMs(exit.atTime) > toMs(board.atTime));
  return {
    studentId,
    state: exited ? 'exited' : board ? 'on_bus' : 'not_boarded',
    boardedAt: board ? isoToHhmm(board.atTime) : null,
    exitedAt: exited && exit ? isoToHhmm(exit.atTime) : null,
    routeId: (exited ? exit?.routeId : board?.routeId) ?? null,
  };
}

// --- The ESE bridge: the bus talks to the support plan ---

export interface TransitionShift {
  readonly stopId: string;
  readonly shiftMinutes: number;
  readonly note: string;
}

/**
 * When a supported student's day begins at the bus loop, a delay shifts the
 * facilitator's arrival task — so the transition stays previewed, not sprung.
 * Returns null when there is nothing to shift (on time / already passed).
 */
export function transitionShift(status: RouteStatus, stopId: string): TransitionShift | null {
  const stop = status.stops.find((s) => s.stopId === stopId);
  if (!stop || stop.passed) return null;
  if (status.state === 'signal_lost') {
    return {
      stopId,
      shiftMinutes: 0,
      note: `Signal lost on bus ${status.busNumber} — hold at the loop and watch for dispatch; do not rely on the scheduled time.`,
    };
  }
  if (status.delayMinutes < LATE_MIN) return null;
  return {
    stopId,
    shiftMinutes: status.delayMinutes,
    note: `Bus ${status.busNumber} is ${status.delayMinutes} min late — arrival support shifts to ${stop.eta ?? 'TBD'}; previewed transition still holds.`,
  };
}
