/**
 * A synthetic grade-3 unit exam under the locked module system:
 *   • Every question id carries a module tag (…_M1, _M2, …).
 *   • Each module maps to a real content-library Learning Objective and ships with
 *     built-in remediation (a reteach + a pass mark).
 *   • Responses span two schools so results roll up student → class → school →
 *     district. Correctness is a fixed hash, so the numbers never drift.
 */

import type { Exam, ExamResponse, ExamRosterEntry, ModuleDef } from '../examAnalysis.js';

// M# → Learning Objective (must exist in the content library so remediation deep-links),
// with the module's built-in reteach and pass mark. base = synthetic difficulty.
const MODULES: (ModuleDef & { base: number })[] = [
  { moduleId: 'M1', objectiveId: 'M3.NF.01', title: 'Represent a fraction as equal parts', lessonIds: ['LP-M3.NF.01'], reteachLessonId: 'LP-M3.NF.01-reteach', passThreshold: 0.7, base: 0.86 },
  { moduleId: 'M2', objectiveId: 'M3.NF.02', title: 'Compare two fractions', lessonIds: ['LP-M3.NF.02'], reteachLessonId: 'LP-M3.NF.02-reteach', passThreshold: 0.7, base: 0.44 },
  { moduleId: 'M3', objectiveId: 'M3.NSO.04', title: 'Round to the nearest 10 or 100', lessonIds: ['LP-M3.NSO.04'], reteachLessonId: 'LP-M3.NSO.04-reteach', passThreshold: 0.7, base: 0.82 },
  { moduleId: 'M4', objectiveId: 'M3.NSO.24', title: 'Multiply and divide within 12', lessonIds: ['LP-M3.NSO.24'], reteachLessonId: 'LP-M3.NSO.24-reteach', passThreshold: 0.7, base: 0.73 },
  { moduleId: 'M5', objectiveId: 'M3.AR.12', title: 'One- and two-step word problems', lessonIds: ['LP-M3.AR.12'], reteachLessonId: 'LP-M3.AR.12-reteach', passThreshold: 0.7, base: 0.61 },
];
const QUESTIONS_PER_MODULE = 3;

export const SAMPLE_MODULES: readonly ModuleDef[] = MODULES.map(({ base: _b, ...m }) => m);

// Two schools, two classes each, five students each → 20 students, one district.
const DISTRICT = 'Palmetto USD (synthetic)';
const SCHOOLS: { school: string; classes: string[]; adj: Record<string, number> }[] = [
  { school: 'Riverbend Elementary', classes: ['3A · Riverbend', '3B · Riverbend'], adj: {} },
  // Cypress Grove runs a bit lower overall, and notably weaker on word problems (M5).
  { school: 'Cypress Grove Elementary', classes: ['3A · Cypress', '3B · Cypress'], adj: { all: -0.06, M5: -0.14 } },
];
const NAMES = ['Mia', 'Ben', 'Cara', 'Diego', 'Ella'];

function h(seed: string): number {
  let x = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    x ^= seed.charCodeAt(i);
    x = Math.imul(x, 16777619) >>> 0;
  }
  return (x >>> 0) / 4294967296;
}
const clamp = (n: number) => Math.max(0.03, Math.min(0.98, n));

// Question ids embed the module tag — the whole tracking convention: "U1-Q07_M3".
export const SAMPLE_EXAM: Exam = {
  examId: 'EX-G3-U1',
  title: 'Grade 3 · Unit 1 exam (Number & Fractions)',
  grade: '3',
  questions: MODULES.flatMap((m) =>
    Array.from({ length: QUESTIONS_PER_MODULE }, (_, i) => ({
      questionId: `EX-G3-U1-Q${m.moduleId}${i + 1}_${m.moduleId}`,
      moduleId: m.moduleId,
      prompt: `${m.title} — item ${i + 1}`,
    })),
  ),
};

export const SAMPLE_EXAM_ROSTER: readonly ExamRosterEntry[] = SCHOOLS.flatMap((sc) =>
  sc.classes.flatMap((className) =>
    NAMES.map((name) => ({
      studentId: `${className.replace(/[^0-9A-Za-z]/g, '')}-${name}`,
      name,
      className,
      school: sc.school,
      district: DISTRICT,
    })),
  ),
);

function generate(): ExamResponse[] {
  const out: ExamResponse[] = [];
  for (const sc of SCHOOLS) {
    for (const entry of SAMPLE_EXAM_ROSTER.filter((e) => e.school === sc.school)) {
      const studentAdj = (h(entry.studentId) - 0.5) * 0.24;
      for (const m of MODULES) {
        const schoolAdj = (sc.adj.all ?? 0) + (sc.adj[m.moduleId] ?? 0);
        const p = clamp(m.base + studentAdj + schoolAdj);
        for (let i = 1; i <= QUESTIONS_PER_MODULE; i++) {
          const questionId = `EX-G3-U1-Q${m.moduleId}${i}_${m.moduleId}`;
          out.push({ studentId: entry.studentId, questionId, correct: h(`${entry.studentId}:${questionId}`) < p });
        }
      }
    }
  }
  return out;
}

export const SAMPLE_EXAM_RESPONSES: readonly ExamResponse[] = generate();
