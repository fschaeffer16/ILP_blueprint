import { describe, expect, it } from 'vitest';
import { compileAssignment } from '../src/index.js';
import type { DeliveryPattern } from '../src/index.js';
import {
  SAMPLE_ADAPTATIONS,
  SAMPLE_ASSIGNMENT,
  SAMPLE_OBJECTIVES,
  SAMPLE_ROSTER,
  OBJ_M3_NF_01,
} from '../src/fixtures/index.js';

function compile() {
  return compileAssignment({
    assignment: SAMPLE_ASSIGNMENT,
    objectives: SAMPLE_OBJECTIVES,
    roster: SAMPLE_ROSTER,
    adaptationCatalog: SAMPLE_ADAPTATIONS,
  });
}

describe('assign-once compiler', () => {
  it('produces one manifest per student and is ready for teacher review', () => {
    const r = compile();
    expect(r.status).toBe('ready_for_teacher_review');
    expect(r.objectiveIntegrity).toBe('pass');
    expect(r.manifests).toHaveLength(SAMPLE_ROSTER.length);
    expect(r.studentCount).toBe(SAMPLE_ROSTER.length);
  });

  it('individualizes: one assignment fans out into multiple delivery patterns', () => {
    const r = compile();
    const patterns = new Set(r.manifests.map((m) => m.pattern));
    // The synthetic class is built to hit at least these four distinct patterns.
    const expected: DeliveryPattern[] = [
      'core',
      'vocabulary_supported',
      'visual_first',
      'guided_practice',
      'advanced_transfer',
    ];
    for (const p of expected) expect(patterns.has(p)).toBe(true);
  });

  it('classifies each synthetic student into the expected pattern', () => {
    const r = compile();
    const byStudent = Object.fromEntries(r.manifests.map((m) => [m.studentId, m.pattern]));
    expect(byStudent['S-001']).toBe('core'); // Ava
    expect(byStudent['S-002']).toBe('vocabulary_supported'); // Ben
    expect(byStudent['S-003']).toBe('visual_first'); // Cara
    expect(byStudent['S-004']).toBe('guided_practice'); // Diego
    expect(byStudent['S-005']).toBe('advanced_transfer'); // Ella
    expect(byStudent['S-006']).toBe('guided_practice'); // Finn
  });

  it('LOCKS the objective, rigor and mastery identically across every student', () => {
    const r = compile();
    for (const m of r.manifests) {
      expect(m.lockedContract.objectiveId).toBe(OBJ_M3_NF_01.objectiveId);
      expect(m.lockedContract.version).toBe(OBJ_M3_NF_01.version);
      expect(m.lockedContract.studentOutcome).toBe(OBJ_M3_NF_01.studentOutcome);
      expect(m.lockedContract.mastery).toEqual(OBJ_M3_NF_01.mastery);
      expect([...m.lockedContract.essentialKnowledge].sort()).toEqual(
        [...OBJ_M3_NF_01.essentialKnowledge].sort(),
      );
      expect([...m.lockedContract.requiredReasoning].sort()).toEqual(
        [...OBJ_M3_NF_01.requiredReasoning].sort(),
      );
    }
    // No silent objective modification anywhere in the class.
    expect(r.objectiveModifications).toBe(0);
    expect(r.manifests.every((m) => !m.objectiveModified)).toBe(true);
  });

  it('never applies a prohibited adaptation', () => {
    const r = compile();
    const prohibited = new Set(OBJ_M3_NF_01.prohibitedAdaptations);
    for (const m of r.manifests) {
      for (const id of m.appliedAdaptationIds) expect(prohibited.has(id)).toBe(false);
    }
  });

  it('is deterministic: identical inputs produce identical output', () => {
    const a = compile();
    const b = compile();
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('pattern counts sum to the class size', () => {
    const r = compile();
    const total = Object.values(r.patternCounts).reduce((x, y) => x + y, 0);
    expect(total).toBe(SAMPLE_ROSTER.length);
  });
});
