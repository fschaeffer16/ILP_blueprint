import { describe, expect, it } from 'vitest';
import { iepToConstraints, isPlanUsable, validateIEPPlan, type IEPPlan } from '../src/index.js';
import { ESE_SHOWCASE_STUDENTS, SAMPLE_ADAPTATIONS } from '../src/fixtures/index.js';

const base: IEPPlan = {
  studentId: 'S-T',
  planType: 'iep',
  accommodations: [
    { adaptationId: 'aac_symbol_response', planText: 'Responds through AAC symbols.', kind: 'access' },
  ],
};

describe('the IEP plan gate (IEP build step 2)', () => {
  it('every showcase plan passes the gate', () => {
    for (const st of ESE_SHOWCASE_STUDENTS) {
      if (!st.plan) continue;
      expect(isPlanUsable(st.plan, SAMPLE_ADAPTATIONS), st.name).toBe(true);
    }
  });

  it('an accommodation outside the catalog blocks', () => {
    const plan: IEPPlan = {
      ...base,
      accommodations: [{ adaptationId: 'not_a_thing', planText: 'x', kind: 'support' }],
    };
    const f = validateIEPPlan(plan, SAMPLE_ADAPTATIONS);
    expect(f.some((x) => x.code === 'UNKNOWN_ADAPTATION' && x.severity === 'blocking')).toBe(true);
    expect(isPlanUsable(plan, SAMPLE_ADAPTATIONS)).toBe(false);
  });

  it('a plan can never force an objective modification through the accommodation lane', () => {
    const plan: IEPPlan = {
      ...base,
      accommodations: [
        { adaptationId: 'reduce_to_recognition_only', planText: 'Recognition tasks only.', kind: 'support' },
      ],
    };
    const f = validateIEPPlan(plan, SAMPLE_ADAPTATIONS);
    expect(f.some((x) => x.code === 'MODIFICATION_IN_ACCOMMODATION_LANE' && x.severity === 'blocking')).toBe(true);
  });

  it('an accommodation without the plan’s wording blocks — the text is the audit trail', () => {
    const plan: IEPPlan = {
      ...base,
      accommodations: [{ adaptationId: 'chunked_prompt', planText: '   ', kind: 'support' }],
    };
    expect(
      validateIEPPlan(plan, SAMPLE_ADAPTATIONS).some((x) => x.code === 'EMPTY_PLAN_TEXT' && x.severity === 'blocking'),
    ).toBe(true);
  });

  it('calling a fading scaffold an access channel is surfaced, not silently accepted', () => {
    const plan: IEPPlan = {
      ...base,
      accommodations: [{ adaptationId: 'read_aloud', planText: 'Read-aloud always.', kind: 'access' }],
    };
    const f = validateIEPPlan(plan, SAMPLE_ADAPTATIONS);
    expect(f.some((x) => x.code === 'ACCESS_WOULD_FADE' && x.severity === 'warning')).toBe(true);
    expect(isPlanUsable(plan, SAMPLE_ADAPTATIONS)).toBe(true); // warning, not a block
  });

  it('a force+exclude conflict warns, and the exclusion wins in the constraints', () => {
    const plan: IEPPlan = { ...base, excludedAdaptations: ['aac_symbol_response'] };
    const f = validateIEPPlan(plan, SAMPLE_ADAPTATIONS);
    expect(f.some((x) => x.code === 'FORCE_EXCLUDE_CONFLICT')).toBe(true);
    const c = iepToConstraints(plan);
    expect(c.forceAdaptations).not.toContain('aac_symbol_response');
    expect(c.disableAdaptations).toContain('aac_symbol_response');
  });
});
