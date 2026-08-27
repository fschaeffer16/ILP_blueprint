import Link from 'next/link';
import { getExamAnalysis } from '../../lib/data';
import type { ExamObjectiveResult, ScopeResult } from '@ilp/core';

const SCOPES = [
  { key: 'grade', label: 'Whole grade' },
  { key: 'class', label: 'By class' },
  { key: 'student', label: 'By student' },
] as const;
type ScopeKey = (typeof SCOPES)[number]['key'];

const pct = (f: number) => `${Math.round(f * 100)}%`;
function band(f: number): 'good' | 'mid' | 'low' {
  if (f >= 0.7) return 'good';
  if (f >= 0.5) return 'mid';
  return 'low';
}

function ObjectiveBars({ rows }: { rows: readonly ExamObjectiveResult[] }) {
  return (
    <div className="bars">
      {rows.map((o) => (
        <div className="bar-row" key={o.objectiveId}>
          <span className="name" title={`${o.objectiveId} · ${o.objectiveTitle}`}>
            {o.objectiveTitle} <small style={{ color: 'var(--muted)' }}>{o.objectiveId}</small>
          </span>
          <span className="bar-track" role="img" aria-label={`${pct(o.correctPct)} correct`}>
            <span className={`bar-fill ${band(o.correctPct)}`} style={{ width: `${Math.max(2, o.correctPct * 100)}%` }} />
          </span>
          <span className="val">
            {pct(o.correctPct)} <small>· {o.correct}/{o.answered}</small>
            {o.struggling && (
              <Link href={`/library?o=${o.objectiveId}`} className="pill danger" style={{ marginLeft: 8 }}>↻ Reteach</Link>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

function Remediation({ scope }: { scope: ScopeResult }) {
  if (scope.strugglingObjectives.length === 0) {
    return (
      <div className="callout" style={{ marginTop: 14 }}>
        <h3>✓ No Learning Objective below the line</h3>
        <p>Every Learning Objective on this exam cleared the mastery bar for this scope. Nothing to reteach.</p>
      </div>
    );
  }
  return (
    <div className="callout danger" style={{ marginTop: 14 }}>
      <h3>Instant remediation — {scope.strugglingObjectives.length} Learning Objective{scope.strugglingObjectives.length === 1 ? '' : 's'} to reteach</h3>
      <p style={{ marginBottom: 10 }}>
        Each weak Learning Objective already has a materially-different reteach and an equivalent
        reassessment ready. Open it, or assign it — today, not next test window.
      </p>
      <div className="decision-row">
        {scope.strugglingObjectives.map((o) => (
          <span key={o.objectiveId} style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <Link href={`/library?o=${o.objectiveId}`} className="btnish primary">↻ Reteach: {o.objectiveTitle} ({pct(o.correctPct)})</Link>
            <Link href="/assign" className="btnish">Assign</Link>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ExamPage({ searchParams }: { searchParams: { by?: string } }) {
  const a = getExamAnalysis();
  const by = (SCOPES.find((s) => s.key === searchParams.by)?.key ?? 'grade') as ScopeKey;

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Exam analysis · by Learning Objective
      </div>
      <h1>{a.title}</h1>
      <p className="lede">
        Every question on this exam is tagged to a Learning Objective, so the results roll up by
        Learning Objective — for the whole grade, a single class, or one student. Wherever a Learning
        Objective falls below <strong>{pct(a.threshold)}</strong>, remediation is one click away.
      </p>

      <div className="kpis" style={{ marginBottom: 16 }}>
        <div className="kpi"><div className="n">{pct(a.gradeScope.overallPct)}</div><div className="l">grade correct overall</div></div>
        <div className="kpi"><div className="n">{a.questionCount}</div><div className="l">questions</div></div>
        <div className="kpi"><div className="n">{a.objectiveCount}</div><div className="l">Learning Objectives covered</div></div>
        <div className="kpi"><div className="n">{a.studentCount}</div><div className="l">students</div></div>
      </div>

      <nav className="levels" aria-label="Scope">
        {SCOPES.map((s) => (
          <Link key={s.key} href={`/exam?by=${s.key}`} className={s.key === by ? 'on' : ''} aria-current={s.key === by ? 'page' : undefined}>
            {s.label}
          </Link>
        ))}
      </nav>

      {by === 'grade' && (
        <>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>{a.gradeScope.label} — every Learning Objective, worst-first</h3>
            <ObjectiveBars rows={a.gradeScope.byObjective} />
            <p className="thresh">Bar = % of questions correct across the grade. Green ≥ 70% · amber ≥ 50% · red below. A red “↻ Reteach” means that Learning Objective is below the mastery line.</p>
          </div>
          <Remediation scope={a.gradeScope} />
        </>
      )}

      {by === 'class' && (
        <div className="grid cols-2">
          {a.classScopes.map((c) => (
            <div className="card" key={c.label}>
              <h3 style={{ marginTop: 0 }}>{c.label} <span className="pill muted" style={{ marginLeft: 6 }}>{pct(c.overallPct)} overall</span></h3>
              <ObjectiveBars rows={c.byObjective} />
              {c.strugglingObjectives.length > 0 && (
                <div className="decision-row" style={{ marginTop: 10 }}>
                  {c.strugglingObjectives.map((o) => (
                    <Link key={o.objectiveId} href={`/library?o=${o.objectiveId}`} className="btnish primary">↻ Reteach {o.objectiveId}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {by === 'student' && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Every student, weakest overall first</h3>
          <div className="worklist">
            {a.studentScopes.map((s) => (
              <div className="workitem" key={s.studentId} style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', gap: 10 }}>
                  <span className="t">{s.label} <small style={{ color: 'var(--muted)' }}>· {s.className}</small></span>
                  <span className={`pill ${band(s.overallPct) === 'good' ? 'ok' : band(s.overallPct) === 'mid' ? 'warn' : 'danger'}`}>{pct(s.overallPct)}</span>
                </div>
                {s.strugglingObjectives.length > 0 ? (
                  <div className="flags">
                    {s.strugglingObjectives.map((o) => (
                      <Link key={o.objectiveId} href={`/library?o=${o.objectiveId}`} className="pill danger" title={`${pct(o.correctPct)} correct`}>
                        ↻ {o.objectiveTitle}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <span className="pill ok">✓ All Learning Objectives cleared</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="footnote">
        Computed by <span className="mono">@ilp/core</span> (<span className="mono">analyzeExam</span>) from tagged,
        synthetic responses. Every question carries its Learning Objective, so nothing here is hand-classified —
        it falls out of the same objective-anchored model the item-integrity gate enforces.
      </p>
    </>
  );
}
