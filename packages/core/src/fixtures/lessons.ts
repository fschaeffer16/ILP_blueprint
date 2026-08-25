/**
 * A sample teacher-authored lesson plan for the grade-3 fractions objective, built
 * from approved sources and covering the objective's required reasoning.
 */

import type { LessonPlan } from '../lessons.js';

export const SAMPLE_LESSON_PLAN: LessonPlan = {
  id: 'LP-M3.NF.01-a',
  objectiveId: 'M3.NF.01',
  objectiveVersion: 1,
  title: 'Fractions as equal parts — introduction',
  authorId: 'T-100',
  blocks: [
    {
      id: 'B1',
      kind: 'objective_preview',
      title: 'What we will learn',
      sourceIds: [],
      targets: [],
    },
    {
      id: 'B2',
      kind: 'instruction',
      title: 'Equal parts with area models',
      sourceIds: ['SRC-001'],
      targets: ['represent', 'explain'],
      techniqueId: 'visual_first_models',
    },
    {
      id: 'B3',
      kind: 'worked_example',
      title: 'Naming a fraction step by step',
      sourceIds: ['SRC-001'],
      targets: ['represent'],
      techniqueId: 'worked_example_fade',
    },
    {
      id: 'B4',
      kind: 'practice',
      title: 'Shade and name fractions',
      sourceIds: ['SRC-001'],
      targets: ['represent', 'explain'],
    },
    {
      id: 'B5',
      kind: 'mastery_task',
      title: 'Represent, explain, and transfer to a new whole',
      sourceIds: ['SRC-002'],
      targets: ['represent', 'explain', 'transfer'],
    },
    {
      id: 'B6',
      kind: 'reflection',
      title: 'What changed and what is still tricky',
      sourceIds: [],
      targets: [],
    },
  ],
};
