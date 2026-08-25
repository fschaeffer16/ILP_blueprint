import { NextResponse } from 'next/server';
import { moderatePost } from '@ilp/core';
import { SAMPLE_MEMBERS } from '@ilp/core/fixtures';

/**
 * POST /api/collaboration/moderate — runs the REAL post-moderation guardrails.
 * Body: { authorId, text }. Returns the moderation decision (status, kind, reasons,
 * requiresMasteryCheck, escalateToHuman).
 */
export async function POST(req: Request): Promise<NextResponse> {
  let body: { authorId?: string; text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }
  const result = moderatePost({
    authorId: body.authorId ?? 'S-777',
    text: String(body.text ?? ''),
    verifiedMemberIds: SAMPLE_MEMBERS.map((m) => m.id),
  });
  return NextResponse.json(result);
}
