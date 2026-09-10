'use client';

import { useState } from 'react';
import { PatternBadge } from './ui';
import type { DeliveryPattern } from '@ilp/core';

export interface CatalogEntry {
  id: string;
  label: string;
  adaptationClass: 'access' | 'scaffold' | 'difficulty' | 'objective_modification';
  fadeRule: string | null;
  permittedChange: string;
}

interface Row {
  included: boolean;
  excluded: boolean;
  planText: string;
  kind: 'access' | 'support';
}

interface Finding {
  code: string;
  severity: 'blocking' | 'warning' | string;
  message: string;
}
interface Compiled {
  pattern: DeliveryPattern;
  objectiveModified: boolean;
  applied: { id: string; label: string; permanent: boolean; planText: string | null }[];
  excluded: string[];
}

const GROUPS: { title: string; blurb: string; classes: CatalogEntry['adaptationClass'][] }[] = [
  { title: 'Access channels — never fade', blurb: 'The child’s way in and way out: AAC, captions, speech-to-text. You never fade a child’s wheelchair.', classes: ['access'] },
  { title: 'Scaffolds & supports — fade on evidence', blurb: 'Help that builds skill and steps back as independence grows.', classes: ['scaffold', 'difficulty'] },
  { title: 'Objective modifications — blocked in this lane', blurb: 'These change WHAT is taught. A plan’s accommodations can never open this lane — try one and watch the gate refuse it.', classes: ['objective_modification'] },
];

export function IepPlanBuilder({ catalog, seed, seedName }: {
  catalog: CatalogEntry[];
  seed: Record<string, { planText: string; kind: 'access' | 'support' }>;
  seedName: string;
}) {
  const init = (): Record<string, Row> => {
    const r: Record<string, Row> = {};
    for (const c of catalog) {
      const s = seed[c.id];
      r[c.id] = {
        included: !!s,
        excluded: false,
        planText: s?.planText ?? '',
        kind: s?.kind ?? (c.adaptationClass === 'access' ? 'access' : 'support'),
      };
    }
    return r;
  };
  const [planType, setPlanType] = useState<'iep' | '504'>('iep');
  const [rows, setRows] = useState<Record<string, Row>>(init);
  const [busy, setBusy] = useState(false);
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [compiled, setCompiled] = useState<Compiled | null>(null);

  const set = (id: string, patch: Partial<Row>) =>
    setRows((r) => ({ ...r, [id]: { ...r[id], ...patch } }));

  async function validate() {
    setBusy(true);
    setFindings(null);
    setCompiled(null);
    try {
      const accommodations = catalog
        .filter((c) => rows[c.id].included)
        .map((c) => ({ adaptationId: c.id, planText: rows[c.id].planText, kind: rows[c.id].kind }));
      const excludedAdaptations = catalog.filter((c) => rows[c.id].excluded).map((c) => c.id);
      const res = await fetch('/api/iep/validate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ planType, accommodations, excludedAdaptations }),
      });
      const data = await res.json();
      setFindings(data.findings ?? []);
      setCompiled(data.compiled ?? null);
    } catch {
      setFindings([{ code: 'NETWORK', severity: 'blocking', message: 'Could not reach the validation gate.' }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
        <span className="lbl" style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)' }}>Plan type</span>
        {(['iep', '504'] as const).map((t) => (
          <button key={t} onClick={() => setPlanType(t)} className={`pill ${planType === t ? 'brand' : 'muted'}`} style={{ cursor: 'pointer', border: 'none' }}>
            {t === 'iep' ? 'IEP' : '504 plan'}
          </button>
        ))}
        <span className="sub" style={{ fontSize: '0.8rem' }}>Seeded with {seedName}’s documented plan — edit anything.</span>
      </div>

      {GROUPS.map((g) => (
        <div className="card" key={g.title} style={{ marginBottom: 12 }}>
          <h3 style={{ margin: '0 0 2px' }}>{g.title}</h3>
          <p className="sub" style={{ margin: '0 0 8px', fontSize: '0.85rem' }}>{g.blurb}</p>
          <div className="worklist">
            {catalog.filter((c) => g.classes.includes(c.adaptationClass)).map((c) => {
              const r = rows[c.id];
              return (
                <div className="workitem" key={c.id} style={{ display: 'block' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer', fontWeight: 600, fontSize: '0.92rem' }}>
                      <input type="checkbox" checked={r.included} onChange={(e) => set(c.id, { included: e.target.checked, excluded: e.target.checked ? false : r.excluded })} />
                      {c.label}
                    </label>
                    {c.fadeRule == null
                      ? <span className="pill brand">never fades</span>
                      : <span className="pill warn">fades</span>}
                    <label style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: '0.78rem', color: 'var(--muted)', cursor: 'pointer', marginLeft: 'auto' }}>
                      <input type="checkbox" checked={r.excluded} onChange={(e) => set(c.id, { excluded: e.target.checked, included: e.target.checked ? false : r.included })} />
                      exclude for this student
                    </label>
                  </div>
                  <p className="sub" style={{ margin: '2px 0 0', fontSize: '0.78rem' }}>{c.permittedChange}</p>
                  {r.included && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <input
                        value={r.planText}
                        onChange={(e) => set(c.id, { planText: e.target.value })}
                        placeholder="Quote the plan’s own wording (required — this is the audit trail)"
                        style={{ flex: '1 1 260px', padding: '7px 10px', borderRadius: 8, border: '1px solid var(--line, var(--border))', background: 'transparent', color: 'inherit', fontSize: '0.85rem' }}
                      />
                      <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>plan calls it:</span>
                      {(['access', 'support'] as const).map((k) => (
                        <button key={k} onClick={() => set(c.id, { kind: k })} className={`pill ${r.kind === k ? 'brand' : 'muted'}`} style={{ cursor: 'pointer', border: 'none' }}>
                          {k}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <button className="btn-primary" type="button" onClick={validate} disabled={busy} style={{ marginTop: 4 }}>
        {busy ? 'Running the gate…' : 'Validate & compile — what every assignment will carry'}
      </button>

      {findings && (
        <div style={{ marginTop: 14 }}>
          {findings.length === 0 && <p><span className="pill ok">Plan passes the gate — no findings</span></p>}
          {findings.map((f, i) => (
            <div key={i} style={{ borderLeft: `3px solid var(--${f.severity === 'blocking' ? 'danger' : 'warn'})`, borderRadius: '0 8px 8px 0', padding: '8px 12px', marginBottom: 6, background: 'var(--panel, transparent)' }}>
              <span className={`pill ${f.severity === 'blocking' ? 'danger' : 'warn'}`}>{f.severity === 'blocking' ? 'blocked' : 'check with the team'}</span>{' '}
              <span style={{ fontSize: '0.88rem' }}>{f.message}</span>
            </div>
          ))}

          {compiled && (
            <div className="card" style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0 }}>Compiled: what rides on every assignment</h3>
                <PatternBadge pattern={compiled.pattern} />
                <span className={`pill ${compiled.objectiveModified ? 'danger' : 'ok'}`}>
                  {compiled.objectiveModified ? 'Modified' : 'Standard unchanged'}
                </span>
              </div>
              <div className="worklist" style={{ marginTop: 8 }}>
                {compiled.applied.length === 0 && <p className="sub" style={{ fontSize: '0.85rem' }}>No adaptations applied — the core delivery.</p>}
                {compiled.applied.map((a) => (
                  <div className="workitem" key={a.id} style={{ alignItems: 'flex-start' }}>
                    <span>
                      <span className="t" style={{ fontSize: '0.9rem' }}>{a.label}</span>
                      {a.planText && <div className="s" style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>From the plan: “{a.planText}”</div>}
                    </span>
                    {a.permanent
                      ? <span className="pill brand">channel · never fades</span>
                      : <span className="pill warn">scaffold · fades</span>}
                  </div>
                ))}
              </div>
              {compiled.excluded.length > 0 && (
                <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: 'var(--muted)' }}>
                  ✕ Never auto-selected for this student: {compiled.excluded.join(', ').replace(/_/g, ' ')}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
