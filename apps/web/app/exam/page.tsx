import Link from 'next/link';
import { getExamAnalysis } from '../../lib/data';
import type { ModuleResult, ScopeResult } from '@ilp/core';

const SCOPES = [
  { key: 'district', label: 'District' },
  { key: 'school', label: 'By school' },
  { key: 'class', label: 'By class' },
  { key: 'student', label: 'By student' },
] as const;
type ScopeKey = (typeof SCOPES)[number]['key'];

const pct = (f: number) => `${Math.round(f * 100)}%`;
function band(f: number, threshold = 0.7): 'good' | 'mid' | 'low' {
  if (f >= threshold) return 'good';
  if (f >= threshold - 0.2) return 'mid';
  return 'low';
}

function ModuleBars({ rows }: { rows: readonly ModuleResult[] }) {
  return (
    <div className="bars">
      {rows.map((m) => (
        <div className="bar-row" key={m.moduleId}>
          <span className="name" title={`${m.moduleId} · ${m.objectiveId} · ${m.title}`}>
            <strong>{m.moduleId}</strong> {m.title} <small style={{ color: 'var(--muted)' }}>{m.objectiveId}</small>
          </span>
          <span className="bar-track" role="img" aria-label={`${pct(m.correctPct)} correct`}>
            <span className={`bar-fill ${band(m.correctPct, m.passThreshold)}`} style={{ width: `${Math.max(2, m.correctPct * 100)}%` }} />
          </span>
          <span className="val">
            {pct(m.correctPct)} <small>· {m.correct}/{m.answered}</small>
            {m.struggling && (
              <Link href={`/library?o=${m.objectiveId}`} className="pill danger" style={{ marginLeft: 8 }}>↻ Reteach</Link>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

function ScopeCard({ scope, subtitle }: { scope: ScopeResult; subtitle?: string }) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>
        {scope.label} <span className="pill muted" style={{ marginLeft: 6 }}>{pct(scope.overallPct)} overall</span>
      </h3>
      {subtitle && <p className="sub" style={{ marginTop: 0 }}>{subtitle}</p>}
      <ModuleBars rows={scope.byModule} />
    </div>
  );
}

export default function ExamPage({ searchParams }: { searchParams: { by?: string } }) {
  const a = getExamAnalysis();
  const by = (SCOPES.find((s) => s.key === searchParams.by)?.key ?? 'district') as ScopeKey;

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Exam analysis · by module
      </div>
      <h1>{a.title}</h1>
      <p className="lede">
        Every question is tagged to a module — a Learning Objective — right in its name
        (<span className="mono">…_M1</span>, <span className="mono">…_M2</span>). That tag is how a
        result tracks up from one student to a class, a school, and the whole district. Fall below a
        module’s pass mark and its <strong>reteach auto-assigns, followed by a retake of just that module’s questions</strong>.
      </p>

      <div className="callout" style={{ marginBottom: 16 }}>
        <strong>{a.tagCheck.allTagged ? '✓ Module tags verified' : '⚠ Untagged questions found'}:</strong>{' '}
        {a.tagCheck.allTagged
          ? `all ${a.questionCount} questions carry a _M# tag, so every one is trackable by module.`
          : `${a.tagCheck.untagged.length} question(s) are missing a _M# tag and can't be tracked: ${a.tagCheck.untagged.join(', ')}.`}
      </div>

      <div className="kpis" style={{ marginBottom: 16 }}>
        <div className="kpi"><div className="n">{pct(a.districtScope.overallPct)}</div><div className="l">district correct overall</div></div>
        <div className="kpi"><div className="n">{a.moduleCount}</div><div className="l">modules (Learning Objectives)</div></div>
        <div className="kpi"><div className="n">{a.studentCount}</div><div className="l">students · {a.schoolScopes.length} schools</div></div>
        <div className="kpi"><div className="n" style={{ color: 'var(--danger)' }}>{a.remediationQueue.length}</div><div className="l">retakes auto-assigned</div></div>
      </div>

      <nav className="levels" aria-label="Scope">
        {SCOPES.map((s) => (
          <Link key={s.key} href={`/exam?by=${s.key}`} className={s.key === by ? 'on' : ''} aria-current={s.key === by ? 'page' : undefined}>
            {s.label}
          </Link>
        ))}
      </nav>

      {by === 'district' && (
        <>
          <ScopeCard scope={a.districtScope} subtitle="Every module across the district, worst-first. Green ≥ pass mark · amber within 20 pts · red below." />
          <div className="callout danger" style={{ marginTop: 14 }}>
            <h3>Auto-remediation is live for {a.remediationQueue.length} retakes</h3>
            <p style={{ marginBottom: 8 }}>
              Because remediation is built into every module, each student below a module’s pass mark has
              already been assigned its reteach and a retake of <em>only that module’s questions</em> — no
              teacher action required to start. Weakest modules district-wide:
            </p>
            <div className="decision-row">
              {a.districtScope.strugglingModules.map((m) => (
                <Link key={m.moduleId} href={`/library?o=${m.objectiveId}`} className="btnish primary">
                  ↻ {m.moduleId} · {m.title} ({pct(m.correctPct)})
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {by === 'school' && (
        <div className="grid cols-2">
          {a.schoolScopes.map((s) => <ScopeCard key={s.label} scope={s} />)}
        </div>
      )}

      {by === 'class' && (
        <div className="grid cols-2">
          {a.classScopes.map((c) => <ScopeCard key={c.label} scope={c} />)}
        </div>
      )}

      {by === 'student' && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Every student — weakest first, with their auto-assigned retakes</h3>
          <div className="worklist">
            {a.studentScopes.map((s) => (
              <div className="workitem" key={s.studentId} style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', gap: 10 }}>
                  <span className="t">{s.label} <small style={{ color: 'var(--muted)' }}>· {s.className} · {s.school}</small></span>
                  <span className={`pill ${band(s.overallPct) === 'good' ? 'ok' : band(s.overallPct) === 'mid' ? 'warn' : 'danger'}`}>{pct(s.overallPct)}</span>
                </div>
                {s.remediation.length > 0 ? (
                  <div className="flags">
                    {s.remediation.map((t) => (
                      <Link key={t.moduleId} href={`/library?o=${t.objectiveId}`} className="pill danger"
                        title={`Auto-assigned: reteach ${t.moduleId}, then retake ${t.retakeQuestionIds.length} questions`}>
                        ↻ {t.moduleId} reteach + retake {t.retakeQuestionIds.length}Q
                      </Link>
                    ))}
                  </div>
                ) : (
                  <span className="pill ok">✓ Passed every module — no remediation</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="footnote">
        Computed by <span className="mono">@ilp/core</span> (<span className="mono">analyzeExam</span>,{' '}
        <span className="mono">checkModuleTags</span>) from module-tagged, synthetic responses. The reteach-and-retake
        is auto-triggered by each module’s pass mark — remediation is programmed into the module, not added after the fact.
      </p>
    </>
  );
}
