/**
 * A synthetic district outcome dataset for the dashboard. NO real student data.
 *
 * Generated deterministically (a fixed FNV-1a hash, no RNG) so the same numbers appear
 * in tests, the dashboard and any export. Distributions vary by school and grade on
 * purpose, so the rollups actually show something worth acting on.
 */

import type { OutcomeRecord } from '../analytics.js';

const DISTRICT = 'Palmetto USD (synthetic)';
const SCHOOLS: readonly { name: string; base: number }[] = [
  { name: 'Riverbend Elementary', base: 0.8 },
  { name: 'Cypress Grove Elementary', base: 0.66 },
];
const GRADES = ['2', '3', '4'] as const;
const CLASSES = ['A', 'B'] as const;
const STUDENTS_PER_CLASS = 5;
const OBJ_BY_GRADE: Record<string, string[]> = {
  '2': ['M2.NF.01'],
  '3': ['M3.NF.01', 'M3.NF.02'],
  '4': ['M4.NF.01'],
};
const FIRST_NAMES = ['Ava', 'Ben', 'Cara', 'Diego', 'Ella', 'Finn', 'Gia', 'Hana', 'Ivan', 'Jae'];

/** Deterministic FNV-1a hash → [0,1). */
function h(seed: string): number {
  let x = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    x ^= seed.charCodeAt(i);
    x = Math.imul(x, 16777619) >>> 0;
  }
  return (x >>> 0) / 4294967296;
}
const jitter = (seed: string, spread: number) => (h(seed) - 0.5) * 2 * spread;
const clamp01 = (n: number) => Math.max(0.05, Math.min(0.99, n));

function generate(): OutcomeRecord[] {
  const out: OutcomeRecord[] = [];
  let nameIdx = 0;
  for (const school of SCHOOLS) {
    for (const grade of GRADES) {
      const gradeAdj = grade === '2' ? 0.04 : grade === '4' ? -0.03 : 0; // grade-level drift
      for (const c of CLASSES) {
        const className = `${grade}${c} · ${school.name.split(' ')[0]}`;
        const classAdj = jitter(`${school.name}${grade}${c}`, 0.06);
        for (let s = 1; s <= STUDENTS_PER_CLASS; s++) {
          const studentId = `${grade}${c}-${school.name[0]}-${s}`;
          const studentName = `${FIRST_NAMES[nameIdx % FIRST_NAMES.length]!} ${studentId}`;
          nameIdx++;
          const studentAdj = jitter(`${studentId}`, 0.14);
          for (const objectiveId of OBJ_BY_GRADE[grade]!) {
            const objAdj = jitter(`${studentId}${objectiveId}`, 0.08);
            const fraction = clamp01(school.base + gradeAdj + classAdj + studentAdj + objAdj);
            const masteryMet = fraction >= 0.8;
            const timeToMasteryDays = masteryMet
              ? 3 + Math.round(h(`${studentId}${objectiveId}t`) * 12)
              : undefined;
            out.push({
              studentId,
              studentName,
              className,
              grade,
              school: school.name,
              district: DISTRICT,
              objectiveId,
              masteryMet,
              fraction: Math.round(fraction * 1000) / 1000,
              timeToMasteryDays,
            });
          }
        }
      }
    }
  }
  return out;
}

export const SAMPLE_DISTRICT = DISTRICT;
export const SAMPLE_OUTCOMES: readonly OutcomeRecord[] = generate();
