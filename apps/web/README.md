# @ilp/web — Teacher Command Center

A Next.js (App Router) app that puts a real teacher UI on top of [`@ilp/core`](../../packages/core).
Every number and status on screen is computed by the actual engine — the assign-once compiler,
the reference grader, the final-grade gate and the 75% rule — running on synthetic fixtures. It is
the same code path a district would deploy, pointed at synthetic data.

## Run

```bash
# from the repo root
npm install
npm run build --workspace @ilp/core   # the web app imports @ilp/core's built output
npm run dev --workspace @ilp/web       # http://localhost:3000
# or a production build:
npm run build --workspace @ilp/web && npm run start --workspace @ilp/web
```

## Screens

| Route | What it is |
| --- | --- |
| `/` — **Today** | The prioritized action board: the 75% classwide-failure card, grading approvals, intervention count, ready-to-advance. |
| `/class` — **My class** | Per-student status: delivery version (pattern), proposed score, mastery, and the rationale for each individualized version. Shows the locked contract that is identical for everyone. |
| `/assign` — **Assign once** | The composer + live compile preview: assignment intent, the locked fields, pattern counts, integrity status, warnings. |
| `/grading` — **Grading review** | Per-submission AI recommendation (criterion evidence, confidence, flags) with interactive accept / modify / reject / second-review controls. A non-accept releases **no** grade. |

## API routes (mirror `api/openapi.yaml`)

- `POST /api/assignments/compile` → runs `compileAssignment`.
- `POST /api/grading/recommend` → runs the reference grader (non-authoritative).

## How it's wired

- `next.config.mjs` sets `transpilePackages: ['@ilp/core']` so the local ESM workspace package
  is bundled correctly.
- `lib/data.ts` is server-only and is the single place the engine is called; pages are server
  components that render its output. Only the grading decision control is a client component,
  so the "teacher decides" interaction runs in the browser.
- No CSS framework or component library — one hand-written, accessible, tablet-first stylesheet
  (`app/globals.css`) with light/dark support. Fewer dependencies is part of the affordability goal.

> This is a pilot UI on synthetic data. Real grading quality comes from the model gateway behind
> `@ilp/core`'s `SubmissionGrader` seam; the guardrails and the teacher-decision gate are the same.
