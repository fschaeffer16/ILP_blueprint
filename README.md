# ILP — Individualized Lesson Planning

**A teacher-controlled, AI-powered instructional operating system for K-12 education.**

> Common objectives. Individual starting points. Adaptive pathways. Equivalent evidence of mastery. Teachers remain in command.

---

## Try the demo

A role-based demo runs the real engine on synthetic data — district, teacher, parent, and
student views. See [`docs/demo.md`](docs/demo.md) for the hosted click-through and the
8-minute walk-through, or run the full app locally:

```bash
npm install
npm run build --workspace @ilp/core
npm run dev --workspace @ilp/web        # http://localhost:3000
```

## What this repository is

This repository holds the **ILP product blueprint and pilot build specification** *and* the
**working engine** that implements its connected instructional cycle. The docs capture the
product model, the non-negotiable principles, the data schemas, the API contract, and the St.
Lucie County (Florida) pilot entry strategy; [`packages/core`](packages/core) is the running,
tested TypeScript kernel.

**What runs today:**

- **`@ilp/core`** — deterministic engine, no AI keys, 51 tests:
  - **Assign-once compiler** — one teacher assignment → individualized delivery per student, objective and rigor locked.
  - **Assessment engine** — rubrics, specs, items, and a deterministic item-integrity gate.
  - **Teacher-reviewed grading** — AI recommends with criterion evidence; only a teacher decision releases a grade.
  - **Remediation + the 75% rule** — classwide-failure evaluation, materially-different reteach, equivalent reassessment.
- **`@ilp/web`** — the teacher command center (Next.js): Today board, **Content library** (6 gate-validated grade-3 objectives with authored lessons, items and sources), My class, Assign-once composer, Grading review, **Objective builder** (district Layer 1), **Lesson builder** (teacher Layer 2), **Baseline screener**, the **Mastery dashboard** (Layer 3 rollups, student → district), and the **Family view** (a plain-language, no-surprises parent dashboard of a child's efforts, time, collaboration, simulations, growth and safety) — every screen driven by the engine above on synthetic data.

```bash
npm install
npm run build --workspace @ilp/core   # the web app imports the built engine
npm run demo                          # assign once → individualized for a synthetic class of 6
npm run demo:cycle                    # assess → grade → teacher decision → 75% rule → remediation
npm test                              # 51 tests
npm run dev --workspace @ilp/web      # the teacher command center at http://localhost:3000
```

The stack is TypeScript throughout; the AI provider and client framework are deliberately
deferred behind seams (`ItemGenerator`, `SubmissionGrader`, a future model gateway), so the
schemas and guardrails survive those decisions.

## The product thesis

> The teacher assigns once. The system individualizes instruction, assessment and
> remediation automatically while preserving the learning objective, mastery requirement
> and teacher authority.

The problem ILP addresses is **not** a lack of educational apps. Schools already run an
LMS, adaptive-practice tools, state assessments, and publisher platforms. The problem is
**fragmentation**: teachers must connect those pieces manually while also teaching,
grading, and intervening. ILP is the layer that connects evidence to prepared
instructional action.

### ILP is / ILP is not

| ILP is | ILP is not |
| --- | --- |
| Teacher-controlled instructional infrastructure | An autonomous AI teacher |
| A connected objective-to-mastery system | A collection of unrelated AI tools |
| Student-level adaptive development | Permanent ability tracking or fixed labels |
| A living, sourced curriculum | A PDF textbook placed on a screen |
| Transparent teacher-reviewed assessment support | Black-box automated grading |
| A protected verified student community | Open public social media |
| A tablet-first learning environment | Seven hours of passive screen time |

## Repository map

| Path | Contents |
| --- | --- |
| [`docs/product-blueprint.md`](docs/product-blueprint.md) | Part I — the full product blueprint (v0.1 content, sections 1–25 + appendices) |
| [`docs/build-spec.md`](docs/build-spec.md) | Part II — St. Lucie enhancement proposal and executable developer build spec (sections 26–50) |
| [`docs/principles.md`](docs/principles.md) | The ten non-negotiable instructional principles (P1–P10) |
| [`docs/instructional-cycle.md`](docs/instructional-cycle.md) | The connected instructional cycle and traceability rules |
| [`docs/data-model.md`](docs/data-model.md) | Core data entities, field-level rules, and how the schemas fit together |
| [`docs/content-governance.md`](docs/content-governance.md) | Where objectives come from (standards), where content is mined from (5-tier library), the vetting pipeline, and the evidence-based technique catalog |
| [`docs/acceptance-criteria.md`](docs/acceptance-criteria.md) | MVP acceptance criteria (AC-01…AC-14) |
| [`docs/requirements-catalog.md`](docs/requirements-catalog.md) | Requirement catalog (LRN/OBJ/ASN/…) and non-functional requirements |
| [`docs/roadmap.md`](docs/roadmap.md) | Build sequence, developer epics, and pilot decision gates |
| [`docs/st-lucie-entry.md`](docs/st-lucie-entry.md) | District entry strategy, integration map, and discovery checklist |
| [`docs/glossary.md`](docs/glossary.md) | Shared vocabulary |
| [`packages/core/`](packages/core) | **`@ilp/core`** — the running engine: compiler, assessment, grading, remediation |
| [`apps/web/`](apps/web) | **`@ilp/web`** — the teacher command center (Next.js), wired to the engine |
| [`schemas/`](schemas/) | JSON Schema definitions for the objective and core entities |
| [`api/openapi.yaml`](api/openapi.yaml) | The `/v1` API contract outline |
| [`examples/`](examples/) | Synthetic fixtures: a sample objective, synthetic students, and compile request/response |

New to the project? Read [`docs/principles.md`](docs/principles.md) first — every technical
decision in this repo is downstream of those ten rules.

## Non-negotiable principles (summary)

1. **Teacher authority** — AI creates, adapts, analyzes and recommends; teachers teach, intervene, correct and decide.
2. **Objective integrity** — every lesson, item, rubric criterion, remediation and reassessment traces to a learning objective.
3. **Adaptive route, visible rigor** — the route may change; any change to the objective or rigor is explicit and teacher-approved.
4. **Access plus development** — don't let an unrelated weakness hide subject knowledge; strengthen that weakness over time.
5. **Knowledge before unsupported opinion** — teach facts, chronology and competing evidence before asking students to evaluate.
6. **Remediation is mandatory** — no failed objective is a dead-end grade.
7. **Assessment is evidence** — a score shows what was demonstrated, what support was used, and where judgment remains.
8. **No ideological advocacy** — distinguish documented fact, inference, interpretation and disagreement without demanding conformity.
9. **Technology must serve learning** — the tablet also directs students into discussion, experiments, handwriting and physical work.
10. **No manipulative engagement** — reward helpfulness, accuracy and constructive participation, not outrage or follower counts.

Full text with requirements in [`docs/principles.md`](docs/principles.md).

## Scope of the first build

A **narrow but complete vertical slice** that proves the connected cycle before any
statewide curriculum:

- **Grade 3** as the first independent-use validation point (patterns reusable down to K-2).
- One mathematics unit, one reading/writing unit, and one short history/civics simulation.
- **8–12** Florida B.E.S.T.-mapped objectives with prerequisites and remediation.
- **Synthetic student data first**; live data only after district approval and consent.
- Teacher control over lesson approval, adaptations, interventions, and **final grades**.

### Explicitly not in the first build

- A custom hardware device or national procurement program.
- Every grade and subject, or a statewide curriculum adoption.
- Open-ended nationwide student social networking or unrestricted messaging.
- Automated high-stakes final grading.
- A full replacement for district SIS, LMS, or state reporting.
- Full IEP/AAC/severe-disability functionality without specialist-led design.

## Status

Blueprint **v0.2** — combines the strategic product model with a St. Lucie enhancement
proposal and executable build specification. This is **not** a legal opinion, a validated
curriculum, a psychometric validation report, or a final procurement response. District
discovery and expert validation remain required before any live student pilot.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for how the documentation and schemas are kept in
sync, and [`docs/roadmap.md`](docs/roadmap.md) for what to build first.
