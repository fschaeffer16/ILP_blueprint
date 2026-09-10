/**
 * Transportation fixtures: one morning, three routes, three honest states —
 * running late (Leo's bus), on time (with a boarding scan), and signal lost
 * (shown AS signal lost, the way the incumbent never does). All synthetic.
 */

import type { BusPing, BusRoute, RiderScan } from '../transportation.js';

/** The frozen "now" for the demo morning. */
export const BUS_NOW = '2026-09-10T07:39:00Z';

export const ROUTE_42: BusRoute = {
  routeId: 'R42', busNumber: '42', label: 'Route 42 · AM · Synthetic Middle', direction: 'am',
  driver: { name: 'D. Alvarez', substitute: false },
  stops: [
    { stopId: 'S42-1', name: 'Sandpiper & Weatherbee', scheduledTime: '07:10', studentIds: ['M-JUNE'] },
    { stopId: 'S42-2', name: 'Oakhurst & Palm', scheduledTime: '07:18', studentIds: ['M-KIRA'] },
    { stopId: 'S42-3', name: 'Riverwalk Entrance', scheduledTime: '07:26', studentIds: [] },
    { stopId: 'S42-4', name: 'Cypress Bend & 3rd', scheduledTime: '07:35', studentIds: ['E-LEO'] },
    { stopId: 'S42-5', name: 'Torino Pkwy & 9th', scheduledTime: '07:43', studentIds: [] },
    { stopId: 'S42-6', name: 'Synthetic Middle — bus loop', scheduledTime: '07:50', studentIds: [] },
  ],
};

export const ROUTE_17: BusRoute = {
  routeId: 'R17', busNumber: '17', label: 'Route 17 · AM · Synthetic High', direction: 'am',
  driver: { name: 'P. Whitfield', substitute: false },
  stops: [
    { stopId: 'S17-1', name: 'Bayshore & 12th', scheduledTime: '07:05', studentIds: [] },
    { stopId: 'S17-2', name: 'Lennard & Grove', scheduledTime: '07:14', studentIds: [] },
    { stopId: 'S17-3', name: 'Hillcrest & Main', scheduledTime: '07:21', studentIds: ['H-DRE'] },
    { stopId: 'S17-4', name: 'Synthetic High — bus loop', scheduledTime: '07:36', studentIds: [] },
  ],
};

export const ROUTE_63: BusRoute = {
  routeId: 'R63', busNumber: '63', label: 'Route 63 · AM · Riverbend Elementary', direction: 'am',
  driver: { name: 'SUB — K. Mott', substitute: true },
  stops: [
    { stopId: 'S63-1', name: 'Marsh Harbor Loop', scheduledTime: '07:20', studentIds: [] },
    { stopId: 'S63-2', name: 'Egret & Dune', scheduledTime: '07:28', studentIds: [] },
    { stopId: 'S63-3', name: 'Pelican Cove Clubhouse', scheduledTime: '07:37', studentIds: [] },
    { stopId: 'S63-4', name: 'Riverbend Elementary — bus loop', scheduledTime: '07:48', studentIds: [] },
  ],
};

export const BUS_ROUTES: readonly BusRoute[] = [ROUTE_42, ROUTE_17, ROUTE_63];

export const BUS_PINGS: readonly BusPing[] = [
  // Route 42 — live signal, running 12 minutes behind schedule.
  { routeId: 'R42', atTime: '2026-09-10T07:22:00Z', lastDepartedStopIndex: 0 },
  { routeId: 'R42', atTime: '2026-09-10T07:31:00Z', lastDepartedStopIndex: 1 },
  { routeId: 'R42', atTime: '2026-09-10T07:38:00Z', lastDepartedStopIndex: 2 },
  // Route 17 — live and on time.
  { routeId: 'R17', atTime: '2026-09-10T07:23:00Z', lastDepartedStopIndex: 2 },
  { routeId: 'R17', atTime: '2026-09-10T07:37:00Z', lastDepartedStopIndex: 2 },
  // Route 63 — the last LIVE fix is 9 minutes old; the newer ping is a
  // store-and-forward upload from a dead zone and must never count as live.
  { routeId: 'R63', atTime: '2026-09-10T07:30:00Z', lastDepartedStopIndex: 1 },
  { routeId: 'R63', atTime: '2026-09-10T07:37:00Z', lastDepartedStopIndex: 2, buffered: true },
];

export const RIDER_SCANS: readonly RiderScan[] = [
  { studentId: 'H-DRE', routeId: 'R17', stopId: 'S17-3', direction: 'board', atTime: '2026-09-10T07:22:00Z' },
];
