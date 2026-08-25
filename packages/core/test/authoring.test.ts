import { describe, expect, it } from 'vitest';
import { validateObjectiveDraft } from '../src/index.js';
import type { ObjectiveVersion } from '../src/index.js';
import { OBJ_M3_NF_01, SAMPLE_ADAPTATIONS, SAMPLE_SOURCES } from '../src/fixtures/index.js';

const ctx = { catalog: SAMPLE_ADAPTATIONS, approvedSources: SAMPLE_SOURCES };
const codes = (r: { issues: readonly { code: string }[] }) => r.issues.map((i) => i.code);

describe('objective authoring gate', () => {
  it('passes a well-formed objective mapped to a standard with approved sources', () => {
    const r = validateObjectiveDraft(OBJ_M3_NF_01, ctx);
    expect(r.ok).toBe(true);
    expect(r.issues.filter((i) => i.severity === 'blocking')).toHaveLength(0);
  });

  it('blocks an objective with no standard reference', () => {
    const draft: ObjectiveVersion = { ...OBJ_M3_NF_01, standardRefs: [] };
    const r = validateObjectiveDraft(draft, ctx);
    expect(r.ok).toBe(false);
    expect(codes(r)).toContain('STANDARD_UNMAPPED');
  });

  it('blocks an objective with no cited source', () => {
    const draft: ObjectiveVersion = { ...OBJ_M3_NF_01, sourceIds: [] };
    const r = validateObjectiveDraft(draft, ctx);
    expect(r.ok).toBe(false);
    expect(codes(r)).toContain('NO_SOURCE');
  });

  it('blocks a source that is not yet approved', () => {
    const draft: ObjectiveVersion = { ...OBJ_M3_NF_01, sourceIds: ['SRC-DRAFT'] };
    const r = validateObjectiveDraft(draft, ctx);
    expect(r.ok).toBe(false);
    expect(codes(r)).toContain('SOURCE_NOT_APPROVED');
  });

  it('blocks a source that is not in the vetted library', () => {
    const draft: ObjectiveVersion = { ...OBJ_M3_NF_01, sourceIds: ['SRC-UNKNOWN'] };
    const r = validateObjectiveDraft(draft, ctx);
    expect(codes(r)).toContain('SOURCE_NOT_FOUND');
  });

  it('blocks permitting a rigor-changing (objective_modification) adaptation', () => {
    const draft: ObjectiveVersion = {
      ...OBJ_M3_NF_01,
      permittedAdaptations: [...OBJ_M3_NF_01.permittedAdaptations, 'reduce_to_recognition_only'],
      prohibitedAdaptations: ['remove_explanation'], // avoid the permit/prohibit overlap schema error
    };
    const r = validateObjectiveDraft(draft, ctx);
    expect(r.ok).toBe(false);
    expect(codes(r)).toContain('RIGOR_ADAPTATION_PERMITTED');
  });

  it('returns field-level schema errors for a malformed draft (does not throw)', () => {
    const r = validateObjectiveDraft({ objectiveId: 'X' }, ctx);
    expect(r.ok).toBe(false);
    expect(codes(r)).toContain('SCHEMA');
  });

  it('warns (but does not block) when misconceptions are missing', () => {
    const draft: ObjectiveVersion = { ...OBJ_M3_NF_01, misconceptions: [] };
    const r = validateObjectiveDraft(draft, ctx);
    expect(r.ok).toBe(true);
    expect(r.issues.some((i) => i.code === 'NO_MISCONCEPTIONS' && i.severity === 'warning')).toBe(true);
  });
});
