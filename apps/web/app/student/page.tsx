import { getStudentHome, getStudentChannels } from '../../lib/data';
import { PostBox } from '../../components/PostBox';
import { PatternBadge } from '../../components/ui';
import type { DeliveryPattern, StudentWorkStatus } from '@ilp/core';

const STATUS: Record<StudentWorkStatus, { text: string; cls: string }> = {
  not_started: { text: 'Start', cls: 'brand' },
  in_progress: { text: 'Keep going', cls: 'brand' },
  submitted: { text: 'Turned in', cls: 'muted' },
  mastered: { text: 'Mastered', cls: 'ok' },
  needs_another_look: { text: 'Another look', cls: 'warn' },
};
const KTAG: Record<string, string> = { explanation: 'explanation', question: 'question', resource: 'resource', answer_dump: 'answer dump' };
const DATE_ICON: Record<string, string> = { quiz: '📝', project: '🛠️', event: '🎉', report: '📩' };
const SUBJECT_LABEL: Record<string, string> = { mathematics: 'Math', reading: 'Reading', writing: 'Writing', history_civics: 'Civics', science: 'Science' };
const channelAnchor = (id: string) => `ch-${id}`;

export default function StudentPage() {
  const { name, queue, upcoming, importantDates, studyGuides } = getStudentHome();
  const { channels, posts } = getStudentChannels();
  const active = queue.filter((a) => a.status !== 'submitted' && a.status !== 'mastered');
  const nextDate = importantDates[0];

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Student app · one place for everything
      </div>
      <h1>Hi, {name} 👋</h1>
      <p className="lede">Your assignments, what’s coming up, important dates, study guides, and your class channels — all in one app. No endless feed, no strangers, just your class and your work.</p>

      <div className="kpis" style={{ marginBottom: 22 }}>
        <div className="kpi"><div className="n">{active.length}</div><div className="l">to do now</div></div>
        <div className="kpi"><div className="n">{upcoming.length}</div><div className="l">coming up</div></div>
        <div className="kpi"><div className="n">{studyGuides.length}</div><div className="l">study guides</div></div>
        <div className="kpi"><div className="n" style={{ fontSize: '1rem', paddingTop: 8 }}>{nextDate?.label ?? '—'}</div><div className="l">next up · {nextDate?.date}</div></div>
      </div>

      <h2>Today · what to do now</h2>
      <div className="assignlist">
        {queue.map((a) => {
          const s = STATUS[a.status];
          return (
            <div className="assign" key={a.assignmentId}>
              <span>
                <span className="t">{a.title}</span>
                <span className="s"> · {a.dueLabel}</span>
                <div><PatternBadge pattern={a.pattern as DeliveryPattern} /> <span className="s">your version</span></div>
              </span>
              <span className={`pill ${s.cls}`}>{s.text}</span>
            </div>
          );
        })}
      </div>

      <h2>Coming up</h2>
      <div className="assignlist">
        {upcoming.map((a) => (
          <div className="assign" key={a.assignmentId}>
            <span>
              <span className="t">{a.title}</span>
              <span className="s"> · {SUBJECT_LABEL[a.subject] ?? a.subject}</span>
              <div><PatternBadge pattern={a.pattern as DeliveryPattern} /> <span className="s">your version</span></div>
            </span>
            <span className="pill muted">{a.dueLabel}</span>
          </div>
        ))}
      </div>

      <h2>Important dates</h2>
      <div className="card">
        <div className="datelist">
          {importantDates.map((d, i) => (
            <div className="dateitem" key={i}>
              <span className="dic" aria-hidden="true">{DATE_ICON[d.kind] ?? '📅'}</span>
              <span className="dwhen">{d.date}</span>
              <span className="dwhat">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <h2>Study guides</h2>
      {studyGuides.map((g) => g && (
        <div className="guide" key={g.objectiveId}>
          <h4>{g.title}</h4>
          <div style={{ fontSize: '0.92rem' }}>{g.whatYoullLearn}</div>
          <div className="lbl">Key ideas</div>
          <div style={{ fontSize: '0.9rem' }}>{g.keyIdeas.join(' · ')}</div>
          {g.workedExample && (<><div className="lbl">Worked example</div><div className="we">{g.workedExample}</div></>)}
          {g.commonMistakes.length > 0 && (<><div className="lbl">Watch out for</div><div style={{ fontSize: '0.9rem' }}>{g.commonMistakes.join(' · ')}</div></>)}
        </div>
      ))}

      <h2>Class channels · by subject</h2>
      <p className="lede" style={{ marginTop: 0 }}>
        Your grade’s verified subject channels — help each other, explain your thinking, share what you find.
        District-first and safe: moderated by trained adults, and answer-dumping gets held so everyone actually learns.
      </p>
      <div className="subjchips">
        {channels.map((ch) => (
          <a className="subjchip" href={`#${channelAnchor(ch.id)}`} key={ch.id}>
            <span className="sc-name"># {ch.name}</span>
            <span className="sc-sub">{SUBJECT_LABEL[ch.subject] ?? ch.subject.replace('_', ' ')}</span>
          </a>
        ))}
      </div>

      {channels.map((ch) => {
        const chPosts = posts.filter((p) => p.channelId === ch.id);
        return (
          <div className="channel" id={channelAnchor(ch.id)} key={ch.id}>
            <div className="chead"><h3># {ch.name}</h3><span className="pill muted">{SUBJECT_LABEL[ch.subject] ?? ch.subject.replace('_', ' ')}</span>{ch.objectiveId && <span className="pill brand">{ch.objectiveId}</span>}</div>
            {chPosts.map((p) => (
              <div className="post" key={p.id}>
                <div className="pmeta"><span className="who">{p.authorName}</span><span className={`ktag ${p.kind}`}>{KTAG[p.kind] ?? p.kind}</span>{p.status === 'held' && <span className="pill warn">held</span>}</div>
                <div className="txt">{p.text}</div>
                {p.note && <div className="held">· {p.note}</div>}
              </div>
            ))}
          </div>
        );
      })}

      <h2>Post to # Math Helpers</h2>
      <div className="card">
        <p className="sub">Try it — write something (or use an example). Your post is checked before it goes live.</p>
        <PostBox />
      </div>

      <p className="footnote">
        Backed by <span className="mono">@ilp/core</span> (<span className="mono">moderatePost</span>, <span className="mono">buildStudyGuide</span>).
        The data model has no direct-message field and no follower counts; moderation runs before anything is shared.
      </p>
    </>
  );
}
