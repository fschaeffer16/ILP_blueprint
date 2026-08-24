# Core data model

The MVP data model, with the critical integrity rule attached to each entity. This mirrors
build spec §30 / §32 and is realized as JSON Schema in [`../schemas/`](../schemas/) and as
TypeScript + zod in [`@ilp/core`](../packages/core).

## Entities and critical rules

| Entity | Minimum fields | Critical rule |
| --- | --- | --- |
| Tenant | id, name, policy_version, retention_policy, feature_flags | No data crosses a tenant boundary. |
| User | id, tenant_id, role, external_id, status | Student identity separated from analytic payload where practical. |
| ClassMembership | class_id, user_id, role, start_at, end_at | Verified roster controls collaboration access. |
| ObjectiveVersion | id, code, subject, grade_band, version, mastery_rule, status | A published version is immutable. |
| ObjectiveEdge | from_id, to_id, relation, strength | Relations include prerequisite, successor and transfer. |
| SourceRecord | id, citation, URI, authority_type, review_status, reviewed_at | Student content uses approved sources only. |
| LearnerEvidenceEvent | student_id, objective_id, event_type, value, support_used, timestamp | Raw evidence is preserved; later inference cannot overwrite it. |
| ILPHypothesis | student_id, domain, statement, confidence, evidence_ids, review_at | A hypothesis is not a diagnosis or permanent label. |
| AdaptationRule | id, trigger, permitted_change, prohibited_change, fade_rule | Objective and rigor stay locked unless a teacher explicitly modifies. |
| Assignment | id, class_id, objective_ids, mode, teacher_settings, published_at | The teacher assigns once. |
| DeliveryManifest | assignment_id, student_id, objective_version, adaptation_ids, content_ids | The exact student version is reproducible and auditable. |
| AssessmentSpec | objective_id, evidence_claims, item_constraints, rubric_id, equivalence_band | Generated items must satisfy the spec before delivery. |
| Submission | id, student_id, manifest_id, response, supports_used, submitted_at | The original response is never silently rewritten. |
| AIRecommendation | type, target_id, output, evidence, confidence, model_version | A recommendation is non-authoritative. |
| TeacherDecision | recommendation_id, action, change, reason, decided_at | The teacher decision is authoritative for grades and consequential actions. |
| RemediationPlan | objective_id, diagnosis, new_method, success_criterion, reassessment_spec | Must be materially different from the failed lesson. |
| SimulationEvent | scenario_id, student_id, state, decision, rationale, consequence | Stores process evidence, not just the final outcome. |
| CollaborationPost | space_id, author_id, objective_id, content, moderation_status | No public indexing or unrestricted adults. |

## What is implemented today

The assign-once compiler slice implements the entities on the critical path from *teacher
intent* to *individualized delivery*:

- **`ObjectiveVersion`** — [`objective.schema.json`](../schemas/objective.schema.json). The
  locked fields (`studentOutcome`, `essentialKnowledge`, `requiredReasoning`, `mastery`) are
  the rigor contract.
- **`Adaptation`** (`AdaptationRule`) — [`adaptation.schema.json`](../schemas/adaptation.schema.json).
  District-customizable; each declares permitted/prohibited change and a fade rule.
- **`StudentILP` / `ILPHypothesis`** — [`student-ilp.schema.json`](../schemas/student-ilp.schema.json).
  Evidence-based, review-dated, teacher-correctable; expired hypotheses are ignored.
- **`Assignment`** and **`DeliveryManifest`** — [`types.ts`](../packages/core/src/types.ts).
  One assignment compiles to one reproducible, integrity-checked manifest per student.

The remaining entities (evidence events, assessment specs, submissions, recommendations,
teacher decisions, remediation plans, simulation events, collaboration posts) are specified
in [`build-spec.md`](build-spec.md) and sequenced in [`roadmap.md`](roadmap.md).

## Locked vs. adaptable

The single most important distinction in the whole model:

| Locked across every student version | May adapt automatically |
| --- | --- |
| Learning objective | Starting point and sequence |
| Essential subject knowledge | Vocabulary preparation / reading load unrelated to the objective |
| Required reasoning | Visual, oral and written supports |
| Mastery definition and threshold | Examples and context |
| Academic-integrity rules | Modeling, chunk size and pacing |
| Traceability between instruction and assessment | Practice quantity, question order, response method, scaffolding |

Anything in the left column that changes is — by definition — an **objective modification**,
which requires explicit teacher authorization and can never be reported as equivalent
mastery.
