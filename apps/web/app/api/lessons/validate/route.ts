import { NextResponse } from 'next/server';
import { validateLessonPlan } from '@ilp/core';
import { OBJ_M3_NF_01, SAMPLE_SOURCES } from '@ilp/core/fixtures';

/**
 * POST /api/lessons/validate — runs the REAL lesson-plan authoring gate.
 *
 * Body: a LessonPlan draft (untrusted; from the lesson builder). Returns
 * { ok, issues, coverage } from `validateLessonPlan`.
 */
export async function POST(req: Request): Promise<NextResponse> {
  let plan: unknown;
  try {
    plan = await req.json();
  } catch {
    return NextResponse.json({ ok: false, issues: [{ code: 'BAD_JSON', severity: 'blocking', message: 'Body was not valid JSON.' }], coverage: [] }, { status: 400 });
  }
  // The gate needs a well-shaped plan; if the client sends a partial, wrap defensively.
  const p = plan as { objectiveId?: string; objectiveVersion?: number; blocks?: unknown[] };
  const safePlan = {
    id: 'draft',
    objectiveId: p.objectiveId ?? OBJ_M3_NF_01.objectiveId,
    objectiveVersion: p.objectiveVersion ?? OBJ_M3_NF_01.version,
    title: 'draft',
    authorId: 'T-100',
    blocks: Array.isArray(p.blocks) ? (p.blocks as never[]) : [],
  };
  const result = validateLessonPlan(safePlan, { objective: OBJ_M3_NF_01, approvedSources: SAMPLE_SOURCES });
  return NextResponse.json(result);
}
