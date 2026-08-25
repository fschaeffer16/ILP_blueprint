# ILP Schemas

Stack-neutral JSON Schema (draft 2020-12) definitions for the core ILP objects. They are
the machine-readable form of the data model in [`../docs/data-model.md`](../docs/data-model.md)
and correspond field-for-field to the runtime `zod` validators and TypeScript types in
[`@ilp/core`](../packages/core).

| Schema | Object | Notes |
| --- | --- | --- |
| [`objective.schema.json`](objective.schema.json) | `ObjectiveVersion` | The versioned objective contract. `studentOutcome`, `essentialKnowledge`, `requiredReasoning` and `mastery` are the LOCKED fields the compiler may never vary. |
| [`adaptation.schema.json`](adaptation.schema.json) | `Adaptation` | A district-customizable unit of individualization. Every adaptation declares what it may and may not change. |
| [`student-ilp.schema.json`](student-ilp.schema.json) | `StudentILP` | A student's evolving evidence profile of ILP hypotheses. |
| [`source-record.schema.json`](source-record.schema.json) | `SourceRecord` | A governed content source (tier, license, authority, review status). Only approved, deliverable-licensed sources may be cited by a published objective. |

## Why both JSON Schema and zod?

- **JSON Schema** is the language-neutral contract a district (or an integration partner)
  can validate against without running our code — useful for content pipelines, CI checks,
  and API request validation.
- **zod** (in `@ilp/core/src/schema.ts`) is the runtime gate inside the application. It
  enforces the same rules *plus* cross-field guardrails (e.g. an adaptation cannot be both
  permitted and prohibited on the same objective).

Keep the two in sync. When you change a field, change it in all three places: the JSON
Schema here, the zod schema, and the TypeScript type. The test suite in `@ilp/core`
validates the fixtures against the zod schemas on every run.

## District customization

Districts customize ILP primarily by supplying their own `ObjectiveVersion` and
`Adaptation` documents. Both are validated against these schemas before anything can reach
a student. That validation is what lets customization stay inside the guardrails: a district
can add adaptations and retune triggers freely, but it cannot express an objective that
silently lowers rigor, because the compiler's objective-integrity checks
([`../packages/core/src/integrity.ts`](../packages/core/src/integrity.ts)) run on every
compiled manifest.
