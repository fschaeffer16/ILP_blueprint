'use client';

import { useState } from 'react';

interface Message {
  id: string;
  to: string;
  text: string;
  sentAt: number;
  status: 'awaiting' | 'ack';
  ackAt?: number;
}

const fmt = (t: number) =>
  new Date(t).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

// A couple of pre-sent messages so the screen shows both states immediately:
// one receipt already returned, one still awaiting the parent.
const SEED: Message[] = [
  {
    id: 'M-seed-1',
    to: 'Mia’s family',
    text: 'Mia has been a huge help to classmates in the Math channel this week — explaining her thinking, not just giving answers. Wanted you to hear the good news!',
    sentAt: Date.parse('2026-09-11T16:40:00Z'),
    status: 'ack',
    ackAt: Date.parse('2026-09-11T18:12:00Z'),
  },
  {
    id: 'M-seed-2',
    to: 'Ben’s family',
    text: 'Quick reminder: the fractions quiz is this Friday. A short practice set is in Ben’s app under “Coming up.”',
    sentAt: Date.parse('2026-09-12T09:15:00Z'),
    status: 'awaiting',
  },
];

export function TeacherMessages({ families }: { families: string[] }) {
  const [messages, setMessages] = useState<Message[]>(SEED);
  const [to, setTo] = useState(families[0] ?? '');
  const [text, setText] = useState('');
  const [seq, setSeq] = useState(1);

  const awaiting = messages.filter((m) => m.status === 'awaiting').length;
  const acked = messages.filter((m) => m.status === 'ack').length;

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const id = `M-${seq}`;
    setSeq(seq + 1);
    setMessages([{ id, to, text: text.trim(), sentAt: Date.now(), status: 'awaiting' }, ...messages]);
    setText('');
  }

  function receipt(id: string) {
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, status: 'ack', ackAt: Date.now() } : m)));
  }

  return (
    <>
      <div className="kpis" style={{ marginBottom: 20 }}>
        <div className="kpi"><div className="n">{messages.length}</div><div className="l">messages sent</div></div>
        <div className="kpi"><div className="n" style={{ color: 'var(--ok)' }}>{acked}</div><div className="l">read &amp; acknowledged</div></div>
        <div className="kpi"><div className="n" style={{ color: awaiting ? 'var(--warn)' : 'var(--muted)' }}>{awaiting}</div><div className="l">awaiting parent</div></div>
      </div>

      <div className="card" style={{ marginBottom: 22 }}>
        <h3 style={{ marginTop: 0 }}>New message to a parent</h3>
        <form onSubmit={send}>
          <div className="field">
            <label htmlFor="to">To</label>
            <select id="to" value={to} onChange={(e) => setTo(e.target.value)}>
              {families.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="msg">Message</label>
            <textarea id="msg" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a quick note home — a celebration, a reminder, a heads-up…" style={{ minHeight: 84 }} />
          </div>
          <button className="btn-primary" type="submit" disabled={!text.trim()}>Send to parent app</button>
          <p className="sub" style={{ margin: '10px 0 0' }}>
            It arrives as a pop-up the parent can’t dismiss without acknowledging — and that acknowledgement comes back here as a read-receipt.
          </p>
        </form>
      </div>

      <h2>Sent · with receipts</h2>
      <div className="msglist">
        {messages.map((m) => (
          <div className={`msgrow ${m.status}`} key={m.id}>
            <div className="msgtop">
              <span className="msgto">{m.to}</span>
              <span className="msgtime">sent {fmt(m.sentAt)}</span>
            </div>
            <div className="msgtext">{m.text}</div>
            <div className="msgfoot">
              {m.status === 'ack' ? (
                <span className="pill ok">✓ Read &amp; acknowledged · {fmt(m.ackAt!)}</span>
              ) : (
                <>
                  <span className="pill warn">Delivered · awaiting acknowledgement</span>
                  <button className="btnish" type="button" onClick={() => receipt(m.id)}>▶ Simulate parent opening the app</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="footnote">
        The receipt loop is the point: in production the acknowledgement returns automatically the moment the
        parent clears the pop-up on their device. Here you can trigger it to see the round-trip. Synthetic data only.
      </p>
    </>
  );
}
