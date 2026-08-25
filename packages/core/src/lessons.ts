/**
 * Lesson-plan authoring (blueprint §10 "assignment package"; §8 objective graph).
 *
 * This is Layer 2 of authoring. The district approves objectives and the source
 * library (Layer 1); an individual teacher then builds their own lesson plans for the
 * year here — but only from a *published* objective and *approved* sources, and the
 * plan must actually teach and assess everything the objective's reasoning requires.
 *
 * `validateLessonPlan` is the gate behind the lesson builder. Like the objective gate
 * it is pure and deterministic, so the builder can validate live and tests can pin the
 * rules down.
 */

import { DELIVERABLE_LICENSES } from './types.js';
import type {
  ObjectiveVersion,
  SourceRecord,
  WarningSeverity,
} from './types.js';

/** The parts of the student's lesson experience (blueprint §10 assignment package). */
export type LessonBlockKind =
  | 'objective_preview'
  | 'instruction'
  | 'worked_example'
  | 'practice'
  | 'collaboration'
  | 'mastery_task'
  | 'reflection';

export interface LessonBlock {
  readonly id: string;
  readonly kind: LessonBlockKind;
  readonly title: string;
  /** Approved sources this block draws its content from. */
  readonly sourceIds: readonly string[];
  /** The objective elements (essential knowledge / required reasoning) this block builds. */
  readonly targets: readonly string[];
  /** Optional technique/adaptation id this block is designed around. */
  readonly techniqueId?: string;
}

export interface LessonPlan {
  readonly id: string;
  readonly objectiveId: string;
  readonly objectiveVersion: number;
  readonly title: string;
  readonly authorId: string;
  readonly blocks: readonly LessonBlock[];
}

/** One objective's slot in a class's year-long scope & sequence. */
export interface YearPlanEntry {
  readonly objectiveId: string;
  readonly objectiveVersion: number;
  readonly term: 1 | 2 | 3 | 4;
  readonly order: number;
  readonly lessonPlanId?: string; // filled once the teacher authors the lesson
}

export interface YearPlan {
  readonly id: string;
  readonly classId: string;
  readonly gradeBand: string;
  readonly entries: readonly YearPlanEntry[];
}

export interface LessonIssue {
  readonly code: string;
  readonly severity: WarningSeverity;
  readonly message: string;
  readonly blockId?: string;
}

export interface LessonValidation {
  readonly ok: boolean;
  readonly issues: readonly LessonIssue[];
  /** Which required-reasoning elements are covered by at least one block. */
  readonly coverage: readonly { readonly target: string; readonly covered: boolean }[];
}

export interface LessonContext {
  readonly objective: ObjectiveVersion;
  readonly approvedSources: readonly SourceRecord[];
}

const TEACHING_KINDS: readonly LessonBlockKind[] = ['instruction', 'worked_example'];

/**
 * Validate a teacher's lesson plan against its objective and the approved source
 * library. Blocks reaching students if the plan is off-objective, doesn't both teach
 * and assess, cites an unvetted source, or fails to cover the required reasoning.
 */
export function validateLessonPlan(plan: LessonPlan, ctx: LessonContext): LessonValidation {
  const issues: LessonIssue[] = [];
  const { objective } = ctx;
  const norm = (s: string) => s.trim().toLowerCase();

  // 1. The plan must target the given published objective version.
  if (plan.objectiveId !== objective.objectiveId || plan.objectiveVersion !== objective.version) {
    issues.push({
      code: 'LESSON_OBJECTIVE_MISMATCH',
      severity: 'blocking',
      message: `Lesson targets ${plan.objectiveId} v${plan.objectiveVersion} but was checked against ${objective.objectiveId} v${objective.version}.`,
    });
  }
  if (objective.status !== 'published') {
    issues.push({
      code: 'OBJECTIVE_NOT_PUBLISHED',
      severity: 'blocking',
      message: `Objective ${objective.objectiveId} is ${objective.status}; only published objectives can carry lessons.`,
    });
  }

  // 2. A lesson must both teach and assess (traceability: no assessment without teaching).
  const hasTeaching = plan.blocks.some((b) => TEACHING_KINDS.includes(b.kind));
  const hasMastery = plan.blocks.some((b) => b.kind === 'mastery_task');
  if (!hasTeaching) {
    issues.push({ code: 'NO_INSTRUCTION', severity: 'blocking', message: 'The lesson has no instruction or worked-example block — it teaches nothing.' });
  }
  if (!hasMastery) {
    issues.push({ code: 'NO_MASTERY_TASK', severity: 'blocking', message: 'The lesson has no mastery task — there is no evidence of learning.' });
  }
  if (!plan.blocks.some((b) => b.kind === 'practice')) {
    issues.push({ code: 'NO_PRACTICE', severity: 'warning', message: 'The lesson has no practice block; students move from instruction straight to the mastery task.' });
  }

  // 3. Every block's sources must be approved and deliverable.
  const byId = new Map(ctx.approvedSources.map((s) => [s.id, s]));
  for (const b of plan.blocks) {
    for (const sid of b.sourceIds) {
      const src = byId.get(sid);
      if (!src) {
        issues.push({ code: 'SOURCE_NOT_FOUND', severity: 'blocking', message: `Block "${b.title}" cites source "${sid}", which is not in the vetted library.`, blockId: b.id });
      } else if (src.reviewStatus !== 'approved') {
        issues.push({ code: 'SOURCE_NOT_APPROVED', severity: 'blocking', message: `Block "${b.title}" cites "${src.title}", which is ${src.reviewStatus}, not approved.`, blockId: b.id });
      } else if (!DELIVERABLE_LICENSES.includes(src.license)) {
        issues.push({ code: 'SOURCE_LICENSE', severity: 'blocking', message: `Block "${b.title}" cites "${src.title}" whose license does not permit student delivery.`, blockId: b.id });
      }
    }
    // A content block with no source is fine for reflection/collaboration, but
    // instruction/worked_example/mastery must be grounded.
    if (b.sourceIds.length === 0 && (TEACHING_KINDS.includes(b.kind) || b.kind === 'mastery_task')) {
      issues.push({ code: 'BLOCK_UNSOURCED', severity: 'warning', message: `Block "${b.title}" (${b.kind}) cites no source. Student-facing content should be grounded in an approved source.`, blockId: b.id });
    }
  }

  // 4. Coverage: every required-reasoning element must be built by at least one block.
  const built = new Set(plan.blocks.flatMap((b) => b.targets.map(norm)));
  const coverage = objective.requiredReasoning.map((r) => ({ target: r, covered: built.has(norm(r)) }));
  for (const c of coverage) {
    if (!c.covered) {
      issues.push({
        code: 'MISSING_COVERAGE',
        severity: 'blocking',
        message: `No block builds the required reasoning "${c.target}". The lesson would assess something it never taught.`,
      });
    }
  }

  return { ok: issues.every((i) => i.severity !== 'blocking'), issues, coverage };
}
