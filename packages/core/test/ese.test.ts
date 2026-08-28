import { describe, expect, it } from 'vitest';
import { buildBaselineProfile, studentILPFromBaseline, compileAssignment, iepToConstraints } from '../src/index.js';
import { ESE_SHOWCASE_STUDENTS, SAMPLE_ASSIGNMENT, SAMPLE_OBJECTIVES, SAMPLE_ADAPTATIONS } from '../src/fixtures/index.js';

const compileFor = (name: string) => {
  const st = ESE_SHOWCASE_STUDENTS.find((s) => s.name === name)!;
  const profile = buildBaselineProfile(st.baseline, { gradeBand: '3', today: new Date('2026-09-08') });
  const ilp = studentILPFromBaseline(profile, st.name);
  const result = compileAssignment({
    assignment: { ...SAMPLE_ASSIGNMENT, teacherConstraints: st.plan ? iepToConstraints(st.plan) : {} },
    objectives: SAMPLE_OBJECTIVES,
    roster: [ilp],
    adaptationCatalog: SAMPLE_ADAPTATIONS,
    today: new Date('2026-09-08'),
  });
  return { manifest: result.manifests[0]!, warnings: result.warnings };
};

describe('ESE: the IEP as a live input (meet them where they are)', () => {
  it('a nonverbal AAC user demonstrates the SAME objective through their channel', () => {
    const { manifest } = compileFor('Leo');
    expect(manifest.pattern).toBe('aac_supported');
    expect(manifest.appliedAdaptationIds).toContain('aac_symbol_response');
    expect(manifest.objectiveModified).toBe(false);
  });

  it('the IEP knows what a score cannot: a Deaf student never gets read-aloud', () => {
    const { manifest } = compileFor('Jonah');
    expect(manifest.appliedAdaptationIds).toContain('captions_visual_supports');
    expect(manifest.appliedAdaptationIds).not.toContain('read_aloud');
    expect(manifest.pattern).toBe('visual_first');
  });

  it('a twice-exceptional student gets the challenge AND the channel at once', () => {
    const { manifest } = compileFor('Elena');
    expect(manifest.appliedAdaptationIds).toContain('advanced_transfer_case');
    expect(manifest.appliedAdaptationIds).toContain('speech_to_text_response');
    expect(manifest.objectiveModified).toBe(false);
  });

  it('access channels are IEP-declared, never inferred from a score', () => {
    for (const id of ['aac_symbol_response', 'speech_to_text_response', 'captions_visual_supports']) {
      const a = SAMPLE_ADAPTATIONS.find((x) => x.id === id)!;
      expect(a.triggers).toHaveLength(0); // no auto-trigger — only a plan applies these
      expect(a.adaptationClass).toBe('access');
      expect(a.fadeRule).toBeNull(); // you never fade a child's wheelchair
    }
  });

  it('every accommodation-lane student keeps the standard unchanged, with no blocking warnings', () => {
    for (const st of ESE_SHOWCASE_STUDENTS) {
      const { manifest, warnings } = compileFor(st.name);
      expect(manifest.objective.objectiveId).toBe(SAMPLE_ASSIGNMENT.objectiveVersionRefs[0]!.objectiveId);
      expect(manifest.objectiveModified).toBe(false);
      expect(warnings.filter((w) => w.severity === 'blocking')).toHaveLength(0);
    }
  });

  it('an IEP exclusion always beats a force (safety of the merge)', () => {
    const merged = iepToConstraints(
      { studentId: 'X', planType: 'iep', accommodations: [{ adaptationId: 'read_aloud', planText: 't', kind: 'support' }], excludedAdaptations: ['read_aloud'] },
    );
    expect(merged.forceAdaptations).not.toContain('read_aloud');
    expect(merged.disableAdaptations).toContain('read_aloud');
  });
});
