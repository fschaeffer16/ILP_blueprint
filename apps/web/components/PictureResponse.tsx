'use client';

import { useState } from 'react';

const LEVEL_LABEL: Record<string, string> = {
  independent: 'Independent',
  gestural_prompt: 'Gestural prompt',
  modeled: 'Modeled',
  full_support: 'Full support',
};

export interface PictureResponseProps {
  data: {
    objectiveOutcome: string;
    itemId: string;
    vocabId: string;
    promptText: string;
    textOptions: string[];
    choices: { choiceId: string; glyph: string; label: string }[];
    outcomes: Record<string, { correct: boolean; value: string; moduleId: string | null }>;
    promptLevels: string[];
  };
}

/**
 * IEP build step 1, live: the same approved item answered by tapping pictures.
 * Every tap displays the engine's pre-scored evidence record — nothing is mocked.
 */
export function PictureResponse({ data }: PictureResponseProps) {
  const [tapped, setTapped] = useState<string | null>(null);
  const [level, setLevel] = useState<string>('independent');
  const outcome = tapped ? data.outcomes[tapped] : null;

  return (
    <div className="grid cols-2" style={{ alignItems: 'stretch' }}>
      <div className="card">
        <div className="lbl" style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)' }}>
          What the class sees
        </div>
        <p style={{ margin: '6px 0 10px', fontWeight: 600 }}>{data.promptText}</p>
        <div className="worklist">
          {data.textOptions.map((o) => (
            <div className="workitem" key={o}>
              <span className="mono" style={{ fontSize: '0.95rem' }}>◯ {o}</span>
            </div>
          ))}
        </div>
        <p className="sub" style={{ marginTop: 10, fontSize: '0.8rem' }}>
          Item <span className="mono">{data.itemId}</span> — approved, gate-checked, tagged to its module.
        </p>
      </div>

      <div className="card">
        <div className="lbl" style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)' }}>
          What Leo sees — same question, on his dedicated phone
        </div>
        <div style={{ maxWidth: 320, margin: '8px auto 0', border: '2px solid var(--line)', borderRadius: 22, padding: '14px 12px 12px', background: 'var(--panel, var(--bg))' }}>
          <p style={{ margin: '0 0 10px', fontWeight: 600, fontSize: '0.95rem', textAlign: 'center' }}>{data.promptText}</p>
          <div style={{ display: 'grid', gap: 8 }}>
            {data.choices.map((c) => (
              <button
                key={c.choiceId}
                onClick={() => setTapped(c.choiceId)}
                aria-pressed={tapped === c.choiceId}
                style={{
                  fontSize: '1.35rem', lineHeight: 1.3, padding: '12px 10px', borderRadius: 14, cursor: 'pointer',
                  border: tapped === c.choiceId ? '2px solid var(--brand)' : '1px solid var(--line)',
                  background: tapped === c.choiceId ? 'var(--brand-weak, transparent)' : 'transparent',
                  color: 'inherit', textAlign: 'center',
                }}
              >
                <span style={{ letterSpacing: 2 }}>{c.glyph}</span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="lbl" style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)' }}>
            Support noted by the adult:
          </span>
          {data.promptLevels.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`pill ${level === l ? 'brand' : 'muted'}`}
              style={{ cursor: 'pointer', border: 'none' }}
            >
              {LEVEL_LABEL[l] ?? l}
            </button>
          ))}
        </div>

        {outcome && (
          <div style={{ marginTop: 12, borderLeft: `3px solid var(--${outcome.correct ? 'ok' : 'warn'})`, borderRadius: '0 8px 8px 0', padding: '10px 12px', background: 'var(--panel, transparent)' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className={`pill ${outcome.correct ? 'ok' : 'warn'}`}>
                {outcome.correct ? 'Correct — full mastery evidence' : 'Not yet — remediation-eligible evidence'}
              </span>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '0.85rem' }}>
              Recorded: answered <span className="mono">{outcome.value}</span> · channel{' '}
              <span className="mono">symbol_tap</span> · prompt level{' '}
              <span className="mono">{level}</span>
              {outcome.moduleId && (
                <>
                  {' '}· rolls into <span className="mono">Module {outcome.moduleId}</span> tracking with the whole class
                </>
              )}
            </p>
            <button onClick={() => setTapped(null)} className="pill muted" style={{ cursor: 'pointer', border: 'none', marginTop: 8 }}>
              ↺ Try another answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
