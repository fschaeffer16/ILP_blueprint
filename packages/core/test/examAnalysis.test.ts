import { describe, expect, it } from 'vitest';
import { analyzeExam } from '../src/index.js';
import { SAMPLE_EXAM, SAMPLE_EXAM_RESPONSES, SAMPLE_EXAM_ROSTER } from '../src/fixtures/index.js';

describe('analyzeExam by Learning Objective', () => {
  const a = analyzeExam(SAMPLE_EXAM, SAMPLE_EXAM_RESPONSES, SAMPLE_EXAM_ROSTER);

  it('summarizes the exam shape', () => {
    expect(a.questionCount).toBe(15); // 5 objectives × 3 questions
    expect(a.objectiveCount).toBe(5);
    expect(a.studentCount).toBe(10); // 2 classes × 5 students
    expect(a.classScopes).toHaveLength(2);
    expect(a.studentScopes).toHaveLength(10);
  });

  it('rolls every scope up per objective, worst-first', () => {
    const pcts = a.gradeScope.byObjective.map((o) => o.correctPct);
    // sorted ascending (worst first)
    expect([...pcts].sort((x, y) => x - y)).toEqual(pcts);
    // each objective row covers 3 distinct questions
    for (const o of a.gradeScope.byObjective) expect(o.questions).toBe(3);
  });

  it('surfaces the grade-wide weak objective (comparing fractions)', () => {
    const weak = a.gradeScope.strugglingObjectives.map((o) => o.objectiveId);
    expect(weak).toContain('M3.NF.02');
    // the strong objective is not flagged
    const nf01 = a.gradeScope.byObjective.find((o) => o.objectiveId === 'M3.NF.01')!;
    expect(nf01.struggling).toBe(false);
  });

  it('is class-sensitive: 3B struggles more on word problems than 3A', () => {
    const arIn = (label: string) =>
      a.classScopes.find((c) => c.label === label)!.byObjective.find((o) => o.objectiveId === 'M3.AR.12')!.correctPct;
    expect(arIn('3B · Riverbend')).toBeLessThan(arIn('3A · Riverbend'));
  });

  it('is deterministic', () => {
    expect(JSON.stringify(analyzeExam(SAMPLE_EXAM, SAMPLE_EXAM_RESPONSES, SAMPLE_EXAM_ROSTER))).toBe(JSON.stringify(a));
  });
});
