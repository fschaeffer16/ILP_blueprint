import { describe, expect, it } from 'vitest';
import {
  riderStatus,
  routeNotifications,
  routeStatus,
  transitionShift,
  type BusPing,
} from '../src/index.js';
import { BUS_NOW, BUS_PINGS, RIDER_SCANS, ROUTE_17, ROUTE_42, ROUTE_63 } from '../src/fixtures/index.js';

describe('transportation (the 50/50 replacement)', () => {
  it('an on-time route reads on time, with freshness on the headline', () => {
    const s = routeStatus(ROUTE_17, BUS_PINGS, BUS_NOW);
    expect(s.state).toBe('on_time');
    expect(s.dataAgeMinutes).toBe(2);
    expect(s.headline).toContain('as of 2 min ago');
    expect(routeNotifications(ROUTE_17, s)).toHaveLength(0); // no blast when nothing is wrong
  });

  it('lateness is computed from the last live fix, and ETAs shift with it', () => {
    const s = routeStatus(ROUTE_42, BUS_PINGS, BUS_NOW);
    expect(s.state).toBe('late');
    expect(s.delayMinutes).toBe(12); // departed the 07:26 stop at 07:38
    const leoStop = s.stops.find((x) => x.stopId === 'S42-4')!;
    expect(leoStop.passed).toBe(false);
    expect(leoStop.eta).toBe('07:47'); // 07:35 + 12
    const passed = s.stops.filter((x) => x.passed).map((x) => x.stopId);
    expect(passed).toEqual(['S42-1', 'S42-2', 'S42-3']);
  });

  it('a delay notifies ONLY the stops the bus has not yet reached', () => {
    const s = routeStatus(ROUTE_42, BUS_PINGS, BUS_NOW);
    const [n] = routeNotifications(ROUTE_42, s);
    expect(n!.kind).toBe('running_late');
    expect(n!.stopIds).toEqual(['S42-4', 'S42-5', 'S42-6']);
    expect(n!.requiresAcknowledgment).toBe(false);
    expect(n!.dedupeKey).toBe('R42:late:2'); // idempotent per 5-min bucket
  });

  it('signal loss is a status, not a silence: no fabricated ETA, age disclosed, buffered pings never count as live', () => {
    const s = routeStatus(ROUTE_63, BUS_PINGS, BUS_NOW);
    expect(s.state).toBe('signal_lost');
    expect(s.dataAgeMinutes).toBe(9); // the 07:37 buffered upload did not refresh liveness
    for (const stop of s.stops.filter((x) => !x.passed)) expect(stop.eta).toBeNull();
    expect(s.headline).toContain('last seen 9 min ago');
    const [n] = routeNotifications(ROUTE_63, s);
    expect(n!.kind).toBe('signal_lost');
    expect(n!.requiresAcknowledgment).toBe(true);
    expect(n!.escalation).toBe('push_then_sms_then_voice');
  });

  it('very late crosses into acknowledge-to-clear with the full escalation ladder', () => {
    const pings: BusPing[] = [{ routeId: 'R42', atTime: '2026-09-10T07:44:00Z', lastDepartedStopIndex: 2 }];
    const s = routeStatus(ROUTE_42, pings, '2026-09-10T07:45:00Z');
    expect(s.state).toBe('very_late'); // 18 minutes behind the 07:26 stop
    const [n] = routeNotifications(ROUTE_42, s);
    expect(n!.kind).toBe('very_late');
    expect(n!.requiresAcknowledgment).toBe(true);
    expect(n!.escalation).toBe('push_then_sms_then_voice');
  });

  it('rider custody comes only from scans — never inferred from the map', () => {
    const dre = riderStatus('H-DRE', RIDER_SCANS, BUS_NOW);
    expect(dre).toMatchObject({ state: 'on_bus', boardedAt: '07:22', routeId: 'R17' });
    const leo = riderStatus('E-LEO', RIDER_SCANS, BUS_NOW);
    expect(leo.state).toBe('not_boarded'); // his bus is late; no scan, no claim
  });

  it('the bus talks to the support plan: a delay shifts the facilitator’s arrival task', () => {
    const late = routeStatus(ROUTE_42, BUS_PINGS, BUS_NOW);
    const shift = transitionShift(late, 'S42-4')!;
    expect(shift.shiftMinutes).toBe(12);
    expect(shift.note).toContain('07:47');
    const onTime = routeStatus(ROUTE_17, BUS_PINGS, BUS_NOW);
    expect(transitionShift(onTime, 'S17-3')).toBeNull();
    const lost = routeStatus(ROUTE_63, BUS_PINGS, BUS_NOW);
    expect(transitionShift(lost, 'S63-4')!.note).toContain('Signal lost');
  });
});
