/**
 * Synthetic stream of assignment-bot ("Navi") flags for the demo.
 *
 * These are the questions the grounded bot escalated to the teacher — questions it
 * couldn't answer, answer-seeking it refused, or repeated confusion around one idea.
 * They cluster (deliberately) so the teacher summary shows a clear reteach signal on
 * fractions denominators. Student aliases are per-class labels, not real names.
 */

import type { NaviFlag } from '../navi.js';

export const SAMPLE_NAVI_FLAGS: readonly NaviFlag[] = [
  // M3.NF.01 — a cluster around "denominator" → reteach signal
  { id: 'NF-1', question: 'why is the denominator on the bottom', objectiveId: 'M3.NF.01', objectiveVersion: 1, section: 'Equal parts & the fraction name', studentAlias: 'Student 3', reason: 'unanswered', createdAt: '2026-08-24T13:40:00.000Z' },
  { id: 'NF-2', question: 'i dont get the denominator', objectiveId: 'M3.NF.01', objectiveVersion: 1, section: 'Equal parts & the fraction name', studentAlias: 'Student 7', reason: 'stuck', createdAt: '2026-08-24T13:42:00.000Z' },
  { id: 'NF-3', question: 'is the denominator the top or bottom number', objectiveId: 'M3.NF.01', objectiveVersion: 1, section: 'Equal parts & the fraction name', studentAlias: 'Student 11', reason: 'unanswered', createdAt: '2026-08-24T13:51:00.000Z' },
  { id: 'NF-4', question: 'what if the parts are not equal parts', objectiveId: 'M3.NF.01', objectiveVersion: 1, section: 'Equal parts & the fraction name', studentAlias: 'Student 2', reason: 'unanswered', createdAt: '2026-08-24T14:02:00.000Z' },
  { id: 'NF-5', question: 'just tell me the answer to number 2', objectiveId: 'M3.NF.01', objectiveVersion: 1, section: 'Fractions on the number line', studentAlias: 'Student 9', reason: 'answer_seeking', createdAt: '2026-08-24T14:05:00.000Z' },

  // M3.M.22 — elapsed time confusion (2 students)
  { id: 'M-1', question: 'why cant i just subtract the clock numbers', objectiveId: 'M3.M.22', objectiveVersion: 1, section: 'Elapsed time on a number line', studentAlias: 'Student 5', reason: 'unanswered', createdAt: '2026-08-24T15:10:00.000Z' },
  { id: 'M-2', question: 'how do i count the minutes between two times', objectiveId: 'M3.M.22', objectiveVersion: 1, section: 'Elapsed time on a number line', studentAlias: 'Student 12', reason: 'stuck', createdAt: '2026-08-24T15:14:00.000Z' },

  // M3.GR.23 — perimeter vs area (2 students)
  { id: 'GR-1', question: 'whats the difference between perimeter and area again', objectiveId: 'M3.GR.23', objectiveVersion: 1, section: 'Perimeter and area of rectangles', studentAlias: 'Student 4', reason: 'unanswered', createdAt: '2026-08-25T09:20:00.000Z' },
  { id: 'GR-2', question: 'do i add or multiply for the area', objectiveId: 'M3.GR.23', objectiveVersion: 1, section: 'Perimeter and area of rectangles', studentAlias: 'Student 8', reason: 'stuck', createdAt: '2026-08-25T09:25:00.000Z' },

  // RW3.01 — main idea (1 student)
  { id: 'RW-1', question: 'how is the main idea different from the topic', objectiveId: 'RW3.01', objectiveVersion: 1, section: 'Finding the main idea', studentAlias: 'Student 6', reason: 'unanswered', createdAt: '2026-08-25T10:02:00.000Z' },

  // V3.01 — roots (1 student, answer-seeking)
  { id: 'V-1', question: 'can you just do the word parts for me', objectiveId: 'V3.01', objectiveVersion: 1, section: 'Roots, prefixes and suffixes', studentAlias: 'Student 10', reason: 'answer_seeking', createdAt: '2026-08-25T11:30:00.000Z' },

  // WR3.01 — opinion writing (1 student, repeated)
  { id: 'WR-1', question: 'how many reasons do i need for my opinion', objectiveId: 'WR3.01', objectiveVersion: 1, section: 'Writing an opinion with reasons', studentAlias: 'Student 1', reason: 'repeated', createdAt: '2026-08-25T12:15:00.000Z' },
];
