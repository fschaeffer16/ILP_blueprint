/**
 * Synthetic assessment fixtures for the grade-3 fractions objective.
 * Rubric, spec, an approved item, and synthetic student submissions. No real data.
 */

import type { AssessmentItem, AssessmentSpec, Rubric } from '../assessment.js';
import type { Submission } from '../grading.js';

export const SAMPLE_RUBRIC: Rubric = {
  rubricId: 'RUB-M3.NF.01',
  objectiveId: 'M3.NF.01',
  objectiveVersion: 1,
  criteria: [
    {
      id: 'C-represent',
      description: 'Represents a fraction as equal parts of a whole using a model.',
      maxPoints: 3,
      objectiveTrace: 'represent',
    },
    {
      id: 'C-explain',
      description: 'Explains the numerator and denominator meaning in the representation.',
      maxPoints: 3,
      objectiveTrace: 'explain',
    },
    {
      id: 'C-transfer',
      description: 'Transfers the idea of equal parts to an unfamiliar whole.',
      maxPoints: 2,
      objectiveTrace: 'transfer',
    },
    {
      id: 'C-mechanics',
      description: 'Writing mechanics (teacher-weighted, objective-dependent).',
      maxPoints: 1,
      objectiveTrace: 'mechanics',
      isMechanics: true,
    },
  ],
};

export const SAMPLE_ASSESSMENT_SPEC: AssessmentSpec = {
  specId: 'SPEC-M3.NF.01-A',
  objectiveId: 'M3.NF.01',
  objectiveVersion: 1,
  evidenceClaims: ['represent', 'explain', 'transfer'],
  equivalenceBand: 'B2',
  rubricId: 'RUB-M3.NF.01',
  itemConstraints: { formats: ['constructed_response', 'multiple_choice'], itemCount: 2 },
};

/** An equivalent reassessment spec — same objective, claims and band; a NEW task. */
export const SAMPLE_REASSESSMENT_SPEC: AssessmentSpec = {
  ...SAMPLE_ASSESSMENT_SPEC,
  specId: 'SPEC-M3.NF.01-B',
};

export const SAMPLE_MC_ITEM: AssessmentItem = {
  itemId: 'ITEM-M3.NF.01-mc1',
  objectiveId: 'M3.NF.01',
  objectiveVersion: 1,
  format: 'multiple_choice',
  prompt: 'A pizza is cut into 4 equal slices. You eat 1 slice. Which fraction shows how much you ate?',
  evidenceClaim: 'represent',
  answerKey: ['1/4'],
  distractors: ['1/3', '4/1', '3/4'],
  equivalenceBand: 'B2',
  sourceIds: ['SRC-001'],
  prohibitedClues: ['larger denominator means larger fraction'],
  status: 'approved',
};

// Synthetic responses tuned so the reference grader yields a spread of outcomes,
// including a classwide-failure section for the 75% rule demo.
export const SAMPLE_SUBMISSIONS: readonly Submission[] = [
  {
    submissionId: 'SUB-001',
    studentId: 'S-001',
    assignmentId: 'ASG-2201',
    objectiveId: 'M3.NF.01',
    objectiveVersion: 1,
    response:
      'I can represent the fraction with equal parts. The denominator is 4 because the whole has 4 equal parts, and the numerator is 1 because I shaded one part. This shows one fourth. It transfers to a chocolate bar cut into equal parts because the whole is still split into equal parts.',
    supportsUsed: [],
    submittedAt: '2026-09-01T12:00:00Z',
  },
  {
    submissionId: 'SUB-005',
    studentId: 'S-005',
    assignmentId: 'ASG-2201',
    objectiveId: 'M3.NF.01',
    objectiveVersion: 1,
    response:
      'The numerator and denominator show equal parts of the whole. I can represent one fourth and explain that the denominator counts the equal parts since the whole is divided evenly. It transfers to any whole split into equal parts.',
    supportsUsed: ['read_aloud'],
    submittedAt: '2026-09-01T12:03:00Z',
  },
  {
    submissionId: 'SUB-002',
    studentId: 'S-002',
    assignmentId: 'ASG-2201',
    objectiveId: 'M3.NF.01',
    objectiveVersion: 1,
    response: 'I think it is one fourth. The bigger the number on the bottom the bigger the piece.',
    supportsUsed: ['read_aloud'],
    submittedAt: '2026-09-01T12:05:00Z',
  },
  {
    submissionId: 'SUB-003',
    studentId: 'S-003',
    assignmentId: 'ASG-2201',
    objectiveId: 'M3.NF.01',
    objectiveVersion: 1,
    response: 'one fourth',
    supportsUsed: [],
    submittedAt: '2026-09-01T12:06:00Z',
  },
  {
    submissionId: 'SUB-004',
    studentId: 'S-004',
    assignmentId: 'ASG-2201',
    objectiveId: 'M3.NF.01',
    objectiveVersion: 1,
    response: 'I am not sure how to do this one.',
    supportsUsed: ['worked_example_fade'],
    submittedAt: '2026-09-01T12:08:00Z',
  },
  {
    submissionId: 'SUB-006',
    studentId: 'S-006',
    assignmentId: 'ASG-2201',
    objectiveId: 'M3.NF.01',
    objectiveVersion: 1,
    response: 'The answer is a quarter I think but I forget why.',
    supportsUsed: ['worked_example_fade'],
    submittedAt: '2026-09-01T12:09:00Z',
  },
];
