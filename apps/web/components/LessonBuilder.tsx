'use client';

import { useState } from 'react';

type Block = { id: string; kind: string; title: string; sourceIds: string[]; targets: string[] };
type Source = { id: string; title: string; reviewStatus: string };
type Objective = { objectiveId: string; version: number; requiredReasoning: string[]; studentOutcome: string };
type Issue = { code: string; severity: 'blocking' | 'warning' | 'info'; message: string; blockId?: string };
type Coverage = { target: string; covered: boolean };
type Result = { ok: boolean; issues: Issue[]; coverage: Coverage[] } | null;

const KIND_LABEL: Record<string, string> = {
  objective_preview: 'Learning Objective preview', instruction: 'Instruction', worked_example: 'Worked example',
  practice: 'Practice', collaboration: 'Collaboration', mastery_task: 'Mastery task', reflection: 'Reflection',
};
const SOURCED_KINDS = new Set(['instruction', 'worked_example', 'mastery_task', 'practice']);

export function LessonBuilder({ objective, plan, sources }: { objective: Objective; plan: { blocks: Block[] }; sources: Source[] }) {
  const [blocks, setBlocks] = useState<Block[]>(plan.blocks.map((b) => ({ ...b })));
  const [included, setIncluded] = useState<Record<string, boolean>>(Object.fromEntries(plan.blocks.map((b) => [b.id, true])));
  const [result, setResult] = useState<Result>(null);
  const [busy, setBusy] = useState(false);

  const setSource = (id: string, sourceId: string) =>
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, sourceIds: sourceId ? [sourceId] : [] } : b)));

  async function validate() {
    setBusy(true);
    try {
      const active = blocks.filter((b) => included[b.id]);
      const res = await fetch('/api/lessons/validate', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ objectiveId: objective.objectiveId, objectiveVersion: objective.version, blocks: active }),
      });
      setResult((await res.json()) as Result);
    } catch {
      setResult({ ok: false, issues: [{ code: 'NETWORK', severity: 'blocking', message: 'Could not reach the validator.' }], coverage: [] });
    } finally { setBusy(false); }
  }

  const blocking = result?.issues.filter((i) => i.severity === 'blocking') ?? [];
  const warnings = result?.issues.filter((i) => i.severity === 'warning') ?? [];

  return (
    <div className="card">
      <div className="field"><label>Lesson blocks <span className="from">↳ toggle a block off, or change its source, then validate</span></label></div>
      <div className="bars" style={{ gap: 10 }}>
        {blocks.map((b) => {
          const on = included[b.id];
          return (
            <div key={b.id} className="opt" style={{ opacity: on ? 1 : 0.55, alignItems: 'center' }}>
              <input type="checkbox" checked={on} onChange={() => setIncluded((s) => ({ ...s, [b.id]: !s[b.id] }))} aria-label={`Include ${b.title}`} />
              <span style={{ flex: 1 }}>
                <span className="t">{b.title} <span className="pill muted">{KIND_LABEL[b.kind] ?? b.kind}</span></span>
                <span className="d">
                  {b.targets.length > 0 ? <>builds: {b.targets.join(', ')}</> : <>no reasoning targets</>}
                </span>
              </span>
              {SOURCED_KINDS.has(b.kind) && (
                <select value={b.sourceIds[0] ?? ''} onChange={(e) => setSource(b.id, e.target.value)} style={{ maxWidth: 200 }} aria-label={`Source for ${b.title}`}>
                  <option value="">— no source —</option>
                  {sources.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}{s.reviewStatus !== 'approved' ? ' (unreviewed)' : ''}</option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
      </div>

      <button className="btn-primary" type="button" onClick={validate} disabled={busy} style={{ marginTop: 16 }}>
        {busy ? 'Validating…' : 'Validate lesson'}
      </button>

      {result && (
        <>
          <div className={`gatebar ${result.ok ? 'ok' : 'bad'}`}>
            <span className="verdict">{result.ok ? '✓ Lesson is complete and grounded' : `✕ Not ready — ${blocking.length} issue${blocking.length === 1 ? '' : 's'}`}</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <strong style={{ fontSize: '0.85rem' }}>Coverage of required reasoning:</strong>{' '}
            {result.coverage.map((c) => (
              <span key={c.target} className={`pill ${c.covered ? 'ok' : 'danger'}`} style={{ marginRight: 6 }}>
                {c.covered ? '✓' : '✕'} {c.target}
              </span>
            ))}
          </div>
        </>
      )}
      {blocking.map((i, n) => (
        <div className="issue" key={`b${n}`}><span className="pill danger">blocking</span><span className="mono">{i.code}</span><span>{i.message}</span></div>
      ))}
      {warnings.map((i, n) => (
        <div className="issue" key={`w${n}`}><span className="pill warn">advisory</span><span className="mono">{i.code}</span><span>{i.message}</span></div>
      ))}
    </div>
  );
}
