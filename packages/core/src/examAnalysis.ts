/**
 * Exam analysis by Learning Objective.
 *
 * Every exam question is tagged to exactly one Learning Objective (the same LO its
 * lessons teach). Given the students' responses, this rolls the results back up by
 * Learning Objective — for one student, one class, or the whole grade — so you can
 * see *which Learning Objective* was missed and open remediation on exactly that.
 *
 * No AI: deterministic aggregation over tagged responses. This is the reporting side
 * of the same objective-anchored model the item-integrity gate already enforces.
 */

export interface ExamQuestion {
  readonly questionId: string;
  /** The Learning Objective this question measures. */
  readonly objectiveId: string;
  readonly objectiveTitle: string;
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
}

/** One Learning Objective's result within a scope (a student, a class, or the grade). */
export interface ExamObjectiveResult {
  readonly objectiveId: string;
  readonly objectiveTitle: string;
  readonly questions: number; // distinct exam questions tagged to this LO
  readonly answered: number; // responses counted in this scope
  readonly correct: number;
  readonly correctPct: number; // 0..1
  readonly struggling: boolean; // below the mastery threshold → remediation offered
}

export interface ScopeResult {
  readonly label: string;
  readonly overallPct: number;
  readonly byObjective: readonly ExamObjectiveResult[];
  /** Learning Objectives below threshold, worst-first — the remediation queue. */
  readonly strugglingObjectives: readonly ExamObjectiveResult[];
}

export interface ExamAnalysis {
  readonly examId: string;
  readonly title: string;
  readonly grade: string;
  readonly threshold: number;
  readonly questionCount: number;
  readonly objectiveCount: number;
  readonly studentCount: number;
  /** The whole grade, per Learning Objective. */
  readonly gradeScope: ScopeResult;
  /** Each class, per Learning Objective. */
  readonly classScopes: readonly ScopeResult[];
  /** Each student, per Learning Objective. */
  readonly studentScopes: readonly (ScopeResult & { studentId: string; className: string })[];
}

const DEFAULT_THRESHOLD = 0.7;
const round = (n: number) => Math.round(n * 1000) / 1000;

/** Aggregate a set of responses by Learning Objective, given the exam's question map. */
function breakdown(
  exam: Exam,
  responses: readonly ExamResponse[],
  threshold: number,
): readonly ExamObjectiveResult[] {
  const qToObjective = new Map(exam.questions.map((q) => [q.questionId, q]));
  // Distinct questions per objective (from the exam definition, not the responses).
  const questionsPerObjective = new Map<string, Set<string>>();
  for (const q of exam.questions) {
    const set = questionsPerObjective.get(q.objectiveId) ?? new Set<string>();
    set.add(q.questionId);
    questionsPerObjective.set(q.objectiveId, set);
  }
  const acc = new Map<string, { title: string; answered: number; correct: number }>();
  for (const r of responses) {
    const q = qToObjective.get(r.questionId);
    if (!q) continue; // response to a question not on this exam → ignore
    const a = acc.get(q.objectiveId) ?? { title: q.objectiveTitle, answered: 0, correct: 0 };
    a.answered += 1;
    if (r.correct) a.correct += 1;
    acc.set(q.objectiveId, a);
  }
  return [...acc.entries()]
    .map(([objectiveId, a]) => {
      const correctPct = a.answered ? round(a.correct / a.answered) : 0;
      return {
        objectiveId,
        objectiveTitle: a.title,
        questions: questionsPerObjective.get(objectiveId)?.size ?? 0,
        answered: a.answered,
        correct: a.correct,
        correctPct,
        struggling: correctPct < threshold,
      };
    })
    .sort((x, y) => x.correctPct - y.correctPct); // worst-first
}

function scope(
  label: string,
  exam: Exam,
  responses: readonly ExamResponse[],
  threshold: number,
): ScopeResult {
  const byObjective = breakdown(exam, responses, threshold);
  const answered = responses.length;
  const correct = responses.filter((r) => r.correct).length;
  return {
    label,
    overallPct: answered ? round(correct / answered) : 0,
    byObjective,
    strugglingObjectives: byObjective.filter((o) => o.struggling),
  };
}

/** Analyze an exam by Learning Objective at grade, class, and student scope. */
export function analyzeExam(
  exam: Exam,
  responses: readonly ExamResponse[],
  roster: readonly ExamRosterEntry[],
  threshold: number = DEFAULT_THRESHOLD,
): ExamAnalysis {
  const byStudent = new Map<string, ExamResponse[]>();
  for (const r of responses) {
    const g = byStudent.get(r.studentId) ?? [];
    g.push(r);
    byStudent.set(r.studentId, g);
  }
  const rosterById = new Map(roster.map((e) => [e.studentId, e]));

  const classes = [...new Set(roster.map((e) => e.className))].sort((a, b) => a.localeCompare(b));
  const classScopes = classes.map((className) => {
    const ids = new Set(roster.filter((e) => e.className === className).map((e) => e.studentId));
    return scope(className, exam, responses.filter((r) => ids.has(r.studentId)), threshold);
  });

  const studentScopes = [...byStudent.entries()]
    .map(([studentId, rs]) => {
      const entry = rosterById.get(studentId);
      const s = scope(entry?.name ?? studentId, exam, rs, threshold);
      return { ...s, studentId, className: entry?.className ?? '—' };
    })
    .sort((a, b) => a.overallPct - b.overallPct);

  return {
    examId: exam.examId,
    title: exam.title,
    grade: exam.grade,
    threshold,
    questionCount: exam.questions.length,
    objectiveCount: new Set(exam.questions.map((q) => q.objectiveId)).size,
    studentCount: byStudent.size,
    gradeScope: scope(`Grade ${exam.grade}`, exam, responses, threshold),
    classScopes,
    studentScopes,
  };
}
