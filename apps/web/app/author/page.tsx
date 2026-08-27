import { getAuthoringData } from '../../lib/data';
import { ObjectiveBuilder } from '../../components/ObjectiveBuilder';

export default function AuthorPage() {
  const { seed, catalog, sources } = getAuthoringData();

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Curriculum authoring
      </div>
      <h1>Learning Objective builder</h1>
      <p className="lede">
        Author a Learning Objective once; every teacher reuses it. Publishing runs the real authoring
        gate — a Learning Objective must be mapped to a standard and cite only approved,
        deliverable-licensed sources, and no permitted technique may change the rigor. Edit the
        fields below and press <strong>Validate &amp; publish</strong> to see the gate decide.
      </p>

      <div className="callout" style={{ marginBottom: 18 }}>
        <strong>Try it:</strong> clear the standard reference, tick a “changes rigor” technique,
        or add the <em>unreviewed</em> source — then validate. The gate blocks each one, live,
        using the same <span className="mono">validateObjectiveDraft</span> the tests run.
      </div>

      <ObjectiveBuilder seed={seed} catalog={catalog} sources={sources} />

      <p className="footnote">
        Backed by <span className="mono">POST /v1/objectives</span> (create draft) and the authoring
        gate. Learning Objective and source records live in <span className="mono">@ilp/core</span>; the
        connected content library that ingests real sources is the next slice.
      </p>
    </>
  );
}
