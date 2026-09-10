/**
 * IEP goals as module chains (IEP build, step 4) — three synthetic goals on the
 * same compare-fractions module (M2) the whole class runs, accruing progress
 * from the step-3 attempt log. Note each criterion names its prompt level:
 * "80% accurate" means nothing until you say at what independence.
 */

import type { IEPGoal } from '../iepGoals.js';

export const ESE_IEP_GOALS: readonly IEPGoal[] = [
  {
    goalId: 'G-LEO-1',
    studentId: 'E-LEO',
    area: 'academic',
    goalText:
      'By the annual review, given his AAC response channel, Leo will compare fractions with like numerators or denominators with 80% accuracy at no more support than a gestural prompt, across 3 consecutive sessions.',
    moduleIds: ['M2'],
    criterion: { accuracy: 0.8, promptLevelAtOrAbove: 'gestural_prompt', consecutiveSessions: 3 },
    reviewDate: '2027-05-15',
  },
  {
    goalId: 'G-ZARA-1',
    studentId: 'E-ZARA',
    area: 'academic',
    goalText:
      'By the annual review, Zara will compare fractions with 80% accuracy at no more support than a gestural prompt, across 3 consecutive sessions.',
    moduleIds: ['M2'],
    criterion: { accuracy: 0.8, promptLevelAtOrAbove: 'gestural_prompt', consecutiveSessions: 3 },
    reviewDate: '2027-05-15',
  },
  {
    goalId: 'G-MAYA-1',
    studentId: 'E-MAYA',
    area: 'academic',
    goalText:
      'By the annual review, Maya will compare fractions with 80% accuracy, fully independently, across 3 consecutive sessions.',
    moduleIds: ['M2'],
    criterion: { accuracy: 0.8, promptLevelAtOrAbove: 'independent', consecutiveSessions: 3 },
    reviewDate: '2027-05-15',
  },
];
