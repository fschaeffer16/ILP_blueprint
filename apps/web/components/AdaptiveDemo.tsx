'use client';

import { useState } from 'react';
import { PatternBadge } from './ui';
import type { DeliveryPattern } from '@ilp/core';

// A fraction bar: `parts` equal segments, `shaded` filled.
function FractionBar({ parts, shaded, label }: { parts: number; shaded: number; label: string }) {
  const W = 210, H = 30, gap = 2, seg = (W - gap * (parts - 1)) / parts;
  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} width="100%" style={{ maxWidth: 240 }} role="img" aria-label={`${shaded} of ${parts} parts shaded`}>
      {Array.from({ length: parts }, (_, i) => (
        <rect key={i} x={i * (seg + gap)} y={0} width={seg} height={H} rx={4}
          fill={i < shaded ? 'var(--brand)' : 'var(--surface-2)'} stroke="var(--border)" />
      ))}
      <text x={0} y={H + 14} fontSize="12" fontWeight="700" fill="var(--muted)">{label}</text>
    </svg>
  );
}

// A simple 0–50 number line marking a value between two tens.
function NumberLine({ value, low, high }: { value: number; low: number; high: number }) {
  const W = 240, y = 26, x = (n: number) => 10 + ((n - low) / (high - low)) * (W - 20);
  return (
    <svg viewBox={`0 0 ${W} 46`} width="100%" style={{ maxWidth: 280 }} role="img" aria-label={`${value} on a number line between ${low} and ${high}`}>
      <line x1={10} y1={y} x2={W - 10} y2={y} stroke="var(--muted)" strokeWidth="1.5" />
      {[low, (low + high) / 2, high].map((n) => (
        <g key={n}>
          <line x1={x(n)} y1={y - 5} x2={x(n)} y2={y + 5} stroke="var(--muted)" strokeWidth="1.5" />
          <text x={x(n)} y={y + 18} fontSize="11" fontWeight="700" fill="var(--muted)" textAnchor="middle">{n}</text>
        </g>
      ))}
      <circle cx={x(value)} cy={y} r={5} fill="var(--brand)" />
      <text x={x(value)} y={y - 9} fontSize="11" fontWeight="800" fill="var(--brand)" textAnchor="middle">{value}</text>
    </svg>
  );
}

interface Variant {
  student: string;
  pattern: DeliveryPattern;
  reason: string;
  fades: boolean; // does the scaffold fade as independence grows?
  cue?: React.ReactNode; // the added support (shown when scaffolds are on)
}
interface Question {
  id: string;
  label: string;
  objective: string;
  prompt: string;
  answer: string;
  variants: Variant[];
}

const QUESTIONS: Question[] = [
  {
    id: 'compare',
    label: 'Compare fractions',
    objective: 'M3.NF.02',
    prompt: 'Which is greater: 1/3 or 1/6?',
    answer: '1/3',
    variants: [
      { student: 'Ava', pattern: 'core', reason: 'On level — no support needed.', fades: false },
      {
        student: 'Diego', pattern: 'visual_first', fades: true,
        reason: 'Baseline: strong visual-spatial, symbolic fractions still forming — the model leads.',
        cue: <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 8 }}><FractionBar parts={3} shaded={1} label="1/3" /><FractionBar parts={6} shaded={1} label="1/6" /></div>,
      },
      {
        student: 'Mia', pattern: 'vocabulary_supported', fades: false,
        reason: 'English-language support — the math is fine, the words are the barrier. Read-aloud on.',
        cue: <ul className="rationale" style={{ margin: '8px 0 0' }}><li><strong>greater</strong> = bigger</li><li><strong>numerator</strong> (top) = parts you have</li><li><strong>denominator</strong> (bottom) = equal parts in all</li></ul>,
      },
      {
        student: 'Ben', pattern: 'guided_practice', fades: true,
        reason: 'Recently below the pass mark — a first step lowers the entry, not the bar.',
        cue: <div className="locked" style={{ padding: '10px 12px', marginTop: 8 }}><span className="k">Step 1:</span> Fewer pieces = <em>bigger</em> pieces. 3 pieces vs 6 — which single piece is bigger?</div>,
      },
      {
        student: 'Cara', pattern: 'advanced_transfer', fades: false,
        reason: 'Already mastered comparing — extended within the same objective, rigor up.',
        cue: <p style={{ margin: '8px 0 0', fontStyle: 'italic', color: 'var(--muted)' }}>…and <strong>how much</strong> greater? Show the difference on a number line and explain.</p>,
      },
    ],
  },
  {
    id: 'round',
    label: 'Rounding',
    objective: 'M3.NSO.04',
    prompt: 'Round 47 to the nearest 10.',
    answer: '50',
    variants: [
      { student: 'Ava', pattern: 'core', reason: 'On level — no support needed.', fades: false },
      {
        student: 'Diego', pattern: 'visual_first', fades: true,
        reason: 'The number line makes "which ten is it closer to" concrete.',
        cue: <div style={{ marginTop: 8 }}><NumberLine value={47} low={40} high={50} /></div>,
      },
      {
        student: 'Mia', pattern: 'vocabulary_supported', fades: false,
        reason: 'Key terms glossed; read-aloud on.',
        cue: <ul className="rationale" style={{ margin: '8px 0 0' }}><li><strong>round</strong> = go to the closest ten</li><li><strong>nearest 10</strong> = 40, 50, 60 …</li></ul>,
      },
      {
        student: 'Ben', pattern: 'guided_practice', fades: true,
        reason: 'A first step lowers the entry, not the bar.',
        cue: <div className="locked" style={{ padding: '10px 12px', marginTop: 8 }}><span className="k">Step 1:</span> 47 is between <strong>40</strong> and <strong>50</strong>. Is it past the halfway mark (45)?</div>,
      },
      {
        student: 'Cara', pattern: 'advanced_transfer', fades: false,
        reason: 'Extended within the objective.',
        cue: <p style={{ margin: '8px 0 0', fontStyle: 'italic', color: 'var(--muted)' }}>Now round <strong>471</strong> to the nearest 10 <em>and</em> the nearest 100. Which changes more?</p>,
      },
    ],
  },
  {
    id: 'wordproblem',
    label: 'Word problem',
    objective: 'M3.AR.12',
    prompt: 'A class has 3 tables with 4 students at each table. How many students in all?',
    answer: '12',
    variants: [
      { student: 'Ava', pattern: 'core', reason: 'On level — no support needed.', fades: false },
      {
        student: 'Diego', pattern: 'visual_first', fades: true,
        reason: 'An array turns the words into a picture of equal groups.',
        cue: <div style={{ marginTop: 8, fontSize: '1.4rem', letterSpacing: 2, lineHeight: 1.5 }} aria-label="3 rows of 4">🟦🟦🟦🟦<br />🟦🟦🟦🟦<br />🟦🟦🟦🟦</div>,
      },
      {
        student: 'Mia', pattern: 'vocabulary_supported', fades: false,
        reason: 'Signal words glossed; read-aloud on.',
        cue: <ul className="rationale" style={{ margin: '8px 0 0' }}><li><strong>each</strong> = every one has the same</li><li><strong>in all / total</strong> = add them together</li></ul>,
      },
      {
        student: 'Ben', pattern: 'guided_practice', fades: true,
        reason: 'A first step lowers the entry, not the bar.',
        cue: <div className="locked" style={{ padding: '10px 12px', marginTop: 8 }}><span className="k">Step 1:</span> 3 groups of 4. Draw 3 circles, put 4 in each, then count — or think 3 × 4.</div>,
      },
      {
        student: 'Cara', pattern: 'advanced_transfer', fades: false,
        reason: 'Two-step extension within the objective.',
        cue: <p style={{ margin: '8px 0 0', fontStyle: 'italic', color: 'var(--muted)' }}>Two more tables of 4 arrive. Now how many — and write the equation you used.</p>,
      },
    ],
  },
];

export function AdaptiveDemo() {
  const [qid, setQid] = useState(QUESTIONS[0]!.id);
  const [scaffolds, setScaffolds] = useState(true);
  const q = QUESTIONS.find((x) => x.id === qid)!;

  return (
    <>
      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div className="lbl" style={{ marginBottom: 6 }}>Pick a question (same objective, different module)</div>
            <div className="levels" style={{ margin: 0 }}>
              {QUESTIONS.map((x) => (
                <button key={x.id} onClick={() => setQid(x.id)} className={x.id === qid ? 'on' : ''}
                  style={{ font: 'inherit', cursor: 'pointer', border: '1px solid var(--border)', background: x.id === qid ? 'var(--brand-weak)' : 'var(--surface)', color: x.id === qid ? 'var(--brand)' : 'var(--muted)', padding: '6px 12px', borderRadius: 8, fontWeight: 600, fontSize: '.88rem' }}>
                  {x.label} <small style={{ opacity: .7 }}>{x.objective}</small>
                </button>
              ))}
            </div>
          </div>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '.9rem', fontWeight: 600, cursor: 'pointer' }}>
            <input type="checkbox" checked={scaffolds} onChange={(e) => setScaffolds(e.target.checked)} />
            {scaffolds ? 'Scaffolds ON — as first taught' : 'Faded — as independence grows'}
          </label>
        </div>
      </div>

      <div className="grid cols-2">
        {q.variants.map((v) => {
          const showCue = v.cue && (scaffolds || !v.fades);
          const faded = v.cue && v.fades && !scaffolds;
          return (
            <div className="card" key={v.student}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0 }}>{v.student}</h3>
                <PatternBadge pattern={v.pattern} />
              </div>
              <p className="sub" style={{ marginTop: 0 }}>{v.reason}</p>
              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
                <p style={{ fontSize: '1.02rem', margin: 0 }}>
                  {v.pattern === 'vocabulary_supported' && showCue && <span aria-hidden="true">🔊 </span>}
                  <strong>{q.prompt}</strong>
                </p>
                {showCue && v.cue}
                {faded && <p style={{ margin: '8px 0 0', fontSize: '.86rem', color: 'var(--ok)', fontWeight: 700 }}>✓ scaffold faded — {v.student} now works it independently</p>}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="pill ok">Answer: {q.answer}</span>
                <span className="pill muted">Objective locked</span>
                {v.fades && <span className="pill brand" title="This scaffold is removed as the student gains independence.">⤵ fades</span>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
