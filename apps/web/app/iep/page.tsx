import Link from 'next/link';
import { getIepBuilder } from '../../lib/data';
import { IepPlanBuilder, type CatalogEntry } from '../../components/IepPlanBuilder';

export default function IepPage() {
  const d = getIepBuilder();

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

      <p className="footnote" style={{ marginTop: 14 }}>
        Runs <span className="mono">validateIEPPlan</span> → <span className="mono">iepToConstraints</span> →{' '}
        the assign-once compiler, live, on synthetic data. Exclusions always beat forces;{' '}
        <span className="mono">objectiveModified</span> stays false in this lane by construction. See the
        six-student showcase at <Link href="/ese">ESE</Link> and the picture-response channel there too.
      </p>
    </>
  );
}
