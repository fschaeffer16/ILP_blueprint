import { NextResponse } from 'next/server';
import { referenceGrader } from '@ilp/core';
import { OBJ_M3_NF_01, SAMPLE_RUBRIC, SAMPLE_SUBMISSIONS } from '@ilp/core/fixtures';

/**
 * POST /api/grading/recommend — mirrors /v1/grading/recommend (api/openapi.yaml).
 *
 * Returns non-authoritative first-pass recommendations for the synthetic submissions.
 * A recommendation is never a grade; releasing a grade requires a teacher decision
 * (/v1/teacher-decisions).
 */
export async function POST(): Promise<NextResponse> {
  const recommendations = SAMPLE_SUBMISSIONS.map((submission) =>
    referenceGrader.grade({ submission, rubric: SAMPLE_RUBRIC, objective: OBJ_M3_NF_01 }),
  );
  return NextResponse.json({ recommendations, authoritative: false });
}
