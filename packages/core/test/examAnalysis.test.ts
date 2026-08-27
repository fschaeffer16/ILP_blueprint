import { describe, expect, it } from 'vitest';
import { analyzeExam, moduleTag, checkModuleTags } from '../src/index.js';
import { SAMPLE_EXAM, SAMPLE_EXAM_RESPONSES, SAMPLE_EXAM_ROSTER, SAMPLE_MODULES } from '../src/fixtures/index.js';

describe('module tag convention', () => {
  it('reads the _M# tag from a question id', () => {
    expect(moduleTag('EX-G3-U1-QM21_M2')).toBe('M2');
    expect(moduleTag('U1-Q07_M10')).toBe('M10');
    expect(moduleTag('no-tag-here')).toBeNull();
  });

  it('the integrity gate confirms every exam question is tagged', () => {
    expect(checkModuleTags(SAMPLE_EXAM).allTagged).toBe(true);
    // a question without a tag is caught
    const broken = { ...SAMPLE_EXAM, questions: [...SAMPLE_EXAM.questions, { questionId: 'Q-untagged', moduleId: 'M9' }] };
    expect(checkModuleTags(broken).allTagged).toBe(false);
    expect(checkModuleTags(broken).untagged).toContain('Q-untagged');
  });
});

describe('analyzeExam by module', () => {
  const a = analyzeExam(SAMPLE_EXAM, SAMPLE_EXAM_RESPONSES, SAMPLE_EXAM_ROSTER, SAMPLE_MODULES);

  it('summarizes the exam and scopes', () => {
    expect(a.questionCount).toBe(15); // 5 modules × 3
    expect(a.moduleCount).toBe(5);
    expect(a.studentCount).toBe(20); // 2 schools × 2 classes × 5
    expect(a.schoolScopes).toHaveLength(2);
    expect(a.classScopes).toHaveLength(4);
    expect(a.studentScopes).toHaveLength(20);
  });

  it('rolls up per module, worst-first, at district scope', () => {
    const pcts = a.districtScope.byModule.map((m) => m.correctPct);
    expect([...pcts].sort((x, y) => x - y)).toEqual(pcts);
    expect(a.districtScope.strugglingModules.map((m) => m.moduleId)).toContain('M2'); // compare fractions
  });

  it('is school-sensitive: Cypress is weaker on word problems (M5) than Riverbend', () => {
    const m5 = (label: string) =>
      a.schoolScopes.find((s) => s.label === label)!.byModule.find((m) => m.moduleId === 'M5')!.correctPct;
    expect(m5('Cypress Grove Elementary')).toBeLessThan(m5('Riverbend Elementary'));
  });

  it('auto-assigns remediation with a retake of only that module’s questions', () => {
    const withRemediation = a.studentScopes.filter((s) => s.remediation.length > 0);
    expect(withRemediation.length).toBeGreaterThan(0);
    const task = withRemediation[0]!.remediation[0]!;
    expect(task.status).toBe('auto_assigned');
    expect(task.reteachLessonId).toContain('reteach');
    // retake covers exactly the module's questions, each carrying the tag
    expect(task.retakeQuestionIds.length).toBe(3);
    for (const q of task.retakeQuestionIds) expect(moduleTag(q)).toBe(task.moduleId);
  });

  it('builds a grade-wide remediation queue', () => {
    expect(a.remediationQueue.length).toBe(a.studentScopes.reduce((n, s) => n + s.remediation.length, 0));
    for (const t of a.remediationQueue) expect(t.studentId).toBeTruthy();
  });

  it('is deterministic', () => {
    expect(JSON.stringify(analyzeExam(SAMPLE_EXAM, SAMPLE_EXAM_RESPONSES, SAMPLE_EXAM_ROSTER, SAMPLE_MODULES))).toBe(JSON.stringify(a));
  });
});
