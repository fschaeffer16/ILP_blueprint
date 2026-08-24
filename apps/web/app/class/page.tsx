import { getClassRows, objective } from '../../lib/data';
import { MasteryPill, PatternBadge, pct } from '../../components/ui';

export default function ClassPage() {
  const rows = getClassRows();

  return (
    <>
      <h1>My class</h1>
      <p className="lede">
        Current status, delivery version and next action for each student on{' '}
        <strong>{objective.objectiveId}</strong> — {objective.studentOutcome} Groups are temporary
        and evidence-based, never fixed ability tracks.
      </p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Delivery version</th>
              <th>Proposed score</th>
              <th>Status</th>
              <th>Why this version</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.studentId}>
                <td>
                  <strong>{r.name}</strong>
                  <div className="evidence mono">{r.studentId}</div>
                </td>
                <td><PatternBadge pattern={r.manifest.pattern} /></td>
                <td>{pct(r.fraction)}</td>
                <td><MasteryPill met={r.masteryMet} /></td>
                <td>
                  <ul className="rationale">
                    {r.manifest.rationale.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="locked" style={{ marginTop: 20 }}>
        <strong>Locked identically for every student above</strong> (the route varies, the rigor
        does not):{' '}
        <span className="k">objective</span> {objective.objectiveId} ·{' '}
        <span className="k">required reasoning</span> {objective.requiredReasoning.join(', ')} ·{' '}
        <span className="k">mastery</span> ≥ {pct(objective.mastery.threshold)},{' '}
        {objective.mastery.minimumEvidenceTypes} evidence types,{' '}
        transfer {objective.mastery.transferRequired ? 'required' : 'optional'}.
      </div>
    </>
  );
}
