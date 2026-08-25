import { NextResponse } from 'next/server';
import { validateObjectiveDraft } from '@ilp/core';
import { SAMPLE_ADAPTATIONS, SAMPLE_SOURCES } from '@ilp/core/fixtures';

/**
 * POST /api/objectives/validate — runs the REAL authoring gate.
 *
 * Body: a draft ObjectiveVersion (untrusted; it comes from the builder form).
 * Returns { ok, issues } from `validateObjectiveDraft`. This is the same function
 * the tests exercise; the builder calls it live so publishing is never a rubber stamp.
 */
export async function POST(req: Request): Promise<NextResponse> {
  let draft: unknown;
  try {
    draft = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, issues: [{ code: 'BAD_JSON', severity: 'blocking', message: 'Request body was not valid JSON.' }] },
      { status: 400 },
    );
  }
  const result = validateObjectiveDraft(draft, {
    catalog: SAMPLE_ADAPTATIONS,
    approvedSources: SAMPLE_SOURCES,
  });
  return NextResponse.json(result);
}
