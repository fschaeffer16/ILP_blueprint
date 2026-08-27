import Link from 'next/link';
import { getNaviFlagReport } from '../../lib/data';

const REASON_LABEL: Record<string, string> = {
  unanswered: 'Couldn’t answer',
  answer_seeking: 'Wanted the answer',
  stuck: 'Said they were stuck',
  repeated: 'Kept asking',
};

export default function FlagsPage() {
  const report = getNaviFlagReport();

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Teacher · Navi help signals
      </div>
      <h1>Where students are stuck</h1>
      <p className="lede">
        Every time the assignment bot can’t answer a question, refuses to hand over the answer, or
        sees a student circling the same idea, it flags it for you here — with the exact question and
        which student asked. This is an <strong>early</strong> signal: you see the confusion forming
        <em> before</em> the graded task, so you can reteach in time.
      </p>

      <div className="kpis" style={{ marginBottom: 16 }}>
        <div className="kpi"><div className="n">{report.totalFlags}</div><div className="l">questions flagged</div></div>
        <div className="kpi"><div className="n">{report.studentsNeedingHelp}</div><div className="l">students needing help</div></div>
        <div className="kpi"><div className="n">{report.objectivesTouched}</div><div className="l">objectives touched</div></div>
        <div className="kpi"><div className="n">{report.byObjective.filter((o) => o.reteachSignal).length}</div><div className="l">reteach signals</div></div>
      </div>

      {report.byObjective.map((o) => (
        <section key={o.objectiveId} className="card" style={{ marginBottom: 14, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <span className="mono" style={{ fontWeight: 700, color: 'var(--brand)' }}>{o.objectiveId}</span>
            {o.standardRefs.length > 0 && (
              <span className="mono" style={{ fontSize: '.72rem', color: 'var(--muted, #778)' }}>{o.standardRefs.join(', ')}</span>
            )}
            {o.reteachSignal ? (
              <span className="pill danger" style={{ marginLeft: 'auto' }}>Reteach signal · {o.studentCount} students</span>
            ) : (
              <span className="pill" style={{ marginLeft: 'auto', opacity: 0.8 }}>{o.studentCount} student{o.studentCount === 1 ? '' : 's'} · {o.flagCount} question{o.flagCount === 1 ? '' : 's'}</span>
            )}
          </div>

          <div style={{ padding: '12px 16px' }}>
            <div style={{ fontWeight: 600, marginBottom: 10 }}>{o.outcome}</div>

            {/* theme chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {o.themes.map((t) => (
                <span key={t.idea} style={{
                  fontSize: '.72rem', fontWeight: 700, padding: '3px 9px', borderRadius: 20,
                  background: t.idea === 'other' ? 'transparent' : 'color-mix(in srgb, var(--brand) 12%, transparent)',
                  border: '1px solid var(--line)', color: t.idea === 'other' ? 'var(--muted, #889)' : 'var(--brand)',
                }}>
                  {t.idea === 'other' ? 'other questions' : t.idea} · {t.count}
                </span>
              ))}
            </div>

            {/* the actual questions */}
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {o.flags.map((f) => (
                <li key={f.id} style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontSize: '.92rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--muted, #778)', minWidth: 78 }}>{f.studentAlias}</span>
                  <span style={{ flex: 1 }}>“{f.question}”</span>
                  <span style={{
                    fontSize: '.66rem', fontWeight: 700, whiteSpace: 'nowrap', padding: '2px 7px', borderRadius: 5,
                    border: '1px solid var(--line)',
                    color: f.reason === 'answer_seeking' ? 'var(--warn, #b9791f)' : 'var(--muted, #889)',
                  }}>{REASON_LABEL[f.reason] ?? f.reason}</span>
                </li>
              ))}
            </ul>

            {o.reteachSignal && (
              <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, background: 'color-mix(in srgb, var(--brand) 8%, transparent)', fontSize: '.85rem' }}>
                <strong>Suggested action:</strong> {o.studentCount} students are circling{' '}
                <strong>{o.themes[0]?.idea !== 'other' ? o.themes[0]?.idea : 'this Learning Objective'}</strong>. Consider a short
                reteach before the graded task — or open the lesson to adjust it.{' '}
                <Link href={`/library?o=${o.objectiveId}`}>Open objective →</Link>
              </div>
            )}
          </div>
        </section>
      ))}

      <p className="footnote">
        Signals from <span className="mono">@ilp/core</span> (<span className="mono">summarizeAssistantFlags</span>). The bot only
        ever flags a question — it never shares one student’s question with another, and it holds no profile data beyond the
        question itself. Synthetic data.
      </p>
    </>
  );
}
