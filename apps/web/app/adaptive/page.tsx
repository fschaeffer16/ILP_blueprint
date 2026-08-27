import Link from 'next/link';
import { PatternBadge } from '../../components/ui';
import type { DeliveryPattern } from '@ilp/core';

/**
 * "One question, every learner." A demonstrator: the teacher pushes ONE question;
 * each student is auto-served a version matched to their baseline-derived profile —
 * same question, same answer, same locked objective, different cues. Rigor never drops;
 * scaffolds fade as the student gains independence.
 *
 * The exemplar question is authored by hand to make the adaptation visible; generic
 * auto-generation of visuals for any item is the model-gateway piece still to build.
 */

// A fraction bar: `parts` equal segments, `shaded` of them filled.
function FractionBar({ parts, shaded, label }: { parts: number; shaded: number; label: string }) {
  const W = 220, H = 34, gap = 2, seg = (W - gap * (parts - 1)) / parts;
  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} width="100%" style={{ maxWidth: 260 }} role="img" aria-label={`${shaded} of ${parts} parts shaded`}>
      {Array.from({ length: parts }, (_, i) => (
        <rect key={i} x={i * (seg + gap)} y={0} width={seg} height={H} rx={4}
          fill={i < shaded ? 'var(--brand)' : 'var(--surface-2)'} stroke="var(--border)" />
      ))}
      <text x={0} y={H + 15} fontSize="13" fontWeight="700" fill="var(--muted)">{label}</text>
    </svg>
  );
}

interface Variant {
  studentName: string;
  pattern: DeliveryPattern;
  baselineReason: string;
  fade?: string;
  render: React.ReactNode;
}

const QUESTION = 'Which is greater: 1/3 or 1/6?';
const ANSWER = '1/3';

const VARIANTS: Variant[] = [
  {
    studentName: 'Ava',
    pattern: 'core',
    baselineReason: 'On level for this module — no support needed.',
    render: <p style={{ fontSize: '1.05rem', margin: 0 }}><strong>{QUESTION}</strong></p>,
  },
  {
    studentName: 'Diego',
    pattern: 'visual_first',
    baselineReason: 'Baseline flagged visual-spatial as a strength and symbolic fractions as still forming — so the model leads.',
    fade: 'The bars fade out over the module as Diego succeeds without them.',
    render: (
      <div>
        <p style={{ fontSize: '1.05rem', margin: '0 0 10px' }}><strong>{QUESTION}</strong> Compare the shaded parts.</p>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          <FractionBar parts={3} shaded={1} label="1/3" />
          <FractionBar parts={6} shaded={1} label="1/6" />
        </div>
      </div>
    ),
  },
  {
    studentName: 'Mia',
    pattern: 'vocabulary_supported',
    baselineReason: 'English-language support: the math is fine, the words get in the way — so key terms are glossed and read-aloud is on.',
    render: (
      <div>
        <p style={{ fontSize: '1.05rem', margin: '0 0 8px' }}>
          <span title="read aloud" aria-hidden="true">🔊 </span><strong>{QUESTION}</strong>
        </p>
        <ul className="rationale" style={{ margin: 0 }}>
          <li><strong>greater</strong> = bigger</li>
          <li><strong>numerator</strong> (top number) = how many parts you have</li>
          <li><strong>denominator</strong> (bottom number) = how many equal parts in all</li>
        </ul>
      </div>
    ),
  },
  {
    studentName: 'Ben',
    pattern: 'guided_practice',
    baselineReason: 'Recently below the pass mark on this module — a first-step scaffold lowers the entry, not the bar.',
    fade: 'The step hint is removed on Ben’s next attempt once he answers two in a row unaided.',
    render: (
      <div>
        <p style={{ fontSize: '1.05rem', margin: '0 0 8px' }}><strong>{QUESTION}</strong></p>
        <div className="locked" style={{ padding: '10px 12px' }}>
          <span className="k">Step 1 (fades):</span> Fewer pieces means <em>bigger</em> pieces. One whole split into
          3 pieces vs. into 6 pieces — which single piece is bigger?
        </div>
      </div>
    ),
  },
  {
    studentName: 'Cara',
    pattern: 'advanced_transfer',
    baselineReason: 'Already mastered comparing — extended within the same objective, rigor up not down.',
    render: (
      <p style={{ fontSize: '1.05rem', margin: 0 }}>
        <strong>{QUESTION}</strong> And <em>how much</em> greater — show the difference on a number line and explain.
      </p>
    ),
  },
];

export default function AdaptivePage() {
  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Adaptive delivery · one question, every learner
      </div>
      <h1>The teacher pushes one question. Each student sees their version.</h1>
      <p className="lede">
        Same Learning Objective, same question, same correct answer (<strong>{ANSWER}</strong>) — the
        <em> presentation</em> adapts to each student’s baseline-derived profile so they have the best chance to
        learn, while the rigor never drops. The teacher assigns once; the compiler does the individualizing.
      </p>

      <div className="callout" style={{ marginBottom: 18 }}>
        <strong>How the profile is set:</strong> a short baseline plus daily classroom evidence builds each
        student’s profile; the assign-once compiler reads it and auto-selects the right support. Supports are
        tagged <em>access</em> (rigor unchanged) or <em>development</em> (strengthen the weakness), and every
        scaffold carries a <strong>fade rule</strong> — removed as the student gains independence, so the
        deficiency actually closes.
      </div>

      <div className="grid cols-2">
        {VARIANTS.map((v) => (
          <div className="card" key={v.studentName}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0 }}>{v.studentName}</h3>
              <PatternBadge pattern={v.pattern} />
            </div>
            <p className="sub" style={{ marginTop: 0 }}>{v.baselineReason}</p>
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
              {v.render}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="pill ok">Answer: {ANSWER}</span>
              <span className="pill muted">Objective locked</span>
              {v.fade && <span className="pill brand" title={v.fade}>⤵ scaffold fades</span>}
            </div>
          </div>
        ))}
      </div>

      <p className="footnote">
        The adaptation the compiler selects per student is real (<span className="mono">@ilp/core</span>{' '}
        assign-once + adaptation engine — see <Link href="/assign">Assign once</Link>). This exemplar renders the
        cues by hand to make it visible; auto-generating visuals for <em>any</em> question is the model-gateway
        work still ahead. Same objective, same answer, adapted delivery — never a lower standard.
      </p>
    </>
  );
}
