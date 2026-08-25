/**
 * Analytics rollups (blueprint §21 pilot evidence; teacher command center §9).
 *
 * The same outcome evidence, viewed at five levels of aggregation:
 * student → class → grade → school → district. Deterministic and pure so the same
 * numbers appear in tests, the dashboard, and any export.
 *
 * The unit of evidence is an `OutcomeRecord`: one student's result on one objective,
 * tagged with the organizational dimensions it rolls up through.
 */

export interface OutcomeRecord {
  readonly studentId: string;
  readonly studentName: string;
  readonly className: string;
  readonly grade: string;
  readonly school: string;
  readonly district: string;
  readonly objectiveId: string;
  readonly masteryMet: boolean;
  readonly fraction: number; // 0..1 score
  /** Days from first attempt to mastery, when reached. */
  readonly timeToMasteryDays?: number;
}

export interface Aggregate {
  readonly n: number; // number of results
  readonly students: number; // distinct students
  readonly mastered: number; // results meeting mastery
  readonly masteredPct: number; // 0..1
  readonly avgFraction: number; // 0..1
  /** Median days to mastery among results that reached it (null if none). */
  readonly medianTimeToMastery: number | null;
}

export type RollupDimension =
  | 'studentId'
  | 'className'
  | 'grade'
  | 'school'
  | 'district'
  | 'objectiveId';

export interface RollupRow {
  readonly key: string;
  readonly label: string;
  readonly agg: Aggregate;
}

/** Aggregate a flat set of outcome records. */
export function aggregate(records: readonly OutcomeRecord[]): Aggregate {
  const n = records.length;
  if (n === 0) {
    return { n: 0, students: 0, mastered: 0, masteredPct: 0, avgFraction: 0, medianTimeToMastery: null };
  }
  const mastered = records.filter((r) => r.masteryMet).length;
  const sum = records.reduce((s, r) => s + r.fraction, 0);
  const students = new Set(records.map((r) => r.studentId)).size;
  const times = records
    .map((r) => r.timeToMasteryDays)
    .filter((t): t is number => typeof t === 'number')
    .sort((a, b) => a - b);
  return {
    n,
    students,
    mastered,
    masteredPct: round(mastered / n),
    avgFraction: round(sum / n),
    medianTimeToMastery: times.length ? median(times) : null,
  };
}

/** Group records by a dimension and aggregate each group. Sorted by key for stable output. */
export function rollupBy(
  records: readonly OutcomeRecord[],
  dimension: RollupDimension,
  labelFor?: (key: string, rows: readonly OutcomeRecord[]) => string,
): RollupRow[] {
  const groups = new Map<string, OutcomeRecord[]>();
  for (const r of records) {
    const key = String(r[dimension]);
    const g = groups.get(key);
    if (g) g.push(r);
    else groups.set(key, [r]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, rows]) => ({
      key,
      label: labelFor ? labelFor(key, rows) : rows[0] ? deriveLabel(dimension, rows[0]) : key,
      agg: aggregate(rows),
    }));
}

/** The full set of rollups a dashboard needs, in one call. */
export function buildRollups(records: readonly OutcomeRecord[]): {
  overall: Aggregate;
  byDistrict: RollupRow[];
  bySchool: RollupRow[];
  byGrade: RollupRow[];
  byClass: RollupRow[];
  byStudent: RollupRow[];
  byObjective: RollupRow[];
} {
  return {
    overall: aggregate(records),
    byDistrict: rollupBy(records, 'district'),
    bySchool: rollupBy(records, 'school'),
    byGrade: rollupBy(records, 'grade', (k) => `Grade ${k}`),
    byClass: rollupBy(records, 'className'),
    byStudent: rollupBy(records, 'studentId', (_k, rows) => rows[0]?.studentName ?? _k),
    byObjective: rollupBy(records, 'objectiveId'),
  };
}

function deriveLabel(dim: RollupDimension, r: OutcomeRecord): string {
  switch (dim) {
    case 'studentId': return r.studentName;
    case 'grade': return `Grade ${r.grade}`;
    default: return String(r[dim]);
  }
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}
function median(sorted: readonly number[]): number {
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid]! : round((sorted[mid - 1]! + sorted[mid]!) / 2);
}
