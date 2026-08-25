/**
 * Runtime validation for ILP domain objects.
 *
 * Districts customize ILP by supplying their own objectives and adaptation
 * catalogs. That customization is only safe if every supplied object is validated
 * against the guardrails before it can reach a student. These zod schemas are that
 * gate; they correspond field-for-field to the JSON Schemas in `schemas/` and the
 * TypeScript types in `types.ts`.
 */

import { z } from 'zod';
import type {
  Adaptation,
  Assignment,
  ObjectiveVersion,
  SourceRecord,
  StudentILP,
} from './types.js';

const gradeBand = z.enum(['K', '1', '2', '3', '4', '5']);
const subject = z.enum([
  'mathematics',
  'reading',
  'writing',
  'science',
  'history_civics',
]);
const evidenceDomain = z.enum([
  'objective_mastery',
  'prerequisite_knowledge',
  'language_access',
  'mathematical_reasoning',
  'written_expression',
  'problem_solving',
  'assessment_conditions',
  'effective_supports',
]);
const adaptationClass = z.enum([
  'access',
  'scaffold',
  'difficulty',
  'objective_modification',
]);
const deliveryPattern = z.enum([
  'core',
  'vocabulary_supported',
  'visual_first',
  'guided_practice',
  'advanced_transfer',
]);

const unitInterval = z.number().min(0).max(1);

export const masteryRuleSchema = z.object({
  threshold: unitInterval,
  minimumEvidenceTypes: z.number().int().min(1),
  transferRequired: z.boolean(),
});

export const objectiveVersionSchema: z.ZodType<ObjectiveVersion> = z
  .object({
    objectiveId: z.string().min(1),
    version: z.number().int().min(1),
    status: z.enum(['draft', 'published', 'retired']),
    subject,
    gradeBand,
    standardRefs: z.array(z.string()),
    studentOutcome: z.string().min(1),
    essentialKnowledge: z.array(z.string()).min(1),
    requiredReasoning: z.array(z.string()).min(1),
    prerequisites: z.array(z.string()),
    mastery: masteryRuleSchema,
    permittedAdaptations: z.array(z.string()),
    prohibitedAdaptations: z.array(z.string()),
    misconceptions: z.array(z.string()),
    sourceIds: z.array(z.string()),
    remediationPatternIds: z.array(z.string()),
  })
  .strict()
  .superRefine((obj, ctx) => {
    // Guardrail: an adaptation cannot be both permitted and prohibited.
    const overlap = obj.permittedAdaptations.filter((id) =>
      obj.prohibitedAdaptations.includes(id),
    );
    if (overlap.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Adaptation(s) both permitted and prohibited: ${overlap.join(', ')}`,
        path: ['permittedAdaptations'],
      });
    }
  }) as z.ZodType<ObjectiveVersion>;

const adaptationTriggerSchema = z
  .object({
    domain: evidenceDomain,
    maxReadiness: unitInterval.optional(),
    minReadiness: unitInterval.optional(),
  })
  .strict()
  .refine(
    (t) => t.maxReadiness !== undefined || t.minReadiness !== undefined,
    { message: 'A trigger must set at least one of minReadiness / maxReadiness' },
  );

export const adaptationSchema: z.ZodType<Adaptation> = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    adaptationClass,
    permittedChange: z.string().min(1),
    prohibitedChange: z.string().min(1),
    triggers: z.array(adaptationTriggerSchema),
    fadeRule: z.string().nullable(),
    contributesToPattern: deliveryPattern,
    costWeight: z.number().min(0),
  })
  .strict() as z.ZodType<Adaptation>;

const ilpHypothesisSchema = z
  .object({
    domain: evidenceDomain,
    statement: z.string().min(1),
    readiness: unitInterval,
    confidence: unitInterval,
    evidenceIds: z.array(z.string()),
    reviewAt: z.string().min(1),
    effectiveSupports: z.array(z.string()).optional(),
    teacherConfirmed: z.boolean().optional(),
  })
  .strict();

export const studentIlpSchema: z.ZodType<StudentILP> = z
  .object({
    studentId: z.string().min(1),
    displayName: z.string().min(1),
    gradeBand,
    hypotheses: z.array(ilpHypothesisSchema),
  })
  .strict() as z.ZodType<StudentILP>;

const teacherConstraintsSchema = z
  .object({
    requireHandwriting: z.boolean().optional(),
    maxReadAloudFraction: unitInterval.optional(),
    forceAdaptations: z.array(z.string()).optional(),
    disableAdaptations: z.array(z.string()).optional(),
    objectiveModificationAuthorizedFor: z.array(z.string()).optional(),
  })
  .strict();

export const assignmentSchema: z.ZodType<Assignment> = z
  .object({
    assignmentId: z.string().min(1),
    classId: z.string().min(1),
    objectiveVersionRefs: z
      .array(z.object({ objectiveId: z.string().min(1), version: z.number().int().min(1) }).strict())
      .min(1),
    durationMinutes: z.number().int().positive(),
    deliveryMode: z.enum(['lesson_practice', 'assessment', 'remediation']),
    botMode: z.enum(['lesson', 'homework', 'quiz', 'exam', 'research']),
    collaboration: z
      .object({ enabled: z.boolean(), scope: z.enum(['none', 'class', 'district']) })
      .strict(),
    teacherConstraints: teacherConstraintsSchema,
  })
  .strict() as z.ZodType<Assignment>;

export const sourceRecordSchema: z.ZodType<SourceRecord> = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    citation: z.string().min(1),
    uri: z.string().optional(),
    tier: z.enum(['standards', 'primary', 'oer', 'licensed', 'pedagogy']),
    authorityType: z.enum([
      'standards_body',
      'government',
      'museum_library',
      'peer_reviewed',
      'open_courseware',
      'publisher',
    ]),
    license: z.enum(['public_domain', 'cc_by', 'cc_by_sa', 'cc_by_nc', 'licensed', 'all_rights_reserved']),
    reviewStatus: z.enum(['draft', 'in_review', 'approved', 'retired']),
    reviewedAt: z.string().optional(),
    reviewBy: z.string().optional(),
  })
  .strict() as z.ZodType<SourceRecord>;

/** Parse-or-throw helpers with ILP-branded error context. */
export function parseObjectiveVersion(input: unknown): ObjectiveVersion {
  return objectiveVersionSchema.parse(input);
}
export function parseSourceRecord(input: unknown): SourceRecord {
  return sourceRecordSchema.parse(input);
}
export function parseAdaptation(input: unknown): Adaptation {
  return adaptationSchema.parse(input);
}
export function parseStudentILP(input: unknown): StudentILP {
  return studentIlpSchema.parse(input);
}
export function parseAssignment(input: unknown): Assignment {
  return assignmentSchema.parse(input);
}
