import { describe, expect, it } from 'vitest';
import { buildCatalog, compileAssignment, hasModuleTag, iepToConstraints, isPlanUsable, buildBaselineProfile, studentILPFromBaseline } from '../src/index.js';
import {
  MATEO_PLAN,
  MIDDLE_6_LIBRARY,
  MIDDLE_6_OBJECTIVES,
  MIDDLE_6_PERIOD1,
  MIDDLE_6_PERIOD4,
  MIDDLE_6_STUDENTS,
  SAMPLE_ADAPTATIONS,
} from '../src/fixtures/index.js';

const mateo = MIDDLE_6_STUDENTS.find((s) => s.name === 'Mateo')!;

const compileFor = (assignment: typeof MIDDLE_6_PERIOD1, student: typeof mateo) => {
  const profile = buildBaselineProfile(student.baseline, { gradeBand: '6', today: new Date('2026-09-01') });
  const ilp = studentILPFromBaseline(profile, student.name);
  const constraints = student.plan ? iepToConstraints(student.plan) : {};
  return compileAssignment({
    assignment: { ...assignment, teacherConstraints: constraints },
    objectives: MIDDLE_6_OBJECTIVES,
    roster: [ilp],
    adaptationCatalog: SAMPLE_ADAPTATIONS,
    today: new Date('2026-09-01'),
  }).manifests[0]!;
};

describe('the grade-6 slice (middle school entry)', () => {
  it('the grade-6 library passes every gate, like the grade-3 and K packs', () => {
    const catalog = buildCatalog(MIDDLE_6_LIBRARY);
    expect(catalog.summary.allValid).toBe(true);
    expect(catalog.summary.objectives).toBe(3);
  });

  it('every grade-6 item carries its module tag', () => {
    for (const item of MIDDLE_6_LIBRARY.items) {
      expect(hasModuleTag(item.itemId), item.itemId).toBe(true);
    }
  });

  it('Mateo’s plan passes the plan gate and his channel rides into BOTH periods — different teachers, nothing re-entered', () => {
    expect(isPlanUsable(MATEO_PLAN, SAMPLE_ADAPTATIONS)).toBe(true);
    const math = compileFor(MIDDLE_6_PERIOD1, mateo);
    const ela = compileFor(MIDDLE_6_PERIOD4, mateo);
    for (const m of [math, ela]) {
      expect(m.appliedAdaptationIds).toContain('aac_symbol_response');
      expect(m.pattern).toBe('aac_supported');
      expect(m.objectiveModified).toBe(false);
    }
    expect(math.objective.objectiveId).toBe('M6.AR.01');
    expect(ela.objective.objectiveId).toBe('R6.CI.01');
  });

  it('the same period serves classmates differently — June core-with-extension, Kira language-supported', () => {
    const june = compileFor(MIDDLE_6_PERIOD1, MIDDLE_6_STUDENTS.find((s) => s.name === 'June')!);
    const kira = compileFor(MIDDLE_6_PERIOD1, MIDDLE_6_STUDENTS.find((s) => s.name === 'Kira')!);
    expect(june.pattern).toBe('core'); // secure across the board — extended within the objective
    expect(june.appliedAdaptationIds).not.toContain('vocabulary_preview');
    expect(kira.appliedAdaptationIds).toContain('vocabulary_preview');
    expect(kira.pattern).toBe('vocabulary_supported');
  });
});
