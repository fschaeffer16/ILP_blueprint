'use client';

import { useState } from 'react';

type Choice = { id: string; label: string };
type Task = { id: string; domain: string; session: number; prompt: string; format: 'single_choice' | 'observation_scale'; choices: readonly Choice[] | null; scaleHint: string | null };
type Response = { taskId: string; choiceId?: string; scaleValue?: number };
type Indicator = { domain: string; signal: string; indicatorType: string; plainLanguage: string; nextSteps: string[] };
type Profile = { sufficientEvidence: boolean; indicators: Indicator[]; familyNotification: string | null; disclaimer: string; sessionsUsed: number } | null;

const DOMAIN_LABEL: Record<string, string> = {
  phonological_awareness: 'Phonological awareness', letter_sound_decoding: 'Letter–sound decoding', rapid_naming: 'Rapid naming',
  oral_language: 'Oral language', working_memory: 'Working memory', processing_speed: 'Processing speed', sustained_attention: 'Sustained attention',
  number_sense: 'Number sense', visual_motor: 'Visual-motor', oral_written_gap: 'Oral-vs-written', performance_conditions: 'Performance conditions',
};
const SIG: Record<string, string> = { notable: 'sig notable', emerging: 'sig emerging', monitor: 'sig monitor' };
const STEP: Record<string, string> = {
  continue_monitoring: 'Keep monitoring', classroom_support: 'Classroom support', targeted_intervention: 'Targeted intervention',
  specialist_screening_referral: 'Specialist screening referral', family_notification: 'Notify family',
};

export function BaselineTake({ tasks, demoResponses }: { tasks: readonly Task[]; demoResponses: readonly Response[] }) {
  const [answers, setAnswers] = useState<Record<string, Response>>({});
  const [profile, setProfile] = useState<Profile>(null);
  const [busy, setBusy] = useState(false);

  const setChoice = (taskId: string, choiceId: string) => setAnswers((a) => ({ ...a, [taskId]: { taskId, choiceId } }));
  const setScale = (taskId: string, scaleValue: number) => setAnswers((a) => ({ ...a, [taskId]: { taskId, scaleValue } }));
  const fillDemo = () => setAnswers(Object.fromEntries(demoResponses.map((r) => [r.taskId, r])));

  async function screen() {
    setBusy(true);
    try {
      const res = await fetch('/api/baseline/screen', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ responses: Object.values(answers) }) });
      setProfile((await res.json()) as Profile);
    } finally { setBusy(false); }
  }

  const sessions = [1, 2, 3];
  const answeredCount = Object.keys(answers).length;

  return (
    <>
      <div className="decision-row" style={{ marginBottom: 14 }}>
        <button className="btnish" type="button" onClick={fillDemo}>Fill demo answers</button>
        <button className="btn-primary" type="button" onClick={screen} disabled={busy || answeredCount === 0}>
          {busy ? 'Scoring…' : `Score & screen (${answeredCount}/${tasks.length} answered)`}
        </button>
      </div>

      {sessions.map((s) => (
        <div key={s} className="card" style={{ marginBottom: 12 }}>
          <h3 style={{ marginBottom: 10 }}>Session {s}</h3>
          {tasks.filter((t) => t.session === s).map((t) => {
            const ans = answers[t.id];
            return (
              <div key={t.id} className="field" style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <label>{DOMAIN_LABEL[t.domain] ?? t.domain}</label>
                <div style={{ fontSize: '0.95rem', marginBottom: 6 }}>{t.prompt}</div>
                {t.format === 'single_choice' && t.choices ? (
                  <div className="decision-row">
                    {t.choices.map((c) => (
                      <button key={c.id} type="button" className={`btnish ${ans?.choiceId === c.id ? 'primary' : ''}`} onClick={() => setChoice(t.id, c.id)}>{c.label}</button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="evidence" style={{ marginBottom: 4 }}>Observer rating — {t.scaleHint}</div>
                    <input type="range" min={0} max={100} value={Math.round((ans?.scaleValue ?? 0.5) * 100)} onChange={(e) => setScale(t.id, Number(e.target.value) / 100)} style={{ width: 220 }} />
                    <span className="mono" style={{ marginLeft: 8 }}>{Math.round((ans?.scaleValue ?? 0.5) * 100)}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {profile && (
        <div style={{ marginTop: 6 }}>
          <div className={`gatebar ${profile.indicators.length > 0 ? 'bad' : 'ok'}`}>
            <span className="verdict">
              {profile.sufficientEvidence
                ? `${profile.indicators.length} signal${profile.indicators.length === 1 ? '' : 's'} to review — screening, not a diagnosis`
                : 'Not enough evidence yet (needs more than one session)'}
            </span>
          </div>
          {profile.indicators.map((i) => (
            <div className="indicator" key={i.domain}>
              <div className="head">
                <span className="dom">{DOMAIN_LABEL[i.domain] ?? i.domain}</span>
                <span className={SIG[i.signal] ?? 'sig monitor'}>{i.signal}</span>
                <span className="pill muted">{i.indicatorType}</span>
              </div>
              <div className="pl">{i.plainLanguage}</div>
              <div className="steps">{i.nextSteps.map((s) => <span key={s} className={`step-pill ${s === 'specialist_screening_referral' ? 'referral' : s === 'family_notification' ? 'notify' : ''}`}>{STEP[s] ?? s}</span>)}</div>
            </div>
          ))}
          {profile.familyNotification && (
            <div className="callout" style={{ marginTop: 12 }}><strong>Family notification:</strong>&nbsp;{profile.familyNotification}</div>
          )}
          <p className="footnote">{profile.disclaimer}</p>
        </div>
      )}
    </>
  );
}
