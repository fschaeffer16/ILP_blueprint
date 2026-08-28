import Link from 'next/link';
import { getKindergartenShowcase } from '../../lib/data';
import { PatternBadge } from '../../components/ui';
import type { DeliveryPattern } from '@ilp/core';

const DOMAIN_LABEL: Record<string, string> = {
  language_access: 'Language / hearing sounds',
  mathematical_reasoning: 'Number sense',
  assessment_conditions: 'Working memory / focus',
  written_expression: 'Writing / fine-motor',
  prerequisite_knowledge: 'Prerequisite skills',
  objective_mastery: 'Objective mastery',
};

// What each auto-selected delivery actually looks like for a kindergartner.
const WHAT_THEY_SEE: Record<DeliveryPattern, string> = {
  core: 'The task as written — and as they show mastery, the system extends them within the objective.',
  visual_first: 'The same count, shown first with counters and a ten-frame — a picture to reason from before the symbols.',
  vocabulary_supported: 'The directions read aloud, with key words pre-taught — so language never hides what they can do with numbers.',
  guided_practice: 'One step at a time with check-ins, the multi-step task chunked — the scaffold fades as independence grows.',
  advanced_transfer: 'Extended within the same objective — more challenge, never a lower standard.',
};

const pctS = (f: number) => `${Math.round(f * 100)}%`;

export default function EarlyGradesPage() {
  const s = getKindergartenShowcase();

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Kindergarten · meet them where they are
      </div>
      <h1>One kindergarten class. Every starting point.</h1>
      <p className="lede">
        No grade has a wider range than Kindergarten — one child can’t yet hear the first sound in a word
        while another is already reading. Here, four kindergartners take the <strong>same</strong> Learning
        Objective — <em>{s.objective.studentOutcome}</em> — and the baseline decides what each one sees.
        Same standard, same goal; the delivery meets each child where they are.
      </p>

      <div className="callout" style={{ marginBottom: 18 }}>
        <strong>{s.allValid ? '✓' : '⚠'} Real, gate-validated Kindergarten content.</strong> This objective,
        its lesson, its items and sources all pass the same guardrails as the grade-3 pack
        ({s.objectiveCount} K objectives authored so far). The delivery each child gets below is the assign-once
        compiler’s actual output from their baseline — computed live, not staged.
      </div>

      <div className="grid cols-2">
        {s.students.map((st) => (
          <div className="card" key={st.studentId}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0 }}>{st.name}</h3>
              {st.manifest && <PatternBadge pattern={st.manifest.pattern as DeliveryPattern} />}
            </div>
            <p className="sub" style={{ marginTop: 0 }}>{st.blurb}</p>

            <div className="lbl" style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)' }}>What the baseline found</div>
            {st.growthAreas.length > 0 ? (
              <div className="flags" style={{ marginTop: 4 }}>
                {st.growthAreas.map((g, i) => (
                  <span key={i} className="pill warn">{DOMAIN_LABEL[g.domain] ?? g.domain} · {pctS(g.readiness)}</span>
                ))}
              </div>
            ) : (
              <p style={{ margin: '4px 0 0', fontSize: '0.9rem' }}><span className="pill ok">Secure across the board</span></p>
            )}

            <div className="lbl" style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)', marginTop: 12 }}>What {st.name} sees</div>
            <p style={{ margin: '4px 0 0', fontSize: '0.93rem' }}>{st.manifest && WHAT_THEY_SEE[st.manifest.pattern as DeliveryPattern]}</p>

            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="pill muted">Objective locked</span>
              <span className="pill ok">Same goal for all</span>
            </div>
          </div>
        ))}
      </div>

      <p className="footnote">
        Computed by <span className="mono">@ilp/core</span> — each child’s baseline
        (<span className="mono">buildBaselineProfile</span>) becomes the compiler’s learner model
        (<span className="mono">studentILPFromBaseline</span>), which the assign-once compiler reads to select the
        delivery. Synthetic Kindergarten data; the content is gate-validated. Grades 1 and 2 mirror this exact
        setup. See the wider adaptation demo at <Link href="/adaptive">Adaptive delivery</Link> and how a
        baseline is built at <Link href="/baseline">Baseline</Link>.
      </p>
    </>
  );
}
