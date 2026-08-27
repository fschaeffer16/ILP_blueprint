'use client';

import { useState } from 'react';

type Seed = {
  objectiveId: string;
  version: number;
  subject: string;
  gradeBand: string;
  standardRefs: string[];
  studentOutcome: string;
  essentialKnowledge: string[];
  requiredReasoning: string[];
  prerequisites: string[];
  mastery: { threshold: number; minimumEvidenceTypes: number; transferRequired: boolean };
  permittedAdaptations: string[];
  prohibitedAdaptations: string[];
  misconceptions: string[];
  sourceIds: string[];
  remediationPatternIds: string[];
};
type CatalogItem = { id: string; label: string; adaptationClass: string; permittedChange: string };
type SourceItem = { id: string; title: string; tier: string; license: string; reviewStatus: string; reviewedAt: string | null };
type Issue = { code: string; severity: 'blocking' | 'warning' | 'info'; message: string; field?: string };
type Result = { ok: boolean; issues: Issue[] } | null;

const LICENSE_LABEL: Record<string, string> = {
  public_domain: 'public domain', cc_by: 'CC BY', cc_by_sa: 'CC BY-SA', cc_by_nc: 'CC BY-NC', licensed: 'licensed', all_rights_reserved: 'all rights reserved',
};

function ChipEditor({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const v = draft.trim();
    if (v && !items.includes(v)) onChange([...items, v]);
    setDraft('');
  };
  return (
    <div className="chips">
      {items.map((it) => (
        <span key={it} className="chip">
          {it}
          <button type="button" aria-label={`Remove ${it}`} onClick={() => onChange(items.filter((x) => x !== it))}>×</button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
        onBlur={add}
      />
    </div>
  );
}

export function ObjectiveBuilder({ seed, catalog, sources }: { seed: Seed; catalog: CatalogItem[]; sources: SourceItem[] }) {
  const [outcome, setOutcome] = useState(seed.studentOutcome);
  const [standardRef, setStandardRef] = useState(seed.standardRefs[0] ?? '');
  const [threshold, setThreshold] = useState(Math.round(seed.mastery.threshold * 100));
  const [minEvidence, setMinEvidence] = useState(seed.mastery.minimumEvidenceTypes);
  const [transfer, setTransfer] = useState(seed.mastery.transferRequired);
  const [essential, setEssential] = useState<string[]>(seed.essentialKnowledge);
  const [reasoning, setReasoning] = useState<string[]>(seed.requiredReasoning);
  const [prereqs, setPrereqs] = useState<string[]>(seed.prerequisites);
  const [misconceptions, setMisconceptions] = useState<string[]>(seed.misconceptions);
  const [permitted, setPermitted] = useState<string[]>(seed.permittedAdaptations);
  const [sourceIds, setSourceIds] = useState<string[]>(seed.sourceIds);
  const [result, setResult] = useState<Result>(null);
  const [busy, setBusy] = useState(false);

  const toggle = (arr: string[], set: (v: string[]) => void, id: string) =>
    set(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  function assembleDraft() {
    // A permitted rigor-changing adaptation is left OUT of prohibited so the gate can
    // catch it as RIGOR_ADAPTATION_PERMITTED (rather than a permit/prohibit overlap).
    const rigorIds = catalog.filter((c) => c.adaptationClass === 'objective_modification').map((c) => c.id);
    const prohibited = rigorIds.filter((id) => !permitted.includes(id));
    return {
      objectiveId: seed.objectiveId,
      version: seed.version,
      status: 'published',
      subject: seed.subject,
      gradeBand: seed.gradeBand,
      standardRefs: standardRef.trim() ? [standardRef.trim()] : [],
      studentOutcome: outcome,
      essentialKnowledge: essential,
      requiredReasoning: reasoning,
      prerequisites: prereqs,
      mastery: { threshold: threshold / 100, minimumEvidenceTypes: minEvidence, transferRequired: transfer },
      permittedAdaptations: permitted,
      prohibitedAdaptations: prohibited,
      misconceptions,
      sourceIds,
      remediationPatternIds: seed.remediationPatternIds,
    };
  }

  async function validate() {
    setBusy(true);
    try {
      const res = await fetch('/api/objectives/validate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(assembleDraft()),
      });
      setResult((await res.json()) as Result);
    } catch {
      setResult({ ok: false, issues: [{ code: 'NETWORK', severity: 'blocking', message: 'Could not reach the validator.' }] });
    } finally {
      setBusy(false);
    }
  }

  const blocking = result?.issues.filter((i) => i.severity === 'blocking') ?? [];
  const warnings = result?.issues.filter((i) => i.severity === 'warning') ?? [];

  return (
    <div className="card">
      <div className="field">
        <label>Student outcome <span className="from">↳ written from the benchmark</span></label>
        <textarea value={outcome} onChange={(e) => setOutcome(e.target.value)} />
      </div>

      <div className="row2">
        <div className="field">
          <label>Standard reference <span className="from">↳ from Florida B.E.S.T.</span></label>
          <input type="text" value={standardRef} onChange={(e) => setStandardRef(e.target.value)} placeholder="e.g. MA.3.FR.1.1" />
        </div>
        <div className="field">
          <label>Learning Objective</label>
          <input type="text" value={`${seed.objectiveId} · v${seed.version} · grade ${seed.gradeBand}`} readOnly />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label>Essential knowledge</label>
          <ChipEditor items={essential} onChange={setEssential} placeholder="add term…" />
        </div>
        <div className="field">
          <label>Required reasoning <span className="from">locked into every version</span></label>
          <ChipEditor items={reasoning} onChange={setReasoning} placeholder="add…" />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label>Mastery rule <span className="from">identical for every child</span></label>
          <div className="chips" style={{ gap: 10 }}>
            <span>≥ <input type="number" min={0} max={100} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} style={{ width: 70 }} />%</span>
            <span><input type="number" min={1} max={5} value={minEvidence} onChange={(e) => setMinEvidence(Number(e.target.value))} style={{ width: 60 }} /> evidence types</span>
            <label className="chip" style={{ cursor: 'pointer' }}><input type="checkbox" checked={transfer} onChange={(e) => setTransfer(e.target.checked)} /> transfer required</label>
          </div>
        </div>
        <div className="field">
          <label>Common misconceptions <span className="from">↳ learning-science tier</span></label>
          <ChipEditor items={misconceptions} onChange={setMisconceptions} placeholder="add misconception…" />
        </div>
      </div>

      <div className="field">
        <label>Prerequisites</label>
        <ChipEditor items={prereqs} onChange={setPrereqs} placeholder="add prerequisite…" />
      </div>

      <div className="field">
        <label>Permitted teaching techniques <span className="from">↳ evidence-based; a rigor-changing one is refused</span></label>
        <div className="optlist">
          {catalog.map((c) => {
            const rigor = c.adaptationClass === 'objective_modification';
            return (
              <label key={c.id} className={`opt ${rigor ? 'rigor' : ''}`}>
                <input type="checkbox" checked={permitted.includes(c.id)} onChange={() => toggle(permitted, setPermitted, c.id)} />
                <span>
                  <span className="t">{c.label}</span>{rigor && <span className="pill warn" style={{ marginLeft: 6 }}>changes rigor</span>}
                  <span className="d">{c.permittedChange}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="field">
        <label>Approved sources <span className="from">↳ from the vetted library — only approved + licensed may publish</span></label>
        <div className="optlist">
          {sources.map((s) => {
            const approved = s.reviewStatus === 'approved';
            return (
              <label key={s.id} className="opt">
                <input type="checkbox" checked={sourceIds.includes(s.id)} onChange={() => toggle(sourceIds, setSourceIds, s.id)} />
                <span>
                  <span className="t">{s.title}</span>
                  <span className="d">
                    <span className="badge">{s.tier}</span> · {LICENSE_LABEL[s.license] ?? s.license} ·{' '}
                    {approved ? <span style={{ color: 'var(--ok)' }}>✓ approved {s.reviewedAt ?? ''}</span> : <span style={{ color: 'var(--warn)' }}>⚠ {s.reviewStatus}</span>}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <button className="btn-primary" type="button" onClick={validate} disabled={busy}>
        {busy ? 'Validating…' : 'Validate & publish v1'}
      </button>

      {result && (
        <div className={`gatebar ${result.ok ? 'ok' : 'bad'}`}>
          <span className="verdict">{result.ok ? '✓ Ready to publish v1' : `✕ Blocked — ${blocking.length} issue${blocking.length === 1 ? '' : 's'}`}</span>
          {result.ok && <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Standard mapped · sources approved · rigor intact.</span>}
        </div>
      )}
      {blocking.map((i, n) => (
        <div className="issue" key={`b${n}`}>
          <span className="pill danger">blocking</span><span className="mono">{i.code}</span><span>{i.message}</span>
        </div>
      ))}
      {warnings.map((i, n) => (
        <div className="issue" key={`w${n}`}>
          <span className="pill warn">advisory</span><span className="mono">{i.code}</span><span>{i.message}</span>
        </div>
      ))}
    </div>
  );
}
