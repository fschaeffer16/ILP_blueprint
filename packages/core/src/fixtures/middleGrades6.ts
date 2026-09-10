/**
 * Grade 6 content slice + the departmentalized showcase.
 *
 * Middle school changes the shape of the problem: one student, many teachers.
 * This fixture authors a small, gate-validated grade-6 library (real
 * B.E.S.T.-mapped objectives, lessons, items, sources) and a two-period day —
 * Period 1 math (ratios), Period 4 ELA (central idea) — where the SAME student
 * profile follows the child across teachers: each teacher assigns once, and the
 * plan and baseline ride along automatically into every period. Includes one
 * IEP student on the 12-and-older dedicated-phone plan. No real data.
 */

import type { ObjectiveVersion, SourceRecord, Assignment } from '../types.js';
import type { LessonPlan } from '../lessons.js';
import type { AssessmentItem, Rubric } from '../assessment.js';
import type { BaselineObservation } from '../baseline.js';
import type { IEPPlan } from '../ese.js';

// --- Approved grade-6 sources ---
export const MIDDLE_6_SOURCES: readonly SourceRecord[] = [
  { id: 'SRC-M601', title: 'Ratio & rate reasoning tasks (6-8)', citation: 'Openly-licensed grade 6-8 ratio, rate and proportional-reasoning task sets.', uri: 'https://www.illustrativemathematics.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by', reviewStatus: 'approved', reviewedAt: '2026-08-16', reviewBy: '2027-08-16' },
  { id: 'SRC-M602', title: 'Unit rates & comparisons (6)', citation: 'Openly-licensed unit-rate and best-buy comparison problems for grade 6.', uri: 'https://www.ck12.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by_nc', reviewStatus: 'approved', reviewedAt: '2026-08-16', reviewBy: '2027-08-16' },
  { id: 'SRC-M603', title: 'Informational texts with central-idea supports (6)', citation: 'Openly-licensed middle-grades informational passages with text-evidence scaffolds.', uri: 'https://www.commonlit.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by_nc', reviewStatus: 'approved', reviewedAt: '2026-08-16', reviewBy: '2027-08-16' },
];

const M6_ADAPTATIONS = [
  'vocabulary_preview', 'read_aloud', 'visual_first_models', 'chunked_prompt', 'worked_example_fade',
  'advanced_transfer_case', 'aac_symbol_response', 'speech_to_text_response', 'captions_visual_supports',
];
const M6_PROHIBITED = ['reduce_to_recognition_only', 'remove_explanation'];

function m6Objective(o: Omit<ObjectiveVersion, 'status' | 'gradeBand' | 'permittedAdaptations' | 'prohibitedAdaptations' | 'remediationPatternIds'> & Partial<ObjectiveVersion>): ObjectiveVersion {
  return { status: 'published', gradeBand: '6', permittedAdaptations: M6_ADAPTATIONS, prohibitedAdaptations: M6_PROHIBITED, remediationPatternIds: [], ...o };
}

export const MIDDLE_6_OBJECTIVES: readonly ObjectiveVersion[] = [
  m6Objective({
    objectiveId: 'M6.AR.01', version: 1, subject: 'mathematics', standardRefs: ['MA.6.AR.3.1'],
    studentOutcome: 'Write and interpret ratios to compare two quantities in a real-world situation.',
    essentialKnowledge: ['ratio notation a:b', 'part-to-part vs part-to-whole', 'order matters in a ratio'],
    requiredReasoning: ['write', 'interpret'],
    prerequisites: ['multiplication and division fluency'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['a ratio is the same thing as a fraction of the whole'], sourceIds: ['SRC-M601'],
  }),
  m6Objective({
    objectiveId: 'M6.AR.02', version: 1, subject: 'mathematics', standardRefs: ['MA.6.AR.3.2'],
    studentOutcome: 'Find unit rates and use them to compare real-world situations, like prices and speeds.',
    essentialKnowledge: ['unit rate as per-one amount', 'divide to find the rate', 'compare with the same unit'],
    requiredReasoning: ['compute', 'compare'],
    prerequisites: ['write and interpret ratios'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['the bigger total is always the better deal'], sourceIds: ['SRC-M602'],
  }),
  m6Objective({
    objectiveId: 'R6.CI.01', version: 1, subject: 'reading', standardRefs: ['ELA.6.R.2.2'],
    studentOutcome: 'Analyze the central idea of an informational text and how details develop it.',
    essentialKnowledge: ['central idea vs topic', 'supporting details', 'development across a text'],
    requiredReasoning: ['analyze', 'cite'],
    prerequisites: ['identify explicit main ideas'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['the central idea is always stated in the first paragraph'], sourceIds: ['SRC-M603'],
  }),
];

export const MIDDLE_6_LESSONS: readonly LessonPlan[] = [
  {
    id: 'LP-M6.AR.01', objectiveId: 'M6.AR.01', objectiveVersion: 1, authorId: 'T-601', title: 'Ratios that mean something',
    blocks: [
      { id: 'm1a', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will write ratios that compare real quantities, and say what they mean.', sourceIds: [], targets: [] },
      { id: 'm1b', kind: 'instruction', title: 'Order carries the meaning', body: 'A ratio compares two quantities in order: 3 guards to 2 forwards is 3:2, and 2:3 says something different. A ratio can compare part to part (guards to forwards) or part to whole (guards to all players) — naming which comparison you are making is half the work.', sourceIds: ['SRC-M601'], targets: ['write', 'interpret'], techniqueId: 'worked_example_fade' },
      { id: 'm1c', kind: 'practice', title: 'Write it both ways', body: 'The recipe uses 4 cups of flour and 6 cups of water. Write the flour-to-water ratio and the flour-to-total ratio.', sourceIds: ['SRC-M601'], targets: ['write'] },
      { id: 'm1d', kind: 'mastery_task', title: 'Interpret the ratio', body: 'A class has a 5:3 ratio of tablets to laptops. Write the ratio, then explain what it tells you — and what it does not.', sourceIds: ['SRC-M601'], targets: ['write', 'interpret'] },
      { id: 'm1e', kind: 'reflection', title: 'Think back', body: 'Why is a 5:3 ratio not the same as saying 5/8 of the devices are tablets — and when is it?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M6.AR.02', objectiveId: 'M6.AR.02', objectiveVersion: 1, authorId: 'T-601', title: 'The per-one number',
    blocks: [
      { id: 'm2a', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will find unit rates and use them to compare deals and speeds.', sourceIds: [], targets: [] },
      { id: 'm2b', kind: 'instruction', title: 'Divide down to one', body: 'A unit rate tells you the amount for exactly one: dollars per one bottle, miles per one hour. Divide to get there — $6 for 4 bottles is $1.50 per bottle. Once both options are per-one, they compare honestly; totals alone can fool you.', sourceIds: ['SRC-M602'], targets: ['compute', 'compare'], techniqueId: 'worked_example_fade' },
      { id: 'm2c', kind: 'practice', title: 'Find the rate', body: '12 granola bars cost $9. What is the cost per bar?', sourceIds: ['SRC-M602'], targets: ['compute'] },
      { id: 'm2d', kind: 'mastery_task', title: 'Which is the better buy?', body: 'Store A: 8 markers for $10. Store B: 5 markers for $7. Compute both unit rates and justify which is the better buy.', sourceIds: ['SRC-M602'], targets: ['compute', 'compare'] },
      { id: 'm2e', kind: 'reflection', title: 'Think back', body: 'Why can the option with the bigger price still be the better deal?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-R6.CI.01', objectiveId: 'R6.CI.01', objectiveVersion: 1, authorId: 'T-604', title: 'What the text is really about',
    blocks: [
      { id: 'm3a', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will figure out the central idea of a text and trace how the details build it.', sourceIds: [], targets: [] },
      { id: 'm3b', kind: 'instruction', title: 'Topic is not idea', body: 'The topic is what a text is about in a word — “sea turtles.” The central idea is what the text is saying about the topic — “sea turtles are recovering because of protection laws.” It may never appear in one sentence; you build it from the details the author keeps returning to, and you prove it by citing them.', sourceIds: ['SRC-M603'], targets: ['analyze', 'cite'], techniqueId: 'chunked_prompt' },
      { id: 'm3c', kind: 'practice', title: 'Find the returning details', body: 'Read the passage and list two details the author repeats or builds on.', sourceIds: ['SRC-M603'], targets: ['analyze'] },
      { id: 'm3d', kind: 'mastery_task', title: 'State it and prove it', body: 'State the central idea in your own sentence, and cite two details that develop it across the text.', sourceIds: ['SRC-M603'], targets: ['analyze', 'cite'] },
      { id: 'm3e', kind: 'reflection', title: 'Think back', body: 'Why can two readers agree on the topic but disagree on the central idea — and how do citations settle it?', sourceIds: [], targets: [] },
    ],
  },
];

function mc(itemId: string, objectiveId: string, evidenceClaim: string, prompt: string, answerKey: string[], distractors: string[], sourceIds: string[], prohibitedClues: string[]): AssessmentItem {
  return { itemId, objectiveId, objectiveVersion: 1, format: 'multiple_choice', prompt, evidenceClaim, answerKey, distractors, equivalenceBand: 'B2', sourceIds, prohibitedClues, status: 'approved' };
}
function cr(itemId: string, objectiveId: string, evidenceClaim: string, prompt: string, sourceIds: string[], prohibitedClues: string[]): AssessmentItem {
  return { itemId, objectiveId, objectiveVersion: 1, format: 'constructed_response', prompt, evidenceClaim, answerKey: [], distractors: [], equivalenceBand: 'B2', sourceIds, prohibitedClues, status: 'approved' };
}

export const MIDDLE_6_ITEMS: readonly AssessmentItem[] = [
  mc('IT-M6.AR.01-1_M1', 'M6.AR.01', 'write', 'A team has 3 guards and 2 forwards. Which ratio compares guards to forwards?', ['3:2'], ['2:3', '3:5', '2:5'], ['SRC-M601'], ['a ratio is the same thing as a fraction of the whole']),
  cr('IT-M6.AR.01-2_M1', 'M6.AR.01', 'interpret', 'The juice mix uses a 2:5 ratio of concentrate to water. Explain what the ratio tells you, and what the part-to-whole version would be.', ['SRC-M601'], ['a ratio is the same thing as a fraction of the whole']),
  mc('IT-M6.AR.02-1_M2', 'M6.AR.02', 'compute', '12 granola bars cost $9. What is the cost per bar?', ['$0.75'], ['$1.33', '$0.90', '$1.08'], ['SRC-M602'], ['the bigger total is always the better deal']),
  cr('IT-M6.AR.02-2_M2', 'M6.AR.02', 'compare', 'Store A sells 8 markers for $10; Store B sells 5 for $7. Compute both unit rates and justify which is the better buy.', ['SRC-M602'], ['the bigger total is always the better deal']),
  cr('IT-R6.CI.01-1_M3', 'R6.CI.01', 'analyze', 'State the central idea of the passage in your own sentence — not just its topic.', ['SRC-M603'], ['the central idea is always stated in the first paragraph']),
  cr('IT-R6.CI.01-2_M3', 'R6.CI.01', 'cite', 'Cite two details from different parts of the passage and explain how each develops the central idea.', ['SRC-M603'], ['the central idea is always stated in the first paragraph']),
];

function rubric(objectiveId: string, criteria: { trace: string; desc: string; max: number }[]): Rubric {
  return {
    rubricId: `RB-${objectiveId}`, objectiveId, objectiveVersion: 1,
    criteria: criteria.map((c, i) => ({ id: `${objectiveId}-c${i + 1}`, description: c.desc, maxPoints: c.max, objectiveTrace: c.trace })),
  };
}

export const MIDDLE_6_RUBRICS: readonly Rubric[] = [
  rubric('M6.AR.01', [{ trace: 'write', desc: 'Writes the ratio with correct order and notation.', max: 2 }, { trace: 'interpret', desc: 'Interprets the comparison, naming part-to-part vs part-to-whole.', max: 2 }]),
  rubric('M6.AR.02', [{ trace: 'compute', desc: 'Computes the unit rate correctly.', max: 2 }, { trace: 'compare', desc: 'Compares options using per-one rates and justifies the choice.', max: 2 }]),
  rubric('R6.CI.01', [{ trace: 'analyze', desc: 'States a defensible central idea, distinct from the topic.', max: 2 }, { trace: 'cite', desc: 'Cites details from across the text that develop the idea.', max: 2 }]),
];

export const MIDDLE_6_LIBRARY = {
  sources: MIDDLE_6_SOURCES,
  objectives: MIDDLE_6_OBJECTIVES,
  lessons: MIDDLE_6_LESSONS,
  items: MIDDLE_6_ITEMS,
  rubrics: MIDDLE_6_RUBRICS,
} as const;

// --- The departmentalized day: two periods, two teachers, one profile ---

export const MIDDLE_6_PERIOD1: Assignment = {
  assignmentId: 'A-6-AR01-P1', classId: '6-Math · Period 1 · Ms. Rivera',
  objectiveVersionRefs: [{ objectiveId: 'M6.AR.01', version: 1 }],
  durationMinutes: 35, deliveryMode: 'lesson_practice', botMode: 'lesson',
  collaboration: { enabled: false, scope: 'none' },
  teacherConstraints: {},
};

export const MIDDLE_6_PERIOD4: Assignment = {
  assignmentId: 'A-6-CI01-P4', classId: '6-ELA · Period 4 · Mr. Okafor',
  objectiveVersionRefs: [{ objectiveId: 'R6.CI.01', version: 1 }],
  durationMinutes: 35, deliveryMode: 'lesson_practice', botMode: 'lesson',
  collaboration: { enabled: false, scope: 'none' },
  teacherConstraints: {},
};

const obs = (studentId: string, domain: BaselineObservation['domain'], session: string, score: number, method: BaselineObservation['method'] = 'tablet_task'): BaselineObservation =>
  ({ studentId, domain, sessionId: session, date: session === 'S1' ? '2026-08-25' : '2026-08-28', score, method, evidenceId: `${studentId}-${domain}-${session}` });

/** Mateo's documented plan — the IEP declares his channel; no score ever guesses it. */
export const MATEO_PLAN: IEPPlan = {
  studentId: 'M-MATEO', planType: 'iep',
  accommodations: [
    { adaptationId: 'aac_symbol_response', planText: 'Mateo responds through his AAC device or symbol selection across all classes and assessments.', kind: 'access' },
    { adaptationId: 'chunked_prompt', planText: 'Multi-step tasks presented one step at a time with a visual checklist.', kind: 'support' },
  ],
};

export interface Middle6Student {
  readonly studentId: string;
  readonly name: string;
  readonly blurb: string;
  readonly baseline: readonly BaselineObservation[];
  readonly plan: IEPPlan | null;
}

export const MIDDLE_6_STUDENTS: readonly Middle6Student[] = [
  {
    studentId: 'M-MATEO', name: 'Mateo',
    blurb: 'Semi-verbal, autistic, mainstreamed with support — sharp mathematical reasoning; his IEP carries his AAC channel into every period, and his dedicated phone carries the day.',
    baseline: [
      obs('M-MATEO', 'oral_language_expressive', 'S1', 0.18), obs('M-MATEO', 'articulation', 'S2', 0.2),
      obs('M-MATEO', 'math_reasoning', 'S1', 0.86), obs('M-MATEO', 'number_sense', 'S2', 0.84),
      obs('M-MATEO', 'working_memory', 'S1', 0.44),
    ],
    plan: MATEO_PLAN,
  },
  {
    studentId: 'M-JUNE', name: 'June',
    blurb: 'Ahead of the class across the board — the risk for her is boredom, not difficulty.',
    baseline: [
      obs('M-JUNE', 'math_reasoning', 'S1', 0.92), obs('M-JUNE', 'number_sense', 'S2', 0.9),
      obs('M-JUNE', 'reading_comprehension', 'S1', 0.9), obs('M-JUNE', 'working_memory', 'S2', 0.88),
    ],
    plan: null,
  },
  {
    studentId: 'M-KIRA', name: 'Kira',
    blurb: 'Multilingual, two years in U.S. schools — strong quantitative thinking; academic English is the barrier, not the math.',
    baseline: [
      obs('M-KIRA', 'oral_language', 'S1', 0.4, 'oral'), obs('M-KIRA', 'reading_comprehension', 'S2', 0.44),
      obs('M-KIRA', 'math_reasoning', 'S1', 0.82), obs('M-KIRA', 'number_sense', 'S2', 0.8),
    ],
    plan: null,
  },
];
