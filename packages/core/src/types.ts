/**
 * ILP core domain types.
 *
 * These types are the contract shared by curriculum authoring, the assignment
 * compiler, assessment, remediation and analytics. They intentionally mirror the
 * blueprint's core data model (see `docs/data-model.md`) and the JSON Schemas in
 * `schemas/`. Runtime validation lives in `schema.ts`; these are the compile-time
 * shapes the rest of the package programs against.
 *
 * Design rules encoded here (from the non-negotiable principles):
 *  - P2 Objective integrity: every adaptation references an objective and can never
 *    change its locked fields.
 *  - P3 Adaptive route, visible rigor: only `objective_modification` changes rigor,
 *    and it always requires explicit teacher authorization.
 *  - P1 Teacher authority: the compiler produces a *proposal* for teacher review;
 *    nothing here releases anything to students on its own.
 */

// ---------------------------------------------------------------------------
// Objective graph
// ---------------------------------------------------------------------------

/** Elementary grade bands used by the first build. */
export type GradeBand = 'K' | '1' | '2' | '3' | '4' | '5';

export type Subject =
  | 'mathematics'
  | 'reading'
  | 'writing'
  | 'science'
  | 'history_civics';

/**
 * The four adaptation classifications from the ILP learner model (blueprint §6).
 * Only `objective_modification` is allowed to change the expected learning; it can
 * never be applied automatically.
 */
export type AdaptationClass =
  | 'access' // objective and rigor unchanged
  | 'scaffold' // temporary support intended to develop independence
  | 'difficulty' // challenge changes *within* the objective based on readiness
  | 'objective_modification'; // expected learning changes — teacher-authorized only

/** Named delivery patterns the compiler classifies each student manifest into. */
export type DeliveryPattern =
  | 'core'
  | 'vocabulary_supported'
  | 'visual_first'
  | 'guided_practice'
  | 'aac_supported' // AAC / alternate response channel (symbol, switch, speech-to-text)
  | 'advanced_transfer';

export interface MasteryRule {
  /** Fraction of evidence required to count as mastery, e.g. 0.8. */
  readonly threshold: number;
  /** How many distinct evidence types are required (e.g. correctness + explanation). */
  readonly minimumEvidenceTypes: number;
  /** Whether transfer to an unfamiliar application is required for mastery. */
  readonly transferRequired: boolean;
}

/**
 * A versioned, immutable-after-publication learning objective. This is the contract
 * among curriculum, lesson generation, assessment, remediation and analytics.
 */
export interface ObjectiveVersion {
  readonly objectiveId: string; // e.g. "M3.NF.01"
  readonly version: number;
  readonly status: 'draft' | 'published' | 'retired';
  readonly subject: Subject;
  readonly gradeBand: GradeBand;
  /** Jurisdictional standard references, e.g. Florida B.E.S.T. benchmark codes. */
  readonly standardRefs: readonly string[];
  /** Plain-language "the student will…" statement. */
  readonly studentOutcome: string;
  /** LOCKED: essential knowledge that every version must require. */
  readonly essentialKnowledge: readonly string[];
  /** LOCKED: the reasoning demands (e.g. represent, explain, transfer). */
  readonly requiredReasoning: readonly string[];
  readonly prerequisites: readonly string[];
  /** LOCKED: the mastery contract. */
  readonly mastery: MasteryRule;
  /** Adaptation ids the district/curriculum team has approved for this objective. */
  readonly permittedAdaptations: readonly string[];
  /** Adaptation ids that would compromise the objective and must never be applied. */
  readonly prohibitedAdaptations: readonly string[];
  readonly misconceptions: readonly string[];
  readonly sourceIds: readonly string[];
  readonly remediationPatternIds: readonly string[];
}

/** The fields the compiler must never allow an adaptation to alter. */
export const LOCKED_OBJECTIVE_FIELDS = [
  'objectiveId',
  'version',
  'studentOutcome',
  'essentialKnowledge',
  'requiredReasoning',
  'mastery',
] as const;

// ---------------------------------------------------------------------------
// Adaptation catalog
// ---------------------------------------------------------------------------

/**
 * A reusable, district-customizable adaptation. Adaptations are the vocabulary of
 * individualization. A district can add, disable or retune adaptations without
 * touching the objective contract — that is the "customizable by any district"
 * requirement, kept inside the guardrails because every adaptation declares what it
 * may and may not change.
 */
export interface Adaptation {
  readonly id: string; // e.g. "vocabulary_preview"
  readonly label: string;
  readonly adaptationClass: AdaptationClass;
  /** Human-readable description of the concrete change to delivery. */
  readonly permittedChange: string;
  /** What this adaptation is explicitly forbidden from doing. */
  readonly prohibitedChange: string;
  /** ILP evidence signals that make this adaptation appropriate. */
  readonly triggers: readonly AdaptationTrigger[];
  /** When/whether the scaffold fades. `null` for non-fading access adaptations. */
  readonly fadeRule: string | null;
  /** The delivery pattern this adaptation contributes to when selected. */
  readonly contributesToPattern: DeliveryPattern;
  /** Relative cost hint (0 = free/rendering change, higher = more content/AI cost). */
  readonly costWeight: number;
}

/** A signal, drawn from a student's ILP, that justifies an adaptation. */
export interface AdaptationTrigger {
  readonly domain: EvidenceDomain;
  /** The adaptation applies when the student's readiness in `domain` is at or below this. */
  readonly maxReadiness?: number;
  /** …or at or above this (used for enrichment / advanced transfer). */
  readonly minReadiness?: number;
}

// ---------------------------------------------------------------------------
// Learner model (ILP)
// ---------------------------------------------------------------------------

export type EvidenceDomain =
  | 'objective_mastery'
  | 'prerequisite_knowledge'
  | 'language_access'
  | 'mathematical_reasoning'
  | 'written_expression'
  | 'problem_solving'
  | 'assessment_conditions'
  | 'effective_supports';

/**
 * A working hypothesis about a student in a given evidence domain. It is not a
 * diagnosis or a permanent label (blueprint §6 / §19). Every hypothesis carries its
 * evidence, confidence and review date, and a teacher can correct or expire it.
 */
export interface ILPHypothesis {
  readonly domain: EvidenceDomain;
  /** Plain-language statement, e.g. "reads below grade level; benefits from read-aloud". */
  readonly statement: string;
  /** 0..1 demonstrated readiness in this domain. Lower = more support warranted. */
  readonly readiness: number;
  /** 0..1 confidence in the hypothesis itself. */
  readonly confidence: number;
  /** Ids of the evidence events supporting this hypothesis. */
  readonly evidenceIds: readonly string[];
  /** ISO date after which the hypothesis must be re-reviewed. */
  readonly reviewAt: string;
  /** Adaptation ids that have previously improved this student's independent performance. */
  readonly effectiveSupports?: readonly string[];
  /** True if a teacher has explicitly corrected/confirmed this hypothesis. */
  readonly teacherConfirmed?: boolean;
}

/** A student and the ILP profile the compiler reads. */
export interface StudentILP {
  readonly studentId: string;
  readonly displayName: string;
  readonly gradeBand: GradeBand;
  readonly hypotheses: readonly ILPHypothesis[];
}

// ---------------------------------------------------------------------------
// Assignment (teacher intent) and compiler output
// ---------------------------------------------------------------------------

export type BotMode = 'lesson' | 'homework' | 'quiz' | 'exam' | 'research';

export interface TeacherConstraints {
  /** Require handwriting for the mastery task where the objective allows it. */
  readonly requireHandwriting?: boolean;
  /** Cap on the fraction of a lesson that may be read aloud (0..1). */
  readonly maxReadAloudFraction?: number;
  /** Adaptation ids the teacher has force-enabled for the whole class. */
  readonly forceAdaptations?: readonly string[];
  /** Adaptation ids the teacher has force-disabled for this assignment. */
  readonly disableAdaptations?: readonly string[];
  /**
   * Whether the teacher has pre-authorized objective modifications for specific
   * students (student ids). Absent → no objective modification is allowed and the
   * compiler will warn instead of applying one.
   */
  readonly objectiveModificationAuthorizedFor?: readonly string[];
}

/** One teacher assignment. "The teacher assigns once." */
export interface Assignment {
  readonly assignmentId: string;
  readonly classId: string;
  /** The objective versions being assigned (usually one for the MVP). */
  readonly objectiveVersionRefs: readonly ObjectiveVersionRef[];
  readonly durationMinutes: number;
  readonly deliveryMode: 'lesson_practice' | 'assessment' | 'remediation';
  readonly botMode: BotMode;
  readonly collaboration: { readonly enabled: boolean; readonly scope: 'none' | 'class' | 'district' };
  readonly teacherConstraints: TeacherConstraints;
}

export interface ObjectiveVersionRef {
  readonly objectiveId: string;
  readonly version: number;
}

/**
 * The compiled, reproducible delivery instructions for one student. It records
 * exactly which locked objective version was used and which adaptations were
 * applied, so the student's experience is auditable (data-model: DeliveryManifest).
 */
export interface DeliveryManifest {
  readonly assignmentId: string;
  readonly studentId: string;
  readonly objective: ObjectiveVersionRef;
  /** The locked contract, copied verbatim for audit and offline delivery. */
  readonly lockedContract: LockedContract;
  readonly appliedAdaptationIds: readonly string[];
  readonly pattern: DeliveryPattern;
  /** True only when a teacher-authorized objective modification was applied. */
  readonly objectiveModified: boolean;
  /** Human-readable rationale lines, one per adaptation decision. */
  readonly rationale: readonly string[];
}

/** The subset of the objective that must be identical across every student version. */
export interface LockedContract {
  readonly objectiveId: string;
  readonly version: number;
  readonly studentOutcome: string;
  readonly essentialKnowledge: readonly string[];
  readonly requiredReasoning: readonly string[];
  readonly mastery: MasteryRule;
}

export type WarningSeverity = 'info' | 'warning' | 'blocking';

export interface CompileWarning {
  readonly code: string;
  readonly severity: WarningSeverity;
  readonly message: string;
  readonly studentId?: string;
}

/**
 * The result of compiling one assignment across a class. Mirrors the API's
 * `/v1/assignments/compile` response: it is a proposal the teacher reviews and then
 * publishes. `status` is `blocked` if any objective-integrity check failed.
 */
export interface CompileResult {
  readonly assignmentId: string;
  readonly classId: string;
  readonly status: 'ready_for_teacher_review' | 'blocked';
  readonly objectiveIntegrity: 'pass' | 'fail';
  readonly studentCount: number;
  /** Count of manifests per delivery pattern (the teacher's at-a-glance summary). */
  readonly patternCounts: Record<DeliveryPattern, number>;
  /** Number of manifests where a (teacher-authorized) objective modification applied. */
  readonly objectiveModifications: number;
  readonly warnings: readonly CompileWarning[];
  readonly manifests: readonly DeliveryManifest[];
}

// ---------------------------------------------------------------------------
// Content sourcing & governance
// ---------------------------------------------------------------------------

/**
 * The five source tiers, strongest first (see `docs/content-governance.md`).
 * `standards` and `pedagogy` are not student-facing content: standards define
 * objectives, pedagogy informs technique.
 */
export type SourceTier = 'standards' | 'primary' | 'oer' | 'licensed' | 'pedagogy';

/** Who produced a source — a proxy for credibility. */
export type AuthorityType =
  | 'standards_body'
  | 'government'
  | 'museum_library'
  | 'peer_reviewed'
  | 'open_courseware'
  | 'publisher';

/** How a source may be used. Student-facing content must have a usable license. */
export type SourceLicense =
  | 'public_domain'
  | 'cc_by'
  | 'cc_by_sa'
  | 'cc_by_nc'
  | 'licensed' // used under a district/vendor contract
  | 'all_rights_reserved';

export type ReviewStatus = 'draft' | 'in_review' | 'approved' | 'retired';

/**
 * A governed source record. Nothing reaches a student unless a SourceRecord for it
 * is `approved`, carries a usable license, and names its authority and review date.
 * Mirrors the blueprint's SourceRecord entity and the vetting pipeline.
 */
export interface SourceRecord {
  readonly id: string; // e.g. "SRC-001"
  readonly title: string;
  readonly citation: string;
  readonly uri?: string;
  readonly tier: SourceTier;
  readonly authorityType: AuthorityType;
  readonly license: SourceLicense;
  readonly reviewStatus: ReviewStatus;
  /** ISO date the source was last editorially reviewed. */
  readonly reviewedAt?: string;
  /** ISO date the source must be re-reviewed by. */
  readonly reviewBy?: string;
}

/** Licenses under which student-facing content may be delivered. */
export const DELIVERABLE_LICENSES: readonly SourceLicense[] = [
  'public_domain',
  'cc_by',
  'cc_by_sa',
  'cc_by_nc',
  'licensed',
];
