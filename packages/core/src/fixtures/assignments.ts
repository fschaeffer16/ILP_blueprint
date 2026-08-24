/**
 * A sample teacher assignment: one objective, one class, assigned once.
 * Mirrors the API's `/v1/assignments/compile` request body (build spec §40).
 */

import type { Assignment } from '../types.js';
import { SAMPLE_CLASS_ID } from './roster.js';

export const SAMPLE_ASSIGNMENT: Assignment = {
  assignmentId: 'ASG-2201',
  classId: SAMPLE_CLASS_ID,
  objectiveVersionRefs: [{ objectiveId: 'M3.NF.01', version: 1 }],
  durationMinutes: 35,
  deliveryMode: 'lesson_practice',
  botMode: 'lesson',
  collaboration: { enabled: true, scope: 'class' },
  teacherConstraints: {
    requireHandwriting: true,
    maxReadAloudFraction: 0.5,
  },
};
