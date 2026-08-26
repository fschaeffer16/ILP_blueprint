/**
 * Synthetic student-facing fixtures: one child's assignment queue, the verified members
 * of a grade-3 space, subject collaboration channels, and a few posts (including an
 * answer-dump that gets held). No real data; no direct messages exist in the model.
 */

import type { StudentAssignment } from '../student.js';
import type { Channel, ModerationStatus, ContributionKind } from '../collaboration.js';

export const SAMPLE_STUDENT_ID = 'S-777';
export const SAMPLE_STUDENT_NAME = 'Mia';

export const SAMPLE_STUDENT_QUEUE: readonly StudentAssignment[] = [
  { assignmentId: 'A-1', objectiveId: 'M3.NF.01', title: 'Show fractions as equal parts', subject: 'mathematics', pattern: 'visual_first', status: 'in_progress', dueLabel: 'Due today' },
  { assignmentId: 'A-2', objectiveId: 'M3.NF.02', title: 'Compare two fractions', subject: 'mathematics', pattern: 'core', status: 'not_started', dueLabel: 'Due Friday' },
  { assignmentId: 'A-3', objectiveId: 'RW3.01', title: 'Find the main idea', subject: 'reading', pattern: 'vocabulary_supported', status: 'submitted', dueLabel: 'Turned in' },
  { assignmentId: 'A-4', objectiveId: 'CIV3.01', title: 'The community water decision', subject: 'history_civics', pattern: 'guided_practice', status: 'in_progress', dueLabel: 'Due next week' },
];

/** Assignments coming up later — the "what's ahead" view a student and family plan around. */
export const SAMPLE_STUDENT_UPCOMING: readonly StudentAssignment[] = [
  { assignmentId: 'A-5', objectiveId: 'M3.FR.1.3', title: 'Fractions on a number line', subject: 'mathematics', pattern: 'core', status: 'not_started', dueLabel: 'Mon, Sep 15' },
  { assignmentId: 'A-6', objectiveId: 'ELA.3.R.2.2', title: 'Explain how key details support the main idea', subject: 'reading', pattern: 'vocabulary_supported', status: 'not_started', dueLabel: 'Tue, Sep 16' },
  { assignmentId: 'A-7', objectiveId: 'ELA.3.C.1.3', title: 'Write an opinion with reasons', subject: 'writing', pattern: 'guided_practice', status: 'not_started', dueLabel: 'Thu, Sep 18' },
  { assignmentId: 'A-8', objectiveId: 'M3.AR.1.1', title: 'Multiplication & division fact families', subject: 'mathematics', pattern: 'advanced_transfer', status: 'not_started', dueLabel: 'Mon, Sep 22' },
];

export type StudentDateKind = 'quiz' | 'project' | 'event' | 'report';
export interface StudentImportantDate {
  readonly date: string;
  readonly label: string;
  readonly kind: StudentDateKind;
}

/** Important dates the student app surfaces so nothing sneaks up on a family. */
export const SAMPLE_IMPORTANT_DATES: readonly StudentImportantDate[] = [
  { date: 'Fri · Sep 12', label: 'Fractions quiz', kind: 'quiz' },
  { date: 'Wed · Sep 17', label: 'Community water project — final decision due', kind: 'project' },
  { date: 'Fri · Sep 19', label: 'Reading celebration — bring your favorite book', kind: 'event' },
  { date: 'Fri · Sep 26', label: 'Progress reports go home', kind: 'report' },
];

/** The verified roster for this grade-3 space. Membership is what gates collaboration. */
export const SAMPLE_MEMBERS: readonly { id: string; name: string }[] = [
  { id: 'S-777', name: 'Mia' },
  { id: 'S-778', name: 'Ben' },
  { id: 'S-779', name: 'Cara' },
  { id: 'S-780', name: 'Diego' },
  { id: 'S-781', name: 'Ella' },
];

export const SAMPLE_CHANNELS: readonly Channel[] = [
  { id: 'CH-math', name: 'Math Helpers', subject: 'mathematics', scope: 'grade', objectiveId: 'M3.NF.02' },
  { id: 'CH-reading', name: 'Reading Circle', subject: 'reading', scope: 'grade' },
  { id: 'CH-civics', name: 'Community Problem-Solvers', subject: 'history_civics', scope: 'grade', objectiveId: 'CIV3.01' },
];

export interface SamplePost {
  readonly id: string;
  readonly channelId: string;
  readonly authorId: string;
  readonly authorName: string;
  readonly text: string;
  readonly kind: ContributionKind;
  readonly status: ModerationStatus;
  readonly note?: string;
}

export const SAMPLE_POSTS: readonly SamplePost[] = [
  { id: 'PO-1', channelId: 'CH-math', authorId: 'S-778', authorName: 'Ben', text: 'I think 1/3 is bigger than 1/6 because when there are fewer pieces, each piece is bigger.', kind: 'explanation', status: 'approved' },
  { id: 'PO-2', channelId: 'CH-math', authorId: 'S-779', authorName: 'Cara', text: 'How do you compare fractions when the top numbers are the same?', kind: 'question', status: 'approved' },
  { id: 'PO-3', channelId: 'CH-math', authorId: 'S-780', authorName: 'Diego', text: 'the answer is 1/3', kind: 'answer_dump', status: 'held', note: 'Held — show your thinking, then a quick solo check.' },
  { id: 'PO-4', channelId: 'CH-civics', authorId: 'S-781', authorName: 'Ella', text: 'First we should fix the pipes because clean water keeps everyone healthy. That matters more than the park right now.', kind: 'explanation', status: 'approved' },
  { id: 'PO-5', channelId: 'CH-reading', authorId: 'S-777', authorName: 'Mia', text: 'The main idea is that bees help plants grow. Source: our class article.', kind: 'resource', status: 'approved' },
];
