'use client';

import { useState } from 'react';
import type { FinalGrade, GradingRecommendation } from '@ilp/core';

type Action = 'pending' | 'accept' | 'modify' | 'reject' | 'request_second_review';

const LABEL: Record<Exclude<Action, 'pending'>, string> = {
  accept: 'Accept',
  modify: 'Modify → full marks',
  reject: 'Reject',
  request_second_review: 'Second review',
};

export function GradingCard({
  name,
  studentId,
  response,
  supportsUsed,
  recommendation,
  proposedOnAccept,
}: {
  name: string;
  studentId: string;
  response: string;
  supportsUsed: readonly string[];
  recommendation: GradingRecommendation;
  proposedOnAccept: FinalGrade;
}) {
  const [action, setAction] = useState<Action>('pending');

  const releases = action === 'accept' || action === 'modify';
  const modified = action === 'modify';
  const fraction = modified ? 1 : proposedOnAccept.fraction;
  const masteryMet = modified ? true : proposedOnAccept.masteryMet;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <h3>{name} <span className="evidence mono">{studentId}</span></h3>
        <span className="pill muted">AI conf {recommendation.overallConfidence}</span>
      </div>

      <p className="sub" style={{ marginTop: 4 }}>
        Response: “{response}”
        {supportsUsed.length > 0 && (
          <> · <span className="pill brand">help: {supportsUsed.join(', ')}</span> (never lowers the grade)</>
        )}
      </p>

      <div className="table-wrap" style={{ margin: '10px 0' }}>
        <table>
          <thead>
            <tr><th>Criterion</th><th>AI points</th><th>Evidence</th><th>Flags</th></tr>
          </thead>
          <tbody>
            {recommendation.criteria.map((c) => (
              <tr key={c.criterionId}>
                <td className="mono">{c.criterionId}</td>
                <td>{c.recommendedPoints}/{c.maxPoints}</td>
                <td className="evidence">{c.evidence}</td>
                <td>
                  <div className="flags">
                    {c.flags.length === 0 ? <span className="pill muted">none</span> : c.flags.map((f) => (
                      <span key={f} className="pill warn">{f}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="decision-row" role="group" aria-label={`Teacher decision for ${name}`}>
        {(Object.keys(LABEL) as Array<Exclude<Action, 'pending'>>).map((a) => (
          <button
            key={a}
            type="button"
            className={`btnish ${action === a ? 'primary' : ''}`}
            aria-pressed={action === a}
            onClick={() => setAction(a)}
          >
            {LABEL[a]}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        {action === 'pending' && <span className="pill muted">No grade yet — awaiting your decision</span>}
        {releases && (
          <span className={`pill ${masteryMet ? 'ok' : 'warn'}`}>
            Grade released: {Math.round(fraction * 100)}% · mastery {masteryMet ? 'met' : 'not met'}
            {modified && ' (teacher override)'}
          </span>
        )}
        {(action === 'reject' || action === 'request_second_review') && (
          <span className="pill danger">No grade released — the AI recommendation stays a recommendation</span>
        )}
      </div>
    </div>
  );
}
