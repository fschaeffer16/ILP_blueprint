'use client';

import { useEffect, useState } from 'react';

// Shape mirrors @ilp/core's ParentNotification; declared locally so the client
// bundle doesn't pull in the fixtures. Data is passed down from the server page.
export interface ParentNotice {
  id: string;
  kind: 'assignment' | 'turned_in' | 'grade' | 'message';
  from: string;
  title: string;
  body: string;
  sentAt: string;
}

const KIND: Record<ParentNotice['kind'], { icon: string; label: string; cls: string }> = {
  grade: { icon: '💯', label: 'Quiz grade', cls: 'grade' },
  turned_in: { icon: '📥', label: 'Work turned in', cls: 'turned_in' },
  assignment: { icon: '🗓️', label: 'New assignment', cls: 'assignment' },
  message: { icon: '💬', label: 'Message from teacher', cls: 'message' },
};

const ACK_KEY = 'ilp-parent-acks';
type Acks = Record<string, string>; // id -> acknowledged-at ISO

function loadAcks(): Acks {
  try {
    return JSON.parse(localStorage.getItem(ACK_KEY) || '{}');
  } catch {
    return {};
  }
}
function saveAcks(a: Acks) {
  try {
    localStorage.setItem(ACK_KEY, JSON.stringify(a));
  } catch {
    /* storage may be unavailable */
  }
}

const fmtSent = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' });
const fmtAck = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export function ParentNotifications({ notices }: { notices: ParentNotice[] }) {
  const [acks, setAcks] = useState<Acks>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAcks(loadAcks());
    setReady(true);
  }, []);

  const pending = ready ? notices.filter((n) => !acks[n.id]) : [];
  const current = pending[0];

  function acknowledge(id: string) {
    const next = { ...acks, [id]: new Date().toISOString() };
    setAcks(next);
    saveAcks(next);
  }

  function replay() {
    setAcks({});
    saveAcks({});
  }

  return (
    <>
      {/* Non-dismissible pop-up: no backdrop-close, no X — the ONLY way out is to
          acknowledge. That click is the read-receipt back to the teacher. */}
      {current && (
        <div className="pn-overlay" role="dialog" aria-modal="true" aria-labelledby="pn-title">
          <div className="pn-modal">
            <div className="pn-req">🔔 This message needs your acknowledgement</div>
            <div className={`pn-card ${KIND[current.kind].cls}`}>
              <div className="pn-kind">
                <span className="pn-ic" aria-hidden="true">{KIND[current.kind].icon}</span>
                <span>{KIND[current.kind].label}</span>
                <span className="pn-when">{fmtSent(current.sentAt)}</span>
              </div>
              <h3 id="pn-title">{current.title}</h3>
              <p className="pn-from">{current.from}</p>
              <p className="pn-body">{current.body}</p>
            </div>
            <button className="pn-ack" onClick={() => acknowledge(current.id)}>
              Got it — I’ve seen this
            </button>
            <p className="pn-count">
              {pending.length > 1
                ? `${pending.length} messages to review — clearing this sends a read-receipt to the teacher`
                : 'Clearing this sends a read-receipt to the teacher'}
            </p>
          </div>
        </div>
      )}

      {/* The receipt trail — what the teacher sees on their side, mirrored for the parent. */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0 }}>Message center</h3>
          <span className="pill brand">{ready ? notices.filter((n) => !acks[n.id]).length : 0} new</span>
          <button className="pn-replay" onClick={replay} type="button">↻ Replay pop-ups (demo)</button>
        </div>
        <p className="sub" style={{ margin: '6px 0 12px' }}>
          Every update — assignments, work turned in, quiz grades, and notes from the teacher — arrives
          here in real time. Each one is acknowledged, so the teacher always knows you saw it. No gaps.
        </p>
        <div className="pn-list">
          {notices.map((n) => (
            <div className="pn-row" key={n.id}>
              <span className="pn-ic" aria-hidden="true">{KIND[n.kind].icon}</span>
              <span className="pn-rowtext">
                <span className="pn-rowtitle">{n.title}</span>
                <span className="pn-rowfrom">{n.from} · {fmtSent(n.sentAt)}</span>
              </span>
              {ready && acks[n.id] ? (
                <span className="pill ok" title={`Acknowledged ${fmtAck(acks[n.id])}`}>✓ Acknowledged</span>
              ) : (
                <span className="pill warn">Awaiting you</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
