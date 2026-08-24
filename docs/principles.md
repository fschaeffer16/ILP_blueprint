# Non-negotiable instructional principles

These ten principles are the constitution of ILP. Every product decision, schema and line
of code is downstream of them. This page states each principle, its requirement, and — where
it exists yet — **how the system mechanically enforces it**, so a principle is never just an
aspiration in a slide.

> Guardrail summary: ILP can be customized freely by a district *within* these principles.
> The objective contract and the compiler's integrity checks are what keep customization
> inside the lines.

| ID | Principle | Requirement |
| --- | --- | --- |
| P1 | Teacher authority | AI creates, adapts, analyzes and recommends. Teachers teach, intervene, correct and decide. |
| P2 | Objective integrity | Every lesson, activity, question, rubric criterion, remediation and reassessment traces to a learning objective. |
| P3 | Adaptive route, visible rigor | The route may change. Any change to the actual objective or rigor must be explicit and teacher-approved. |
| P4 | Access plus development | Do not let an unrelated weakness hide subject knowledge; also strengthen that weakness over time instead of permanently routing around it. |
| P5 | Knowledge before unsupported opinion | Teach facts, chronology, context and competing evidence before asking students to evaluate or propose alternatives. |
| P6 | Remediation is mandatory | No failed objective becomes a dead-end grade. The next instructional action is part of the objective definition. |
| P7 | Assessment is evidence | A score must show what the student demonstrated, what support was used and where judgment remains. |
| P8 | No ideological advocacy | Content distinguishes documented fact, inference, interpretation and unresolved disagreement without demanding political or identity-based conformity. |
| P9 | Technology must serve learning | The tablet coordinates instruction, collaboration and evidence; it also directs students into discussion, experiments, handwriting and physical work. |
| P10 | No manipulative engagement | The student network rewards helpfulness, accuracy and constructive participation rather than outrage, follower counts or addictive infinite feeds. |

## How the current build enforces each principle

The first slice (the **assign-once compiler**, [`@ilp/core`](../packages/core)) already
enforces several of these mechanically:

- **P1 — Teacher authority.** `compileAssignment` never releases anything to students. Its
  output status is `ready_for_teacher_review`; publication is a separate, teacher-only step.
  Objective modifications are *suggested*, never applied, without explicit teacher
  authorization (`selectAdaptations` → `OBJECTIVE_MODIFICATION_SUGGESTED`).
- **P2 — Objective integrity.** Every delivery manifest copies the objective's locked
  contract, and `checkManifestIntegrity` fails the whole compile if any manifest's contract
  drifts from the published objective (`LOCKED_CONTRACT_MISMATCH`).
- **P3 — Adaptive route, visible rigor.** Only the `objective_modification` adaptation class
  may change expected learning, and the engine refuses to apply it automatically. Any
  modification is counted and flagged (`objectiveModifications`, `objectiveModified`) and can
  never be reported as equivalent mastery. Prohibited adaptations are blocked even if a
  teacher force-enables them (`FORCED_PROHIBITED_ADAPTATION`).
- **P4 — Access plus development.** The engine selects the *smallest* set of supports needed
  for access, and separately adds an in-objective enrichment/transfer target when a student
  is ready — supports are also marked with `fadeRule`s so they are removed as independence
  grows, rather than becoming permanent.
- **P6 — Remediation is mandatory.** `evaluateClasswideFailure` turns a failed objective into
  a required next action rather than a dead-end grade: at ≥75% miss it suspends the grade and
  opens an integrity audit; below that it routes individual remediation. `checkRemediationPlan`
  rejects a reteach that is not *materially different* from the failed lesson and a reassessment
  that is not *equivalent*.
- **P7 — Assessment is evidence.** The grader produces criterion-level evidence, confidence and
  flags; `releaseFinalGrade` is the only path to a grade and requires a teacher accept/modify
  decision (a reject/second-review releases nothing). An append-only audit log (`appendAudit`)
  keeps the original recommendation even after a teacher correction.

Principles **P5, P8, P9, P10** are honored in the schemas and specifications and will be
enforced in later slices (editorial governance, collaboration network, device management, the
assignment-aware bot). Each of those slices should add its own enforcement notes here so this
table stays a live map of promise → mechanism, not a static list.

## The central prohibition

> The system may not silently give one student an easier standard and report the result as
> equivalent mastery.

This single sentence is the reason objective integrity is enforced in code and not left to
review. See [`../packages/core/src/integrity.ts`](../packages/core/src/integrity.ts) and its
tests in [`../packages/core/test/integrity.test.ts`](../packages/core/test/integrity.test.ts).
