import type { IndependenceTrend, PromptLevel } from '@ilp/core';

/**
 * The independence trend, drawn honestly (IEP build step 3):
 * one row per student; each attempt is a marker on a date axis. Prompt level is
 * an ordered magnitude, so it wears ONE hue in ordered steps (sequential), and
 * correctness rides on SHAPE (disc vs. cross) — never color alone. A table view
 * of every attempt sits under each chart.
 */

const LEVEL_LABEL: Record<PromptLevel, string> = {
  independent: 'Independent',
  gestural_prompt: 'Gestural prompt',
  modeled: 'Modeled',
  full_support: 'Full support',
};
/** Sequential steps of the brand hue — darkest = most independent. */
const LEVEL_ALPHA: Record<PromptLevel, number> = {
  independent: 1,
  gestural_prompt: 0.68,
  modeled: 0.4,
  full_support: 0.14,
};
const CHANNEL_LABEL: Record<string, string> = {
  symbol_tap: 'picture tap',
  text: 'text',
  speech: 'speech',
  handwriting: 'handwriting',
};

export interface TrendRow {
  name: string;
  scaffold: string;
  note: string;
  trend: IndependenceTrend;
  attempts: { date: string; correct: boolean; promptLevel: PromptLevel; responseChannel: string; weight: number }[];
}

const DIRECTION: Record<string, { text: string; cls: string }> = {
  gaining_independence: { text: 'Gaining independence', cls: 'ok' },
  steady: { text: 'Steady', cls: 'muted' },
  losing_independence: { text: 'Losing independence', cls: 'warn' },
  insufficient_evidence: { text: 'Not enough evidence yet', cls: 'muted' },
};

function Strip({ attempts }: { attempts: TrendRow['attempts'] }) {
  const W = 560;
  const H = 56;
  const padX = 16;
  const dates = attempts.map((a) => +new Date(a.date));
  const min = Math.min(...dates);
  const max = Math.max(...dates);
  const x = (d: string) => padX + ((+new Date(d) - min) / Math.max(1, max - min)) * (W - 2 * padX);
  const y = 24;
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 620, display: 'block' }} role="img"
      aria-label={`${attempts.length} attempts from ${fmt(attempts[0].date)} to ${fmt(attempts[attempts.length - 1].date)}`}>
      <line x1={padX} y1={y} x2={W - padX} y2={y} stroke="var(--line, var(--border))" strokeWidth="1" />
      {[attempts[0].date, attempts[attempts.length - 1].date].map((d, i) => (
        <text key={i} x={x(d)} y={H - 8} fontSize="11" fill="var(--muted)" textAnchor={i === 0 ? 'start' : 'end'}>
          {fmt(d)}
        </text>
      ))}
      {attempts.map((a, i) => {
        const cx = x(a.date);
        const tip = `${fmt(a.date)} — ${a.correct ? 'correct' : 'not yet'} · ${LEVEL_LABEL[a.promptLevel]} · via ${CHANNEL_LABEL[a.responseChannel] ?? a.responseChannel}`;
        return a.correct ? (
          <circle key={i} cx={cx} cy={y} r={7}
            fill="var(--brand)" fillOpacity={LEVEL_ALPHA[a.promptLevel]}
            stroke="var(--brand)" strokeWidth="1.5"
            paintOrder="stroke" style={{ outline: 'none' }}>
            <title>{tip}</title>
          </circle>
        ) : (
          <g key={i} stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round"
            opacity={Math.max(0.55, LEVEL_ALPHA[a.promptLevel])}>
            <line x1={cx - 5} y1={y - 5} x2={cx + 5} y2={y + 5} />
            <line x1={cx - 5} y1={y + 5} x2={cx + 5} y2={y - 5} />
            <title>{tip}</title>
          </g>
        );
      })}
    </svg>
  );
}

export function IndependenceTrends({ rows }: { rows: TrendRow[] }) {
  const pct = (f: number) => `${Math.round(f * 100)}%`;
  return (
    <div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10, fontSize: '0.8rem', color: 'var(--muted)' }}>
        <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', fontSize: '0.72rem' }}>Legend</span>
        {(Object.keys(LEVEL_LABEL) as PromptLevel[]).map((l) => (
          <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <svg width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="6" fill="var(--brand)" fillOpacity={LEVEL_ALPHA[l]} stroke="var(--brand)" strokeWidth="1.2" /></svg>
            {LEVEL_LABEL[l]}
          </span>
        ))}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <svg width="14" height="14" aria-hidden="true"><g stroke="var(--brand)" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="3" x2="11" y2="11" /><line x1="3" y1="11" x2="11" y2="3" /></g></svg>
          Not yet correct
        </span>
      </div>

      <div className="grid" style={{ gap: 12 }}>
        {rows.map((r) => {
          const d = DIRECTION[r.trend.direction];
          return (
            <div className="card" key={r.name}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0 }}>{r.name}</h3>
                <span className={`pill ${d.cls}`}>{d.text}</span>
                {r.trend.readyToFade && <span className="pill brand">evidence supports a fade conversation</span>}
                {r.trend.correctOnlyWithSupport && <span className="pill warn">supported mastery — not independent yet</span>}
              </div>
              <p className="sub" style={{ margin: '2px 0 8px', fontSize: '0.83rem' }}>
                Scaffold in question: <strong>{r.scaffold}</strong> · Module {r.trend.moduleId} ·{' '}
                {r.trend.attempts} attempts · correct {pct(r.trend.correctRate)} · independent &amp; correct {pct(r.trend.independentMasteryRate)}
              </p>
              <Strip attempts={r.attempts} />
              <p style={{ margin: '6px 0 0', fontSize: '0.85rem' }}>{r.note}</p>
              <details style={{ marginTop: 8 }}>
                <summary style={{ cursor: 'pointer', fontSize: '0.8rem', color: 'var(--muted)' }}>Every attempt, as a table</summary>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ borderCollapse: 'collapse', fontSize: '0.82rem', marginTop: 6, minWidth: 380 }}>
                    <thead>
                      <tr>
                        {['Date', 'Result', 'Prompt level', 'Channel'].map((h) => (
                          <th key={h} style={{ textAlign: 'left', padding: '4px 10px 4px 0', color: 'var(--muted)', fontWeight: 700 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {r.attempts.map((a, i) => (
                        <tr key={i}>
                          <td style={{ padding: '3px 10px 3px 0' }}>{a.date}</td>
                          <td style={{ padding: '3px 10px 3px 0' }}>{a.correct ? 'Correct' : 'Not yet'}</td>
                          <td style={{ padding: '3px 10px 3px 0' }}>{LEVEL_LABEL[a.promptLevel]}</td>
                          <td style={{ padding: '3px 10px 3px 0' }}>{CHANNEL_LABEL[a.responseChannel] ?? a.responseChannel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
}
