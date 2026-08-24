import { describe, expect, it } from 'vitest';
import { parseObjectiveVersion, parseAdaptation } from '../src/index.js';
import { OBJ_M3_NF_01, SAMPLE_ADAPTATIONS } from '../src/fixtures/index.js';

describe('runtime schema guardrails', () => {
  it('accepts the sample objective and adaptations', () => {
    expect(() => parseObjectiveVersion(OBJ_M3_NF_01)).not.toThrow();
    for (const a of SAMPLE_ADAPTATIONS) expect(() => parseAdaptation(a)).not.toThrow();
  });

  it('rejects an objective that both permits and prohibits the same adaptation', () => {
    const bad = {
      ...OBJ_M3_NF_01,
      permittedAdaptations: [...OBJ_M3_NF_01.permittedAdaptations, 'remove_explanation'],
      // 'remove_explanation' is also in prohibitedAdaptations
    };
    expect(() => parseObjectiveVersion(bad)).toThrow();
  });

  it('rejects an objective with an empty required-reasoning list', () => {
    const bad = { ...OBJ_M3_NF_01, requiredReasoning: [] };
    expect(() => parseObjectiveVersion(bad)).toThrow();
  });

  it('rejects a mastery threshold outside 0..1', () => {
    const bad = { ...OBJ_M3_NF_01, mastery: { ...OBJ_M3_NF_01.mastery, threshold: 1.5 } };
    expect(() => parseObjectiveVersion(bad)).toThrow();
  });

  it('rejects an adaptation trigger with neither min nor max readiness', () => {
    const bad = {
      ...SAMPLE_ADAPTATIONS[0]!,
      triggers: [{ domain: 'language_access' }],
    };
    expect(() => parseAdaptation(bad)).toThrow();
  });
});
