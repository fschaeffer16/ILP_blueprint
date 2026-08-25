import { describe, expect, it } from 'vitest';
import { aggregateTime, buildParentSummary } from '../src/index.js';
import type { ParentSummaryInput } from '../src/index.js';
import { SAMPLE_PARENT_INPUT } from '../src/fixtures/index.js';

describe('aggregateTime', () => {
  it('sums minutes per surface, largest first', () => {
    const { bySurface, totalMinutes } = aggregateTime([
      { studentId: 'x', surface: 'lesson', minutes: 30, date: 'd' },
      { studentId: 'x', surface: 'lesson', minutes: 20, date: 'd' },
      { studentId: 'x', surface: 'collaboration', minutes: 15, date: 'd' },
    ]);
    expect(totalMinutes).toBe(65);
    expect(bySurface[0]).toEqual({ surface: 'lesson', minutes: 50 });
    expect(bySurface[1]).toEqual({ surface: 'collaboration', minutes: 15 });
  });
});

describe('buildParentSummary', () => {
  const s = buildParentSummary(SAMPLE_PARENT_INPUT);

  it('reports total time and the collaboration share', () => {
    expect(s.totalMinutes).toBe(SAMPLE_PARENT_INPUT.sessions.reduce((n, x) => n + x.minutes, 0));
    expect(s.collaborationMinutes).toBe(15 + 18 + 12);
    expect(s.collaborationShare).toBeGreaterThan(0);
    expect(s.collaborationShare).toBeLessThan(0.5); // healthy balance
  });

  it('celebrates real growth', () => {
    expect(s.flags.some((f) => f.kind === 'celebrate' && f.message.includes('up'))).toBe(true);
  });

  it('raises no unresolved-safety attention flag when everything was handled', () => {
    expect(s.flags.some((f) => f.kind === 'attention')).toBe(false);
  });

  it('raises an attention flag when a safety item is still open', () => {
    const open: ParentSummaryInput = { ...SAMPLE_PARENT_INPUT, wellbeing: { moderationFlags: 1, unresolvedFlags: 1 } };
    const r = buildParentSummary(open);
    expect(r.flags.some((f) => f.kind === 'attention')).toBe(true);
  });

  it('flags a needs-reteach item so there is no surprise', () => {
    const input: ParentSummaryInput = {
      ...SAMPLE_PARENT_INPUT,
      todaysWork: [{ objectiveId: 'X', title: 'Long division', status: 'needs_reteach' }],
    };
    const r = buildParentSummary(input);
    expect(r.flags.some((f) => f.kind === 'watch' && f.message.includes('Long division'))).toBe(true);
  });

  it('flags a collaboration-heavy week for a balance check', () => {
    const input: ParentSummaryInput = {
      ...SAMPLE_PARENT_INPUT,
      sessions: [
        { studentId: 'x', surface: 'collaboration', minutes: 60, date: 'd' },
        { studentId: 'x', surface: 'lesson', minutes: 20, date: 'd' },
      ],
    };
    const r = buildParentSummary(input);
    expect(r.collaborationShare).toBeGreaterThan(0.5);
    expect(r.flags.some((f) => f.kind === 'watch' && f.message.includes('collaboration space'))).toBe(true);
  });

  it('exposes no peer message/transcript content (privacy)', () => {
    const json = JSON.stringify(s).toLowerCase();
    // Plain-language flag text lives under the "message" key; what must never appear is
    // stored conversation content — a messages array or a transcript.
    expect(json).not.toContain('"messages"');
    expect(json).not.toContain('transcript');
    expect(json).not.toContain('chatlog');
  });
});
