import Link from 'next/link';
import { getBusShowcase } from '../../lib/data';

const STATE_PILL: Record<string, { text: string; cls: string }> = {
  on_time: { text: 'on time', cls: 'ok' },
  late: { text: 'running late', cls: 'warn' },
  very_late: { text: 'very late', cls: 'danger' },
  signal_lost: { text: 'signal lost', cls: 'danger' },
  not_started: { text: 'not started', cls: 'muted' },
  completed: { text: 'complete', cls: 'muted' },
};

export default function BusPage() {
  const s = getBusShowcase();

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Transportation · honest data or no data
      </div>
      <h1>The bus, fixed.</h1>
      <p className="lede">
        The app districts run today works “50/50 at best”: stale GPS shown as if fresh, alerts that
        fire after the bus left, and a robocall that takes an hour to say what a push could say in a
        second. This module inverts it with rules the tests enforce: <strong>every location carries
        its age</strong>; when the signal is stale, “we don’t know” becomes the status and{' '}
        <strong>no ETA is invented</strong>; delays alert <strong>only the affected stops</strong>;
        and “your child boarded” comes only from a real tag scan — never inferred from a map.
        One synthetic morning, frozen at {s.now}, three routes, three honest states:
      </p>

      <div className="grid cols-3">
        {s.statuses.map(({ route, status }) => {
          const pill = STATE_PILL[status.state] ?? STATE_PILL.on_time;
          return (
            <div className="card" key={route.routeId}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0 }}>Bus {route.busNumber}</h3>
                <span className={`pill ${pill.cls}`}>{pill.text}</span>
                {route.driver.substitute && <span className="pill muted" title="Substitute driver — full route and student context follows the run.">sub driver</span>}
              </div>
              <p className="sub" style={{ margin: '2px 0 8px', fontSize: '0.8rem' }}>{route.label}</p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{status.headline}</p>
              <div className="worklist" style={{ marginTop: 8 }}>
                {status.stops.map((st) => (
                  <div className="workitem" key={st.stopId} style={{ fontSize: '0.82rem' }}>
                    <span style={{ color: st.passed ? 'var(--muted)' : 'inherit' }}>
                      {st.passed ? '✓ ' : ''}{st.name}
                    </span>
                    <span className="mono" style={{ color: 'var(--muted)' }}>
                      {st.passed ? 'passed' : st.eta ? `ETA ${st.eta}` : status.state === 'signal_lost' ? 'no ETA — signal lost' : `sched ${st.scheduledTime}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <h2 style={{ marginTop: 26 }}>What the family sees — facts, not guesses</h2>
      <div className="grid cols-2">
        <div className="card">
          <h3 style={{ margin: '0 0 6px' }}>Leo’s family · Bus 42, stop “{s.leo.stop.name}”</h3>
          {s.leo.notification && (
            <div style={{ borderLeft: '3px solid var(--warn)', borderRadius: '0 8px 8px 0', padding: '8px 12px', background: 'var(--panel, transparent)' }}>
              <span className="pill warn">pushed to this stop only</span>
              <p style={{ margin: '6px 0 0', fontSize: '0.88rem' }}>{s.leo.notification.message}</p>
            </div>
          )}
          <p style={{ margin: '10px 0 0', fontSize: '0.9rem' }}>
            Updated ETA at your stop: <strong className="mono">{s.leo.stop.eta}</strong> (scheduled {s.leo.stop.scheduledTime}).{' '}
            Boarding status: <span className="pill muted">not boarded yet</span> — and that’s the honest
            answer, because no scan has happened. The moment Leo taps on, this flips to a timestamped fact.
          </p>
          <p style={{ margin: '10px 0 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
            Critical alerts (very late, signal lost) use the parent app’s acknowledge-to-clear model and
            escalate push → SMS → voice until someone confirms — the robocall survives only as a last resort.
          </p>
        </div>
        <div className="card">
          <h3 style={{ margin: '0 0 6px' }}>Dre’s family · Bus 17</h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <span className="pill ok">Boarded at {s.dre.rider.boardedAt} ✓</span>
          </p>
          <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>
            A tag scan at the door, timestamped — the question parents actually have (“is my kid on the
            bus?”) answered by a record, not a dot on a map. The same scans build the chain-of-custody and
            compliance record ESE transportation requires.
          </p>
          {s.leo.shift && (
            <div style={{ marginTop: 12, borderLeft: '3px solid var(--brand)', borderRadius: '0 8px 8px 0', padding: '8px 12px', background: 'var(--panel, transparent)' }}>
              <span className="pill brand">the bus talks to the support plan</span>
              <p style={{ margin: '6px 0 0', fontSize: '0.86rem' }}>
                On Leo’s support tech’s phone, the arrival task just shifted: “{s.leo.shift.note}” —
                transitions stay previewed for exactly the kids surprise costs the most. See{' '}
                <Link href="/facilitator">the facilitator’s day</Link>.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="banner" style={{ marginTop: 18 }}>
        <span className="ic">🚌</span>
        <div>
          <b>Why this beats what runs today.</b>
          <p>
            The incumbent alerts on <em>proximity</em> and has no concept of a <em>delay</em>; the robocall
            takes 60–90 minutes to blast everyone about one late route. Here, lateness itself raises the
            alert, it reaches only the stops still waiting, signal loss is admitted instead of papered over,
            and the whole thing rides the parent app the district already has — one inbox, one
            acknowledgment model, classroom and bus. Full design (predictive ETAs, driver tablet,
            dispatch, SIS sync) in <span className="mono">docs/transportation-track.md</span>.
          </p>
        </div>
      </div>

      <p className="footnote">
        Computed live by <span className="mono">@ilp/core</span> (<span className="mono">routeStatus</span>,{' '}
        <span className="mono">routeNotifications</span>, <span className="mono">riderStatus</span>,{' '}
        <span className="mono">transitionShift</span>) from synthetic pings — the deployed build reads the
        district’s existing bus GPS feed. Delay is measured at departures against the schedule; the v1
        engine shifts schedules honestly, and the predictive-ETA service from the design doc is the
        deployed upgrade. All data synthetic.
      </p>
    </>
  );
}
