/**
 * A synthetic baseline for one grade-3 student, "Noah", across three short sessions.
 * Reading-processing signals are low (an early reading / dyslexia-characteristic
 * indicator) while number sense is a strength — so the profile clearly routes support
 * where it's needed without ever labeling the whole child. No real data.
 */

import type { BaselineObservation } from '../baseline.js';

const S = 'S-311';
const mk = (
  domain: BaselineObservation['domain'],
  sessionId: string,
  score: number,
  method: BaselineObservation['method'],
  n: number,
): BaselineObservation => ({ studentId: S, domain, sessionId, date: '2026-09-05', score, method, evidenceId: `EV-${domain}-${n}` });

export const SAMPLE_BASELINE: readonly BaselineObservation[] = [
  // Session 1 (game-like tasks + observation)
  mk('phonological_awareness', 'BS-1', 0.22, 'game_task', 1),
  mk('letter_sound_decoding', 'BS-1', 0.3, 'game_task', 1),
  mk('rapid_naming', 'BS-1', 0.38, 'oral', 1),
  mk('working_memory', 'BS-1', 0.5, 'tablet_task', 1),
  mk('number_sense', 'BS-1', 0.82, 'tablet_task', 1),
  mk('oral_language', 'BS-1', 0.72, 'oral', 1),
  // Session 2
  mk('phonological_awareness', 'BS-2', 0.28, 'game_task', 2),
  mk('letter_sound_decoding', 'BS-2', 0.35, 'tablet_task', 2),
  mk('rapid_naming', 'BS-2', 0.42, 'oral', 2),
  mk('working_memory', 'BS-2', 0.55, 'tablet_task', 2),
  mk('number_sense', 'BS-2', 0.78, 'tablet_task', 2),
  mk('performance_conditions', 'BS-2', 0.5, 'teacher_observation', 2),
  // Session 3
  mk('phonological_awareness', 'BS-3', 0.25, 'teacher_observation', 3),
  mk('letter_sound_decoding', 'BS-3', 0.32, 'tablet_task', 3),
  mk('working_memory', 'BS-3', 0.52, 'tablet_task', 3),
  mk('oral_language', 'BS-3', 0.68, 'oral', 3),
  mk('performance_conditions', 'BS-3', 0.48, 'teacher_observation', 3),
];
