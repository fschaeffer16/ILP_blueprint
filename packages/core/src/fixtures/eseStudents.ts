/**
 * "One class. Every ability." — the ESE showcase fixture.
 *
 * Six synthetic students spanning the range of documented disabilities, all in the SAME
 * general-education class, taking the SAME grade-3 Learning Objective. Each carries a
 * baseline plus a documented plan (IEP/504) whose accommodations the compiler applies
 * automatically. The point: five of the six are pure accommodation-lane — the objective
 * is locked and identical; only the sixth (Access Points) is the human-authorized
 * modification lane, shown as documentation, never computed by the engine.
 *
 * IMPORTANT FRAMING: the disability named on each card comes from the child's OWN TEAM's
 * documented plan — never from the screener. The screener raises signals; people decide.
 * All data synthetic. Specialist co-design is the gate before any classroom use.
 */

import type { BaselineObservation } from '../baseline.js';
import type { IEPPlan } from '../ese.js';

const obs = (
  studentId: string,
  domain: BaselineObservation['domain'],
  session: string,
  score: number,
  method: BaselineObservation['method'] = 'tablet_task',
): BaselineObservation => ({
  studentId, domain, sessionId: session, date: session === 'S1' ? '2026-09-02' : '2026-09-05',
  score, method, evidenceId: `${studentId}-${domain}-${session}`,
});

export interface EseShowcaseStudent {
  readonly studentId: string;
  readonly name: string;
  /** The documented condition, as the child's own team recorded it — not a screener output. */
  readonly documented: string;
  readonly whereTheyAre: string;
  readonly baseline: readonly BaselineObservation[];
  readonly plan: IEPPlan | null; // null → no plan needed (shown for contrast) — not used here
}

export const ESE_SHOWCASE_STUDENTS: readonly EseShowcaseStudent[] = [
  {
    studentId: 'E-MAYA', name: 'Maya',
    documented: 'IEP · Specific Learning Disability (dyslexia)',
    whereTheyAre: 'Grade-level thinking; decoding is the barrier. Her ideas should never wait on her reading speed.',
    baseline: [
      obs('E-MAYA', 'phonological_awareness', 'S1', 0.3), obs('E-MAYA', 'letter_sound_decoding', 'S2', 0.32),
      obs('E-MAYA', 'number_sense', 'S1', 0.82), obs('E-MAYA', 'working_memory', 'S2', 0.78),
    ],
    plan: {
      studentId: 'E-MAYA', planType: 'iep',
      accommodations: [
        { adaptationId: 'read_aloud', planText: 'Text-to-speech for all prose and directions (not for decoding-objective tasks).', kind: 'support' },
        { adaptationId: 'vocabulary_preview', planText: 'Key vocabulary pre-taught before new content.', kind: 'support' },
      ],
    },
  },
  {
    studentId: 'E-JONAH', name: 'Jonah',
    documented: 'IEP · Deaf (reads print fluently, communicates in ASL and text)',
    whereTheyAre: 'Fully capable — audio is the barrier, and only the audio. Everything reaches him through his eyes.',
    baseline: [
      obs('E-JONAH', 'auditory_acuity', 'S1', 0.05), obs('E-JONAH', 'auditory_acuity', 'S2', 0.05),
      obs('E-JONAH', 'number_sense', 'S1', 0.84), obs('E-JONAH', 'working_memory', 'S2', 0.8),
    ],
    plan: {
      studentId: 'E-JONAH', planType: 'iep',
      accommodations: [
        { adaptationId: 'captions_visual_supports', planText: 'All audio delivered as captions/transcripts; visual-first presentation.', kind: 'access' },
      ],
      // The IEP knows what a score can't: read-aloud is meaningless for Jonah.
      excludedAdaptations: ['read_aloud'],
    },
  },
  {
    studentId: 'E-LEO', name: 'Leo',
    documented: 'IEP · Autism spectrum, nonverbal — communicates with a symbol-based AAC device',
    whereTheyAre: 'Understanding is present; speech and keyboards can’t carry it. His AAC vocabulary is his voice.',
    baseline: [
      obs('E-LEO', 'oral_language', 'S1', 0.1, 'teacher_observation'), obs('E-LEO', 'oral_language', 'S2', 0.12, 'teacher_observation'),
      obs('E-LEO', 'sensory_regulation', 'S1', 0.35, 'teacher_observation'),
      obs('E-LEO', 'number_sense', 'S2', 0.62),
    ],
    plan: {
      studentId: 'E-LEO', planType: 'iep',
      accommodations: [
        { adaptationId: 'aac_symbol_response', planText: 'Responses via his own AAC symbol set (switch scanning available) count as full mastery evidence.', kind: 'access' },
        { adaptationId: 'chunked_prompt', planText: 'One step at a time, with a visual schedule and warned transitions.', kind: 'support' },
      ],
    },
  },
  {
    studentId: 'E-ZARA', name: 'Zara',
    documented: '504 plan · ADHD (combined presentation)',
    whereTheyAre: 'The ability is intact; attention and task-launch are the barrier. Lower the entry, never the bar.',
    baseline: [
      obs('E-ZARA', 'sustained_attention', 'S1', 0.35), obs('E-ZARA', 'executive_function', 'S2', 0.4),
      obs('E-ZARA', 'number_sense', 'S1', 0.75), obs('E-ZARA', 'phonological_awareness', 'S2', 0.8),
    ],
    plan: {
      studentId: 'E-ZARA', planType: '504',
      accommodations: [
        { adaptationId: 'chunked_prompt', planText: 'Multi-step work chunked with check-ins; movement breaks; extended time.', kind: 'support' },
      ],
    },
  },
  {
    studentId: 'E-ELENA', name: 'Elena',
    documented: 'IEP · Twice-exceptional — gifted, with dysgraphia (SLD in written expression)',
    whereTheyAre: 'Two truths at once: she needs a bigger challenge AND a different way to write. Neither may cancel the other.',
    baseline: [
      obs('E-ELENA', 'visual_motor', 'S1', 0.25), obs('E-ELENA', 'fine_motor', 'S2', 0.3),
      obs('E-ELENA', 'number_sense', 'S1', 0.95), obs('E-ELENA', 'working_memory', 'S2', 0.92),
    ],
    plan: {
      studentId: 'E-ELENA', planType: 'iep',
      accommodations: [
        { adaptationId: 'speech_to_text_response', planText: 'Dictation/typing in place of handwriting; content graded separately from mechanics.', kind: 'access' },
        { adaptationId: 'advanced_transfer_case', planText: 'Gifted services: extension within the objective at full rigor.', kind: 'support' },
      ],
    },
  },
];

/**
 * The sixth student — the one lane the engine never enters on its own. Sam's card shows
 * the documented, team-authorized alternate-standards path (axis 5), not a compile result.
 */
export const ESE_ACCESS_POINTS_STUDENT = {
  studentId: 'E-SAM', name: 'Sam',
  documented: 'IEP · Significant cognitive disability — the IEP team designated alternate standards (Access Points)',
  whereTheyAre: 'Sam works toward Access Point MA.K12.AP standards with Essential-Understanding levels — a real standard with real mastery, decided by his team and family, documented and dated. Same class, same app, his own authorized path.',
  authorization: {
    authorizedBy: 'IEP team (with family), eligibility staffing',
    authorizedOn: '2026-05-14',
    note: 'FSAA-aligned; reviewed annually. The platform records and serves this decision — it can never make it.',
  },
} as const;
