/**
 * A sample published grade-3 mathematics objective for the pilot vertical slice.
 *
 * Mirrors the objective schema in the build spec (§31) and `schemas/objective.schema.json`.
 * `permittedAdaptations` references the sample catalog; `prohibitedAdaptations` locks
 * out the two rigor-changing adaptations so this objective always requires equivalent
 * mastery.
 */

import type { ObjectiveVersion } from '../types.js';

export const OBJ_M3_NF_01: ObjectiveVersion = {
  objectiveId: 'M3.NF.01',
  version: 1,
  status: 'published',
  subject: 'mathematics',
  gradeBand: '3',
  standardRefs: ['MA.3.FR.1.1'], // Florida B.E.S.T. — confirm exact code in district discovery
  studentOutcome: 'Explain and represent a fraction as equal parts of a whole.',
  essentialKnowledge: ['numerator', 'denominator', 'equal parts', 'whole/part relationship'],
  requiredReasoning: ['represent', 'explain', 'transfer'],
  prerequisites: ['equal partitioning', 'whole/part relationship'],
  mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
  permittedAdaptations: [
    'vocabulary_preview',
    'read_aloud',
    'visual_first_models',
    'worked_example_fade',
    'chunked_prompt',
    'advanced_transfer_case',
  ],
  prohibitedAdaptations: ['reduce_to_recognition_only', 'remove_explanation'],
  misconceptions: ['larger denominator means larger fraction'],
  sourceIds: ['SRC-001', 'SRC-002'],
  remediationPatternIds: ['REM-FRACTION-AREA', 'REM-FRACTION-SET'],
};

export const SAMPLE_OBJECTIVES: readonly ObjectiveVersion[] = [OBJ_M3_NF_01];
