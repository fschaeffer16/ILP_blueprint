import { getClasswideOutcome, getGradingRows, objective, rubric } from '../../lib/data';
import { GradingCard } from '../../components/GradingCard';
import { pct } from '../../components/ui';

export default function GradingPage() {
  const rows = getGradingRows();
  const outcome = getClasswideOutcome();

  return (
    <>
      <h1>Grading review</h1>
      <p className="lede">
        The AI reviews each submission against the rubric and shows its evidence, confidence and
        flags. It <strong>cannot</strong> release a grade — you accept, modify or reject. A rejected
        or second-review submission releases nothing.
      </p>

      {outcome.mode === 'classwide' && (
        <div className="callout danger">
          <h3>⚠ Classwide pattern detected — the 75% rule fired</h3>
          <p>{outcome.rationale}</p>
          <p style={{ marginTop: 6 }}>
            Before blaming {Math.round(outcome.missRate * 100)}% of the class, audit the item and the
            instruction. The strong responses below were scored low by the first pass — exactly the
            assessment-integrity signal this rule exists to surface.
          </p>
        </div>
      )}

      <div className="locked" style={{ marginBottom: 16 }}>
        <strong>Rubric {rubric.rubricId}</strong> for {objective.objectiveId} — mastery ≥{' '}
        {pct(objective.mastery.threshold)}, {objective.mastery.minimumEvidenceTypes} evidence types,
        transfer {objective.mastery.transferRequired ? 'required' : 'optional'}.
      </div>

      <div className="grid">
        {rows.map((r) => (
          <GradingCard
            key={r.studentId}
            name={r.name}
            studentId={r.studentId}
            response={r.response}
            supportsUsed={r.supportsUsed}
            recommendation={r.recommendation}
            proposedOnAccept={r.proposedOnAccept}
          />
        ))}
      </div>

      <p className="footnote">
        Backed by <span className="mono">POST /v1/grading/recommend</span> and{' '}
        <span className="mono">POST /v1/teacher-decisions</span>. The reference grader is a
        deterministic stand-in; production grading runs behind the provider-agnostic model gateway.
        The decision → final-grade gate is identical either way.
      </p>
    </>
  );
}
