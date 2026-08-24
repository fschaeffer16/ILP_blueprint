import { describe, expect, it } from 'vitest';
import { compileAssignment, selectAdaptations, indexCatalog } from '../src/index.js';
import type { Assignment, ObjectiveVersion, StudentILP } from '../src/index.js';
import { SAMPLE_ADAPTATIONS, OBJ_M3_NF_01 } from '../src/fixtures/index.js';

const catalog = indexCatalog(SAMPLE_ADAPTATIONS);
const REVIEW = '2099-06-01';

/** An objective whose permitted supports cannot reach a very-low-readiness student. */
const THIN_OBJECTIVE: ObjectiveVersion = {
  ...OBJ_M3_NF_01,
  objectiveId: 'M3.NF.THIN',
  permittedAdaptations: ['advanced_transfer_case'], // no access/scaffold supports
  prohibitedAdaptations: ['reduce_to_recognition_only', 'remove_explanation'],
};

const STRUGGLING: StudentILP = {
  studentId: 'S-LOW',
  displayName: 'Low',
  gradeBand: '3',
  hypotheses: [
    {
      domain: 'prerequisite_knowledge',
      statement: 'Far below prerequisite level.',
      readiness: 0.1,
      confidence: 0.8,
      evidenceIds: ['EV'],
      reviewAt: REVIEW,
    },
    {
      domain: 'objective_mastery',
      statement: 'Cannot yet access the objective.',
      readiness: 0.1,
      confidence: 0.8,
      evidenceIds: ['EV'],
      reviewAt: REVIEW,
    },
  ],
};

describe('adaptation engine — objective modification (P3)', () => {
  it('never modifies the objective automatically; it only suggests and defers to the teacher', () => {
    const sel = selectAdaptations(THIN_OBJECTIVE, STRUGGLING, catalog);
    expect(sel.objectiveModified).toBe(false);
    expect(sel.warnings.some((w) => w.code === 'OBJECTIVE_MODIFICATION_SUGGESTED')).toBe(true);
  });

  it('applies an objective modification ONLY with explicit teacher authorization', () => {
    const sel = selectAdaptations(THIN_OBJECTIVE, STRUGGLING, catalog, {
      objectiveModificationAuthorizedFor: ['S-LOW'],
    });
    expect(sel.objectiveModified).toBe(true);
    expect(sel.warnings.some((w) => w.code === 'OBJECTIVE_MODIFIED')).toBe(true);
  });

  it('a suggested (unauthorized) modification does not block the class', () => {
    const assignment: Assignment = {
      assignmentId: 'A',
      classId: 'C',
      objectiveVersionRefs: [{ objectiveId: 'M3.NF.THIN', version: 1 }],
      durationMinutes: 30,
      deliveryMode: 'lesson_practice',
      botMode: 'lesson',
      collaboration: { enabled: false, scope: 'none' },
      teacherConstraints: {},
    };
    const r = compileAssignment({
      assignment,
      objectives: [THIN_OBJECTIVE],
      roster: [STRUGGLING],
      adaptationCatalog: SAMPLE_ADAPTATIONS,
    });
    // Warning surfaces, but a mere suggestion is not an integrity failure.
    expect(r.status).toBe('ready_for_teacher_review');
    expect(r.objectiveIntegrity).toBe('pass');
    expect(r.objectiveModifications).toBe(0);
  });
});

describe('adaptation engine — support selection', () => {
  it('prefers a previously effective support for the student', () => {
    const student: StudentILP = {
      studentId: 'S-EFF',
      displayName: 'Eff',
      gradeBand: '3',
      hypotheses: [
        {
          domain: 'language_access',
          statement: 'reads below level',
          readiness: 0.35,
          confidence: 0.8,
          evidenceIds: ['EV'],
          reviewAt: REVIEW,
          effectiveSupports: ['read_aloud'],
        },
      ],
    };
    const sel = selectAdaptations(OBJ_M3_NF_01, student, catalog);
    expect(sel.selected.map((a) => a.id)).toContain('read_aloud');
    expect(sel.pattern).toBe('vocabulary_supported');
  });

  it('ignores expired hypotheses when selecting supports', () => {
    const student: StudentILP = {
      studentId: 'S-EXP',
      displayName: 'Exp',
      gradeBand: '3',
      hypotheses: [
        {
          domain: 'language_access',
          statement: 'stale hypothesis',
          readiness: 0.2,
          confidence: 0.9,
          evidenceIds: ['EV'],
          reviewAt: '2000-01-01', // expired
        },
      ],
    };
    const sel = selectAdaptations(OBJ_M3_NF_01, student, catalog, {}, undefined, new Date('2026-08-24'));
    expect(sel.selected).toHaveLength(0);
    expect(sel.pattern).toBe('core');
  });

  it('does not stack two supports that produce the same delivery pattern', () => {
    // Ben-like: both vocabulary_preview and read_aloud trigger, but they share a pattern.
    const student: StudentILP = {
      studentId: 'S-VOC',
      displayName: 'Voc',
      gradeBand: '3',
      hypotheses: [
        {
          domain: 'language_access',
          statement: 'reads well below level',
          readiness: 0.25,
          confidence: 0.9,
          evidenceIds: ['EV'],
          reviewAt: REVIEW,
        },
      ],
    };
    const sel = selectAdaptations(OBJ_M3_NF_01, student, catalog);
    const patterns = sel.selected.map((a) => a.contributesToPattern);
    expect(new Set(patterns).size).toBe(patterns.length); // no duplicate patterns
  });
});
