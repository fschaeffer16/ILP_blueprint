/**
 * Server-only data layer for the teacher command center.
 *
 * Every number and status on the screens comes from running the REAL @ilp/core engine
 * on the synthetic fixtures — the compiler, the reference grader, the final-grade gate
 * and the 75% rule. Nothing here is mocked UI state; it is the same code path a district
 * would deploy, pointed at synthetic data.
 */

import 'server-only';

import {
  compileAssignment,
  evaluateClasswideFailure,
  referenceGrader,
  releaseFinalGrade,
  buildRollups,
  buildParentSummary,
  buildBaselineProfile,
  studentILPFromBaseline,
  buildCatalog,
  analyzeExam,
  summarizeAssistantFlags,
  buildStudyGuide,
  lessonFor,
  SURFACE_LABEL,
  type CompileResult,
  type DeliveryManifest,
  type FinalGrade,
  type GradingRecommendation,
  type ClasswideFailureOutcome,
} from '@ilp/core';
import {
  OBJ_M3_NF_01,
  SAMPLE_ADAPTATIONS,
  SAMPLE_ASSIGNMENT,
  SAMPLE_DISTRICT,
  SAMPLE_LESSON_PLAN,
  SAMPLE_OBJECTIVES,
  CONTENT_LIBRARY,
  coverageReport,
  SAMPLE_NAVI_FLAGS,
  SAMPLE_STUDENT_NAME,
  SAMPLE_STUDENT_QUEUE,
  SAMPLE_STUDENT_UPCOMING,
  SAMPLE_IMPORTANT_DATES,
  SAMPLE_EXAM,
  SAMPLE_EXAM_RESPONSES,
  SAMPLE_EXAM_ROSTER,
  SAMPLE_MODULES,
  EARLY_K_LIBRARY,
  EARLY_K_OBJECTIVES,
  EARLY_K_ASSIGNMENT,
  EARLY_K_STUDENTS,
  SAMPLE_CHANNELS,
  SAMPLE_POSTS,
  SAMPLE_MEMBERS,
  SAMPLE_BASELINE,
  SAMPLE_TASK_BANK,
  SAMPLE_TASK_RESPONSES,
  SAMPLE_OUTCOMES,
  SAMPLE_PARENT_INPUT,
  SAMPLE_PARENT_NOTIFICATIONS,
  SAMPLE_ROSTER,
  SAMPLE_RUBRIC,
  SAMPLE_SOURCES,
  SAMPLE_SUBMISSIONS,
} from '@ilp/core/fixtures';

const TEACHER_ID = 'T-100';
const DECIDED_AT = '2026-09-01T15:00:00Z';

export const objective = OBJ_M3_NF_01;
export const rubric = SAMPLE_RUBRIC;
export const assignment = SAMPLE_ASSIGNMENT;

export function nameFor(studentId: string): string {
  return SAMPLE_ROSTER.find((s) => s.studentId === studentId)?.displayName ?? studentId;
}

/** The student home: individualized assignment queue + study guides built from the
 * library, and the verified subject channels with their posts. */
export function getStudentHome() {
  const guideFor = (objectiveId: string) => {
    const objective = CONTENT_LIBRARY.objectives.find((o) => o.objectiveId === objectiveId);
    if (!objective) return null;
    return buildStudyGuide(objective, lessonFor(CONTENT_LIBRARY, objectiveId, objective.version));
  };
  const studyGuides = ['M3.NF.01', 'M3.NF.02', 'CIV3.01'].map(guideFor).filter(Boolean);
  return {
    name: SAMPLE_STUDENT_NAME,
    queue: SAMPLE_STUDENT_QUEUE,
    upcoming: SAMPLE_STUDENT_UPCOMING,
    importantDates: SAMPLE_IMPORTANT_DATES,
    studyGuides,
  };
}

export function getStudentChannels() {
  return { channels: SAMPLE_CHANNELS, posts: SAMPLE_POSTS, members: SAMPLE_MEMBERS };
}

/** The content-library catalog (every objective validated against every gate). */
export function getLibrary() {
  return buildCatalog(CONTENT_LIBRARY);
}

/** Kindergarten "meet them where they are" showcase: one gate-validated K counting
 * objective, four kindergartners with sharply different baselines, and the delivery the
 * assign-once compiler auto-selects for each — same objective, decided by the baseline. */
export function getKindergartenShowcase() {
  const objective = EARLY_K_OBJECTIVES.find(
    (o) => o.objectiveId === EARLY_K_ASSIGNMENT.objectiveVersionRefs[0]?.objectiveId,
  )!;
  const catalog = buildCatalog(EARLY_K_LIBRARY);
  const students = EARLY_K_STUDENTS.map((st) => {
    const profile = buildBaselineProfile(st.baseline, { gradeBand: 'K', today: new Date('2026-09-01') });
    const ilp = studentILPFromBaseline(profile, st.name);
    const result = compileAssignment({
      assignment: EARLY_K_ASSIGNMENT,
      objectives: EARLY_K_OBJECTIVES,
      roster: [ilp],
      adaptationCatalog: SAMPLE_ADAPTATIONS,
      today: new Date('2026-09-01'),
    });
    const growthAreas = profile.ilpHypotheses.map((h) => ({ domain: h.domain, readiness: h.readiness }));
    return { studentId: st.studentId, name: st.name, blurb: st.blurb, manifest: result.manifests[0] ?? null, growthAreas };
  });
  return { objective, allValid: catalog.summary.allValid, objectiveCount: catalog.summary.objectives, students };
}

export function getStandardsCoverage() {
  const refs = CONTENT_LIBRARY.objectives.flatMap((o) => o.standardRefs);
  return coverageReport(refs);
}

export function getNaviFlagReport() {
  return summarizeAssistantFlags(SAMPLE_NAVI_FLAGS, CONTENT_LIBRARY.objectives);
}

/** The module definition (module code, pass mark, built-in reteach) for an objective,
 * when it appears on the sample exam — else null. Every objective is a module; this
 * returns the concrete _M# tag and remediation config where one is defined. */
export function getModuleFor(objectiveId: string) {
  return SAMPLE_MODULES.find((m) => m.objectiveId === objectiveId) ?? null;
}

/** One objective's full content: its catalog entry, authored lesson, items, sources,
 * plus its module framing (module = Learning Objective; lessons live inside it). */
export function getLibraryObjective(objectiveId: string) {
  const objective = CONTENT_LIBRARY.objectives.find((o) => o.objectiveId === objectiveId);
  if (!objective) return null;
  const entry = buildCatalog(CONTENT_LIBRARY).entries.find((e) => e.objectiveId === objectiveId)!;
  const lesson = lessonFor(CONTENT_LIBRARY, objectiveId, objective.version);
  const items = CONTENT_LIBRARY.items.filter((i) => i.objectiveId === objectiveId);
  const sourceById = new Map(CONTENT_LIBRARY.sources.map((s) => [s.id, s]));
  const sources = [...new Set(objective.sourceIds)].map((id) => sourceById.get(id)).filter(Boolean);
  return { entry, objective, lesson, items, sources, module: getModuleFor(objectiveId) };
}

/** The baseline task bank for the interactive "take the screening" demo (no answer keys
 * sent to the client — scoring happens server-side), plus a demo answer set. */
export function getBaselineTasks() {
  return {
    tasks: SAMPLE_TASK_BANK.map((t) => ({
      id: t.id, domain: t.domain, session: t.session, prompt: t.prompt, format: t.format,
      choices: t.choices ?? null, scaleHint: t.scaleHint ?? null,
    })),
    demoResponses: SAMPLE_TASK_RESPONSES,
  };
}

/** The baseline screening profile for one child (screening, never a diagnosis). */
export function getBaseline() {
  return buildBaselineProfile(SAMPLE_BASELINE, { gradeBand: '3', today: new Date('2026-09-06') });
}

/** Prove the wire: feed the baseline result straight into the assign-once compiler and
 * return the delivery the compiler auto-selects for THIS baselined student — the pattern,
 * the rationale, and which objective it was compiled against. Screening → individualized
 * delivery, no re-keying. */
export function getBaselineToInstruction() {
  const profile = getBaseline();
  const displayName = profile.studentId === 'S-311' ? 'Noah' : profile.studentId;
  const student = studentILPFromBaseline(profile, displayName);
  const result = compileAssignment({
    assignment: SAMPLE_ASSIGNMENT,
    objectives: SAMPLE_OBJECTIVES,
    roster: [student],
    adaptationCatalog: SAMPLE_ADAPTATIONS,
    today: new Date('2026-09-06'),
  });
  const manifest = result.manifests[0] ?? null;
  const objective = SAMPLE_OBJECTIVES.find(
    (o) => o.objectiveId === SAMPLE_ASSIGNMENT.objectiveVersionRefs[0]?.objectiveId,
  );
  return { displayName, manifest, objectiveTitle: objective?.studentOutcome ?? 'the objective' };
}

/** The plain-language parent summary for one child, plus surface labels. */
export function getParentSummary() {
  return {
    summary: buildParentSummary(SAMPLE_PARENT_INPUT),
    surfaceLabel: SURFACE_LABEL,
    notifications: SAMPLE_PARENT_NOTIFICATIONS,
  };
}

/** Exam results rolled up by module (Learning Objective), at district / school /
 * class / student scope, with auto-triggered reteach-and-retake remediation. */
export function getExamAnalysis() {
  return analyzeExam(SAMPLE_EXAM, SAMPLE_EXAM_RESPONSES, SAMPLE_EXAM_ROSTER, SAMPLE_MODULES);
}

/** The full set of rollups for the analytics dashboard (student → district). */
export function getDashboard() {
  return { district: SAMPLE_DISTRICT, total: SAMPLE_OUTCOMES.length, rollups: buildRollups(SAMPLE_OUTCOMES) };
}

/** Everything the lesson-builder screen needs: the sample plan, the objective's
 * required reasoning (for coverage), and the vetted source options. */
export function getLessonData() {
  return {
    objective: { objectiveId: OBJ_M3_NF_01.objectiveId, version: OBJ_M3_NF_01.version, requiredReasoning: [...OBJ_M3_NF_01.requiredReasoning], studentOutcome: OBJ_M3_NF_01.studentOutcome },
    plan: {
      id: SAMPLE_LESSON_PLAN.id,
      objectiveId: SAMPLE_LESSON_PLAN.objectiveId,
      objectiveVersion: SAMPLE_LESSON_PLAN.objectiveVersion,
      title: SAMPLE_LESSON_PLAN.title,
      authorId: SAMPLE_LESSON_PLAN.authorId,
      blocks: SAMPLE_LESSON_PLAN.blocks.map((b) => ({ id: b.id, kind: b.kind, title: b.title, sourceIds: [...b.sourceIds], targets: [...b.targets] })),
    },
    sources: SAMPLE_SOURCES.map((s) => ({ id: s.id, title: s.title, reviewStatus: s.reviewStatus })),
  };
}

/** Everything the objective-builder screen needs: the seed draft, the adaptation
 * catalog, and the vetted source library (all shape-simplified for the client). */
export function getAuthoringData() {
  const o = OBJ_M3_NF_01;
  return {
    seed: {
      objectiveId: o.objectiveId,
      version: o.version,
      subject: o.subject as string,
      gradeBand: o.gradeBand as string,
      standardRefs: [...o.standardRefs],
      studentOutcome: o.studentOutcome,
      essentialKnowledge: [...o.essentialKnowledge],
      requiredReasoning: [...o.requiredReasoning],
      prerequisites: [...o.prerequisites],
      mastery: { ...o.mastery },
      permittedAdaptations: [...o.permittedAdaptations],
      prohibitedAdaptations: [...o.prohibitedAdaptations],
      misconceptions: [...o.misconceptions],
      sourceIds: [...o.sourceIds],
      remediationPatternIds: [...o.remediationPatternIds],
    },
    catalog: SAMPLE_ADAPTATIONS.map((a) => ({
      id: a.id,
      label: a.label,
      adaptationClass: a.adaptationClass,
      permittedChange: a.permittedChange,
    })),
    sources: SAMPLE_SOURCES.map((s) => ({
      id: s.id,
      title: s.title,
      tier: s.tier,
      license: s.license,
      reviewStatus: s.reviewStatus,
      reviewedAt: s.reviewedAt ?? null,
    })),
  };
}

/** The assign-once compile result for the class (assign preview, class overview, today). */
export function getCompile(): CompileResult {
  return compileAssignment({
    assignment: SAMPLE_ASSIGNMENT,
    objectives: SAMPLE_OBJECTIVES,
    roster: SAMPLE_ROSTER,
    adaptationCatalog: SAMPLE_ADAPTATIONS,
  });
}

export interface GradingRow {
  readonly studentId: string;
  readonly name: string;
  readonly response: string;
  readonly supportsUsed: readonly string[];
  readonly recommendation: GradingRecommendation;
  /** The grade the teacher WOULD release on accept — shown for review, not yet released. */
  readonly proposedOnAccept: FinalGrade;
}

/** First-pass AI grading for every submission (non-authoritative recommendations). */
export function getGradingRows(): GradingRow[] {
  return SAMPLE_SUBMISSIONS.map((submission) => {
    const recommendation = referenceGrader.grade({ submission, rubric: SAMPLE_RUBRIC, objective: OBJ_M3_NF_01 });
    const proposedOnAccept = releaseFinalGrade(
      recommendation,
      { submissionId: submission.submissionId, action: 'accept', teacherId: TEACHER_ID, decidedAt: DECIDED_AT },
      SAMPLE_RUBRIC,
      OBJ_M3_NF_01,
    )!;
    return {
      studentId: submission.studentId,
      name: nameFor(submission.studentId),
      response: submission.response,
      supportsUsed: submission.supportsUsed,
      recommendation,
      proposedOnAccept,
    };
  });
}

/** The 75% classwide-failure outcome, computed from the accept-path grades. */
export function getClasswideOutcome(): ClasswideFailureOutcome {
  const rows = getGradingRows();
  return evaluateClasswideFailure({
    objectiveId: OBJ_M3_NF_01.objectiveId,
    objectiveVersion: OBJ_M3_NF_01.version,
    itemGroupId: `${SAMPLE_ASSIGNMENT.assignmentId}/written`,
    results: rows.map((r) => ({
      studentId: r.studentId,
      masteryMet: r.proposedOnAccept.masteryMet,
      fraction: r.proposedOnAccept.fraction,
    })),
  });
}

export interface ClassStudentRow {
  readonly studentId: string;
  readonly name: string;
  readonly manifest: DeliveryManifest;
  readonly masteryMet: boolean;
  readonly fraction: number;
}

/** Per-student status combining the compiled manifest and the proposed grade. */
export function getClassRows(): ClassStudentRow[] {
  const compile = getCompile();
  const grading = new Map(getGradingRows().map((g) => [g.studentId, g]));
  return compile.manifests.map((manifest) => {
    const g = grading.get(manifest.studentId);
    return {
      studentId: manifest.studentId,
      name: nameFor(manifest.studentId),
      manifest,
      masteryMet: g?.proposedOnAccept.masteryMet ?? false,
      fraction: g?.proposedOnAccept.fraction ?? 0,
    };
  });
}
