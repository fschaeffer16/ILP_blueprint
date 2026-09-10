import Link from 'next/link';
import { getEseShowcase, getPictureResponse } from '../../lib/data';
import { PatternBadge } from '../../components/ui';
import { PictureResponse } from '../../components/PictureResponse';
import type { DeliveryPattern } from '@ilp/core';

export default function EsePage() {
  const s = getEseShowcase();
  const pr = getPictureResponse();

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        ESE · meet them where they are
      </div>
      <h1>One class. Every ability.</h1>
      <p className="lede">
        Six students, one general-education classroom, the <strong>same</strong> Learning Objective —
        <em> {s.objective.studentOutcome}</em> Each child’s documented plan (IEP or 504) feeds the compiler
        directly, so their accommodations are applied on <strong>every</strong> assignment, automatically.
        Five of the six work the identical, locked objective; the sixth shows the one lane only humans may open.
      </p>

      <div className="callout" style={{ marginBottom: 18 }}>
        <strong>The rule that makes this trustworthy:</strong> the algorithm never guesses a child’s
        communication channel or legal supports — <em>the IEP declares them</em>, and the compiler carries them.
        Supports that give <strong>access</strong> (captions, AAC, speech-to-text) never fade — you never fade a
        child’s wheelchair. Supports that build skill <strong>fade as independence grows</strong>. And the
        disability named on each card comes from the child’s own team’s documented plan — never from a screener.
      </div>

      <div className="grid cols-2">
        {s.students.map((st) => (
          <div className="card" key={st.name}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0 }}>{st.name}</h3>
              <PatternBadge pattern={st.pattern as DeliveryPattern} />
            </div>
            <p className="sub" style={{ margin: '2px 0 6px', fontWeight: 600 }}>{st.documented}</p>
            <p style={{ margin: '0 0 10px', fontSize: '0.92rem' }}>{st.whereTheyAre}</p>

            <div className="lbl" style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)' }}>
              What the compiler applied — automatically
            </div>
            <div className="worklist" style={{ marginTop: 4 }}>
              {st.applied.map((a) => (
                <div className="workitem" key={a.id} style={{ alignItems: 'flex-start' }}>
                  <span>
                    <span className="t" style={{ fontSize: '0.9rem' }}>{a.label}</span>
                    {a.fromPlan && (
                      <div className="s" style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                        {a.fromPlan.planType === 'iep' ? 'From her/his IEP' : 'From the 504 plan'}: “{a.fromPlan.planText}”
                      </div>
                    )}
                  </span>
                  {a.permanent
                    ? <span className="pill brand" title="An access channel — never fades.">channel · never fades</span>
                    : <span className="pill warn" title="A development scaffold — removed as independence grows.">scaffold · fades</span>}
                </div>
              ))}
            </div>
            {st.excluded.length > 0 && (
              <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: 'var(--muted)' }}>
                ✕ Excluded by the IEP: {st.excluded.join(', ').replace(/_/g, ' ')} — the plan knows what a score can’t.
              </p>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <span className="pill muted">Objective locked</span>
              <span className={`pill ${st.objectiveModified ? 'danger' : 'ok'}`}>
                {st.objectiveModified ? 'Modified' : 'Standard unchanged'}
              </span>
            </div>
          </div>
        ))}

        <div className="card" style={{ borderStyle: 'dashed' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0 }}>{s.accessPoints.name}</h3>
            <span className="pill danger">Alternate standards · human-authorized</span>
          </div>
          <p className="sub" style={{ margin: '2px 0 6px', fontWeight: 600 }}>{s.accessPoints.documented}</p>
          <p style={{ margin: '0 0 10px', fontSize: '0.92rem' }}>{s.accessPoints.whereTheyAre}</p>
          <div className="locked" style={{ padding: '10px 12px' }}>
            <span className="k">The one lane the engine never enters on its own.</span>{' '}
            Authorized by {s.accessPoints.authorization.authorizedBy} on {s.accessPoints.authorization.authorizedOn}.{' '}
            {s.accessPoints.authorization.note}
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: 26 }}>The picture-response item — try it</h2>
      <p className="lede" style={{ fontSize: '1rem' }}>
        Step 1 of the IEP build, running live: the identical approved question from the module on{' '}
        <em>{pr.objectiveOutcome}</em>, rendered two ways. The class reads text; the nonverbal student
        taps pictures — no reading, no typing. Tap an answer below and watch the engine record the{' '}
        <strong>same mastery evidence</strong>, tagged with the response channel, the prompt level the
        adult noted, and the question’s module — so a symbol tap counts in class, school, and district
        rollups exactly like every other answer.
      </p>
      <PictureResponse data={pr} />
      <p className="footnote" style={{ marginTop: 8 }}>
        The picture buttons are honest part-whole glyphs standing in for the student’s own AAC symbol
        set, which a deployed build imports rather than replaces. Rendering refuses any item that
        hasn’t passed the integrity gate (<span className="mono">renderSymbolItem</span> /{' '}
        <span className="mono">scoreSymbolResponse</span>, test-pinned).
      </p>

      <div className="banner" style={{ marginTop: 18 }}>
        <span className="ic">🤝</span>
        <div>
          <b>Same class. Same app. Same dignity.</b>
          <p>
            Leo’s AAC device answers the same questions his tablemates answer. Jonah’s captions carry the same
            lesson. Elena is challenged <em>and</em> accommodated at once. Nobody is sent to separate “special”
            software — the delivery adapts inside a shared world. Built to the applied design in{' '}
            <span className="mono">docs/ese-applied-design.md</span>; ESE specialists, SLPs, OTs, and AAC
            specialists co-design this before any classroom use. All data synthetic.
          </p>
        </div>
      </div>

      <p className="footnote">
        Computed live by <span className="mono">@ilp/core</span>: baseline → learner model, plan →{' '}
        <span className="mono">iepToConstraints</span> → forced/excluded adaptations → assign-once compile.
        Every card above shows the compiler’s actual output, and <span className="mono">objectiveModified</span>{' '}
        is false for all five accommodation-lane students. See also{' '}
        <Link href="/early-grades">Kindergarten</Link> · <Link href="/baseline">Baseline &amp; screening</Link> ·{' '}
        <Link href="/adaptive">Adaptive delivery</Link>.
      </p>
    </>
  );
}
