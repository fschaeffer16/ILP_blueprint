import { NextResponse } from 'next/server';
import { compileAssignment, iepToConstraints, validateIEPPlan, type IEPPlan } from '@ilp/core';
import { SAMPLE_ADAPTATIONS, SAMPLE_ASSIGNMENT, SAMPLE_OBJECTIVES, SAMPLE_ROSTER } from '@ilp/core/fixtures';

/**
 * POST /api/iep/validate — runs the REAL plan gate, then (if the plan is usable)
 * the REAL compiler with the plan as live input. The builder screen calls this on
 * every "Validate & compile", so what the team sees is what every future
 * assignment will carry — never a mockup.
 */
export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, findings: [{ code: 'BAD_JSON', severity: 'blocking', message: 'Request body was not valid JSON.' }] },
      { status: 400 },
    );
  }

  const b = body as Partial<IEPPlan> & { accommodations?: unknown; excludedAdaptations?: unknown };
  const accommodations = Array.isArray(b.accommodations)
    ? b.accommodations
        .filter((a): a is { adaptationId: string; planText: string; kind: string } =>
          !!a && typeof (a as { adaptationId?: unknown }).adaptationId === 'string')
        .map((a) => ({
          adaptationId: a.adaptationId,
          planText: typeof a.planText === 'string' ? a.planText : '',
          kind: a.kind === 'access' ? ('access' as const) : ('support' as const),
        }))
    : [];
  const excludedAdaptations = Array.isArray(b.excludedAdaptations)
    ? b.excludedAdaptations.filter((x): x is string => typeof x === 'string')
    : [];

  const plan: IEPPlan = {
    studentId: 'BUILDER-DEMO',
    planType: b.planType === '504' ? '504' : 'iep',
    accommodations,
    excludedAdaptations,
  };

  const findings = validateIEPPlan(plan, SAMPLE_ADAPTATIONS);
  const ok = findings.every((f) => f.severity !== 'blocking');
  if (!ok) return NextResponse.json({ ok, findings, compiled: null });

  const constraints = iepToConstraints(plan);
  const result = compileAssignment({
    assignment: { ...SAMPLE_ASSIGNMENT, teacherConstraints: constraints },
    objectives: SAMPLE_OBJECTIVES,
    roster: [SAMPLE_ROSTER[0]],
    adaptationCatalog: SAMPLE_ADAPTATIONS,
    today: new Date('2026-09-08'),
  });
  const manifest = result.manifests[0] ?? null;
  const byId = new Map(SAMPLE_ADAPTATIONS.map((a) => [a.id, a]));
  const planTextById = new Map(plan.accommodations.map((a) => [a.adaptationId, a.planText]));
  const applied = (manifest?.appliedAdaptationIds ?? []).map((id) => ({
    id,
    label: byId.get(id)?.label ?? id,
    permanent: byId.get(id)?.fadeRule == null,
    planText: planTextById.get(id) ?? null,
  }));

  return NextResponse.json({
    ok,
    findings,
    compiled: manifest
      ? {
          pattern: manifest.pattern,
          objectiveModified: manifest.objectiveModified,
          applied,
          excluded: excludedAdaptations,
        }
      : null,
  });
}
