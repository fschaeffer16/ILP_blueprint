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

export default function StudentPage() {
  const { name, queue, studyGuides } = getStudentHome();
  const { channels, posts } = getStudentChannels();

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.72rem', fontWeight: 700, marginBottom: 8 }}>
        Student app · one place for everything
      </div>
      <h1>Hi, {name} 👋</h1>
      <p className="lede">Your assignments, your study guides, and your class channels — all in one app. No endless feed, no strangers, just your class and your work.</p>

      <h2>Today</h2>
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

      <h2>Class channels</h2>
      <p className="lede" style={{ marginTop: 0 }}>
        Verified subject channels for your grade — help each other, explain your thinking, share what you find.
        District-first, and safe: moderated by trained adults, and answer-dumping gets held so everyone actually learns.
      </p>

      {channels.map((ch) => {
        const chPosts = posts.filter((p) => p.channelId === ch.id);
        return (
          <div className="channel" key={ch.id}>
            <div className="chead"><h3># {ch.name}</h3><span className="pill muted">{ch.subject.replace('_', ' ')}</span>{ch.objectiveId && <span className="pill brand">{ch.objectiveId}</span>}</div>
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
