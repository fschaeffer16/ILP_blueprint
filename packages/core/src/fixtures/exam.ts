/**
 * A synthetic grade-3 unit exam, tagged question-by-question to real Learning
 * Objectives from the content library, plus a deterministic set of student
 * responses across two classes. Drives the exam-analysis-by-objective demo.
 * No real student data; correctness is a fixed hash so the results never drift.
 */

import type { Exam, ExamResponse, ExamRosterEntry } from '../examAnalysis.js';

// Learning Objectives on this exam (all exist in the content library, so remediation
// can deep-link to the reteach), each with a baseline difficulty for the synthetic data.
const OBJECTIVES: { id: string; title: string; base: number }[] = [
  { id: 'M3.NF.01', title: 'Represent a fraction as equal parts', base: 0.86 },
  { id: 'M3.NF.02', title: 'Compare two fractions', base: 0.44 }, // grade-wide weak spot
  { id: 'M3.NSO.04', title: 'Round to the nearest 10 or 100', base: 0.82 },
  { id: 'M3.NSO.24', title: 'Multiply and divide within 12', base: 0.73 },
  { id: 'M3.AR.12', title: 'One- and two-step word problems', base: 0.61 },
];
const QUESTIONS_PER_OBJECTIVE = 3;

const CLASSES = ['3A · Riverbend', '3B · Riverbend'] as const;
const STUDENT_NAMES = ['Mia', 'Ben', 'Cara', 'Diego', 'Ella'];
// 3B is weaker on word problems (M3.AR.12); everything else is comparable.
const CLASS_ADJ: Record<string, Record<string, number>> = {
  '3B · Riverbend': { 'M3.AR.12': -0.18 },
};

/** Deterministic FNV-1a hash → [0,1). */
function h(seed: string): number {
  let x = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    x ^= seed.charCodeAt(i);
    x = Math.imul(x, 16777619) >>> 0;
  }
  return (x >>> 0) / 4294967296;
}
const clamp = (n: number) => Math.max(0.03, Math.min(0.98, n));

export const SAMPLE_EXAM: Exam = {
  examId: 'EX-G3-U1',
  title: 'Grade 3 · Unit 1 exam (Number & Fractions)',
  grade: '3',
  questions: OBJECTIVES.flatMap((o) =>
    Array.from({ length: QUESTIONS_PER_OBJECTIVE }, (_, i) => ({
      questionId: `${o.id}-q${i + 1}`,
      objectiveId: o.id,
      objectiveTitle: o.title,
    })),
  ),
};

export const SAMPLE_EXAM_ROSTER: readonly ExamRosterEntry[] = CLASSES.flatMap((className) =>
  STUDENT_NAMES.map((name, s) => ({
    studentId: `${className[1]}-${name}`,
    name,
    className,
  })),
);

function generate(): ExamResponse[] {
  const out: ExamResponse[] = [];
  for (const entry of SAMPLE_EXAM_ROSTER) {
    const studentAdj = (h(entry.studentId) - 0.5) * 0.24; // ±0.12 personal skill
    for (const o of OBJECTIVES) {
      const classAdj = CLASS_ADJ[entry.className]?.[o.id] ?? 0;
      const p = clamp(o.base + studentAdj + classAdj);
      for (let i = 1; i <= QUESTIONS_PER_OBJECTIVE; i++) {
        const questionId = `${o.id}-q${i}`;
        out.push({
          studentId: entry.studentId,
          questionId,
          correct: h(`${entry.studentId}:${questionId}`) < p,
        });
      }
    }
  }
  return out;
}

export const SAMPLE_EXAM_RESPONSES: readonly ExamResponse[] = generate();
