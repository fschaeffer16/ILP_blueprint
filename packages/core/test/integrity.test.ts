import { describe, expect, it } from 'vitest';
import {
  buildLockedContract,
  checkManifestIntegrity,
  compileAssignment,
  indexCatalog,
} from '../src/index.js';
import type { Assignment, DeliveryManifest } from '../src/index.js';
import {
  SAMPLE_ADAPTATIONS,
  SAMPLE_ASSIGNMENT,
  SAMPLE_OBJECTIVES,
  SAMPLE_ROSTER,
  OBJ_M3_NF_01,
} from '../src/fixtures/index.js';

const catalog = indexCatalog(SAMPLE_ADAPTATIONS);

describe('objective-integrity enforcement', () => {
  it('blocks the whole compile when a teacher forces a prohibited adaptation', () => {
    const tampered: Assignment = {
      ...SAMPLE_ASSIGNMENT,
      teacherConstraints: {
        ...SAMPLE_ASSIGNMENT.teacherConstraints,
        forceAdaptations: ['remove_explanation'], // prohibited by the objective
      },
    };
    const r = compileAssignment({
      assignment: tampered,
      objectives: SAMPLE_OBJECTIVES,
      roster: SAMPLE_ROSTER,
      adaptationCatalog: SAMPLE_ADAPTATIONS,
    });
    expect(r.status).toBe('blocked');
    expect(r.objectiveIntegrity).toBe('fail');
    expect(r.warnings.some((w) => w.code === 'FORCED_PROHIBITED_ADAPTATION')).toBe(true);
  });

  it('blocks when the objective is not published', () => {
    const draft = { ...OBJ_M3_NF_01, status: 'draft' as const };
    const r = compileAssignment({
      assignment: SAMPLE_ASSIGNMENT,
      objectives: [draft],
      roster: SAMPLE_ROSTER,
      adaptationCatalog: SAMPLE_ADAPTATIONS,
    });
    expect(r.status).toBe('blocked');
    expect(r.warnings.some((w) => w.code === 'OBJECTIVE_NOT_PUBLISHED')).toBe(true);
  });

  it('blocks when the referenced objective version does not exist', () => {
    const r = compileAssignment({
      assignment: {
        ...SAMPLE_ASSIGNMENT,
        objectiveVersionRefs: [{ objectiveId: 'M3.NF.01', version: 99 }],
      },
      objectives: SAMPLE_OBJECTIVES,
      roster: SAMPLE_ROSTER,
      adaptationCatalog: SAMPLE_ADAPTATIONS,
    });
    expect(r.status).toBe('blocked');
    expect(r.warnings.some((w) => w.code === 'OBJECTIVE_NOT_FOUND')).toBe(true);
  });

  it('detects a directly tampered locked contract', () => {
    const manifest: DeliveryManifest = {
      assignmentId: 'A',
      studentId: 'S-001',
      objective: { objectiveId: OBJ_M3_NF_01.objectiveId, version: OBJ_M3_NF_01.version },
      lockedContract: {
        ...buildLockedContract(OBJ_M3_NF_01),
        mastery: { threshold: 0.5, minimumEvidenceTypes: 1, transferRequired: false }, // eased!
      },
      appliedAdaptationIds: [],
      pattern: 'core',
      objectiveModified: false,
      rationale: [],
    };
    const violations = checkManifestIntegrity(OBJ_M3_NF_01, manifest, catalog);
    expect(violations.some((v) => v.code === 'LOCKED_CONTRACT_MISMATCH')).toBe(true);
    expect(violations.every((v) => v.severity === 'blocking')).toBe(true);
  });

  it('flags a prohibited adaptation present on a manifest', () => {
    const manifest: DeliveryManifest = {
      assignmentId: 'A',
      studentId: 'S-001',
      objective: { objectiveId: OBJ_M3_NF_01.objectiveId, version: OBJ_M3_NF_01.version },
      lockedContract: buildLockedContract(OBJ_M3_NF_01),
      appliedAdaptationIds: ['reduce_to_recognition_only'],
      pattern: 'core',
      objectiveModified: false,
      rationale: [],
    };
    const violations = checkManifestIntegrity(OBJ_M3_NF_01, manifest, catalog);
    expect(violations.some((v) => v.code === 'PROHIBITED_ADAPTATION_APPLIED')).toBe(true);
    expect(violations.some((v) => v.code === 'MODIFICATION_AS_ADAPTATION')).toBe(true);
  });

  it('flags an adaptation that is neither permitted nor teacher-forced', () => {
    const manifest: DeliveryManifest = {
      assignmentId: 'A',
      studentId: 'S-001',
      objective: { objectiveId: OBJ_M3_NF_01.objectiveId, version: OBJ_M3_NF_01.version },
      lockedContract: buildLockedContract(OBJ_M3_NF_01),
      appliedAdaptationIds: ['some_unlisted_adaptation'],
      pattern: 'core',
      objectiveModified: false,
      rationale: [],
    };
    const violations = checkManifestIntegrity(OBJ_M3_NF_01, manifest, catalog);
    expect(violations.some((v) => v.code === 'UNPERMITTED_ADAPTATION_APPLIED')).toBe(true);
  });
});
