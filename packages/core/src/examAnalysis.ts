/**
 * Exam / quiz analysis by MODULE.
 *
 * The module system, locked down:
 *   • A module IS a Learning Objective. Every lesson lives inside a module.
 *   • Every quiz/exam question ID must carry a module tag — `_M1`, `_M2`, … —
 *     somewhere in its name. That tag is how a result is tracked student-wide,
 *     class-wide, school-wide and district-wide, purely from the question id.
 *   • Each module ships with remediation already programmed in: fall below the
 *     module's pass mark and the reteach auto-triggers, followed by a retake of
 *     *only that module's* questions.
 *
 * No AI: deterministic aggregation + a fixed remediation rule. This is the
 * reporting/remediation side of the same module-anchored model the content gates
 * enforce at authoring time.
 */

/** Pull the module tag (`M1`, `M2`, …) out of a question id. Null if absent. */
export function moduleTag(id: string): string | null {
  const m = /_(M\d+)\b/i.exec(id) ?? /_(M\d+)/i.exec(id);
  return m ? m[1]!.toUpperCase() : null;
}
export const hasModuleTag = (id: string): boolean => moduleTag(id) !== null;

/** A module: one Learning Objective, its lessons, and its built-in remediation. */
export interface ModuleDef {
  readonly moduleId: string; // 'M1'
  readonly objectiveId: string; // the Learning Objective it is
  readonly title: string;
  readonly lessonIds: readonly string[]; // every lesson lives inside the module
  /** Built-in remediation: the reteach that auto-assigns below the pass mark. */
  readonly reteachLessonId: string;
  /** Below this fraction correct on the module, remediation triggers. */
  readonly passThreshold: number;
}

export interface ExamQuestion {
  readonly questionId: string; // must contain a module tag, e.g. "U1-Q07_M2"
  readonly moduleId: string; // derived tag, kept explicit for convenience
  readonly prompt?: string;
}

export interface Exam {
  readonly examId: string;
  readonly title: string;
  readonly grade: string;
  readonly questions: readonly ExamQuestion[];
}

export interface ExamResponse {
  readonly studentId: string;
  readonly questionId: string;
  readonly correct: boolean;
}

export interface ExamRosterEntry {
  readonly studentId: string;
  readonly name: string;
  readonly className: string;
  readonly school: string;
  readonly district: string;
}

/** One module's result within a scope (a student, class, school, or the district). */
export interface ModuleResult {
  readonly moduleId: string;
  readonly objectiveId: string;
  readonly title: string;
  readonly questions: number; // distinct questions tagged to this module
  readonly answered: number;
  readonly correct: number;
  readonly correctPct: number; // 0..1
  readonly passThreshold: number;
  readonly struggling: boolean; // below the module's pass mark
}

/** An auto-triggered remediation: reteach + retake of just that module's portion. */
export interface RemediationTask {
  readonly moduleId: string;
  readonly objectiveId: string;
  readonly title: string;
  readonly reteachLessonId: string;
  readonly retakeQuestionIds: readonly string[]; // the module's questions to retake
  readonly correctPct: number;
  readonly status: 'auto_assigned';
}

export interface ScopeResult {
  readonly label: string;
  readonly overallPct: number;
  readonly byModule: readonly ModuleResult[];
  readonly strugglingModules: readonly ModuleResult[];
}

export interface StudentScopeResult extends ScopeResult {
  readonly studentId: string;
  readonly className: string;
  readonly school: string;
  /** The retakes this student has been auto-assigned by the module rules. */
  readonly remediation: readonly RemediationTask[];
}

export interface ModuleTagCheck {
  readonly allTagged: boolean;
  readonly untagged: readonly string[]; // question ids missing a _M# tag
}

export interface ExamAnalysis {
  readonly examId: string;
  readonly title: string;
  readonly grade: string;
  readonly questionCount: number;
  readonly moduleCount: number;
  readonly studentCount: number;
  readonly tagCheck: ModuleTagCheck;
  readonly districtScope: ScopeResult;
  readonly schoolScopes: readonly ScopeResult[];
  readonly classScopes: readonly ScopeResult[];
  readonly studentScopes: readonly StudentScopeResult[];
  /** Every auto-assigned retake across the grade — the remediation worklist. */
  readonly remediationQueue: readonly (RemediationTask & { studentId: string; studentName: string; className: string })[];
}

const DEFAULT_THRESHOLD = 0.7;
const round = (n: number) => Math.round(n * 1000) / 1000;

/**
 * The integrity gate for the module naming convention: every question id must
 * carry a `_M#` tag, or it cannot be tracked by module. Mirrors the item-integrity
 * gate — a question that can't be traced to a module shouldn't ship.
 */
export function checkModuleTags(exam: Exam): ModuleTagCheck {
  const untagged = exam.questions.filter((q) => !hasModuleTag(q.questionId)).map((q) => q.questionId);
  return { allTagged: untagged.length === 0, untagged };
}

function moduleMap(modules: readonly ModuleDef[]): Map<string, ModuleDef> {
  return new Map(modules.map((m) => [m.moduleId, m]));
}

/** Aggregate a set of responses by module tag (read from the question id). */
function breakdown(
  exam: Exam,
  responses: readonly ExamResponse[],
  modules: Map<string, ModuleDef>,
): readonly ModuleResult[] {
  // distinct questions per module, from the exam definition
  const qPerModule = new Map<string, Set<string>>();
  for (const q of exam.questions) {
    const tag = moduleTag(q.questionId);
    if (!tag) continue;
    (qPerModule.get(tag) ?? qPerModule.set(tag, new Set()).get(tag)!).add(q.questionId);
  }
  const acc = new Map<string, { answered: number; correct: number }>();
  for (const r of responses) {
    const tag = moduleTag(r.questionId);
    if (!tag) continue;
    const a = acc.get(tag) ?? { answered: 0, correct: 0 };
    a.answered += 1;
    if (r.correct) a.correct += 1;
    acc.set(tag, a);
  }
  return [...acc.entries()]
    .map(([moduleId, a]) => {
      const def = modules.get(moduleId);
      const threshold = def?.passThreshold ?? DEFAULT_THRESHOLD;
      const correctPct = a.answered ? round(a.correct / a.answered) : 0;
      return {
        moduleId,
        objectiveId: def?.objectiveId ?? moduleId,
        title: def?.title ?? moduleId,
        questions: qPerModule.get(moduleId)?.size ?? 0,
        answered: a.answered,
        correct: a.correct,
        correctPct,
        passThreshold: threshold,
        struggling: correctPct < threshold,
      };
    })
    .sort((x, y) => x.correctPct - y.correctPct); // worst-first
}

function scope(
  label: string,
  exam: Exam,
  responses: readonly ExamResponse[],
  modules: Map<string, ModuleDef>,
): ScopeResult {
  const byModule = breakdown(exam, responses, modules);
  const answered = responses.length;
  const correct = responses.filter((r) => r.correct).length;
  return {
    label,
    overallPct: answered ? round(correct / answered) : 0,
    byModule,
    strugglingModules: byModule.filter((m) => m.struggling),
  };
}

/** All question ids on the exam that belong to a module. */
function questionsForModule(exam: Exam, moduleId: string): string[] {
  return exam.questions.filter((q) => moduleTag(q.questionId) === moduleId).map((q) => q.questionId);
}

/**
 * Analyze an exam by module at district / school / class / student scope, and
 * auto-assign remediation (reteach + retake of that module's portion) to any
 * student who falls below a module's pass mark.
 */
export function analyzeExam(
  exam: Exam,
  responses: readonly ExamResponse[],
  roster: readonly ExamRosterEntry[],
  modules: readonly ModuleDef[],
): ExamAnalysis {
  const mods = moduleMap(modules);
  const rosterById = new Map(roster.map((e) => [e.studentId, e]));
  const respByStudent = new Map<string, ExamResponse[]>();
  for (const r of responses) {
    (respByStudent.get(r.studentId) ?? respByStudent.set(r.studentId, []).get(r.studentId)!).push(r);
  }

  const groupScopes = (key: (e: ExamRosterEntry) => string): ScopeResult[] => {
    const groups = [...new Set(roster.map(key))].sort((a, b) => a.localeCompare(b));
    return groups.map((g) => {
      const ids = new Set(roster.filter((e) => key(e) === g).map((e) => e.studentId));
      return scope(g, exam, responses.filter((r) => ids.has(r.studentId)), mods);
    });
  };

  const studentScopes: StudentScopeResult[] = [...respByStudent.entries()]
    .map(([studentId, rs]) => {
      const entry = rosterById.get(studentId);
      const s = scope(entry?.name ?? studentId, exam, rs, mods);
      const remediation: RemediationTask[] = s.strugglingModules.map((m) => ({
        moduleId: m.moduleId,
        objectiveId: m.objectiveId,
        title: m.title,
        reteachLessonId: mods.get(m.moduleId)?.reteachLessonId ?? `reteach-${m.moduleId}`,
        retakeQuestionIds: questionsForModule(exam, m.moduleId),
        correctPct: m.correctPct,
        status: 'auto_assigned' as const,
      }));
      return {
        ...s,
        studentId,
        className: entry?.className ?? '—',
        school: entry?.school ?? '—',
        remediation,
      };
    })
    .sort((a, b) => a.overallPct - b.overallPct);

  const remediationQueue = studentScopes.flatMap((s) =>
    s.remediation.map((t) => ({ ...t, studentId: s.studentId, studentName: s.label, className: s.className })),
  );

  return {
    examId: exam.examId,
    title: exam.title,
    grade: exam.grade,
    questionCount: exam.questions.length,
    moduleCount: new Set(exam.questions.map((q) => moduleTag(q.questionId)).filter(Boolean)).size,
    studentCount: respByStudent.size,
    tagCheck: checkModuleTags(exam),
    districtScope: scope(roster[0]?.district ?? 'District', exam, responses, mods),
    schoolScopes: groupScopes((e) => e.school),
    classScopes: groupScopes((e) => e.className),
    studentScopes,
    remediationQueue,
  };
}
