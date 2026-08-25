import { describe, expect, it } from 'vitest';
import { classifyContribution, moderatePost, computeRecognition, buildStudyGuide } from '../src/index.js';
import { SAMPLE_MEMBERS, LIBRARY_OBJECTIVES, LIBRARY_LESSONS } from '../src/fixtures/index.js';

const LIB_OBJ = LIBRARY_OBJECTIVES.find((o) => o.objectiveId === 'M3.NF.01')!;
const LIB_LESSON = LIBRARY_LESSONS.find((l) => l.objectiveId === 'M3.NF.01')!;

const verified = SAMPLE_MEMBERS.map((m) => m.id);
const mod = (authorId: string, text: string) => moderatePost({ authorId, text, verifiedMemberIds: verified });

describe('contribution classification', () => {
  it('recognizes explanations, questions, resources and answer-dumps', () => {
    expect(classifyContribution('I think 1/3 is bigger because the pieces are bigger.')).toBe('explanation');
    expect(classifyContribution('How do you compare fractions?')).toBe('question');
    expect(classifyContribution('Here is a helpful video https://example.org')).toBe('resource');
    expect(classifyContribution('the answer is 1/3')).toBe('answer_dump');
  });
});

describe('moderation guardrails', () => {
  it('approves a helpful, on-topic explanation from a verified member', () => {
    const r = mod('S-778', 'I think 1/3 is bigger because there are fewer, bigger pieces.');
    expect(r.status).toBe('approved');
    expect(r.escalateToHuman).toBe(false);
  });

  it('blocks a post from someone not on the verified roster', () => {
    const r = mod('S-999', 'hi can I join');
    expect(r.status).toBe('blocked');
    expect(r.reasons[0]!.code).toBe('unverified_member');
  });

  it('holds an answer-dump and requires an independent mastery check', () => {
    const r = mod('S-780', 'the answer is 1/3');
    expect(r.status).toBe('held');
    expect(r.kind).toBe('answer_dump');
    expect(r.requiresMasteryCheck).toBe(true);
  });

  it('holds bullying language and escalates to a human', () => {
    const r = mod('S-780', 'you are so stupid');
    expect(r.status).toBe('held');
    expect(r.escalateToHuman).toBe(true);
    expect(r.reasons.some((x) => x.code === 'safety_bullying')).toBe(true);
  });

  it('escalates possible self-harm language to a trained adult immediately', () => {
    const r = mod('S-777', 'sometimes I want to hurt myself');
    expect(r.escalateToHuman).toBe(true);
    expect(r.reasons.some((x) => x.code === 'self_harm')).toBe(true);
    expect(r.status).toBe('held');
  });

  it('holds posts that contain personal contact info', () => {
    const r = mod('S-777', 'call me at 555-123-4567');
    expect(r.status).toBe('held');
    expect(r.reasons.some((x) => x.code === 'pii')).toBe(true);
  });
});

describe('recognition is helpfulness, not popularity', () => {
  it('ranks explainers and resource-sharers above answer-dumpers', () => {
    const posts = [
      { authorId: 'S-778', kind: 'explanation' as const, status: 'approved' as const },
      { authorId: 'S-778', kind: 'explanation' as const, status: 'approved' as const },
      { authorId: 'S-779', kind: 'resource' as const, status: 'approved' as const },
      { authorId: 'S-780', kind: 'answer_dump' as const, status: 'held' as const },
    ];
    const ranked = computeRecognition(SAMPLE_MEMBERS, posts);
    expect(ranked[0]!.memberId).toBe('S-778'); // most helpful
    expect(ranked.find((r) => r.memberId === 'S-780')!.helpfulness).toBeLessThan(0);
  });
});

describe('study guide', () => {
  it('builds a study guide from approved lesson content', () => {
    const g = buildStudyGuide(LIB_OBJ, LIB_LESSON);
    expect(g.whatYoullLearn).toBe(LIB_OBJ.studentOutcome);
    expect(g.keyIdeas.length).toBeGreaterThan(0);
    expect(g.commonMistakes).toEqual([...LIB_OBJ.misconceptions]);
    expect(g.workedExample).toBeTruthy();
  });
});
