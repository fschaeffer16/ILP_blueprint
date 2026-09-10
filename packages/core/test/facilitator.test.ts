import { describe, expect, it } from 'vitest';
import { buildFacilitatorDay, incidentFreeStreak } from '../src/index.js';
import {
  LEO_DAY_PLAN,
  LEO_SERVICE_LOGS,
  SAMPLE_INCIDENTS,
  SCHOOL_DAYS,
} from '../src/fixtures/index.js';

describe('the support facilitator’s day (IEP build step 5)', () => {
  it('merges the day plan with the log; unlogged promises stay pending', () => {
    const day = buildFacilitatorDay('E-LEO', LEO_DAY_PLAN, LEO_SERVICE_LOGS, '2026-09-09');
    expect(day.items).toHaveLength(6);
    const byId = Object.fromEntries(day.items.map((i) => [i.task.taskId, i.status]));
    expect(byId['LD-2']).toBe('delivered');
    expect(byId['LD-3']).toBe('partial');
    expect(byId['LD-5']).toBe('pending');
    expect(byId['LD-6']).toBe('pending');
  });

  it('items come out in time order regardless of input order', () => {
    const day = buildFacilitatorDay('E-LEO', [...LEO_DAY_PLAN].reverse(), LEO_SERVICE_LOGS, '2026-09-09');
    expect(day.items.map((i) => i.task.time)).toEqual(['07:45', '08:15', '10:00', '11:45', '13:00', '14:45']);
  });

  it('fidelity counts pending promises separately — never for, never against', () => {
    const day = buildFacilitatorDay('E-LEO', LEO_DAY_PLAN, LEO_SERVICE_LOGS, '2026-09-09');
    expect(day.fidelity).toMatchObject({ promised: 6, delivered: 3, partial: 1, missed: 0, pending: 2 });
    expect(day.fidelity.rate).toBeCloseTo(3 / 4);
  });

  it('a missed promise is on the record with its reason — surfaced, not buried', () => {
    const yesterday = buildFacilitatorDay('E-LEO', LEO_DAY_PLAN, LEO_SERVICE_LOGS, '2026-09-08');
    const missed = yesterday.items.find((i) => i.status === 'missed');
    expect(missed?.task.taskId).toBe('LD-3');
    expect(missed?.note).toMatch(/did not happen/);
    expect(yesterday.fidelity.rate).toBeCloseTo(5 / 6);
  });

  it('fidelity grades the service, never the child — no score or correctness exists here', () => {
    const day = buildFacilitatorDay('E-LEO', LEO_DAY_PLAN, LEO_SERVICE_LOGS, '2026-09-09');
    for (const item of day.items) {
      expect(Object.keys(item)).not.toContain('correct');
      expect(Object.keys(item.task)).not.toContain('score');
    }
  });

  it('incident-free days accrue: Leo’s streak spans the whole calendar; an incident resets another student’s', () => {
    expect(incidentFreeStreak('E-LEO', SCHOOL_DAYS, SAMPLE_INCIDENTS)).toBe(SCHOOL_DAYS.length);
    expect(incidentFreeStreak('E-OTHER', SCHOOL_DAYS, SAMPLE_INCIDENTS)).toBe(
      SCHOOL_DAYS.filter((d) => d > '2026-09-02').length,
    );
  });
});
