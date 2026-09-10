'use client';

import { useState } from 'react';

/**
 * The support facilitator's phone (IEP build step 5): the child's day as logged
 * promises. The two still-pending blocks are tappable so the demo shows the
 * logging gesture; fidelity recounts live using the engine's rule
 * (delivered / logged — pending counts neither way).
 */

type Status = 'delivered' | 'partial' | 'missed' | 'pending';

export interface DayItem {
  taskId: string;
  time: string;
  block: string;
  title: string;
  detail: string;
  supports: string[];
  status: Status;
  note: string | null;
}

const BLOCK_ICON: Record<string, string> = {
  arrival: '🚌', transition: '🚶', class: '📚', pull_aside: '👩‍🏫', lunch: '🥪', regulation_break: '🌿', dismissal: '🎒',
};
const STATUS_PILL: Record<Status, { text: string; cls: string }> = {
  delivered: { text: 'delivered', cls: 'ok' },
  partial: { text: 'partial', cls: 'warn' },
  missed: { text: 'missed', cls: 'danger' },
  pending: { text: 'up next', cls: 'muted' },
};

export function FacilitatorDay({ initial, studentName }: { initial: DayItem[]; studentName: string }) {
  const [items, setItems] = useState<DayItem[]>(initial);
  const log = (taskId: string, status: Status) =>
    setItems((xs) => xs.map((x) => (x.taskId === taskId ? { ...x, status } : x)));

  const delivered = items.filter((i) => i.status === 'delivered').length;
  const partial = items.filter((i) => i.status === 'partial').length;
  const missed = items.filter((i) => i.status === 'missed').length;
  const logged = delivered + partial + missed;
  const rate = logged === 0 ? 0 : Math.round((delivered / logged) * 100);

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', border: '2px solid var(--line, var(--border))', borderRadius: 24, padding: '16px 14px', background: 'var(--panel, var(--bg))' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <strong style={{ fontSize: '0.95rem' }}>{studentName} · today</strong>
        <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
          fidelity so far: <strong style={{ color: 'var(--text, inherit)' }}>{rate}%</strong> · {delivered} delivered · {partial} partial · {missed} missed
        </span>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {items.map((i) => (
          <div key={i.taskId} style={{ border: '1px solid var(--line, var(--border))', borderRadius: 14, padding: '10px 12px', background: 'var(--card, transparent)' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span aria-hidden="true">{BLOCK_ICON[i.block] ?? '•'}</span>
              <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{i.time}</span>
              <strong style={{ fontSize: '0.9rem' }}>{i.title}</strong>
              <span className={`pill ${STATUS_PILL[i.status].cls}`} style={{ marginLeft: 'auto' }}>{STATUS_PILL[i.status].text}</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--muted)' }}>{i.detail}</p>
            {i.supports.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                {i.supports.map((s) => <span key={s} className="pill brand">{s}</span>)}
              </div>
            )}
            {i.note && <p style={{ margin: '6px 0 0', fontSize: '0.8rem', fontStyle: 'italic' }}>“{i.note}”</p>}
            {i.status === 'pending' && (
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {(['delivered', 'partial', 'missed'] as const).map((s) => (
                  <button key={s} onClick={() => log(i.taskId, s)} className={`pill ${STATUS_PILL[s].cls}`} style={{ cursor: 'pointer', border: '1px solid var(--line, var(--border))' }}>
                    log {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
