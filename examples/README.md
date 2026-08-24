# ILP Examples (synthetic only)

Concrete, synthetic-data examples that exercise the schemas and the assign-once compiler.
**No real student data lives in this repository, ever** — the blueprint mandates synthetic
data before any live pilot (build spec §28).

| File | What it is |
| --- | --- |
| [`objectives/M3.NF.01.json`](objectives/M3.NF.01.json) | A published grade-3 fractions objective, valid against [`../schemas/objective.schema.json`](../schemas/objective.schema.json). |
| [`synthetic-students/S-002-ben.json`](synthetic-students/S-002-ben.json) | One synthetic student ILP profile (a below-grade-level reader). |
| [`api/compile-request.json`](api/compile-request.json) | A sample `POST /v1/assignments/compile` body. |
| [`api/compile-response.json`](api/compile-response.json) | The compile result for the synthetic class of 6. |

## See it run

The canonical, richer versions of these fixtures live in
[`../packages/core/src/fixtures`](../packages/core/src/fixtures) and drive the runnable demo:

```bash
npm install
npm run demo         # compiles one assignment across a synthetic class of 6
npm test             # 24 tests covering the compiler and objective-integrity guardrails
```

The demo prints exactly what a teacher would review before publishing: one objective,
locked rigor and mastery, and a per-student adaptation summary.
