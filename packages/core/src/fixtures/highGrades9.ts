/**
 * Grade 9 content slice + the course-and-EOC showcase.
 *
 * High school changes the stakes: standards live inside CREDIT COURSES, and in
 * Florida the Algebra 1 end-of-course exam counts toward the course grade and
 * graduation itself. This fixture authors a small, gate-validated Algebra 1 +
 * English 1 library and an EOC practice check whose every question carries a
 * module tag — so the module machinery (worst-first analysis, auto remediation)
 * points directly at the test that counts. No real data.
 */

import type { ObjectiveVersion, SourceRecord, Assignment } from '../types.js';
import type { LessonPlan } from '../lessons.js';
import type { AssessmentItem, Rubric } from '../assessment.js';
import type { BaselineObservation } from '../baseline.js';
import type { IEPPlan } from '../ese.js';
import type { Exam, ExamResponse, ExamRosterEntry, ModuleDef } from '../examAnalysis.js';

// --- Approved grade-9 sources ---
export const HIGH_9_SOURCES: readonly SourceRecord[] = [
  { id: 'SRC-H901', title: 'Algebra 1 linear equations tasks (HS)', citation: 'Openly-licensed high-school algebra task sets — writing and solving linear equations in context.', uri: 'https://www.illustrativemathematics.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by', reviewStatus: 'approved', reviewedAt: '2026-08-16', reviewBy: '2027-08-16' },
  { id: 'SRC-H902', title: 'Linear functions & graphing (HS)', citation: 'Openly-licensed slope, intercept and linear-function interpretation problems.', uri: 'https://www.ck12.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by_nc', reviewStatus: 'approved', reviewedAt: '2026-08-16', reviewBy: '2027-08-16' },
  { id: 'SRC-H903', title: 'Literary texts with theme & character supports (9-10)', citation: 'Openly-licensed literary passages with character, conflict and theme scaffolds.', uri: 'https://www.commonlit.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by_nc', reviewStatus: 'approved', reviewedAt: '2026-08-16', reviewBy: '2027-08-16' },
];

const H9_ADAPTATIONS = [
  'vocabulary_preview', 'read_aloud', 'visual_first_models', 'chunked_prompt', 'worked_example_fade',
  'advanced_transfer_case', 'aac_symbol_response', 'speech_to_text_response', 'captions_visual_supports',
];
const H9_PROHIBITED = ['reduce_to_recognition_only', 'remove_explanation'];

function h9Objective(o: Omit<ObjectiveVersion, 'status' | 'gradeBand' | 'permittedAdaptations' | 'prohibitedAdaptations' | 'remediationPatternIds'> & Partial<ObjectiveVersion>): ObjectiveVersion {
  return { status: 'published', gradeBand: '9', permittedAdaptations: H9_ADAPTATIONS, prohibitedAdaptations: H9_PROHIBITED, remediationPatternIds: [], ...o };
}

export const HIGH_9_OBJECTIVES: readonly ObjectiveVersion[] = [
  h9Objective({
    objectiveId: 'A1.AR.01', version: 1, subject: 'mathematics', standardRefs: ['MA.912.AR.2.1'],
    studentOutcome: 'Write and solve one-variable linear equations from real-world situations.',
    essentialKnowledge: ['variable as the unknown', 'inverse operations undo in reverse order', 'check by substitution'],
    requiredReasoning: ['write', 'solve'],
    prerequisites: ['integer and rational-number operations'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['you always subtract the smaller number from the larger'], sourceIds: ['SRC-H901'],
  }),
  h9Objective({
    objectiveId: 'A1.AR.02', version: 1, subject: 'mathematics', standardRefs: ['MA.912.AR.2.4'],
    studentOutcome: 'Graph linear functions and interpret slope and intercept in the situation they model.',
    essentialKnowledge: ['slope as rate of change', 'intercept as the starting value', 'a graph tells the story of the situation'],
    requiredReasoning: ['graph', 'interpret'],
    prerequisites: ['write and solve linear equations'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['a steeper line always means a bigger y-value'], sourceIds: ['SRC-H902'],
  }),
  h9Objective({
    objectiveId: 'E1.R.01', version: 1, subject: 'reading', standardRefs: ['ELA.9.R.1.1'],
    studentOutcome: 'Analyze how an author’s choices about character and conflict develop a literary text’s theme.',
    essentialKnowledge: ['theme vs plot', 'character decisions reveal values', 'conflict drives development'],
    requiredReasoning: ['analyze', 'cite'],
    prerequisites: ['identify explicit theme statements'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['the theme is whatever the story’s topic is'], sourceIds: ['SRC-H903'],
  }),
];

export const HIGH_9_LESSONS: readonly LessonPlan[] = [
  {
    id: 'LP-A1.AR.01', objectiveId: 'A1.AR.01', objectiveVersion: 1, authorId: 'T-901', title: 'From situation to equation',
    blocks: [
      { id: 'h1a', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will turn a real situation into a linear equation and solve it.', sourceIds: [], targets: [] },
      { id: 'h1b', kind: 'instruction', title: 'Name the unknown, then undo', body: 'Let the variable stand for the thing you want to know. Build the equation from the story: a gym charges $25 to join plus $10 a month, and you spent $95 — so 25 + 10m = 95. Solve by undoing in reverse order (subtract 25, then divide by 10), and check by substituting back into the story.', sourceIds: ['SRC-H901'], targets: ['write', 'solve'], techniqueId: 'worked_example_fade' },
      { id: 'h1c', kind: 'practice', title: 'Build it', body: 'A ride-share costs $3 plus $2 per mile. The trip cost $17. Write the equation.', sourceIds: ['SRC-H901'], targets: ['write'] },
      { id: 'h1d', kind: 'mastery_task', title: 'Write, solve, check', body: 'Write an equation for a new situation, solve it showing each undo step, and verify the solution back in the context.', sourceIds: ['SRC-H901'], targets: ['write', 'solve'] },
      { id: 'h1e', kind: 'reflection', title: 'Think back', body: 'Why does checking your answer in the situation catch mistakes the algebra alone can miss?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-A1.AR.02', objectiveId: 'A1.AR.02', objectiveVersion: 1, authorId: 'T-901', title: 'The line tells the story',
    blocks: [
      { id: 'h2a', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will graph linear functions and say what the slope and intercept mean in the situation.', sourceIds: [], targets: [] },
      { id: 'h2b', kind: 'instruction', title: 'Slope is a rate, intercept is a start', body: 'In y = 10x + 25 for the gym, 25 is where you start (the joining fee) and 10 is the rate the cost climbs each month. On the graph, the intercept is where the line meets the axis and the slope is how fast it rises. Read the line as the story: steeper means faster change — not automatically bigger values.', sourceIds: ['SRC-H902'], targets: ['graph', 'interpret'], techniqueId: 'visual_first_models' },
      { id: 'h2c', kind: 'practice', title: 'Plot the plan', body: 'Graph y = 2x + 3 and label the intercept and the slope.', sourceIds: ['SRC-H902'], targets: ['graph'] },
      { id: 'h2d', kind: 'mastery_task', title: 'Graph and interpret', body: 'Graph a phone-plan function and explain what its slope and intercept mean in dollars and months.', sourceIds: ['SRC-H902'], targets: ['graph', 'interpret'] },
      { id: 'h2e', kind: 'reflection', title: 'Think back', body: 'Two lines cross: what does the crossing point mean in the two plans’ story?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-E1.R.01', objectiveId: 'E1.R.01', objectiveVersion: 1, authorId: 'T-904', title: 'Choices make the theme',
    blocks: [
      { id: 'h3a', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will trace how an author’s choices about character and conflict build the theme.', sourceIds: [], targets: [] },
      { id: 'h3b', kind: 'instruction', title: 'Theme is earned, not announced', body: 'The theme is what the story argues about life — and authors argue through choices: which conflict the character faces, what the character risks, what the outcome costs. Track the decisive moments; the pattern of choices is the evidence, and citing them is how you prove a theme rather than guess one.', sourceIds: ['SRC-H903'], targets: ['analyze', 'cite'], techniqueId: 'chunked_prompt' },
      { id: 'h3c', kind: 'practice', title: 'Find the turn', body: 'Mark the moment the main character makes their hardest choice. What does it cost them?', sourceIds: ['SRC-H903'], targets: ['analyze'] },
      { id: 'h3d', kind: 'mastery_task', title: 'Argue the theme', body: 'State the theme in your own sentence and cite two character choices that develop it.', sourceIds: ['SRC-H903'], targets: ['analyze', 'cite'] },
      { id: 'h3e', kind: 'reflection', title: 'Think back', body: 'How can two readers cite the same scene and defend different themes — and what settles it?', sourceIds: [], targets: [] },
    ],
  },
];

function mc(itemId: string, objectiveId: string, evidenceClaim: string, prompt: string, answerKey: string[], distractors: string[], sourceIds: string[], prohibitedClues: string[]): AssessmentItem {
  return { itemId, objectiveId, objectiveVersion: 1, format: 'multiple_choice', prompt, evidenceClaim, answerKey, distractors, equivalenceBand: 'B2', sourceIds, prohibitedClues, status: 'approved' };
}
function cr(itemId: string, objectiveId: string, evidenceClaim: string, prompt: string, sourceIds: string[], prohibitedClues: string[]): AssessmentItem {
  return { itemId, objectiveId, objectiveVersion: 1, format: 'constructed_response', prompt, evidenceClaim, answerKey: [], distractors: [], equivalenceBand: 'B2', sourceIds, prohibitedClues, status: 'approved' };
}

export const HIGH_9_ITEMS: readonly AssessmentItem[] = [
  mc('IT-A1.AR.01-1_M1', 'A1.AR.01', 'write', 'A gym charges $25 to join plus $10 per month. You have spent $95 total. Which equation models the months m?', ['25 + 10m = 95'], ['10 + 25m = 95', '95 + 10m = 25', '25m − 10 = 95'], ['SRC-H901'], ['you always subtract the smaller number from the larger']),
  cr('IT-A1.AR.01-2_M1', 'A1.AR.01', 'solve', 'Solve 25 + 10m = 95, showing each undo step, and check the solution in the gym situation.', ['SRC-H901'], ['you always subtract the smaller number from the larger']),
  mc('IT-A1.AR.02-1_M2', 'A1.AR.02', 'interpret', 'In the cost function y = 10x + 25, what does the 25 represent?', ['the starting cost before any months'], ['the monthly rate', 'the number of months', 'the total cost'], ['SRC-H902'], ['a steeper line always means a bigger y-value']),
  cr('IT-A1.AR.02-2_M2', 'A1.AR.02', 'graph', 'Graph the two phone plans y = 15x and y = 10x + 20, and interpret what their crossing point means.', ['SRC-H902'], ['a steeper line always means a bigger y-value']),
  cr('IT-E1.R.01-1_M3', 'E1.R.01', 'analyze', 'State the theme of the story in your own sentence — the argument it makes, not its topic.', ['SRC-H903'], ['the theme is whatever the story’s topic is']),
  cr('IT-E1.R.01-2_M3', 'E1.R.01', 'cite', 'Cite two character choices from different parts of the text and explain how each develops the theme.', ['SRC-H903'], ['the theme is whatever the story’s topic is']),
];

function rubric(objectiveId: string, criteria: { trace: string; desc: string; max: number }[]): Rubric {
  return {
    rubricId: `RB-${objectiveId}`, objectiveId, objectiveVersion: 1,
    criteria: criteria.map((c, i) => ({ id: `${objectiveId}-c${i + 1}`, description: c.desc, maxPoints: c.max, objectiveTrace: c.trace })),
  };
}

export const HIGH_9_RUBRICS: readonly Rubric[] = [
  rubric('A1.AR.01', [{ trace: 'write', desc: 'Writes an equation that models the situation.', max: 2 }, { trace: 'solve', desc: 'Solves with valid steps and checks in context.', max: 2 }]),
  rubric('A1.AR.02', [{ trace: 'graph', desc: 'Graphs the function accurately with labeled features.', max: 2 }, { trace: 'interpret', desc: 'Interprets slope and intercept in the situation.', max: 2 }]),
  rubric('E1.R.01', [{ trace: 'analyze', desc: 'States a defensible theme distinct from the topic.', max: 2 }, { trace: 'cite', desc: 'Cites character choices that develop the theme.', max: 2 }]),
];

export const HIGH_9_LIBRARY = {
  sources: HIGH_9_SOURCES,
  objectives: HIGH_9_OBJECTIVES,
  lessons: HIGH_9_LESSONS,
  items: HIGH_9_ITEMS,
  rubrics: HIGH_9_RUBRICS,
} as const;

// --- The course: Algebra 1, a graduation-stakes credit ---

export const ALG1_ASSIGNMENT: Assignment = {
  assignmentId: 'A-A1-AR01-P2', classId: 'Algebra 1 · Period 2 · Coach Daniels',
  objectiveVersionRefs: [{ objectiveId: 'A1.AR.01', version: 1 }],
  durationMinutes: 40, deliveryMode: 'lesson_practice', botMode: 'lesson',
  collaboration: { enabled: false, scope: 'none' },
  teacherConstraints: {},
};

const obs = (studentId: string, domain: BaselineObservation['domain'], session: string, score: number, method: BaselineObservation['method'] = 'tablet_task'): BaselineObservation =>
  ({ studentId, domain, sessionId: session, date: session === 'S1' ? '2026-08-25' : '2026-08-28', score, method, evidenceId: `${studentId}-${domain}-${session}` });

/** Dre's documented plan: dysgraphia — his algebra reasoning is spoken, not handwritten. */
export const DRE_PLAN: IEPPlan = {
  studentId: 'H-DRE', planType: 'iep',
  accommodations: [
    { adaptationId: 'speech_to_text_response', planText: 'Dre dictates written responses and explanations, including on assessments, in all courses.', kind: 'access' },
  ],
};

export interface High9Student {
  readonly studentId: string;
  readonly name: string;
  readonly blurb: string;
  readonly baseline: readonly BaselineObservation[];
  readonly plan: IEPPlan | null;
}

export const HIGH_9_STUDENTS: readonly High9Student[] = [
  {
    studentId: 'H-NOVA', name: 'Nova',
    blurb: 'Solid across the board — the course’s job is to keep her moving, not waiting.',
    baseline: [
      obs('H-NOVA', 'math_reasoning', 'S1', 0.9), obs('H-NOVA', 'number_sense', 'S2', 0.88),
      obs('H-NOVA', 'working_memory', 'S1', 0.86), obs('H-NOVA', 'reading_comprehension', 'S2', 0.88),
    ],
  plan: null,
  },
  {
    studentId: 'H-DRE', name: 'Dre',
    blurb: 'Strong algebraic thinker with dysgraphia — handwriting is the barrier, never the math. His IEP carries speech-to-text into every course and every exam.',
    baseline: [
      obs('H-DRE', 'visual_motor', 'S1', 0.2), obs('H-DRE', 'fine_motor', 'S2', 0.24),
      obs('H-DRE', 'math_reasoning', 'S1', 0.85), obs('H-DRE', 'working_memory', 'S2', 0.8),
    ],
    plan: DRE_PLAN,
  },
  {
    studentId: 'H-LENA', name: 'Lena',
    blurb: 'Arrived in ninth grade with middle-school gaps under her algebra — the EOC clock is running, and the modules make her exact gaps visible.',
    baseline: [
      obs('H-LENA', 'math_reasoning', 'S1', 0.44), obs('H-LENA', 'number_sense', 'S2', 0.46),
      obs('H-LENA', 'working_memory', 'S1', 0.7), obs('H-LENA', 'reading_comprehension', 'S2', 0.72),
    ],
    plan: null,
  },
];

// --- The EOC practice check: every question module-tagged, remediation built in ---

export const ALG1_MODULES: readonly ModuleDef[] = [
  { moduleId: 'M1', objectiveId: 'A1.AR.01', title: 'Write & solve linear equations', lessonIds: ['LP-A1.AR.01'], reteachLessonId: 'LP-A1.AR.01', passThreshold: 0.7 },
  { moduleId: 'M2', objectiveId: 'A1.AR.02', title: 'Graph & interpret linear functions', lessonIds: ['LP-A1.AR.02'], reteachLessonId: 'LP-A1.AR.02', passThreshold: 0.7 },
];

const q = (n: number, moduleId: string): { questionId: string; moduleId: string } =>
  ({ questionId: `EOC-A1-CK1-Q${n}_${moduleId}`, moduleId });

export const ALG1_EOC_CHECK: Exam = {
  examId: 'EOC-A1-CK1',
  title: 'Algebra 1 EOC practice check #1',
  grade: '9',
  questions: [q(1, 'M1'), q(2, 'M1'), q(3, 'M1'), q(4, 'M1'), q(5, 'M2'), q(6, 'M2'), q(7, 'M2'), q(8, 'M2')],
};

const HS = { className: 'Algebra 1 · Period 2', school: 'Synthetic High School', district: 'Palmetto USD (synthetic)' };
export const ALG1_EOC_ROSTER: readonly ExamRosterEntry[] = [
  { studentId: 'H-NOVA', name: 'Nova', ...HS },
  { studentId: 'H-DRE', name: 'Dre', ...HS },
  { studentId: 'H-LENA', name: 'Lena', ...HS },
  { studentId: 'H-OMAR', name: 'Omar', ...HS },
  { studentId: 'H-PRIYA', name: 'Priya', ...HS },
  { studentId: 'H-SETH', name: 'Seth', ...HS },
];

// Deterministic responses: the class owns M1 (~88%) but is under the pass mark on
// M2 graphs (~54%) — the worst-first analysis catches it; Lena is below on both.
const R = (studentId: string, n: number, moduleId: string, correct: boolean): ExamResponse =>
  ({ studentId, questionId: `EOC-A1-CK1-Q${n}_${moduleId}`, correct });

const pattern: Record<string, boolean[]> = {
  //           M1: Q1    Q2     Q3     Q4     M2: Q5    Q6     Q7     Q8
  'H-NOVA': [true, true, true, true, true, true, false, true],
  'H-DRE': [true, true, true, true, true, false, true, false],
  'H-LENA': [false, true, false, false, false, false, true, false],
  'H-OMAR': [true, true, false, true, false, true, false, false],
  'H-PRIYA': [true, true, true, true, true, false, false, false],
  'H-SETH': [true, false, true, true, false, false, true, false],
};

export const ALG1_EOC_RESPONSES: readonly ExamResponse[] = Object.entries(pattern).flatMap(
  ([studentId, answers]) =>
    answers.map((correct, i) => R(studentId, i + 1, i < 4 ? 'M1' : 'M2', correct)),
);
