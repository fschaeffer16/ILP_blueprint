import Link from 'next/link';
import { AdaptiveDemo } from '../../components/AdaptiveDemo';

export default function AdaptivePage() {
  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Adaptive delivery · one question, every learner
      </div>
      <h1>The teacher pushes one question. Each student sees their version.</h1>
      <p className="lede">
        Same Learning Objective, same question, same correct answer — the <em>presentation</em> adapts to each
        student’s baseline-derived profile so they have the best chance to learn, while the rigor never drops.
        Pick a question and toggle the scaffolds to watch the supports <em>fade</em> as independence grows.
      </p>

      <div className="callout" style={{ marginBottom: 18 }}>
        <strong>How the profile is set:</strong> a short baseline plus daily classroom evidence builds each
        student’s profile; the assign-once compiler reads it and auto-selects the right support. Supports are
        tagged <em>access</em> (rigor unchanged) or <em>development</em> (strengthen the weakness), and every
        development scaffold carries a <strong>fade rule</strong> — removed as the student gains independence,
        so the deficiency actually closes.
      </div>

      <AdaptiveDemo />

      <p className="footnote">
        The adaptation the compiler selects per student is real (<span className="mono">@ilp/core</span>{' '}
        assign-once + adaptation engine — see <Link href="/assign">Assign once</Link>). These exemplars render the
        cues by hand to make it visible; auto-generating visuals for <em>any</em> question is the model-gateway
        work still ahead. Same objective, same answer, adapted delivery — never a lower standard.
      </p>
    </>
  );
}
