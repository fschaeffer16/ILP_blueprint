/**
 * A synthetic week of activity for one child, for the parent dashboard. No real data,
 * and — by design — no message content anywhere: parents see patterns, time, and
 * safety, never their child's (or other children's) conversations.
 */

import type { ActivitySession, ParentSummaryInput } from '../engagement.js';

const STUDENT = 'S-777';
const WEEK: { surface: ActivitySession['surface']; minutes: number; date: string }[] = [
  { surface: 'lesson', minutes: 40, date: '2026-09-08' },
  { surface: 'practice', minutes: 25, date: '2026-09-08' },
  { surface: 'collaboration', minutes: 15, date: '2026-09-08' },
  { surface: 'lesson', minutes: 35, date: '2026-09-09' },
  { surface: 'simulation', minutes: 20, date: '2026-09-09' },
  { surface: 'bot_help', minutes: 10, date: '2026-09-09' },
  { surface: 'assessment', minutes: 25, date: '2026-09-10' },
  { surface: 'reflection', minutes: 8, date: '2026-09-10' },
  { surface: 'collaboration', minutes: 18, date: '2026-09-10' },
  { surface: 'lesson', minutes: 30, date: '2026-09-11' },
  { surface: 'practice', minutes: 22, date: '2026-09-11' },
  { surface: 'simulation', minutes: 18, date: '2026-09-11' },
  { surface: 'collaboration', minutes: 12, date: '2026-09-12' },
  { surface: 'reflection', minutes: 6, date: '2026-09-12' },
  { surface: 'bot_help', minutes: 8, date: '2026-09-12' },
];

export const SAMPLE_PARENT_INPUT: ParentSummaryInput = {
  studentName: 'Mia',
  asOf: '2026-09-12T15:30:00Z',
  sessions: WEEK.map((s) => ({ studentId: STUDENT, ...s })),
  todaysWork: [
    { objectiveId: 'M3.NF.01', title: 'Fractions as equal parts', status: 'in_progress' },
    { objectiveId: 'RW3.02', title: 'Explain your answer with evidence', status: 'submitted' },
    { objectiveId: 'M3.NF.02', title: 'Compare fractions', status: 'mastered' },
    { objectiveId: 'SCI3.04', title: 'Community water use — simulation', status: 'in_progress' },
  ],
  collaboration: {
    threadsJoined: 5,
    contributions: 12,
    peersHelped: 4,
    helpReceived: 3,
    independentChecksPassed: 5,
    independentChecksTotal: 5,
  },
  simulation: {
    scenariosCompleted: 2,
    decisions: 14,
    revisions: 3,
    recoveries: 2,
  },
  wellbeing: {
    moderationFlags: 1, // one flag was raised and handled — shown for transparency
    unresolvedFlags: 0,
  },
  growth: {
    mastered: 6,
    inProgress: 3,
    baselineAvg: 0.58,
    currentAvg: 0.79,
  },
};
