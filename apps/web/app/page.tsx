import Link from 'next/link';
import { getClasswideOutcome, getClassRows, getCompile, getGradingRows, objective } from '../lib/data';
import { IntegrityPill, Stat } from '../components/ui';

export default function TodayPage() {
  const compile = getCompile();
  const grading = getGradingRows();
  const outcome = getClasswideOutcome();
  const classRows = getClassRows();

  const readyToAdvance = classRows.filter((r) => r.manifest.pattern === 'advanced_transfer' || r.masteryMet);
  const inRemediation = outcome.failingStudentIds.length;

  return (
    <>
      <h1>Today</h1>
      <p className="lede">
        The smallest set of actions with the highest instructional impact. Every card below is
        produced by the ILP engine from real classroom evidence — not a to-do list you maintain.
      </p>

      <div className="grid cols-3" style={{ marginBottom: 8 }}>
        <div className="card">
          <Stat num={compile.studentCount} label="students in this class" />
        </div>
        <div className="card">
          <Stat num={`${objective.objectiveId}`} label={objective.studentOutcome} />
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center' }}>
          <IntegrityPill pass={compile.objectiveIntegrity === 'pass'} />
        </div>
      </div>

      {outcome.mode === 'classwide' && (
        <div className="callout danger">
          <h3>⚠ Urgent — classwide failure on {objective.objectiveId}</h3>
          <p>{outcome.rationale}</p>
          <div className="decision-row">
            <span className="pill danger">Grade suspended</span>
            <span className="pill warn">Assessment-integrity audit opened</span>
            <span className="pill brand">Reteach + equivalent reassessment required</span>
          </div>
          <p style={{ marginTop: 10 }}>
            <Link href="/grading">Review the flagged submissions →</Link>
          </p>
        </div>
      )}

      <h2>Priority cards</h2>
      <div className="grid cols-2">
        <div className="card">
          <h3>Grading review</h3>
          <p className="sub">AI first-pass ready; you release the grades.</p>
          <Stat num={grading.length} label="submissions awaiting your decision" />
          <p style={{ marginTop: 12 }}>
            <Link href="/grading" className="btnish primary">Open grading review</Link>
          </p>
        </div>

        <div className="card">
          <h3>Intervention</h3>
          <p className="sub">Students below mastery on the current objective.</p>
          <Stat num={inRemediation} label="students routed to remediation" />
          <p style={{ marginTop: 12 }}>
            <Link href="/class" className="btnish">See class status</Link>
          </p>
        </div>

        <div className="card">
          <h3>Ready to advance</h3>
          <p className="sub">Mastery evidence in hand; extend within the objective.</p>
          <Stat num={readyToAdvance.length} label="students ready for advanced transfer" />
        </div>

        <div className="card">
          <h3>Assign once</h3>
          <p className="sub">One objective → an individualized version for every student.</p>
          <Stat num={`${outcome.mode === 'classwide' ? 'Reteach' : 'Ready'}`} label="compose the next assignment" />
          <p style={{ marginTop: 12 }}>
            <Link href="/assign" className="btnish">Open composer</Link>
          </p>
        </div>
      </div>

      <p className="footnote">
        Synthetic data. Every value is computed live by <span className="mono">@ilp/core</span>{' '}
        (compiler, reference grader, 75% rule). Grades are proposals until you decide — the system
        never releases a grade on its own.
      </p>
    </>
  );
}
