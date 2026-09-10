import Link from 'next/link';
import { getIepBuilder, getIepGoals } from '../../lib/data';
import { IepPlanBuilder, type CatalogEntry } from '../../components/IepPlanBuilder';

const GOAL_STATUS: Record<string, { text: string; cls: string }> = {
  met: { text: 'Criterion met', cls: 'ok' },
  on_track: { text: 'On track', cls: 'ok' },
  progressing: { text: 'Progressing', cls: 'muted' },
  needs_review: { text: 'Needs review', cls: 'warn' },
  insufficient_evidence: { text: 'No qualifying evidence yet', cls: 'warn' },
};
const LEVEL_TEXT: Record<string, string> = {
  independent: 'fully independent',
  gestural_prompt: 'a gestural prompt or less',
  modeled: 'a model or less',
  full_support: 'any support',
};
const pctG = (f: number) => `${Math.round(f * 100)}%`;

export default function IepPage() {
  const d = getIepBuilder();
  const goals = getIepGoals();

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        ESE · the plan drives the software
      </div>
      <h1>The IEP plan screen</h1>
      <p className="lede">
        Step 2 of the IEP build: the child’s team enters the plan <strong>once</strong> — each
        accommodation in the plan’s own wording — and from that moment the compiler carries it on{' '}
        <strong>every</strong> assignment, quiz, and exam, automatically. Never left to memory, never
        forgotten on test day. The gate below is the same code the tests run: it refuses an
        accommodation that would modify the Learning Objective (that lane stays human-authorized),
        demands the plan’s wording for the audit trail, and surfaces any mismatch between what the
        plan calls a support and how the platform will treat it.
      </p>

      <IepPlanBuilder catalog={d.catalog as CatalogEntry[]} seed={d.seed} seedName={d.seedName} />

      <h2 style={{ marginTop: 26 }}>Goals as module chains — progress that accrues itself</h2>
      <p className="lede" style={{ fontSize: '1rem' }}>
        Step 4: an annual goal decomposes into the <strong>same modules the class already runs</strong>,
        so pull-aside works the same curriculum and progress toward the goal accrues automatically from
        everyday instruction — no separate data collection, no quarterly scramble. Each criterion names
        its prompt level, because “80% accurate” means nothing until you say <em>at what independence</em>:
        only attempts at or above that level count toward the criterion, so supported success can never
        quietly satisfy an independence goal. Status is evidence for the team — never a determination.
      </p>
      <div className="grid cols-2" style={{ alignItems: 'stretch' }}>
        {goals.map(({ goal, studentName, moduleTitles, progress }) => {
          const st = GOAL_STATUS[progress.status] ?? GOAL_STATUS.progressing;
          return (
            <div className="card" key={goal.goalId}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0 }}>{studentName}</h3>
                <span className={`pill ${st.cls}`}>{st.text}</span>
              </div>
              <p style={{ margin: '6px 0 8px', fontSize: '0.88rem', fontStyle: 'italic' }}>“{goal.goalText}”</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                {moduleTitles.map((m) => (
                  <span key={m.id} className="pill brand">{m.id} · {m.title}</span>
                ))}
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>
                Criterion: <strong>{pctG(goal.criterion.accuracy)}</strong> at{' '}
                <strong>{LEVEL_TEXT[goal.criterion.promptLevelAtOrAbove]}</strong>, {goal.criterion.consecutiveSessions} sessions in a row.
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
                {progress.qualifyingAttempts} qualifying attempts ({pctG(progress.accuracyAtCriterionLevel)} correct) ·{' '}
                {progress.consecutiveCriterionSessions} criterion sessions in a row ·{' '}
                {progress.supportedAttempts} more-supported attempts stay visible, never counted toward the criterion
              </p>
            </div>
          );
        })}
      </div>

      <p className="footnote" style={{ marginTop: 14 }}>
        Goals validated by <span className="mono">validateIEPGoal</span> against the class’s own module
        definitions; progress accrued by <span className="mono">goalProgressFrom</span> over the same
        prompt-level attempt log as the independence trend on <Link href="/ese">ESE</Link>. Runs{' '}
        <span className="mono">validateIEPPlan</span> → <span className="mono">iepToConstraints</span> →{' '}
        the assign-once compiler, live, on synthetic data. Exclusions always beat forces;{' '}
        <span className="mono">objectiveModified</span> stays false in this lane by construction. See the
        six-student showcase at <Link href="/ese">ESE</Link> and the picture-response channel there too.
      </p>
    </>
  );
}
