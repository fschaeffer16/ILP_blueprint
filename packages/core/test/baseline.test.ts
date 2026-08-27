import { describe, expect, it } from 'vitest';
import { buildBaselineProfile, studentILPFromBaseline, compileAssignment } from '../src/index.js';
import { SAMPLE_BASELINE, SAMPLE_ASSIGNMENT, SAMPLE_OBJECTIVES, SAMPLE_ADAPTATIONS } from '../src/fixtures/index.js';

const build = (obs = SAMPLE_BASELINE) => buildBaselineProfile(obs, { gradeBand: '3', today: new Date('2026-09-06') });

describe('baseline processing screener', () => {
  it('uses evidence from multiple sessions', () => {
    const p = build();
    expect(p.sessionsUsed).toBe(3);
    expect(p.sufficientEvidence).toBe(true);
  });

  it('NEVER decides on a single session (no one test)', () => {
    const oneSession = SAMPLE_BASELINE.filter((o) => o.sessionId === 'BS-1');
    const p = buildBaselineProfile(oneSession, { gradeBand: '3', today: new Date('2026-09-06') });
    expect(p.sufficientEvidence).toBe(false);
    expect(p.indicators).toHaveLength(0);
  });

  it('surfaces an early reading (dyslexia-characteristic) indicator', () => {
    const p = build();
    const reading = p.indicators.find((i) => i.domain === 'phonological_awareness');
    expect(reading).toBeDefined();
    expect(reading!.signal === 'notable' || reading!.signal === 'emerging').toBe(true);
    expect(reading!.indicatorType).toContain('reading');
  });

  it('routes a notable signal to a specialist screening referral AND family notification', () => {
    const p = build();
    const notable = p.indicators.find((i) => i.signal === 'notable');
    expect(notable).toBeDefined();
    expect(notable!.nextSteps).toContain('specialist_screening_referral');
    expect(notable!.nextSteps).toContain('family_notification');
  });

  it('never produces a diagnosis — every indicator is screening + human review, and no diagnosis field exists', () => {
    const p = build();
    for (const i of p.indicators) {
      expect(i.isDiagnosis).toBe(false);
      expect(i.requiresHumanReview).toBe(true);
    }
    const json = JSON.stringify(p).toLowerCase();
    expect(json).not.toContain('"diagnosis"');
    expect(json).not.toContain('has dyslexia');
    expect(json).not.toContain('disabled');
  });

  it('does not label the whole child — a strength stays a strength', () => {
    const p = build();
    // Number sense is strong; it must not appear as an indicator.
    expect(p.indicators.some((i) => i.domain === 'number_sense')).toBe(false);
    const ns = p.domains.find((d) => d.domain === 'number_sense');
    expect(ns!.readiness).toBeGreaterThan(0.6);
  });

  it('seeds the learner model with support hypotheses (starting point, not a lower standard)', () => {
    const p = build();
    expect(p.ilpHypotheses.length).toBeGreaterThan(0);
    // Reading signals map to the compiler's language_access evidence domain.
    expect(p.ilpHypotheses.some((h) => h.domain === 'language_access')).toBe(true);
    expect(p.ilpHypotheses.every((h) => h.teacherConfirmed === false)).toBe(true);
  });

  it('produces a plain-language family notification when reading support will start', () => {
    const p = build();
    expect(p.familyNotification).toBeTruthy();
    expect(p.familyNotification!.toLowerCase()).toContain('not a diagnosis');
  });

  it('always carries the screening-not-diagnosis disclaimer', () => {
    expect(build().disclaimer.toLowerCase()).toContain('not a diagnosis');
  });

  it('wires straight into the compiler: baseline result drives auto-adapted delivery', () => {
    const profile = build();
    const student = studentILPFromBaseline(profile, 'Noah');
    // The bridge preserves the profile as the compiler's learner model.
    expect(student.hypotheses).toBe(profile.ilpHypotheses);
    expect(student.gradeBand).toBe(profile.gradeBand);

    const result = compileAssignment({
      assignment: SAMPLE_ASSIGNMENT,
      objectives: SAMPLE_OBJECTIVES,
      roster: [student],
      adaptationCatalog: SAMPLE_ADAPTATIONS,
      today: new Date('2026-09-06'),
    });
    const manifest = result.manifests[0]!;
    // A student with low baseline readiness must receive a support pattern, not bare 'core',
    // and the objective is never modified (rigor unchanged).
    expect(manifest.pattern).not.toBe('core');
    expect(manifest.appliedAdaptationIds.length).toBeGreaterThan(0);
    expect(manifest.objectiveModified).toBe(false);
  });
});
