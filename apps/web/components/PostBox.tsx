'use client';

import { useState } from 'react';

type Reason = { code: string; severity: string; message: string };
type Result = { status: 'approved' | 'held' | 'blocked'; kind: string; reasons: Reason[]; requiresMasteryCheck: boolean; escalateToHuman: boolean } | null;

const EXAMPLES = [
  ['A good explanation', 'I think 1/3 is bigger than 1/6 because there are fewer, bigger pieces.'],
  ['An answer dump', 'the answer is 1/3'],
  ['Unkind words', 'you are so stupid'],
  ['Personal info', 'call me at 555-123-4567'],
] as const;

export function PostBox() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<Result>(null);
  const [busy, setBusy] = useState(false);

  async function post() {
    if (!text.trim()) return;
    setBusy(true);
    try {
      const res = await fetch('/api/collaboration/moderate', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ authorId: 'S-777', text }),
      });
      setResult((await res.json()) as Result);
    } finally { setBusy(false); }
  }

  const statusPill = result?.status === 'approved' ? 'ok' : result?.status === 'held' ? 'warn' : 'danger';

  return (
    <div className="postbox">
      <div className="decision-row" style={{ marginBottom: 8 }}>
        {EXAMPLES.map(([label, ex]) => (
          <button key={label} type="button" className="btnish" onClick={() => setText(ex)}>{label}</button>
        ))}
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share your thinking with the class…" aria-label="Write a post" />
      <div className="decision-row" style={{ marginTop: 8 }}>
        <button className="btn-primary" type="button" onClick={post} disabled={busy || !text.trim()}>{busy ? 'Checking…' : 'Post'}</button>
      </div>

      {result && (
        <div className="modresult">
          <span className={`pill ${statusPill}`}>
            {result.status === 'approved' ? 'Posted ✓' : result.status === 'held' ? 'Held for review' : 'Not allowed'}
          </span>
          {' '}<span className="ktag">{result.kind.replace('_', ' ')}</span>
          {result.escalateToHuman && <span className="pill danger" style={{ marginLeft: 6 }}>A trusted adult is notified</span>}
          {result.requiresMasteryCheck && <span className="pill warn" style={{ marginLeft: 6 }}>Quick solo check first</span>}
          {result.reasons.filter((r) => r.code !== 'ok').map((r, i) => (
            <div className="held" key={i}>· {r.message}</div>
          ))}
        </div>
      )}
      <p className="rules">Verified classmates only · no direct messages · no follower counts · a trained adult reviews anything flagged.</p>
    </div>
  );
}
