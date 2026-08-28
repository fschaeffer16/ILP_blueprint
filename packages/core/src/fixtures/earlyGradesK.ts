/**
 * Kindergarten content slice + a "meet them where they are" baseline showcase.
 *
 * The point of starting at K: the range of readiness in a single kindergarten class is
 * enormous — one child can't yet hear the sounds in a word while another already reads.
 * This fixture authors a small, gate-validated K library (real B.E.S.T.-mapped objectives,
 * lessons, items, sources) and four synthetic kindergartners whose baselines diverge
 * sharply, so the assign-once compiler serves each of them the SAME objective differently.
 *
 * Same standard, same answer — different delivery, decided by the baseline. No real data.
 */

import type { ObjectiveVersion, SourceRecord, Assignment } from '../types.js';
import type { LessonPlan } from '../lessons.js';
import type { AssessmentItem, Rubric } from '../assessment.js';
import type { BaselineObservation } from '../baseline.js';

// --- Approved K sources ---
export const EARLY_K_SOURCES: readonly SourceRecord[] = [
  { id: 'SRC-K01', title: 'Counting & cardinality manipulatives (K)', citation: 'Openly-licensed early-numeracy tasks — counting objects, ten-frames, cardinality.', uri: 'https://www.illustrativemathematics.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by', reviewStatus: 'approved', reviewedAt: '2026-08-16', reviewBy: '2027-08-16' },
  { id: 'SRC-K02', title: 'Comparing quantities tasks (K)', citation: 'Openly-licensed compare-more-fewer-equal task set for Kindergarten.', uri: 'https://www.ck12.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by_nc', reviewStatus: 'approved', reviewedAt: '2026-08-16', reviewBy: '2027-08-16' },
  { id: 'SRC-K03', title: 'Phonological awareness activities (K)', citation: 'Openly-licensed early-literacy set — beginning sounds, blending and segmenting.', uri: 'https://www.ckla.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by', reviewStatus: 'approved', reviewedAt: '2026-08-16', reviewBy: '2027-08-16' },
];

const K_ADAPTATIONS = ['vocabulary_preview', 'read_aloud', 'visual_first_models', 'chunked_prompt', 'worked_example_fade', 'advanced_transfer_case'];
const K_PROHIBITED = ['reduce_to_recognition_only', 'remove_explanation'];

function kObjective(o: Omit<ObjectiveVersion, 'status' | 'gradeBand' | 'permittedAdaptations' | 'prohibitedAdaptations' | 'remediationPatternIds'> & Partial<ObjectiveVersion>): ObjectiveVersion {
  return { status: 'published', gradeBand: 'K', permittedAdaptations: K_ADAPTATIONS, prohibitedAdaptations: K_PROHIBITED, remediationPatternIds: [], ...o };
}

export const EARLY_K_OBJECTIVES: readonly ObjectiveVersion[] = [
  kObjective({
    objectiveId: 'MK.NSO.01', version: 1, subject: 'mathematics', standardRefs: ['MA.K.NSO.1.1'],
    studentOutcome: 'Count a group of up to 20 objects and tell how many there are.',
    essentialKnowledge: ['count sequence', 'one-to-one correspondence', 'how many in all'],
    requiredReasoning: ['count', 'represent'],
    prerequisites: ['say number names in order'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['the last number you say is just the last one, not how many'], sourceIds: ['SRC-K01'],
  }),
  kObjective({
    objectiveId: 'MK.NSO.02', version: 1, subject: 'mathematics', standardRefs: ['MA.K.NSO.3.2'],
    studentOutcome: 'Compare two groups of up to 10 objects and tell which has more, fewer, or the same.',
    essentialKnowledge: ['more', 'fewer', 'equal', 'match one-to-one'],
    requiredReasoning: ['compare', 'explain'],
    prerequisites: ['count small groups'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['the group that takes up more space always has more'], sourceIds: ['SRC-K02'],
  }),
  kObjective({
    objectiveId: 'RK.F.01', version: 1, subject: 'reading', standardRefs: ['ELA.K.F.2.3'],
    studentOutcome: 'Say the beginning sound of a spoken word and match words that start with the same sound.',
    essentialKnowledge: ['beginning sound', 'same sound', 'listen for sounds'],
    requiredReasoning: ['identify', 'match'],
    prerequisites: ['hear words in a sentence'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['the beginning sound is the same as the first letter’s name'], sourceIds: ['SRC-K03'],
  }),
];

export const EARLY_K_LESSONS: readonly LessonPlan[] = [
  {
    id: 'LP-MK.NSO.01', objectiveId: 'MK.NSO.01', objectiveVersion: 1, authorId: 'T-K01', title: 'How many in all?',
    blocks: [
      { id: 'k1a', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will count a group of things and tell how many there are.', sourceIds: [], targets: [] },
      { id: 'k1b', kind: 'instruction', title: 'Count each one once', body: 'To count, touch each object one time and say the next number: one, two, three. The very last number you say tells how many there are in all — that is the total, not just the last thing you touched.', sourceIds: ['SRC-K01'], targets: ['count', 'represent'], techniqueId: 'visual_first_models' },
      { id: 'k1c', kind: 'practice', title: 'Touch and count', body: 'Touch each counter and count out loud. How many did you count?', sourceIds: ['SRC-K01'], targets: ['count'] },
      { id: 'k1d', kind: 'mastery_task', title: 'Count and show', body: 'Count this group of objects, tell how many in all, and show that number on a ten-frame or with a drawing.', sourceIds: ['SRC-K01'], targets: ['count', 'represent'] },
      { id: 'k1e', kind: 'reflection', title: 'Think back', body: 'How do you know the last number you said is how many there are?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-MK.NSO.02', objectiveId: 'MK.NSO.02', objectiveVersion: 1, authorId: 'T-K01', title: 'More, fewer, or the same?',
    blocks: [
      { id: 'k2a', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will look at two groups and tell which one has more, fewer, or the same.', sourceIds: [], targets: [] },
      { id: 'k2b', kind: 'instruction', title: 'Match them up', body: 'To compare two groups, match one object from each group into pairs. The group with objects left over has more; the other has fewer. If every object has a partner, the groups are equal. A group can look bigger but still have fewer — matching tells the truth.', sourceIds: ['SRC-K02'], targets: ['compare', 'explain'], techniqueId: 'visual_first_models' },
      { id: 'k2c', kind: 'practice', title: 'Make pairs', body: 'Draw a line matching each apple to one basket. Which group has more?', sourceIds: ['SRC-K02'], targets: ['compare'] },
      { id: 'k2d', kind: 'mastery_task', title: 'Compare and tell why', body: 'Compare the two groups, say which has more, fewer, or the same, and explain how matching shows it.', sourceIds: ['SRC-K02'], targets: ['compare', 'explain'] },
      { id: 'k2e', kind: 'reflection', title: 'Think back', body: 'Why can a group that takes up more space still have fewer things?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-RK.F.01', objectiveId: 'RK.F.01', objectiveVersion: 1, authorId: 'T-K02', title: 'Listen for the first sound',
    blocks: [
      { id: 'k3a', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will listen for the first sound in a word and find words that start the same way.', sourceIds: [], targets: [] },
      { id: 'k3b', kind: 'instruction', title: 'The first sound', body: 'Every word starts with a sound you can hear. Say “sun” slowly: /s/… the first sound is /s/. “Sock” also starts with /s/. Listen for the sound, not the letter name — the sound is what your mouth makes first.', sourceIds: ['SRC-K03'], targets: ['identify', 'match'], techniqueId: 'chunked_prompt' },
      { id: 'k3c', kind: 'practice', title: 'Say it slow', body: 'Say the word “map” slowly. What sound do you hear first?', sourceIds: ['SRC-K03'], targets: ['identify'] },
      { id: 'k3d', kind: 'mastery_task', title: 'First sound match', body: 'Say the beginning sound of the picture’s name, then point to another picture that starts with the same sound.', sourceIds: ['SRC-K03'], targets: ['identify', 'match'] },
      { id: 'k3e', kind: 'reflection', title: 'Think back', body: 'How can two different words start with the very same sound?', sourceIds: [], targets: [] },
    ],
  },
];

function mc(itemId: string, objectiveId: string, evidenceClaim: string, prompt: string, answerKey: string[], distractors: string[], sourceIds: string[], prohibitedClues: string[]): AssessmentItem {
  return { itemId, objectiveId, objectiveVersion: 1, format: 'multiple_choice', prompt, evidenceClaim, answerKey, distractors, equivalenceBand: 'B2', sourceIds, prohibitedClues, status: 'approved' };
}
function cr(itemId: string, objectiveId: string, evidenceClaim: string, prompt: string, sourceIds: string[], prohibitedClues: string[]): AssessmentItem {
  return { itemId, objectiveId, objectiveVersion: 1, format: 'constructed_response', prompt, evidenceClaim, answerKey: [], distractors: [], equivalenceBand: 'B2', sourceIds, prohibitedClues, status: 'approved' };
}

export const EARLY_K_ITEMS: readonly AssessmentItem[] = [
  mc('IT-MK.NSO.01-1_M1', 'MK.NSO.01', 'count', 'Count the dots: ● ● ● ● ● ● ● — how many are there in all?', ['seven'], ['six', 'eight', 'five'], ['SRC-K01'], ['the last number you say is just the last one, not how many']),
  cr('IT-MK.NSO.01-2_M1', 'MK.NSO.01', 'represent', 'Show the number twelve on a ten-frame or by drawing, and tell how many in all.', ['SRC-K01'], ['the last number you say is just the last one, not how many']),
  cr('IT-MK.NSO.02-1_M2', 'MK.NSO.02', 'compare', 'One row has 4 stars, another row has 7 stars. Match them in pairs and tell which row has more.', ['SRC-K02'], ['the group that takes up more space always has more']),
  cr('IT-MK.NSO.02-2_M2', 'MK.NSO.02', 'explain', 'The two groups look about the same size. Explain how matching one-to-one shows which has fewer.', ['SRC-K02'], ['the group that takes up more space always has more']),
  cr('IT-RK.F.01-1_M3', 'RK.F.01', 'identify', 'Say the word “fish” slowly and tell the first sound you hear.', ['SRC-K03'], ['the beginning sound is the same as the first letter’s name']),
  cr('IT-RK.F.01-2_M3', 'RK.F.01', 'match', 'The word is “ball.” Point to another picture whose name starts with the same beginning sound, and say the sound.', ['SRC-K03'], ['the beginning sound is the same as the first letter’s name']),
];

function rubric(objectiveId: string, criteria: { trace: string; desc: string; max: number }[]): Rubric {
  return {
    rubricId: `RB-${objectiveId}`, objectiveId, objectiveVersion: 1,
    criteria: criteria.map((c, i) => ({ id: `${objectiveId}-c${i + 1}`, description: c.desc, maxPoints: c.max, objectiveTrace: c.trace })),
  };
}

export const EARLY_K_RUBRICS: readonly Rubric[] = [
  rubric('MK.NSO.01', [{ trace: 'count', desc: 'Counts each object once and states the total.', max: 2 }, { trace: 'represent', desc: 'Represents the quantity on a ten-frame or drawing.', max: 2 }]),
  rubric('MK.NSO.02', [{ trace: 'compare', desc: 'Correctly compares the two groups (more/fewer/same).', max: 2 }, { trace: 'explain', desc: 'Explains the comparison using one-to-one matching.', max: 2 }]),
  rubric('RK.F.01', [{ trace: 'identify', desc: 'Says the correct beginning sound of a spoken word.', max: 2 }, { trace: 'match', desc: 'Matches a word with the same beginning sound.', max: 2 }]),
];

export const EARLY_K_LIBRARY = {
  sources: EARLY_K_SOURCES,
  objectives: EARLY_K_OBJECTIVES,
  lessons: EARLY_K_LESSONS,
  items: EARLY_K_ITEMS,
  rubrics: EARLY_K_RUBRICS,
} as const;

// --- The showcase: one kindergarten counting objective, four very different learners ---

export const EARLY_K_ASSIGNMENT: Assignment = {
  assignmentId: 'A-K-NSO01', classId: 'K-Room-4',
  objectiveVersionRefs: [{ objectiveId: 'MK.NSO.01', version: 1 }],
  durationMinutes: 20, deliveryMode: 'lesson_practice', botMode: 'lesson',
  collaboration: { enabled: false, scope: 'none' },
  teacherConstraints: {},
};

const obs = (studentId: string, domain: BaselineObservation['domain'], session: string, score: number, method: BaselineObservation['method'] = 'game_task'): BaselineObservation =>
  ({ studentId, domain, sessionId: session, date: session === 'S1' ? '2026-08-25' : '2026-08-28', score, method, evidenceId: `${studentId}-${domain}-${session}` });

/** Four kindergartners, same class, wildly different starting points. */
export const EARLY_K_STUDENTS: readonly { studentId: string; name: string; blurb: string; baseline: readonly BaselineObservation[] }[] = [
  {
    studentId: 'K-ADA', name: 'Ada', blurb: 'Comes in already counting past 20 and reading simple words.',
    baseline: [
      obs('K-ADA', 'number_sense', 'S1', 0.9), obs('K-ADA', 'number_sense', 'S2', 0.88),
      obs('K-ADA', 'phonological_awareness', 'S1', 0.86), obs('K-ADA', 'working_memory', 'S2', 0.85),
    ],
  },
  {
    studentId: 'K-BODI', name: 'Bodhi', blurb: 'A visual thinker — number sense is still forming; sees it when he can see it.',
    baseline: [
      obs('K-BODI', 'number_sense', 'S1', 0.42), obs('K-BODI', 'number_sense', 'S2', 0.46),
      obs('K-BODI', 'phonological_awareness', 'S1', 0.8), obs('K-BODI', 'working_memory', 'S2', 0.82),
    ],
  },
  {
    studentId: 'K-CAI', name: 'Cai', blurb: 'A multilingual learner — strong with numbers; the spoken directions are the barrier.',
    baseline: [
      obs('K-CAI', 'phonological_awareness', 'S1', 0.34, 'oral'), obs('K-CAI', 'phonological_awareness', 'S2', 0.36, 'oral'),
      obs('K-CAI', 'letter_sound_decoding', 'S1', 0.38, 'oral'),
      obs('K-CAI', 'number_sense', 'S2', 0.8),
    ],
  },
  {
    studentId: 'K-DEV', name: 'Dev', blurb: 'Bright and busy — holds one step at a time; a long multi-step task overwhelms.',
    baseline: [
      obs('K-DEV', 'working_memory', 'S1', 0.4), obs('K-DEV', 'working_memory', 'S2', 0.42),
      obs('K-DEV', 'number_sense', 'S1', 0.78), obs('K-DEV', 'phonological_awareness', 'S2', 0.8),
    ],
  },
];
