# Contributing to ILP

ILP is a teacher-controlled instructional operating system for K-12. Its correctness matters
in a way most software's does not: a bug here can mean a child is quietly held to an easier
standard and told they mastered something they didn't. Contribute with that in mind.

## Ground rules (non-negotiable)

These come straight from the [instructional principles](docs/principles.md) and are not up for
local override:

1. **Never let individualization change rigor silently.** The objective's locked fields
   (`studentOutcome`, `essentialKnowledge`, `requiredReasoning`, `mastery`) must be identical
   across every student version. If your change could alter them per student, it is an
   *objective modification* — teacher-authorized, flagged, and never reported as equivalent
   mastery.
2. **The system proposes; the teacher decides.** No code path may release a grade, publish an
   assignment, or apply an objective modification without an explicit teacher action.
3. **No real student data in this repo.** Ever. Fixtures and examples are synthetic. `.env`,
   databases and `/data/` are git-ignored.
4. **Do not train external general-purpose models on student work** (AC-14). AI runs behind
   the model gateway with grounding, logging and redaction.

## Working in the repo

```bash
npm install            # workspaces
npm test               # all packages
npm run typecheck
npm run demo           # the assign-once compiler on synthetic data
```

Node ≥ 20. TypeScript, ESM, strict mode.

## Keep the three representations in sync

The domain model is expressed three ways and they must agree:

1. **JSON Schema** — [`schemas/*.json`](schemas/) (language-neutral contract).
2. **zod** — `packages/core/src/schema.ts` (runtime gate).
3. **TypeScript types** — `packages/core/src/types.ts` (compile-time shape).

A field change touches all three, plus any affected [`docs/`](docs/) tables and the
[requirements catalog](docs/requirements-catalog.md) status column.

## Definition of done for a slice

- Tests cover the new behavior *and* the guardrails it must not break (add an adversarial
  test: what input would let rigor drift?).
- `npm test` and `npm run typecheck` are green.
- The relevant status columns in [`docs/acceptance-criteria.md`](docs/acceptance-criteria.md)
  and [`docs/requirements-catalog.md`](docs/requirements-catalog.md) are updated.
- If you enforced a principle in code, note the mechanism in
  [`docs/principles.md`](docs/principles.md) so promise → mechanism stays a live map.

## Docs are part of the product

The blueprint and build spec ([`docs/product-blueprint.md`](docs/product-blueprint.md),
[`docs/build-spec.md`](docs/build-spec.md)) are the source of truth for *what* to build. If
you change behavior, update the spec in the same PR. Don't let the code and the blueprint
drift.
