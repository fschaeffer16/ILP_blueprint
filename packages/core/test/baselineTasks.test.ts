import { describe, expect, it } from 'vitest';
import { administer, scoreTaskResponse, buildBaselineProfile } from '../src/index.js';
import type { BaselineTask } from '../src/index.js';
import { SAMPLE_TASK_BANK, SAMPLE_TASK_RESPONSES } from '../src/fixtures/index.js';

const choiceTask = SAMPLE_TASK_BANK.find((t) => t.format === 'single_choice')! as BaselineTask;
const scaleTask = SAMPLE_TASK_BANK.find((t) => t.format === 'observation_scale')! as BaselineTask;

describe('scoreTaskResponse', () => {
  it('scores a correct single-choice answer 1 and a wrong one 0', () => {
    expect(scoreTaskResponse(choiceTask, { taskId: choiceTask.id, choiceId: choiceTask.correctChoiceId })).toBe(1);
    expect(scoreTaskResponse(choiceTask, { taskId: choiceTask.id, choiceId: 'zzz' })).toBe(0);
  });
  it('passes through an observation-scale value, clamped', () => {
    expect(scoreTaskResponse(scaleTask, { taskId: scaleTask.id, scaleValue: 0.6 })).toBe(0.6);
    expect(scoreTaskResponse(scaleTask, { taskId: scaleTask.id, scaleValue: 5 })).toBe(1);
  });
  it('an unanswered task scores 0', () => {
    expect(scoreTaskResponse(choiceTask, undefined)).toBe(0);
  });
});

describe('administer', () => {
  const obs = administer({ studentId: 'S-311', date: '2026-09-05', tasks: SAMPLE_TASK_BANK, responses: SAMPLE_TASK_RESPONSES });

  it('produces one observation per answered task, across sessions', () => {
    expect(obs).toHaveLength(SAMPLE_TASK_RESPONSES.length);
    expect(new Set(obs.map((o) => o.sessionId)).size).toBe(3);
  });

  it('feeds the screener: real answers produce a reading indicator, number sense stays strong', () => {
    const profile = buildBaselineProfile(obs, { gradeBand: '3', today: new Date('2026-09-06') });
    expect(profile.sufficientEvidence).toBe(true);
    const reading = profile.indicators.filter((i) => i.indicatorType.startsWith('reading'));
    expect(reading.length).toBeGreaterThan(0);
    // Number sense answered correctly → not flagged.
    expect(profile.indicators.some((i) => i.domain === 'number_sense')).toBe(false);
  });

  it('skips tasks with no response (a skip is not evidence)', () => {
    const partial = administer({ studentId: 'x', date: 'd', tasks: SAMPLE_TASK_BANK, responses: [{ taskId: 'T-pa-1', choiceId: 'a' }] });
    expect(partial).toHaveLength(1);
    expect(partial[0]!.score).toBe(1);
  });
});
