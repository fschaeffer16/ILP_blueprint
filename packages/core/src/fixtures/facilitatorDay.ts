/**
 * The support facilitator's day (IEP build, step 5): Leo's mainstream day as the
 * program's day-in-the-life describes it — every promised support a logged item,
 * the quiet good days accruing on the record. All synthetic.
 */

import type { IncidentRecord, ServiceLogEntry, SupportTask } from '../facilitator.js';

const T = (
  taskId: string,
  time: string,
  block: SupportTask['block'],
  title: string,
  detail: string,
  planAccommodationIds: string[] = [],
): SupportTask => ({ taskId, studentId: 'E-LEO', time, block, title, detail, planAccommodationIds });

export const LEO_DAY_PLAN: readonly SupportTask[] = [
  T('LD-1', '07:45', 'arrival', 'Bus loop → homeroom', 'Meet at the bus loop; previewed walk-through; first-bell routine card.', []),
  T('LD-2', '08:15', 'class', 'Math block — in class', 'Same assignment as the class; his AAC channel and chunked steps ride along automatically.', ['aac_symbol_response', 'chunked_prompt']),
  T('LD-3', '10:00', 'pull_aside', 'Pull-aside — 25 min', 'ESE teacher works the SAME compare-fractions module (M2) his class is on, one prompt level lighter.', ['chunked_prompt']),
  T('LD-4', '11:45', 'transition', 'Lunch transition', 'Supported transition to the cafeteria, then peers — support steps back.', []),
  T('LD-5', '13:00', 'class', 'Afternoon quiz', 'Accommodations applied because the compiler carries the plan; answers score into module tracking like everyone’s.', ['aac_symbol_response']),
  T('LD-6', '14:45', 'dismissal', 'Dismissal → bus', 'Previewed transition; end-of-day routine card; hand-off note to family app.', []),
];

const L = (
  taskId: string,
  date: string,
  status: ServiceLogEntry['status'],
  note?: string,
): ServiceLogEntry => ({ taskId, studentId: 'E-LEO', date, status, loggedBy: 'behavior_tech', note });

export const LEO_SERVICE_LOGS: readonly ServiceLogEntry[] = [
  // Yesterday — one promise missed, on the record, with the reason.
  L('LD-1', '2026-09-08', 'delivered'),
  L('LD-2', '2026-09-08', 'delivered'),
  L('LD-3', '2026-09-08', 'missed', 'ESE teacher pulled to cover an absence — pull-aside did not happen.'),
  L('LD-4', '2026-09-08', 'delivered'),
  L('LD-5', '2026-09-08', 'delivered'),
  L('LD-6', '2026-09-08', 'delivered'),
  // Today, mid-day: afternoon still pending.
  L('LD-1', '2026-09-09', 'delivered'),
  L('LD-2', '2026-09-09', 'delivered'),
  L('LD-3', '2026-09-09', 'partial', 'Shortened to 15 minutes by the assembly schedule.'),
  L('LD-4', '2026-09-09', 'delivered'),
];

/** The dated school calendar for the window shown. */
export const SCHOOL_DAYS: readonly string[] = [
  '2026-08-24', '2026-08-25', '2026-08-26', '2026-08-27', '2026-08-28',
  '2026-08-31', '2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04',
  '2026-09-08', '2026-09-09',
];

/** Leo has none — that IS the record. (One other-student incident proves filtering.) */
export const SAMPLE_INCIDENTS: readonly IncidentRecord[] = [
  { studentId: 'E-OTHER', date: '2026-09-02', note: 'Synthetic contrast record.' },
];
