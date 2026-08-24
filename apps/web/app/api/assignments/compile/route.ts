import { NextResponse } from 'next/server';
import { compileAssignment } from '@ilp/core';
import {
  SAMPLE_ADAPTATIONS,
  SAMPLE_ASSIGNMENT,
  SAMPLE_OBJECTIVES,
  SAMPLE_ROSTER,
} from '@ilp/core/fixtures';

/**
 * POST /api/assignments/compile — mirrors /v1/assignments/compile (api/openapi.yaml).
 *
 * For the demo it compiles the sample assignment across the synthetic class. A real
 * implementation would read the request body (class, objective refs, constraints) and
 * load the tenant's objectives and roster.
 */
export async function POST(): Promise<NextResponse> {
  const result = compileAssignment({
    assignment: SAMPLE_ASSIGNMENT,
    objectives: SAMPLE_OBJECTIVES,
    roster: SAMPLE_ROSTER,
    adaptationCatalog: SAMPLE_ADAPTATIONS,
  });

  return NextResponse.json({
    status: result.status,
    objective_integrity: result.objectiveIntegrity,
    student_count: result.studentCount,
    patterns: result.patternCounts,
    objective_modifications: result.objectiveModifications,
    warnings: result.warnings,
    publish_token: result.status === 'ready_for_teacher_review' ? 'one-time-token' : null,
  });
}
