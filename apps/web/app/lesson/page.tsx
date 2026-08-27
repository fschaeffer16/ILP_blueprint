import { getLessonData } from '../../lib/data';
import { LessonBuilder } from '../../components/LessonBuilder';

export default function LessonPage() {
  const { objective, plan, sources } = getLessonData();

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Teacher authoring · Layer 2
      </div>
      <h1>Lesson builder</h1>
      <p className="lede">
        A teacher assembles a lesson for <strong>{objective.objectiveId}</strong> — {objective.studentOutcome}
        {' '}— from district-approved sources. The gate checks that the lesson actually teaches and
        assesses, that every block is grounded in an approved source, and that it <em>covers every
        piece of reasoning the Learning Objective will be graded on</em>. Freedom inside the guardrails.
      </p>

      <div className="callout" style={{ marginBottom: 18 }}>
        <strong>Try it:</strong> switch a block’s source to the <em>unreviewed</em> one, or turn off the
        <em> mastery task</em> or the block that builds <em>transfer</em> — then validate. The gate
        blocks each, live, using the same <span className="mono">validateLessonPlan</span> the tests run.
      </div>

      <LessonBuilder objective={objective} plan={plan} sources={sources} />

      <p className="footnote">
        This is Layer 2. Layer 1 (the Learning Objective + approved sources) is district-governed on the
        <span className="mono"> /author</span> screen; Layer 3 (the rollup dashboard) is on
        <span className="mono"> /dashboard</span>.
      </p>
    </>
  );
}
