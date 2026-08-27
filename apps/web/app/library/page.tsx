import Link from 'next/link';
import { getLibrary, getLibraryObjective, getStandardsCoverage } from '../../lib/data';

const SUBJECT_LABEL: Record<string, string> = {
  mathematics: 'Mathematics', reading: 'Reading', writing: 'Writing', science: 'Science', history_civics: 'History & Civics',
};
const KIND_LABEL: Record<string, string> = {
  objective_preview: 'Preview', instruction: 'Instruction', worked_example: 'Worked example',
  practice: 'Practice', collaboration: 'Collaboration', mastery_task: 'Mastery task', reflection: 'Reflection',
};

export default function LibraryPage({ searchParams }: { searchParams: { o?: string } }) {
  if (searchParams.o) return <ObjectiveDetail id={searchParams.o} />;

  const cat = getLibrary();
  type Entry = (typeof cat.entries)[number];
  const bySubject = new Map<string, Entry[]>();
  for (const e of cat.entries) {
    const g = bySubject.get(e.subject) ?? [];
    g.push(e);
    bySubject.set(e.subject, g);
  }

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        District-approved content · grade 3
      </div>
      <h1>Content library · modules</h1>
      <p className="lede">
        The approved curriculum, organized as <strong>modules</strong>. A module is one Learning
        Objective: its lessons live inside it, its assessment items are tagged to it, and its
        remediation is built in. Every card below has passed every guardrail (standard-mapped,
        approved sources, lesson covers the reasoning, items trace and don’t leak). Open one to see
        the module’s lesson, its items, and its pass-mark-triggered reteach.
      </p>

      <div className="kpis" style={{ marginBottom: 12 }}>
        <div className="kpi"><div className="n">{cat.summary.objectives}</div><div className="l">Learning Objectives</div></div>
        <div className="kpi"><div className="n">{cat.summary.lessons}</div><div className="l">authored lessons</div></div>
        <div className="kpi"><div className="n">{cat.summary.items}</div><div className="l">assessment items</div></div>
        <div className="kpi"><div className="n">{cat.summary.sources}</div><div className="l">approved sources</div></div>
        <div className="kpi"><div className="n">{cat.summary.allValid ? '✓ All' : '⚠'}</div><div className="l">pass every gate</div></div>
      </div>

      <BestCoverage />

      {[...bySubject.entries()].map(([subject, entries]) => (
        <section key={subject}>
          <div className="subject-head">
            <h2>{SUBJECT_LABEL[subject] ?? subject}</h2>
            <span className="count">{entries.length} Learning Objective{entries.length === 1 ? '' : 's'}</span>
          </div>
          <div className="libgrid">
            {entries.map((e) => (
              <Link key={e.objectiveId} href={`/library?o=${e.objectiveId}`} className="libcard">
                <span className="code">{e.objectiveId}</span> {e.ok ? <span className="pill ok">✓ valid</span> : <span className="pill danger">✕</span>}
                <div className="ttl">{e.title}</div>
                <div className="meta">
                  <span>{e.blockCount} blocks</span><span>{e.itemCount} items</span><span>{e.sourceCount} sources</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <p className="footnote">
        Computed by <span className="mono">@ilp/core</span> (<span className="mono">buildCatalog</span>): every Learning Objective is
        run through the Learning-Objective authoring, lesson-coverage, and item-integrity gates. Synthetic content; sources are
        representative candidates confirmed in the vetting pipeline.
      </p>
    </>
  );
}

function BestCoverage() {
  const cov = getStandardsCoverage();
  const pct = Math.round((cov.totals.authored / cov.totals.total) * 100);
  return (
    <section style={{ margin: '10px 0 22px', padding: '16px 18px', border: '1px solid var(--line)', borderRadius: 14, background: 'var(--panel, #fff)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: '1.05rem' }}>Florida B.E.S.T. grade-3 coverage</h2>
        <span style={{ color: 'var(--muted, #667)', fontSize: '.85rem', fontWeight: 600 }}>
          {cov.totals.authored} of {cov.totals.total} benchmarks authored ({pct}%) — the library grows toward the full standard set
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10 }}>
        {cov.rows.map((r) => (
          <div key={r.strand} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: '.78rem', fontWeight: 700 }}>
              <span>{r.strand}</span>
              <span style={{ color: r.authored > 0 ? 'var(--brand)' : 'var(--muted, #99a)' }}>{r.authored}/{r.total}</span>
            </div>
            <div style={{ height: 6, borderRadius: 4, background: 'var(--line)', marginTop: 8, overflow: 'hidden' }}>
              <div style={{ width: `${Math.round((r.authored / r.total) * 100)}%`, height: '100%', background: 'var(--brand)' }} />
            </div>
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {r.codes.map((c) => (
                <span key={c.code} title={c.code} style={{
                  fontSize: '.62rem', fontWeight: 700, padding: '2px 5px', borderRadius: 5,
                  fontFamily: 'var(--mono, ui-monospace, monospace)',
                  background: c.authored ? 'var(--brand)' : 'transparent',
                  color: c.authored ? '#fff' : 'var(--muted, #99a)',
                  border: c.authored ? '1px solid var(--brand)' : '1px solid var(--line)',
                }}>{c.code.replace(/^(MA|ELA)\.3\./, '')}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ObjectiveDetail({ id }: { id: string }) {
  const data = getLibraryObjective(id);
  if (!data) return <><h1>Not found</h1><p><Link href="/library">← Back to the library</Link></p></>;
  const { entry, objective, lesson, items, sources, module } = data;
  const passPct = Math.round((module?.passThreshold ?? objective.mastery.threshold) * 100);
  const teachingBlocks = lesson?.blocks.filter((b) => b.kind === 'instruction' || b.kind === 'worked_example').length ?? 0;

  return (
    <>
      <p style={{ marginBottom: 10 }}><Link href="/library">← Content library</Link></p>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Module · {SUBJECT_LABEL[objective.subject] ?? objective.subject} · {objective.objectiveId} · {objective.standardRefs.join(', ')} {entry.ok && <span className="pill ok" style={{ marginLeft: 8 }}>✓ passes every gate</span>}
      </div>
      <h1>{objective.studentOutcome}</h1>

      <div className="callout" style={{ margin: '14px 0 20px' }}>
        <h3 style={{ marginBottom: 6 }}>
          This is a module {module && <span className="pill brand" style={{ marginLeft: 6 }}>tag {module.moduleId}</span>}
        </h3>
        <p style={{ marginBottom: 8 }}>
          A module is one Learning Objective. Its lessons live inside it, and remediation is built in:
          every quiz/exam question for this module is tagged{' '}
          <span className="mono">_{module?.moduleId ?? 'M#'}</span> so results track by module — student, class,
          school, district.
        </p>
        <div className="mini">
          <div className="m"><div className="n">{teachingBlocks || 1}</div><div className="l">lesson{teachingBlocks === 1 ? '' : 's'} inside this module</div></div>
          <div className="m"><div className="n">{items.length}</div><div className="l">assessment items, all tagged to it</div></div>
          <div className="m"><div className="n">{passPct}%</div><div className="l">pass mark — below it, remediation auto-triggers</div></div>
        </div>
        <p className="sub" style={{ margin: '10px 0 0' }}>
          <strong>Built-in remediation:</strong> score below {passPct}% on this module and a materially-different
          reteach auto-assigns, then the student retakes <em>only this module’s questions</em> — no waiting for the next test.
          {' '}<Link href="/exam">See it tracked on an exam →</Link>
        </p>
      </div>

      <div className="locked" style={{ margin: '14px 0 20px' }}>
        <span className="k">Locked contract</span> — required reasoning: <strong>{objective.requiredReasoning.join(', ')}</strong> ·
        mastery ≥ {Math.round(objective.mastery.threshold * 100)}%, {objective.mastery.minimumEvidenceTypes} evidence types,
        transfer {objective.mastery.transferRequired ? 'required' : 'optional'}.
      </div>

      <h2>The lesson inside this module: {lesson?.title}</h2>
      {lesson?.blocks.map((b) => (
        <div className="block" key={b.id}>
          <div className="bhead">
            <span className="kindchip">{KIND_LABEL[b.kind] ?? b.kind}</span>
            <span className="btitle">{b.title}</span>
          </div>
          {b.body && <div className="bbody">{b.body}</div>}
          <div className="bmeta">
            {b.targets.length > 0 && <>builds: {b.targets.join(', ')} · </>}
            {b.sourceIds.length > 0 ? <>source: {b.sourceIds.join(', ')}</> : <>no source needed</>}
          </div>
        </div>
      ))}

      <h2>Assessment items</h2>
      <div className="wrap">
        <table>
          <thead><tr><th>Item</th><th>Measures</th><th>Format</th><th>Prompt</th></tr></thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.itemId}>
                <td className="mono">{it.itemId}</td>
                <td>{it.evidenceClaim}</td>
                <td>{it.format.replace('_', ' ')}</td>
                <td>{it.prompt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Sources</h2>
      <div className="wrap">
        <table>
          <thead><tr><th>Source</th><th>Tier</th><th>License</th><th>Status</th></tr></thead>
          <tbody>
            {sources.map((s) => s && (
              <tr key={s.id}>
                <td>{s.title} <span className="mono" style={{ color: 'var(--muted)' }}>{s.id}</span></td>
                <td>{s.tier}</td>
                <td>{s.license.replace(/_/g, ' ')}</td>
                <td><span className="pill ok">✓ {s.reviewStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="footnote">
        This is what a teacher assigns and a student sees. Assigning it runs the compiler
        (<Link href="/assign">Assign once</Link>) to individualize it per student while keeping this Learning Objective locked.
      </p>
    </>
  );
}
