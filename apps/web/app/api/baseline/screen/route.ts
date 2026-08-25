import { NextResponse } from 'next/server';
import { administer, buildBaselineProfile } from '@ilp/core';
import { SAMPLE_TASK_BANK } from '@ilp/core/fixtures';

/**
 * POST /api/baseline/screen — the real task-delivery → screener path.
 *
 * Body: { responses: TaskResponse[] }. Scores the answers against the task bank
 * (server-side, so answer keys never reach the client), turns them into observations,
 * and runs the screener. Returns the screening profile.
 */
export async function POST(req: Request): Promise<NextResponse> {
  let body: { responses?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }
  const responses = Array.isArray(body.responses) ? (body.responses as never[]) : [];
  const observations = administer({ studentId: 'S-311', date: '2026-09-05', tasks: SAMPLE_TASK_BANK, responses });
  const profile = buildBaselineProfile(observations, { gradeBand: '3', today: new Date('2026-09-06') });
  return NextResponse.json(profile);
}
