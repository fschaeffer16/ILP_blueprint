import Link from 'next/link';
import { getMiddleGradesShowcase } from '../../lib/data';
import { PatternBadge } from '../../components/ui';
import type { DeliveryPattern } from '@ilp/core';

export default function MiddleGradesPage() {
  const s = getMiddleGradesShowcase();

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Grade 6 · one profile, every period
      </div>
      <h1>Middle school: many teachers, one child.</h1>
      <p className="lede">
        Middle school changes the shape of the problem. In elementary, one teacher holds the whole
        picture of a child; in sixth grade that picture shatters across six teachers who may never
        compare notes. ILP is the piece that doesn’t shatter: <strong>one profile follows the student
        into every period</strong>. Below, the same three sixth-graders move from Period 1 math to
        Period 4 ELA — different teachers, different subjects — and each teacher just assigns once.
        The baseline and the plan ride along automatically.
      </p>

      <div className="callout" style={{ marginBottom: 18 }}>
        <strong>{s.allValid ? '✓' : '⚠'} Real, gate-validated grade-6 content.</strong> {s.objectiveCount} B.E.S.T.-mapped
        grade-6 Learning Objectives (ratios, unit rates, central idea), each a module with tagged items,
        passing the same guardrails as the grade-3 and Kindergarten packs. Every delivery below is the
        compiler’s live output. And note Mateo: <strong>semi-verbal, mainstreamed, on the 12-and-older
        dedicated-phone plan</strong> — his IEP was entered once, and his AAC channel appears in{' '}
        <em>both</em> periods without either teacher lifting a finger.
      </div>

      {s.periods.map((p) => (
        <div key={p.objectiveId} style={{ marginBottom: 22 }}>
          <h2 style={{ marginBottom: 4 }}>{p.classLabel}</h2>
          <p className="sub" style={{ marginTop: 0 }}>
            Learning Objective <span className="mono">{p.objectiveId}</span>: <em>{p.outcome}</em>
          </p>
          <div className="grid cols-3">
            {p.students.map((st) => (
              <div className="card" key={st.name}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0 }}>{st.name}</h3>
                  <PatternBadge pattern={st.pattern as DeliveryPattern} />
                </div>
                <p style={{ margin: '0 0 8px', fontSize: '0.88rem' }}>{st.blurb}</p>
                {st.applied.length > 0 ? (
                  <div className="flags" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {st.applied.map((a) => (
                      <span key={a.id} className={`pill ${a.fromPlan ? 'brand' : 'warn'}`} title={a.fromPlan ? 'Carried from the IEP — entered once, rides everywhere.' : a.permanent ? 'Access support' : 'Scaffold — fades on evidence.'}>
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
        </div>
      ))}

      <div className="banner" style={{ marginTop: 6 }}>
        <span className="ic">🎒</span>
        <div>
          <b>Entered once. Carried everywhere. That is the middle-school promise.</b>
          <p>
            Six periods a day is six chances for an accommodation to be forgotten — unless the software
            carries it. Mateo’s teachers didn’t coordinate; the compiler did. His mastery evidence flows
            into the same module tracking as everyone’s (see <Link href="/ese">the picture-response
            channel</Link> and <Link href="/iep">his plan and goals</Link>), and his support team’s day
            lives at <Link href="/facilitator">Facilitator</Link>. Grade 7 mirrors this setup; full 6–8
            coverage is an authoring track on proven machinery, like the grade-3 pack.
          </p>
        </div>
      </div>

      <p className="footnote">
        Computed live by <span className="mono">@ilp/core</span> — each student’s baseline becomes the
        compiler’s learner model; Mateo’s plan adds <span className="mono">iepToConstraints</span>.
        Synthetic students; gate-validated content (<span className="mono">buildCatalog</span>). See{' '}
        <Link href="/early-grades">Kindergarten</Link> for the other end of the K-12 span.
      </p>
    </>
  );
}
