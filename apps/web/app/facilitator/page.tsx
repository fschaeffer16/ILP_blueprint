import Link from 'next/link';
import { getFacilitatorDay } from '../../lib/data';
import { FacilitatorDay, type DayItem } from '../../components/FacilitatorDay';

export default function FacilitatorPage() {
  const d = getFacilitatorDay();
  const pct = (f: number) => `${Math.round(f * 100)}%`;

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        ESE · the hands on deck, coordinated
      </div>
      <h1>The support facilitator’s day</h1>
      <p className="lede">
        Step 5 of the IEP build: the behavior tech and support facilitator carry the child’s day on{' '}
        <strong>their own phone</strong> — the schedule, the transitions, and the supports the plan
        promises for each block. Every promise gets logged, and the record answers the question every
        IEP meeting should be able to answer and rarely can: <em>were the supports delivered exactly
        as the plan promised?</em> Two rules: <strong>fidelity grades the service, never the
        child</strong> — and the quiet good days accrue on the record too.
      </p>

      <div className="grid cols-2" style={{ alignItems: 'start' }}>
        <div>
          <FacilitatorDay initial={d.items as DayItem[]} studentName={d.studentName} />
          <p className="footnote" style={{ marginTop: 8, textAlign: 'center' }}>
            The two “up next” blocks are tappable — log them and watch fidelity recount.
          </p>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <div className="card">
            <h3 style={{ margin: '0 0 6px' }}>The record the IEP meeting sees</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              <span className="pill ok">{d.incidentFreeDays} incident-free school days in a row</span>
            </p>
            <p style={{ margin: '8px 0 0', fontSize: '0.88rem' }}>
              Yesterday’s fidelity: <strong>{pct(d.yesterdayFidelity.rate)}</strong> ({d.yesterdayFidelity.delivered} of{' '}
              {d.yesterdayFidelity.promised} promises delivered).
            </p>
            {d.missedYesterday && (
              <div style={{ marginTop: 10, borderLeft: '3px solid var(--danger)', borderRadius: '0 8px 8px 0', padding: '8px 12px', background: 'var(--panel, transparent)' }}>
                <span className="pill danger">missed · on the record</span>
                <p style={{ margin: '6px 0 0', fontSize: '0.86rem' }}>
                  {d.missedYesterday.title} — “{d.missedYesterday.note}”
                </p>
              </div>
            )}
            <p style={{ margin: '10px 0 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
              A missed service is an adult’s promise not kept — surfaced, never buried. And the
              incident-free streak turns the quiet good days into data: the placement’s safety record,
              accruing by itself.
            </p>
          </div>
          <div className="card">
            <h3 style={{ margin: '0 0 6px' }}>Who sees this</h3>
            <p style={{ margin: 0, fontSize: '0.88rem' }}>
              The behavior tech logs the day. The ESE teacher sees the same module chain the pull-aside
              works (<Link href="/iep">goals</Link>). The ESE director sees fidelity across students.
              The family sees plain-language progress in the <Link href="/parent">parent app</Link> —
              never a quarterly surprise. Contracted providers (the district already uses three
              behavior-service agencies) land on this same record, same as district staff.
            </p>
          </div>
        </div>
      </div>

      <p className="footnote" style={{ marginTop: 14 }}>
        Computed by <span className="mono">buildFacilitatorDay</span> / <span className="mono">incidentFreeStreak</span>{' '}
        over the day plan and service log — fidelity has no score or grade field by construction; it
        measures adults, not children. Synthetic data; the day mirrors the program’s day-in-the-life
        (<span className="mono">docs/ese-program.md</span> §4). See the six-student showcase at{' '}
        <Link href="/ese">ESE</Link>.
      </p>
    </>
  );
}
