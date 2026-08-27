import Link from 'next/link';
import { getBaseline, getBaselineToInstruction } from '../../lib/data';
import { PatternBadge } from '../../components/ui';
import type { DeliveryPattern, NextStep, ProcessingDomain, SignalStrength } from '@ilp/core';

const DOMAIN_LABEL: Record<ProcessingDomain, string> = {
  phonological_awareness: 'Phonological awareness',
  letter_sound_decoding: 'Letter–sound decoding',
  rapid_naming: 'Rapid naming',
  oral_language: 'Oral language',
  working_memory: 'Working memory',
  processing_speed: 'Processing speed',
  sustained_attention: 'Sustained attention',
  number_sense: 'Number sense',
  visual_motor: 'Visual-motor / handwriting',
  oral_written_gap: 'Oral-vs-written gap',
  performance_conditions: 'Performance conditions',
};
const STEP_LABEL: Record<NextStep, { text: string; cls: string }> = {
  continue_monitoring: { text: 'Keep monitoring', cls: '' },
  classroom_support: { text: 'Classroom support', cls: '' },
  targeted_intervention: { text: 'Targeted intervention', cls: '' },
  specialist_screening_referral: { text: 'Specialist screening referral', cls: 'referral' },
  family_notification: { text: 'Notify family', cls: 'notify' },
};
const SIG_LABEL: Record<SignalStrength, string> = { none: 'None', monitor: 'Monitor', emerging: 'Emerging', notable: 'Notable' };
const pctS = (f: number) => `${Math.round(f * 100)}%`;

export default function BaselinePage() {
  const p = getBaseline();
  const wire = getBaselineToInstruction();

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Baseline intake · universal screening (MTSS/RTI)
      </div>
      <h1>Meeting {p.studentId === 'S-311' ? 'Noah' : 'the student'} where he is</h1>
      <p className="lede">
        A short, age-appropriate baseline across the ways a child receives and processes
        information — spread over several sessions, never a single test. It surfaces subtle,
        early signals so support can start now.
      </p>

      <p style={{ marginBottom: 16 }}>
        <Link href="/baseline/take" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>▶ Take the baseline (interactive)</Link>
      </p>

      <div className="banner">
        <span className="ic">🧭</span>
        <div>
          <b>This is a screening, not a diagnosis.</b>
          <p>{p.disclaimer} Every signal below routes to a person — a teacher, a specialist screener, or a family conversation. Only qualified professionals, with the family, can determine a learning disability.</p>
        </div>
      </div>

      <div className="kpis" style={{ marginBottom: 20 }}>
        <div className="kpi"><div className="n">{p.sessionsUsed}</div><div className="l">sessions of evidence</div></div>
        <div className="kpi"><div className="n">{p.indicators.length}</div><div className="l">signals to review</div></div>
        <div className="kpi"><div className="n">{p.ilpHypotheses.length}</div><div className="l">supports seeded into her plan</div></div>
        <div className="kpi"><div className="n">{p.sufficientEvidence ? 'Yes' : 'Not yet'}</div><div className="l">enough evidence to act</div></div>
      </div>

      <h2>How he receives &amp; processes information</h2>
      <div className="card">
        <div className="bars">
          {p.domains.map((d) => (
            <div className="bar-row" key={d.domain}>
              <span className="name" title={DOMAIN_LABEL[d.domain]}>{DOMAIN_LABEL[d.domain]}</span>
              <span className="bar-track"><span className={`bar-fill ${d.readiness >= 0.6 ? 'good' : d.readiness >= 0.45 ? 'mid' : 'low'}`} style={{ width: `${Math.max(3, d.readiness * 100)}%` }} /></span>
              <span className="val">{pctS(d.readiness)} <small>· conf {pctS(d.confidence)}</small></span>
            </div>
          ))}
        </div>
        <p className="thresh">Higher is stronger. Low areas become <em>where to look</em> and <em>where support starts</em> — never a lower standard, and never a label on the whole child (note the strengths).</p>
      </div>

      <h2>Signals a person should look at</h2>
      {p.indicators.map((i) => (
        <div className="indicator" key={i.domain}>
          <div className="head">
            <span className="dom">{DOMAIN_LABEL[i.domain]}</span>
            <span className={`sig ${i.signal}`}>{SIG_LABEL[i.signal]}</span>
            <span className="pill muted">{i.indicatorType}</span>
          </div>
          <div className="pl">{i.plainLanguage}</div>
          <div className="steps">
            {i.nextSteps.map((s) => (
              <span key={s} className={`step-pill ${STEP_LABEL[s].cls}`}>{STEP_LABEL[s].text}</span>
            ))}
          </div>
        </div>
      ))}

      <h2>From screening to instruction — automatically</h2>
      <div className="callout" style={{ marginBottom: 14 }}>
        <p style={{ margin: 0 }}>
          The baseline doesn’t sit in a report. Its {p.ilpHypotheses.length} evidence-based hypotheses feed the
          <strong> assign-once compiler</strong> directly. Below is what the compiler <em>actually selected</em> for
          {' '}{wire.displayName} on the next assignment — computed live, not asserted.
        </p>
      </div>
      {wire.manifest && (
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
            <h3 style={{ margin: 0 }}>{wire.displayName}’s auto-selected delivery</h3>
            <PatternBadge pattern={wire.manifest.pattern as DeliveryPattern} />
            <span className="pill muted">Objective locked</span>
          </div>
          <p className="sub" style={{ marginTop: 0 }}>Assignment: <strong>{wire.objectiveTitle}</strong> — same standard, same rigor for every student.</p>
          <ul className="rationale" style={{ margin: 0 }}>
            {wire.manifest.rationale.map((r, i) => (
              <li key={i}>{r.replace(/\.\.$/, '.')}</li>
            ))}
          </ul>
          <p className="thresh" style={{ marginTop: 10 }}>
            Supports tagged <em>access</em> keep the rigor unchanged; <em>scaffolds</em> fade as {wire.displayName}
            {' '}gains independence. The teacher can override any of it — the compiler recommends, the teacher decides.
          </p>
        </div>
      )}

      <div className="card">
        <h3>The family hears about it — right away</h3>
        <p className="sub">No surprises. Aligned with Florida’s K-3 notification rule.</p>
        {p.familyNotification ? (
          <p style={{ fontSize: '0.92rem', fontStyle: 'italic', borderLeft: '3px solid var(--brand)', paddingLeft: 12 }}>“{p.familyNotification}”</p>
        ) : (
          <p style={{ fontSize: '0.92rem' }}>No family notification required this cycle.</p>
        )}
      </div>

      <p className="footnote">
        Computed by <span className="mono">@ilp/core</span> (<span className="mono">buildBaselineProfile</span>) on synthetic data.
        Modeled on MTSS/RTI universal screening and Florida’s K-3 dyslexia-screening statute (F.S. 1008.25). The data model has
        no field in which a diagnosis could be stored.
      </p>
    </>
  );
}
