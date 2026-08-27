import { assignment, getCompile, objective } from '../../lib/data';
import { IntegrityPill, PatternBadge, Stat, pct } from '../../components/ui';
import type { DeliveryPattern } from '@ilp/core';

const PATTERN_ORDER: DeliveryPattern[] = [
  'core',
  'vocabulary_supported',
  'visual_first',
  'guided_practice',
  'advanced_transfer',
];

export default function AssignPage() {
  const compile = getCompile();

  return (
    <>
      <h1>Assign once</h1>
      <p className="lede">
        You choose the class, the Learning Objective and a few constraints. The compiler reads each
        student&apos;s ILP and prepares an individualized version — while locking the Learning Objective,
        rigor and mastery rule. Review the summary, then publish once.
      </p>

      <div className="grid cols-2">
        <div className="card">
          <h3>Assignment intent</h3>
          <p className="sub">What you set.</p>
          <table>
            <tbody>
              <tr><th>Class</th><td>{assignment.classId}</td></tr>
              <tr><th>Objective</th><td>{objective.objectiveId} v{objective.version}</td></tr>
              <tr><th>Duration</th><td>{assignment.durationMinutes} min</td></tr>
              <tr><th>Delivery</th><td>{assignment.deliveryMode}</td></tr>
              <tr><th>Bot mode</th><td>{assignment.botMode}</td></tr>
              <tr><th>Collaboration</th><td>{assignment.collaboration.enabled ? assignment.collaboration.scope : 'off'}</td></tr>
              <tr><th>Handwriting</th><td>{assignment.teacherConstraints.requireHandwriting ? 'required' : 'optional'}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Locked across every student version</h3>
          <p className="sub">Individualization can never change these.</p>
          <div className="locked">
            <div><span className="k">Outcome:</span> {objective.studentOutcome}</div>
            <div style={{ marginTop: 6 }}><span className="k">Essential knowledge:</span> {objective.essentialKnowledge.join(', ')}</div>
            <div style={{ marginTop: 6 }}><span className="k">Required reasoning:</span> {objective.requiredReasoning.join(', ')}</div>
            <div style={{ marginTop: 6 }}>
              <span className="k">Mastery:</span> ≥ {pct(objective.mastery.threshold)} ·{' '}
              {objective.mastery.minimumEvidenceTypes} evidence types ·{' '}
              transfer {objective.mastery.transferRequired ? 'required' : 'optional'}
            </div>
          </div>
        </div>
      </div>

      <h2>Compile summary</h2>
      <div className="callout">
        <h3>
          Status: {compile.status === 'ready_for_teacher_review' ? 'Ready for your review' : 'Blocked'} &nbsp;
          <IntegrityPill pass={compile.objectiveIntegrity === 'pass'} />
        </h3>
        <p>
          One assignment fanned out into {compile.studentCount} individualized versions across{' '}
          {PATTERN_ORDER.filter((p) => compile.patternCounts[p] > 0).length} patterns, with{' '}
          {compile.objectiveModifications} objective modifications.
        </p>
      </div>

      <div className="grid cols-3">
        {PATTERN_ORDER.filter((p) => compile.patternCounts[p] > 0).map((p) => (
          <div className="card" key={p}>
            <Stat num={compile.patternCounts[p]} label="" />
            <PatternBadge pattern={p} />
          </div>
        ))}
      </div>

      {compile.warnings.length > 0 && (
        <>
          <h2>Warnings</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Severity</th><th>Code</th><th>Message</th></tr></thead>
              <tbody>
                {compile.warnings.map((w, i) => (
                  <tr key={i}>
                    <td><span className={`pill ${w.severity === 'blocking' ? 'danger' : w.severity === 'warning' ? 'warn' : 'muted'}`}>{w.severity}</span></td>
                    <td className="mono">{w.code}</td>
                    <td>{w.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <p className="footnote">
        Backed by <span className="mono">POST /v1/assignments/compile</span> (see{' '}
        <span className="mono">api/openapi.yaml</span>). Publishing is a separate teacher action; the
        compiler only ever prepares a proposal.
      </p>
    </>
  );
}
