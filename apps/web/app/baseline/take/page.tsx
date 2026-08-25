import Link from 'next/link';
import { getBaselineTasks } from '../../../lib/data';
import { BaselineTake } from '../../../components/BaselineTake';

export default function BaselineTakePage() {
  const { tasks, demoResponses } = getBaselineTasks();

  return (
    <>
      <p style={{ marginBottom: 10 }}><Link href="/baseline">← Baseline results</Link></p>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Baseline task delivery · grade 3
      </div>
      <h1>Take the baseline</h1>
      <p className="lede">
        The actual age-appropriate tasks, across three short sessions — game/tablet items the child
        answers, and structured observations the teacher rates. Answer them (or press <strong>Fill demo
        answers</strong>), then <strong>Score &amp; screen</strong>: the real answers are scored and run
        through the screener, live. Screening, never a diagnosis.
      </p>

      <div className="callout" style={{ marginBottom: 16 }}>
        <strong>Try it:</strong> answer the reading tasks wrong and the number tasks right, then screen — you’ll
        see the reading signals route to a specialist referral and a family notification, while number sense
        stays a strength. Scoring happens on the server; answer keys never reach the browser.
      </div>

      <BaselineTake tasks={tasks} demoResponses={demoResponses} />

      <p className="footnote">
        Backed by <span className="mono">administer()</span> + <span className="mono">buildBaselineProfile()</span> in
        <span className="mono"> @ilp/core</span>. These are illustrative demo tasks, not a clinical instrument.
      </p>
    </>
  );
}
