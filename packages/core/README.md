# @ilp/core

The ILP domain kernel: the objective graph, the ILP learner model, a district-customizable
adaptation engine, and the **assign-once assignment compiler** with objective-integrity
enforcement.

This package has no framework, no database and no AI dependency. It is pure, deterministic
domain logic — which is what makes ILP's individualization auditable, testable, and cheap to
run (no model call per student).

## Install & run

```bash
npm install          # from the repo root (workspaces)
npm run demo         # compile one assignment across a synthetic class of 6
npm test             # 24 tests: compiler + objective-integrity guardrails
npm run typecheck
npm run build        # emits dist/
```

## The one function that matters

```ts
import {
  compileAssignment,
  SAMPLE_ASSIGNMENT,
  SAMPLE_OBJECTIVES,
  SAMPLE_ROSTER,
  SAMPLE_ADAPTATIONS,
} from '@ilp/core';

const result = compileAssignment({
  assignment: SAMPLE_ASSIGNMENT,       // one teacher assignment, one objective
  objectives: SAMPLE_OBJECTIVES,       // published objective versions
  roster: SAMPLE_ROSTER,               // each student's ILP
  adaptationCatalog: SAMPLE_ADAPTATIONS,
});

result.status;               // 'ready_for_teacher_review' | 'blocked'
result.objectiveIntegrity;   // 'pass' | 'fail'
result.patternCounts;        // { core, vocabulary_supported, visual_first, guided_practice, advanced_transfer }
result.manifests;            // one individualized, integrity-checked DeliveryManifest per student
```

`compileAssignment` produces a **proposal for teacher review** — it never releases anything to
students. If any per-student manifest would violate the objective's locked contract, the whole
result is `blocked` / `objectiveIntegrity: 'fail'`.

## What it guarantees

- **Assign once, individualize automatically.** One objective fans out into per-student lesson
  versions.
- **Rigor is locked.** `studentOutcome`, `essentialKnowledge`, `requiredReasoning` and the
  `mastery` rule are identical on every manifest, verified by `checkManifestIntegrity`.
- **No silent easier standard.** Prohibited adaptations are never applied (even if
  teacher-forced); objective modifications require explicit teacher authorization and are
  counted and flagged.
- **District-customizable, inside the guardrails.** Districts supply their own objectives and
  adaptation catalog; both are validated (`zod` + JSON Schema) before anything reaches a
  student.
- **Deterministic.** Same inputs → same output. No model call required.

## Layout

| File | Responsibility |
| --- | --- |
| `src/types.ts` | Domain types + the list of locked objective fields |
| `src/schema.ts` | `zod` runtime validation (mirrors `schemas/*.json`) |
| `src/adaptation.ts` | The adaptation engine (decision order, selection, pattern naming) |
| `src/integrity.ts` | Objective-integrity checks (the enforcement of P2/P3) |
| `src/compiler.ts` | `compileAssignment` — orchestration |
| `src/fixtures/` | Synthetic grade-3 objective, adaptation catalog, class, assignment |
| `src/cli.ts` | The `npm run demo` runner |
| `test/` | Vitest suites |

See [`../../docs/`](../../docs) for the product blueprint and build spec this implements.
