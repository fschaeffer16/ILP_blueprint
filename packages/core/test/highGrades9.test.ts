import { describe, expect, it } from 'vitest';
import {
  analyzeExam,
  buildBaselineProfile,
  buildCatalog,
  compileAssignment,
  hasModuleTag,
  iepToConstraints,
  isPlanUsable,
  studentILPFromBaseline,
} from '../src/index.js';
import {
  ALG1_ASSIGNMENT,
  ALG1_EOC_CHECK,
  ALG1_EOC_RESPONSES,
  ALG1_EOC_ROSTER,
  ALG1_MODULES,
  DRE_PLAN,
  HIGH_9_LIBRARY,
  HIGH_9_OBJECTIVES,
  HIGH_9_STUDENTS,
  SAMPLE_ADAPTATIONS,
} from '../src/fixtures/index.js';

const compileFor = (student: (typeof HIGH_9_STUDENTS)[number]) => {
  const profile = buildBaselineProfile(student.baseline, { gradeBand: '9', today: new Date('2026-09-01') });
  const ilp = studentILPFromBaseline(profile, student.name);
  const constraints = student.plan ? iepToConstraints(student.plan) : {};
  return compileAssignment({
    assignment: { ...ALG1_ASSIGNMENT, teacherConstraints: constraints },
    objectives: HIGH_9_OBJECTIVES,
    roster: [ilp],
    adaptationCatalog: SAMPLE_ADAPTATIONS,
    today: new Date('2026-09-01'),
  }).manifests[0]!;
};

describe('the grade-9 slice (Algebra 1 and the EOC)', () => {
  it('the grade-9 library passes every gate, like the 3/K/6 packs', () => {
    const catalog = buildCatalog(HIGH_9_LIBRARY);
    expect(catalog.summary.allValid).toBe(true);
    expect(catalog.summary.objectives).toBe(3);
  });

  it('every item and every EOC-practice question carries a module tag', () => {
    for (const item of HIGH_9_LIBRARY.items) expect(hasModuleTag(item.itemId), item.itemId).toBe(true);
    for (const question of ALG1_EOC_CHECK.questions) {
      expect(hasModuleTag(question.questionId), question.questionId).toBe(true);
    }
  });

  it('Dre’s speech-to-text channel rides into the course automatically, standard unchanged', () => {
    expect(isPlanUsable(DRE_PLAN, SAMPLE_ADAPTATIONS)).toBe(true);
    const dre = compileFor(HIGH_9_STUDENTS.find((s) => s.name === 'Dre')!);
    expect(dre.appliedAdaptationIds).toContain('speech_to_text_response');
    expect(dre.objectiveModified).toBe(false);
  });

  it('the EOC practice check finds the weak module class-wide, worst first', () => {
    const analysis = analyzeExam(ALG1_EOC_CHECK, ALG1_EOC_RESPONSES, ALG1_EOC_ROSTER, ALG1_MODULES);
    const cls = analysis.classScopes[0]!;
    const byModule = Object.fromEntries(cls.byModule.map((m) => [m.moduleId, m]));
    expect(byModule.M1!.struggling).toBe(false);
    expect(byModule.M2!.struggling).toBe(true); // graphs under the 70% pass mark
    expect(cls.strugglingModules[0]!.moduleId).toBe('M2');
  });

  it('remediation auto-assigns the reteach + module retake for the students below the mark', () => {
    const analysis = analyzeExam(ALG1_EOC_CHECK, ALG1_EOC_RESPONSES, ALG1_EOC_ROSTER, ALG1_MODULES);
    const lena = analysis.studentScopes.find((s) => s.studentId === 'H-LENA')!;
    const moduleIds = lena.remediation.map((r) => r.moduleId).sort();
    expect(moduleIds).toEqual(['M1', 'M2']); // below the mark on both
    for (const r of lena.remediation) {
      expect(r.status).toBe('auto_assigned');
      expect(r.reteachLessonId).toMatch(/^LP-A1/);
      expect(r.retakeQuestionIds.length).toBe(4); // just that module's questions
    }
    const nova = analysis.studentScopes.find((s) => s.studentId === 'H-NOVA')!;
    expect(nova.remediation).toHaveLength(0);
  });
});
