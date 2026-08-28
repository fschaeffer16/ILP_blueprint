import { describe, expect, it } from 'vitest';
import { buildCatalog, buildBaselineProfile, studentILPFromBaseline, compileAssignment } from '../src/index.js';
import { EARLY_K_LIBRARY, EARLY_K_OBJECTIVES, EARLY_K_ASSIGNMENT, EARLY_K_STUDENTS, SAMPLE_ADAPTATIONS } from '../src/fixtures/index.js';

describe('Kindergarten content pack', () => {
  it('passes every gate, like the grade-3 pack', () => {
    const cat = buildCatalog(EARLY_K_LIBRARY);
    const bad = cat.entries.filter((e) => !e.ok);
    expect(bad.map((e) => `${e.objectiveId}: ${e.issues.join(', ')}`)).toEqual([]);
    expect(cat.summary.allValid).toBe(true);
    expect(cat.summary.objectives).toBe(3);
    for (const o of EARLY_K_OBJECTIVES) expect(o.gradeBand).toBe('K');
  });
});

describe('Kindergarten "meet them where they are" showcase', () => {
  const patternFor = (baseline: (typeof EARLY_K_STUDENTS)[number]['baseline']) => {
    const profile = buildBaselineProfile(baseline, { gradeBand: 'K', today: new Date('2026-09-01') });
    const ilp = studentILPFromBaseline(profile);
    const result = compileAssignment({
      assignment: EARLY_K_ASSIGNMENT,
      objectives: EARLY_K_OBJECTIVES,
      roster: [ilp],
      adaptationCatalog: SAMPLE_ADAPTATIONS,
      today: new Date('2026-09-01'),
    });
    return result.manifests[0]!;
  };

  it('serves the same objective four different ways from four baselines', () => {
    const byName = new Map(EARLY_K_STUDENTS.map((s) => [s.name, patternFor(s.baseline)]));
    expect(byName.get('Ada')!.pattern).toBe('core');
    expect(byName.get('Bodhi')!.pattern).toBe('visual_first');
    expect(byName.get('Cai')!.pattern).toBe('vocabulary_supported');
    expect(byName.get('Dev')!.pattern).toBe('guided_practice');
    // Four distinct deliveries — the range a real K class needs.
    expect(new Set([...byName.values()].map((m) => m.pattern)).size).toBe(4);
  });

  it('never lowers the standard: the objective is the same and unmodified for every child', () => {
    for (const s of EARLY_K_STUDENTS) {
      const m = patternFor(s.baseline);
      expect(m.objective.objectiveId).toBe('MK.NSO.01');
      expect(m.objectiveModified).toBe(false);
    }
  });
});
