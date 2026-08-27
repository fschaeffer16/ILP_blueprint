import { getParentSummary } from '../../lib/data';
import { ParentNotifications, type ParentNotice } from '../../components/ParentNotifications';
import type { ActivitySurface, WorkStatus } from '@ilp/core';

const WORK_LABEL: Record<WorkStatus, { text: string; cls: string }> = {
  in_progress: { text: 'Working on it', cls: 'brand' },
  submitted: { text: 'Turned in', cls: 'muted' },
  mastered: { text: 'Mastered', cls: 'ok' },
  needs_reteach: { text: 'Needs another look', cls: 'warn' },
};
const FLAG_ICON = { celebrate: '🎉', watch: '👀', attention: '⚠️' } as const;
const mins = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`);

export default function ParentPage() {
  const { summary: s, surfaceLabel, notifications } = getParentSummary();
  const maxTime = Math.max(...s.timeBySurface.map((t) => t.minutes), 1);
  const growthGain = Math.round((s.growth.currentAvg - s.growth.baselineAvg) * 100);
  const notices: ParentNotice[] = notifications.map((n) => ({
    id: n.id, kind: n.kind, from: n.from, title: n.title, body: n.body, sentAt: n.sentAt,
  }));

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Family view · updated continuously
      </div>
      <h1>{s.studentName}’s week</h1>
      <p className="lede">
        Everything {s.studentName} is doing in ILP, in plain language — no surprises. What she’s working on
        right now, how her time is spent, how she’s collaborating, and how she’s growing.
      </p>

      <div className="kpis" style={{ marginBottom: 20 }}>
        <div className="kpi"><div className="n">{s.growth.mastered}</div><div className="l">objectives mastered</div></div>
        <div className="kpi"><div className="n">{s.growth.inProgress}</div><div className="l">in progress now</div></div>
        <div className="kpi"><div className="n">+{growthGain}</div><div className="l">points since fall</div></div>
        <div className="kpi"><div className="n">{mins(s.totalMinutes)}</div><div className="l">learning time this week</div></div>
        <div className="kpi">
          <div className="n" style={{ color: s.wellbeing.unresolvedFlags === 0 ? 'var(--ok)' : 'var(--danger)', fontSize: '1.2rem', paddingTop: 6 }}>
            {s.wellbeing.unresolvedFlags === 0 ? '✓ All clear' : 'Review'}
          </div>
          <div className="l">safety this week</div>
        </div>
      </div>

      <ParentNotifications notices={notices} />

      {s.flags.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {s.flags.map((f, i) => (
            <div className={`flag ${f.kind}`} key={i}>
              <span className="ic">{FLAG_ICON[f.kind]}</span>
              <span className="m">{f.message}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid cols-2">
        <div className="card">
          <h3>Right now</h3>
          <p className="sub">What {s.studentName} is working on today.</p>
          <div className="worklist">
            {s.todaysWork.map((w) => {
              const l = WORK_LABEL[w.status];
              return (
                <div className="workitem" key={w.objectiveId}>
                  <span className="t">{w.title}</span>
                  <span className={`pill ${l.cls}`}>{l.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3>Growth this year</h3>
          <p className="sub">Where she started, where she is now.</p>
          <div className="mini">
            <div className="m"><div className="n">{s.growth.mastered}</div><div className="l">objectives mastered</div></div>
            <div className="m"><div className="n">{s.growth.inProgress}</div><div className="l">in progress</div></div>
            <div className="m"><div className="n">+{growthGain}</div><div className="l">points since fall</div></div>
          </div>
          <p className="sub" style={{ marginTop: 12 }}>
            Average score rose from {Math.round(s.growth.baselineAvg * 100)}% at the start of the year to{' '}
            <strong>{Math.round(s.growth.currentAvg * 100)}%</strong> now.
          </p>
        </div>
      </div>

      <h2>Time in ILP this week — {mins(s.totalMinutes)} total</h2>
      <div className="card">
        <div className="bars">
          {s.timeBySurface.map((t) => (
            <div className="bar-row" key={t.surface}>
              <span className="name" title={surfaceLabel[t.surface as ActivitySurface]}>{surfaceLabel[t.surface as ActivitySurface]}</span>
              <span className="bar-track"><span className="bar-fill plain" style={{ width: `${Math.max(3, (t.minutes / maxTime) * 100)}%` }} /></span>
              <span className="val">{mins(t.minutes)}</span>
            </div>
          ))}
        </div>
        <p className="thresh">
          The <strong>Collaboration lab</strong> was {mins(s.collaborationMinutes)} — {Math.round(s.collaborationShare * 100)}% of her ILP time.
          It’s a verified, teacher-moderated, district-only space: no strangers, no public feed, no follower counts.
        </p>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <h3>Working with classmates</h3>
          <p className="sub">Academic collaboration — checked for real understanding afterward.</p>
          <div className="mini">
            <div className="m"><div className="n">{s.collaboration.peersHelped}</div><div className="l">classmates helped</div></div>
            <div className="m"><div className="n">{s.collaboration.contributions}</div><div className="l">contributions</div></div>
            <div className="m"><div className="n">{s.collaboration.independentChecksPassed}/{s.collaboration.independentChecksTotal}</div><div className="l">solo checks passed after group work</div></div>
          </div>
        </div>

        <div className="card">
          <h3>Problem-solving simulations</h3>
          <p className="sub">Branching scenarios — where revising and recovering is the point.</p>
          <div className="mini">
            <div className="m"><div className="n">{s.simulation.scenariosCompleted}</div><div className="l">scenarios completed</div></div>
            <div className="m"><div className="n">{s.simulation.decisions}</div><div className="l">decisions made</div></div>
            <div className="m"><div className="n">{s.simulation.revisions + s.simulation.recoveries}</div><div className="l">times she revised or recovered a plan</div></div>
          </div>
        </div>
      </div>

      <h2>Safety</h2>
      <div className="card" style={{ marginBottom: 18 }}>
        {s.wellbeing.unresolvedFlags === 0 ? (
          <p style={{ margin: 0 }}>
            <span className="pill ok">All clear</span>{' '}
            {s.wellbeing.moderationFlags === 0
              ? 'No safety events this week.'
              : `${s.wellbeing.moderationFlags} moderation event was reviewed and resolved by school staff. Nothing needs your attention.`}
          </p>
        ) : (
          <p style={{ margin: 0 }}>
            <span className="pill danger">Needs attention</span> {s.wellbeing.unresolvedFlags} item is under review — the school has been notified and will contact you.
          </p>
        )}
      </div>

      <div className="privacy">
        <span>🔒</span>
        <span>
          <strong>What you see, and what you don’t.</strong> You see how {s.studentName} spends her time,
          how she collaborates, and how she’s growing — plus anything that needs your attention. You do
          <em> not</em> see the messages she and her classmates exchange. That protects every child’s privacy;
          trained staff moderate the spaces and escalate anything unsafe to you and the school.
        </span>
      </div>

      <p className="footnote">
        Computed by <span className="mono">@ilp/core</span> (<span className="mono">buildParentSummary</span>) on synthetic data.
        There is deliberately no message-content field in the parent data model.
      </p>
    </>
  );
}
