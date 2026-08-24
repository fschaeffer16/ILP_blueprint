/**
 * A synthetic grade-3 class. NO real student data — every profile is invented to
 * exercise the compiler's individualization paths. The blueprint mandates synthetic
 * data before any live pilot (build spec §28, "Data during build: Synthetic students only").
 *
 * The class is designed so one teacher assignment fans out into every delivery
 * pattern, demonstrating "assign once → individualized for each child".
 */

import type { StudentILP } from '../types.js';

// A review date safely in the future so hypotheses are active in tests/demo.
const REVIEW = '2099-06-01';

export const SAMPLE_CLASS_ID = 'CLS-103';

export const SAMPLE_ROSTER: readonly StudentILP[] = [
  {
    studentId: 'S-001',
    displayName: 'Ava',
    gradeBand: '3',
    hypotheses: [
      {
        domain: 'objective_mastery',
        statement: 'On grade level with fractions foundations; steady independent work.',
        readiness: 0.7,
        confidence: 0.8,
        evidenceIds: ['EV-1001'],
        reviewAt: REVIEW,
        teacherConfirmed: true,
      },
    ],
  },
  {
    studentId: 'S-002',
    displayName: 'Ben',
    gradeBand: '3',
    hypotheses: [
      {
        domain: 'language_access',
        statement: 'Reads below grade level; understands more when text is read aloud.',
        readiness: 0.3,
        confidence: 0.85,
        evidenceIds: ['EV-1002', 'EV-1003'],
        reviewAt: REVIEW,
        effectiveSupports: ['read_aloud'],
        teacherConfirmed: true,
      },
    ],
  },
  {
    studentId: 'S-003',
    displayName: 'Cara',
    gradeBand: '3',
    hypotheses: [
      {
        domain: 'mathematical_reasoning',
        statement: 'Grasps fractions better with area/set models before symbols.',
        readiness: 0.45,
        confidence: 0.75,
        evidenceIds: ['EV-1004'],
        reviewAt: REVIEW,
      },
    ],
  },
  {
    studentId: 'S-004',
    displayName: 'Diego',
    gradeBand: '3',
    hypotheses: [
      {
        domain: 'prerequisite_knowledge',
        statement: 'Partitioning prerequisite is shaky; benefits from worked examples.',
        readiness: 0.4,
        confidence: 0.8,
        evidenceIds: ['EV-1005'],
        reviewAt: REVIEW,
        effectiveSupports: ['worked_example_fade'],
      },
    ],
  },
  {
    studentId: 'S-005',
    displayName: 'Ella',
    gradeBand: '3',
    hypotheses: [
      {
        domain: 'objective_mastery',
        statement: 'Already fluent with fraction representation; ready for transfer.',
        readiness: 0.92,
        confidence: 0.9,
        evidenceIds: ['EV-1006', 'EV-1007'],
        reviewAt: REVIEW,
        teacherConfirmed: true,
      },
    ],
  },
  {
    studentId: 'S-006',
    displayName: 'Finn',
    gradeBand: '3',
    hypotheses: [
      {
        domain: 'prerequisite_knowledge',
        statement: 'Missing partitioning fundamentals; needs step-by-step support.',
        readiness: 0.35,
        confidence: 0.7,
        evidenceIds: ['EV-1008'],
        reviewAt: REVIEW,
      },
      {
        domain: 'assessment_conditions',
        statement: 'Loses accuracy under time pressure on multi-step prompts.',
        readiness: 0.4,
        confidence: 0.65,
        evidenceIds: ['EV-1009'],
        reviewAt: REVIEW,
      },
    ],
  },
];
