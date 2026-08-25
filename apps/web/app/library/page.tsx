import Link from 'next/link';
import { getLibrary, getLibraryObjective } from '../../lib/data';

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
      <h1>Content library</h1>
      <p className="lede">
        The approved curriculum content a teacher builds from — objectives, authored lessons,
        assessment items, and vetted sources. Every item below has passed every guardrail
        (standard-mapped, approved sources, lesson covers the reasoning, items trace and don’t leak).
      </p>

      <div className="kpis" style={{ marginBottom: 12 }}>
        <div className="kpi"><div className="n">{cat.summary.objectives}</div><div className="l">objectives</div></div>
        <div className="kpi"><div className="n">{cat.summary.lessons}</div><div className="l">authored lessons</div></div>
        <div className="kpi"><div className="n">{cat.summary.items}</div><div className="l">assessment items</div></div>
        <div className="kpi"><div className="n">{cat.summary.sources}</div><div className="l">approved sources</div></div>
        <div className="kpi"><div className="n">{cat.summary.allValid ? '✓ All' : '⚠'}</div><div className="l">pass every gate</div></div>
      </div>

      {[...bySubject.entries()].map(([subject, entries]) => (
        <section key={subject}>
          <div className="subject-head">
            <h2>{SUBJECT_LABEL[subject] ?? subject}</h2>
            <span className="count">{entries.length} objective{entries.length === 1 ? '' : 's'}</span>
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
        Computed by <span className="mono">@ilp/core</span> (<span className="mono">buildCatalog</span>): every objective is
        run through the objective-authoring, lesson-coverage, and item-integrity gates. Synthetic content; sources are
        representative candidates confirmed in the vetting pipeline.
      </p>
    </>
  );
}

function ObjectiveDetail({ id }: { id: string }) {
  const data = getLibraryObjective(id);
  if (!data) return <><h1>Not found</h1><p><Link href="/library">← Back to the library</Link></p></>;
  const { entry, objective, lesson, items, sources } = data;

  return (
    <>
      <p style={{ marginBottom: 10 }}><Link href="/library">← Content library</Link></p>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        {SUBJECT_LABEL[objective.subject] ?? objective.subject} · {objective.objectiveId} · {objective.standardRefs.join(', ')} {entry.ok && <span className="pill ok" style={{ marginLeft: 8 }}>✓ passes every gate</span>}
      </div>
      <h1>{objective.studentOutcome}</h1>

      <div className="locked" style={{ margin: '14px 0 20px' }}>
        <span className="k">Locked contract</span> — required reasoning: <strong>{objective.requiredReasoning.join(', ')}</strong> ·
        mastery ≥ {Math.round(objective.mastery.threshold * 100)}%, {objective.mastery.minimumEvidenceTypes} evidence types,
        transfer {objective.mastery.transferRequired ? 'required' : 'optional'}.
      </div>

      <h2>The lesson: {lesson?.title}</h2>
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
        (<Link href="/assign">Assign once</Link>) to individualize it per student while keeping this objective locked.
      </p>
    </>
  );
}
