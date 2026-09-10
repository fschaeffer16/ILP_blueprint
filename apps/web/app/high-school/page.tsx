import Link from 'next/link';
import { getHighSchoolShowcase } from '../../lib/data';
import { PatternBadge } from '../../components/ui';
import type { DeliveryPattern } from '@ilp/core';

const pct = (f: number) => `${Math.round(f * 100)}%`;

export default function HighSchoolPage() {
  const s = getHighSchoolShowcase();

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Grade 9 · Algebra 1 · graduation stakes
      </div>
      <h1>High school: the test that decides a diploma.</h1>
      <p className="lede">
        In high school, standards live inside <strong>credit courses</strong> — and in Florida, the
        Algebra 1 end-of-course exam counts toward the course grade and toward graduation itself.
        That’s exactly where “every question traces to a Learning Objective” stops being tidy
        bookkeeping and starts being the difference between a diploma and a retake: when a practice
        check is module-tagged, the course knows <em>which specific skill</em> is costing which
        student — months before the real EOC.
      </p>

      <div className="callout" style={{ marginBottom: 18 }}>
        <strong>{s.allValid ? '✓' : '⚠'} Real, gate-validated grade-9 content.</strong> {s.objectiveCount} B.E.S.T.-mapped
        objectives (Algebra 1 linear equations MA.912.AR.2.1, linear functions MA.912.AR.2.4, and
        English 1 literary analysis ELA.9.R.1.1), same guardrails as the grade-3, K, and 6 packs.
        Everything below is the engine’s live output.
      </div>

      <h2 style={{ marginBottom: 4 }}>{s.classLabel} — one course, three starting points</h2>
      <p className="sub" style={{ marginTop: 0 }}>
        Learning Objective <span className="mono">{s.objective.objectiveId}</span>: <em>{s.objective.studentOutcome}</em>
      </p>
      <div className="grid cols-3">
        {s.students.map((st) => (
          <div className="card" key={st.name}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0 }}>{st.name}</h3>
              <PatternBadge pattern={st.pattern as DeliveryPattern} />
            </div>
            <p style={{ margin: '0 0 8px', fontSize: '0.88rem' }}>{st.blurb}</p>
            {st.applied.length > 0 ? (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {st.applied.map((a) => (
                  <span key={a.id} className={`pill ${a.fromPlan ? 'brand' : 'warn'}`}>
                    {a.label}{a.fromPlan ? ' · from the IEP' : ''}
                  </span>
                ))}
              </div>
            ) : (
              <span className="pill ok">Core — extended within the objective</span>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <span className="pill muted">Objective locked</span>
              <span className={`pill ${st.objectiveModified ? 'danger' : 'ok'}`}>
                {st.objectiveModified ? 'Modified' : 'Standard unchanged'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 26 }}>{s.eoc.title} — the modules tell you where the EOC will hurt</h2>
      <p className="lede" style={{ fontSize: '1rem' }}>
        {s.eoc.studentCount} students took an 8-question practice check; every question carries its{' '}
        <span className="mono">_M#</span> tag. The class average ({pct(s.eoc.overallPct)}) hides the
        real story — the modules don’t:
      </p>
      <div className="grid cols-2">
        {s.eoc.byModule.map((m) => (
          <div className="card" key={m.moduleId}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0 }}>{m.moduleId} · {m.title}</h3>
              {m.struggling
                ? <span className="pill danger">below the {pct(m.passThreshold)} pass mark</span>
                : <span className="pill ok">on track</span>}
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>
              Class: <strong>{pct(m.correctPct)}</strong> correct across {m.questions} tagged questions —
              Learning Objective <span className="mono">{m.objectiveId}</span>.
            </p>
            {m.struggling && (
              <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
                Reteach tomorrow, not in May: the module names the exact lesson to re-run and the exact
                questions to retake.
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h3 style={{ margin: '0 0 6px' }}>Auto-assigned remediation — reteach + retake, per student, per module</h3>
        <div className="worklist">
          {s.eoc.remediationQueue.map((r, i) => (
            <div className="workitem" key={i}>
              <span>
                <span className="t" style={{ fontSize: '0.9rem' }}>{r.studentName} · {r.moduleId} — {r.title}</span>
                <div className="s" style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                  scored {pct(r.correctPct)} · reteach <span className="mono">{r.reteachLessonId}</span> · retake {r.retakeCount} questions (that module only)
                </div>
              </span>
              <span className="pill warn">auto-assigned</span>
            </div>
          ))}
        </div>
        <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
          Nobody retakes what they already own; nobody’s gap waits for the real EOC to be discovered.
          And Dre’s speech-to-text channel rides into the practice check the same way it rides into
          class — the plan carried, never remembered.
        </p>
      </div>

      <p className="footnote" style={{ marginTop: 14 }}>
        Computed live by <span className="mono">@ilp/core</span> — <span className="mono">buildCatalog</span> gates the
        content, the assign-once compiler individualizes the course, and <span className="mono">analyzeExam</span> runs
        the module analysis with auto remediation. Synthetic students; EOC weighting and graduation
        requirements per Florida statute — verify current rules before formal use. The K-12 span:{' '}
        <Link href="/early-grades">Kindergarten</Link> · grade 3 (<Link href="/library">full pack</Link>) ·{' '}
        <Link href="/middle-grades">grade 6</Link> · grade 9.
      </p>
    </>
  );
}
