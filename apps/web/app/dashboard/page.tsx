import Link from 'next/link';
import { getDashboard } from '../../lib/data';
import type { RollupRow } from '@ilp/core';

const LEVELS = [
  { key: 'district', label: 'District' },
  { key: 'school', label: 'School' },
  { key: 'grade', label: 'Grade' },
  { key: 'class', label: 'Class' },
  { key: 'objective', label: 'Objective' },
  { key: 'student', label: 'Student' },
] as const;

type LevelKey = (typeof LEVELS)[number]['key'];

function band(pct: number): 'good' | 'mid' | 'low' {
  if (pct >= 0.6) return 'good';
  if (pct >= 0.3) return 'mid';
  return 'low';
}
const pctS = (f: number) => `${Math.round(f * 100)}%`;

export default function DashboardPage({ searchParams }: { searchParams: { by?: string } }) {
  const { district, total, rollups } = getDashboard();
  const by = (LEVELS.find((l) => l.key === searchParams.by)?.key ?? 'school') as LevelKey;

  const rowsByLevel: Record<LevelKey, RollupRow[]> = {
    district: rollups.byDistrict,
    school: rollups.bySchool,
    grade: rollups.byGrade,
    class: rollups.byClass,
    objective: rollups.byObjective,
    student: rollups.byStudent,
  };
  const rows = [...rowsByLevel[by]].sort((a, b) => a.agg.masteredPct - b.agg.masteredPct);
  const o = rollups.overall;

  return (
    <>
      <h1>Dashboard</h1>
      <p className="lede">
        The same objective evidence for <strong>{district}</strong>, rolled up at every level.
        Mastery is the locked bar (≥ 80%, with transfer); the average score shows how close the
        rest are. Sorted worst-first so what needs attention is on top.
      </p>

      <div className="kpis" style={{ marginBottom: 20 }}>
        <div className="kpi"><div className="n">{pctS(o.masteredPct)}</div><div className="l">mastered ({o.mastered}/{o.n} results)</div></div>
        <div className="kpi"><div className="n">{pctS(o.avgFraction)}</div><div className="l">average score</div></div>
        <div className="kpi"><div className="n">{o.students}</div><div className="l">students</div></div>
        <div className="kpi"><div className="n">{o.medianTimeToMastery ?? '—'}</div><div className="l">median days to mastery</div></div>
      </div>

      <h2 style={{ marginBottom: 4 }}>Break down by</h2>
      <nav className="levels" aria-label="Rollup level">
        {LEVELS.map((l) => (
          <Link key={l.key} href={`/dashboard?by=${l.key}`} className={l.key === by ? 'on' : ''} aria-current={l.key === by ? 'page' : undefined}>
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="card">
        <div className="bars">
          {rows.map((r) => (
            <div className="bar-row" key={r.key}>
              <span className="name" title={r.label}>{r.label}</span>
              <span className="bar-track" role="img" aria-label={`${pctS(r.agg.masteredPct)} mastered, ${pctS(r.agg.avgFraction)} average`}>
                <span className={`bar-fill ${band(r.agg.masteredPct)}`} style={{ width: `${Math.max(2, r.agg.masteredPct * 100)}%` }} />
              </span>
              <span className="val">{pctS(r.agg.masteredPct)} <small>· {pctS(r.agg.avgFraction)} avg</small></span>
            </div>
          ))}
        </div>
        <p className="thresh">Bar = % of results reaching mastery. Green ≥ 60% · amber ≥ 30% · red below. “avg” is the mean score, showing how far the not-yet-mastered are from the bar.</p>
      </div>

      <p className="footnote">
        Every figure is computed by <span className="mono">@ilp/core</span> (<span className="mono">buildRollups</span>) from {total} synthetic
        outcome records — the same rollups a district, principal, or teacher would see, at their level.
      </p>
    </>
  );
}
