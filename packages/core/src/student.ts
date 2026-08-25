/**
 * Student-facing surfaces (blueprint §10 student application).
 *
 * The student sees ONE coherent app: today's assignments (the individualized versions the
 * compiler produced), study guides built from the same approved lesson content, and the
 * verified collaboration channels (see `collaboration.ts`). No separate logins, no infinite
 * feed.
 */

import type { DeliveryPattern } from './types.js';
import type { LessonPlan } from './lessons.js';
import type { ObjectiveVersion } from './types.js';

export type StudentWorkStatus = 'not_started' | 'in_progress' | 'submitted' | 'mastered' | 'needs_another_look';

export interface StudentAssignment {
  readonly assignmentId: string;
  readonly objectiveId: string;
  readonly title: string; // the objective's student outcome, in kid-facing form
  readonly subject: string;
  readonly pattern: DeliveryPattern; // the individualized version this student got
  readonly status: StudentWorkStatus;
  readonly dueLabel: string;
}

/** A study guide is a condensed, student-facing reference built from the approved lesson. */
export interface StudyGuide {
  readonly objectiveId: string;
  readonly title: string;
  readonly whatYoullLearn: string;
  readonly keyIdeas: readonly string[];
  readonly vocabulary: readonly string[];
  readonly workedExample: string | null;
  readonly practice: string | null;
  readonly commonMistakes: readonly string[];
}

/**
 * Build a study guide from an objective and its authored lesson. Everything comes from
 * already-approved content — the guide never invents new material.
 */
export function buildStudyGuide(objective: ObjectiveVersion, lesson: LessonPlan | null): StudyGuide {
  const worked = lesson?.blocks.find((b) => b.kind === 'worked_example')?.body
    ?? lesson?.blocks.find((b) => b.kind === 'instruction')?.body
    ?? null;
  const practice = lesson?.blocks.find((b) => b.kind === 'practice')?.body ?? null;
  return {
    objectiveId: objective.objectiveId,
    title: lesson?.title ?? objective.objectiveId,
    whatYoullLearn: objective.studentOutcome,
    keyIdeas: objective.essentialKnowledge,
    vocabulary: objective.essentialKnowledge.filter((k) => !k.includes(' ')),
    workedExample: worked,
    practice,
    commonMistakes: objective.misconceptions,
  };
}
