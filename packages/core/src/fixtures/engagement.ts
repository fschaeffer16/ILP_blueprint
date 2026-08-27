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

/**
 * Real-time parent notifications — the teacher↔student↔parent loop.
 * Each carries a receipt requirement: the parent app surfaces these as pop-ups that
 * cannot be dismissed silently; a parent clears each one with an explicit
 * acknowledgement, which sends a read-receipt back to the teacher. No gaps.
 * (Notification metadata only — never another child's message content.)
 */
export type ParentNotificationKind = 'assignment' | 'turned_in' | 'grade' | 'message';

export interface ParentNotification {
  readonly id: string;
  readonly kind: ParentNotificationKind;
  /** Who/what it is from, in plain language. */
  readonly from: string;
  readonly title: string;
  readonly body: string;
  /** When the school sent it (ISO). */
  readonly sentAt: string;
  /** Requires an explicit parent acknowledgement to clear (always true in this build). */
  readonly requiresAck: true;
}

export const SAMPLE_PARENT_NOTIFICATIONS: readonly ParentNotification[] = [
  {
    id: 'N-1',
    kind: 'grade',
    from: 'Ms. Alvarez · Grade 3',
    title: 'Quiz graded: Compare fractions',
    body: 'Mia scored 5/6 (83%) on the fractions quiz. One to revisit: comparing fractions with the same numerator. A short reteach is already queued for tomorrow.',
    sentAt: '2026-09-12T14:05:00Z',
    requiresAck: true,
  },
  {
    id: 'N-2',
    kind: 'turned_in',
    from: 'ILP · automatic',
    title: 'Work turned in: “Explain your answer with evidence”',
    body: 'Mia submitted her reading response at 1:12 PM. It’s with Ms. Alvarez for review — you’ll get the grade here the moment it’s released.',
    sentAt: '2026-09-12T13:12:00Z',
    requiresAck: true,
  },
  {
    id: 'N-3',
    kind: 'assignment',
    from: 'ILP · automatic',
    title: 'New assignment: Fractions on a number line',
    body: 'Assigned today, due Monday, Sep 15. Mia’s version uses visual models first. You can see it any time under “Coming up.”',
    sentAt: '2026-09-12T09:30:00Z',
    requiresAck: true,
  },
  {
    id: 'N-4',
    kind: 'message',
    from: 'Ms. Alvarez · Grade 3',
    title: 'A quick note from your teacher',
    body: 'Mia has been a huge help to classmates in the Math channel this week — explaining her thinking, not just giving answers. Wanted you to hear the good news. Reply any time.',
    sentAt: '2026-09-11T16:40:00Z',
    requiresAck: true,
  },
];
