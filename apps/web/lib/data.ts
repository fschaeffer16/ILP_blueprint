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
  domainLabel,
  iepToConstraints,
  buildIndependenceTrend,
  INDEPENDENCE_WEIGHT,
  validateIEPGoal,
  goalProgressFrom,
  buildFacilitatorDay,
  incidentFreeStreak,
  renderSymbolItem,
  scoreSymbolResponse,
  PROMPT_LEVELS,
  SCREENING_DOMAINS,
  CROSS_CUTTING_FILTERS,
  SIGNAL_ROUTING,
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
  ESE_SHOWCASE_STUDENTS,
  ESE_ACCESS_POINTS_STUDENT,
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
  FRACTION_SYMBOLS,
  SYMBOL_DEMO_ITEM,
  LIBRARY_OBJECTIVES,
  ESE_INDEPENDENCE_ATTEMPTS,
  INDEPENDENCE_STORIES,
  ESE_IEP_GOALS,
  LEO_DAY_PLAN,
  LEO_SERVICE_LOGS,
  SCHOOL_DAYS,
  SAMPLE_INCIDENTS,
  MIDDLE_6_LIBRARY,
  MIDDLE_6_OBJECTIVES,
  MIDDLE_6_PERIOD1,
  MIDDLE_6_PERIOD4,
  MIDDLE_6_STUDENTS,
  HIGH_9_LIBRARY,
  HIGH_9_OBJECTIVES,
  HIGH_9_STUDENTS,
  ALG1_ASSIGNMENT,
  ALG1_EOC_CHECK,
  ALG1_EOC_RESPONSES,
  ALG1_EOC_ROSTER,
  ALG1_MODULES,
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
  let disclaimer = '';
  const students = EARLY_K_STUDENTS.map((st) => {
    const profile = buildBaselineProfile(st.baseline, { gradeBand: 'K', today: new Date('2026-09-01') });
    disclaimer = profile.disclaimer;
    const ilp = studentILPFromBaseline(profile, st.name);
    const result = compileAssignment({
      assignment: EARLY_K_ASSIGNMENT,
      objectives: EARLY_K_OBJECTIVES,
      roster: [ilp],
      adaptationCatalog: SAMPLE_ADAPTATIONS,
      today: new Date('2026-09-01'),
    });
    const growthAreas = profile.ilpHypotheses.map((h) => ({ domain: h.domain, readiness: h.readiness }));
    const indicators = profile.indicators.map((i) => ({
      signal: i.signal, indicatorType: i.indicatorType, plainLanguage: i.plainLanguage, nextSteps: i.nextSteps,
    }));
    return {
      studentId: st.studentId, name: st.name, blurb: st.blurb,
      manifest: result.manifests[0] ?? null, growthAreas,
      indicators, familyNotification: profile.familyNotification,
    };
  });
  return { objective, allValid: catalog.summary.allValid, objectiveCount: catalog.summary.objectives, students, disclaimer };
}

/**
 * The grade-6 departmentalized showcase: two periods, two teachers, one profile.
 * Each student is compiled live for each period; Mateo's IEP constraints ride
 * into both compiles from the same plan, entered once.
 */
export function getMiddleGradesShowcase() {
  const catalog = buildCatalog(MIDDLE_6_LIBRARY);
  const adaptationById = new Map(SAMPLE_ADAPTATIONS.map((a) => [a.id, a]));
  const compileFor = (assignment: typeof MIDDLE_6_PERIOD1, st: (typeof MIDDLE_6_STUDENTS)[number]) => {
    const profile = buildBaselineProfile(st.baseline, { gradeBand: '6', today: new Date('2026-09-01') });
    const ilp = studentILPFromBaseline(profile, st.name);
    const constraints = st.plan ? iepToConstraints(st.plan) : {};
    const result = compileAssignment({
      assignment: { ...assignment, teacherConstraints: constraints },
      objectives: MIDDLE_6_OBJECTIVES,
      roster: [ilp],
      adaptationCatalog: SAMPLE_ADAPTATIONS,
      today: new Date('2026-09-01'),
    });
    const m = result.manifests[0] ?? null;
    return {
      name: st.name,
      blurb: st.blurb,
      hasPlan: !!st.plan,
      pattern: m?.pattern ?? 'core',
      objectiveModified: m?.objectiveModified ?? false,
      applied: (m?.appliedAdaptationIds ?? []).map((id) => {
        const a = adaptationById.get(id);
        const fromPlan = st.plan?.accommodations.find((acc) => acc.adaptationId === id) ?? null;
        return { id, label: a?.label ?? id, permanent: a?.fadeRule == null, fromPlan: !!fromPlan };
      }),
    };
  };
  const periods = [
    { assignment: MIDDLE_6_PERIOD1, objectiveId: 'M6.AR.01' },
    { assignment: MIDDLE_6_PERIOD4, objectiveId: 'R6.CI.01' },
  ].map(({ assignment, objectiveId }) => {
    const objective = MIDDLE_6_OBJECTIVES.find((o) => o.objectiveId === objectiveId)!;
    return {
      classLabel: assignment.classId,
      objectiveId,
      outcome: objective.studentOutcome,
      students: MIDDLE_6_STUDENTS.map((st) => compileFor(assignment, st)),
    };
  });
  return { allValid: catalog.summary.allValid, objectiveCount: catalog.summary.objectives, periods };
}

/**
 * The grade-9 showcase: Algebra 1 as a graduation-stakes course. Three students
 * compiled live on the linear-equations objective (Dre's IEP riding along), and
 * the EOC practice check run through the real module analysis with auto
 * remediation.
 */
export function getHighSchoolShowcase() {
  const catalog = buildCatalog(HIGH_9_LIBRARY);
  const adaptationById = new Map(SAMPLE_ADAPTATIONS.map((a) => [a.id, a]));
  const students = HIGH_9_STUDENTS.map((st) => {
    const profile = buildBaselineProfile(st.baseline, { gradeBand: '9', today: new Date('2026-09-01') });
    const ilp = studentILPFromBaseline(profile, st.name);
    const constraints = st.plan ? iepToConstraints(st.plan) : {};
    const result = compileAssignment({
      assignment: { ...ALG1_ASSIGNMENT, teacherConstraints: constraints },
      objectives: HIGH_9_OBJECTIVES,
      roster: [ilp],
      adaptationCatalog: SAMPLE_ADAPTATIONS,
      today: new Date('2026-09-01'),
    });
    const m = result.manifests[0] ?? null;
    return {
      name: st.name,
      blurb: st.blurb,
      pattern: m?.pattern ?? 'core',
      objectiveModified: m?.objectiveModified ?? false,
      applied: (m?.appliedAdaptationIds ?? []).map((id) => ({
        id,
        label: adaptationById.get(id)?.label ?? id,
        fromPlan: !!st.plan?.accommodations.some((acc) => acc.adaptationId === id),
      })),
    };
  });
  const analysis = analyzeExam(ALG1_EOC_CHECK, ALG1_EOC_RESPONSES, ALG1_EOC_ROSTER, ALG1_MODULES);
  const cls = analysis.classScopes[0]!;
  return {
    allValid: catalog.summary.allValid,
    objectiveCount: catalog.summary.objectives,
    classLabel: ALG1_ASSIGNMENT.classId,
    objective: HIGH_9_OBJECTIVES.find((o) => o.objectiveId === 'A1.AR.01')!,
    students,
    eoc: {
      title: ALG1_EOC_CHECK.title,
      studentCount: analysis.studentCount,
      overallPct: cls.overallPct,
      byModule: cls.byModule,
      remediationQueue: analysis.remediationQueue.map((r) => ({
        studentName: r.studentName,
        moduleId: r.moduleId,
        title: r.title,
        correctPct: r.correctPct,
        reteachLessonId: r.reteachLessonId,
        retakeCount: r.retakeQuestionIds.length,
      })),
    },
  };
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

/** The universal-screening taxonomy the screener is prepared to flag: the domains grouped,
 * the cross-cutting bias filters, and the signal → next-step routing ladder (the ESE gateway). */
export function getScreeningReference() {
  const groups: Record<string, string> = {
    reading_language: 'Reading & language', math: 'Math & spatial',
    attention_cognition: 'Attention, memory & executive', motor_visual: 'Motor & visual',
    social_emotional_sensory: 'Social, emotional & sensory', cross_cutting: 'Cross-cutting',
  };
  const byGroup = Object.keys(groups).map((g) => ({
    group: groups[g]!,
    domains: SCREENING_DOMAINS.filter((d) => d.group === g).map((d) => ({
      label: domainLabel(d.domain), implicates: d.implicates,
    })),
  }));
  return { byGroup, filters: CROSS_CUTTING_FILTERS, routing: SIGNAL_ROUTING, domainCount: SCREENING_DOMAINS.length };
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

/** The ESE showcase: six students with documented plans, one grade-3 Learning Objective.
 * Each plan's accommodations are forced into the compiler (IEP as live input); five are
 * pure accommodation-lane (objective locked); the sixth is the documented Access-Points
 * lane the engine never computes. */
export function getEseShowcase() {
  const objective = SAMPLE_OBJECTIVES.find(
    (o) => o.objectiveId === SAMPLE_ASSIGNMENT.objectiveVersionRefs[0]?.objectiveId,
  )!;
  const adaptationById = new Map(SAMPLE_ADAPTATIONS.map((a) => [a.id, a]));
  const students = ESE_SHOWCASE_STUDENTS.map((st) => {
    const profile = buildBaselineProfile(st.baseline, { gradeBand: '3', today: new Date('2026-09-08') });
    const ilp = studentILPFromBaseline(profile, st.name);
    const constraints = st.plan ? iepToConstraints(st.plan) : {};
    const result = compileAssignment({
      assignment: { ...SAMPLE_ASSIGNMENT, teacherConstraints: constraints },
      objectives: SAMPLE_OBJECTIVES,
      roster: [ilp],
      adaptationCatalog: SAMPLE_ADAPTATIONS,
      today: new Date('2026-09-08'),
    });
    const manifest = result.manifests[0] ?? null;
    const applied = (manifest?.appliedAdaptationIds ?? []).map((id) => {
      const a = adaptationById.get(id);
      const fromPlan = st.plan?.accommodations.find((acc) => acc.adaptationId === id) ?? null;
      return {
        id,
        label: a?.label ?? id,
        permanent: a?.fadeRule == null, // access channels never fade
        fromPlan: fromPlan ? { planText: fromPlan.planText, planType: st.plan!.planType } : null,
      };
    });
    return {
      name: st.name, documented: st.documented, whereTheyAre: st.whereTheyAre,
      pattern: manifest?.pattern ?? 'core', applied,
      excluded: st.plan?.excludedAdaptations ?? [],
      objectiveModified: manifest?.objectiveModified ?? false,
    };
  });
  return { objective, students, accessPoints: ESE_ACCESS_POINTS_STUDENT };
}

/**
 * IEP build, step 3: prompt-level evidence → the independence trend, computed
 * live from the synthetic attempt log for three ESE students on module M2.
 */
export function getIndependence() {
  return INDEPENDENCE_STORIES.map((s) => {
    const trend = buildIndependenceTrend(ESE_INDEPENDENCE_ATTEMPTS, {
      studentId: s.studentId,
      objectiveId: 'M3.NF.02',
      moduleId: 'M2',
    });
    const attempts = ESE_INDEPENDENCE_ATTEMPTS.filter((a) => a.studentId === s.studentId).map(
      (a) => ({
        date: a.date,
        correct: a.correct,
        promptLevel: a.promptLevel,
        responseChannel: a.responseChannel,
        weight: INDEPENDENCE_WEIGHT[a.promptLevel],
      }),
    );
    return { name: s.name, scaffold: s.scaffold, note: s.note, trend, attempts };
  });
}

/**
 * IEP build, step 5: the support facilitator's day — Leo's day plan merged with
 * the service log, fidelity computed by the engine, incident-free streak live.
 */
export function getFacilitatorDay() {
  const adaptationById = new Map(SAMPLE_ADAPTATIONS.map((a) => [a.id, a.label]));
  const today = buildFacilitatorDay('E-LEO', LEO_DAY_PLAN, LEO_SERVICE_LOGS, '2026-09-09');
  const yesterday = buildFacilitatorDay('E-LEO', LEO_DAY_PLAN, LEO_SERVICE_LOGS, '2026-09-08');
  const missedYesterday = yesterday.items.find((i) => i.status === 'missed') ?? null;
  return {
    studentName: 'Leo',
    date: today.date,
    items: today.items.map((i) => ({
      taskId: i.task.taskId,
      time: i.task.time,
      block: i.task.block,
      title: i.task.title,
      detail: i.task.detail,
      supports: i.task.planAccommodationIds.map((id) => adaptationById.get(id) ?? id),
      status: i.status,
      note: i.note ?? null,
    })),
    fidelity: today.fidelity,
    yesterdayFidelity: yesterday.fidelity,
    missedYesterday: missedYesterday
      ? { title: missedYesterday.task.title, note: missedYesterday.note ?? '' }
      : null,
    incidentFreeDays: incidentFreeStreak('E-LEO', SCHOOL_DAYS, SAMPLE_INCIDENTS),
  };
}

/**
 * IEP build, step 4: goals as module chains — validated against the class's own
 * modules, with progress accrued live from the step-3 attempt log.
 */
export function getIepGoals() {
  const nameById = new Map(ESE_SHOWCASE_STUDENTS.map((s) => [s.studentId, s.name]));
  const moduleById = new Map(SAMPLE_MODULES.map((m) => [m.moduleId, m]));
  return ESE_IEP_GOALS.map((g) => {
    const findings = validateIEPGoal(g, SAMPLE_MODULES);
    const progress = goalProgressFrom(g, ESE_INDEPENDENCE_ATTEMPTS);
    return {
      goal: g,
      studentName: nameById.get(g.studentId) ?? g.studentId,
      moduleTitles: g.moduleIds.map((id) => ({ id, title: moduleById.get(id)?.title ?? id })),
      findings,
      progress,
    };
  });
}

/**
 * IEP build, step 2: the plan-builder screen's server data — the adaptation
 * catalog with fade semantics, seeded with Leo's documented plan.
 */
export function getIepBuilder() {
  const leo = ESE_SHOWCASE_STUDENTS.find((s) => s.name === 'Leo');
  const seed: Record<string, { planText: string; kind: 'access' | 'support' }> = {};
  for (const acc of leo?.plan?.accommodations ?? []) {
    seed[acc.adaptationId] = { planText: acc.planText, kind: acc.kind };
  }
  return {
    seedName: leo?.name ?? 'Leo',
    seed,
    catalog: SAMPLE_ADAPTATIONS.map((a) => ({
      id: a.id,
      label: a.label,
      adaptationClass: a.adaptationClass,
      fadeRule: a.fadeRule,
      permittedChange: a.permittedChange,
    })),
  };
}

/**
 * IEP build, step 1: the picture-response item, computed live. The same approved
 * compare-fractions question rendered two ways — text for the class, tappable
 * picture buttons for the AAC student — with every possible tap pre-scored by the
 * engine so the demo shows real evidence records (channel, prompt level, module).
 */
export function getPictureResponse() {
  const objective = LIBRARY_OBJECTIVES.find((o) => o.objectiveId === SYMBOL_DEMO_ITEM.objectiveId)!;
  const { rendering, findings } = renderSymbolItem(SYMBOL_DEMO_ITEM, FRACTION_SYMBOLS, objective);
  if (!rendering) throw new Error(`picture rendering failed: ${findings.map((f) => f.code).join(',')}`);
  const outcomes: Record<string, { correct: boolean; value: string; moduleId: string | null }> = {};
  for (const c of rendering.choices) {
    const ev = scoreSymbolResponse(SYMBOL_DEMO_ITEM, rendering, c.choiceId)!;
    outcomes[c.choiceId] = { correct: ev.correct, value: ev.value, moduleId: ev.moduleId };
  }
  return {
    objectiveOutcome: objective.studentOutcome,
    itemId: SYMBOL_DEMO_ITEM.itemId,
    vocabId: rendering.vocabId,
    promptText: rendering.promptText,
    textOptions: [...SYMBOL_DEMO_ITEM.answerKey, ...SYMBOL_DEMO_ITEM.distractors].sort(),
    choices: rendering.choices.map((c) => ({ choiceId: c.choiceId, glyph: c.symbol.glyph, label: c.symbol.label })),
    outcomes,
    promptLevels: [...PROMPT_LEVELS],
  };
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
