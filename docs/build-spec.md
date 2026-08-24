# ILP Developer Build Specification (Part II)

_St. Lucie Enhancement Proposal and Executable Build Specification — version 0.2, dated August 24, 2026._

For Part I (the strategic product model), see [product-blueprint.md](product-blueprint.md).

## Part II. St. Lucie Enhancement Proposal and Executable Build Specification

**PURPOSE** — Define exactly what to build for the first working ILP product and how to present it to St. Lucie Public Schools as an enhancement to the systems it already uses.

### Part II contents

| Sections 26-38 | Sections 39-50 |
| --- | --- |
| 26  St. Lucie proposition | 39  Verified collaboration |
| 27  Pilot outcome commitments | 40  API contract outline |
| 28  First product scope | 41  AI orchestration and guardrails |
| 29  Product architecture | 42  Security, privacy and devices |
| 30  Core data model | 43  Nonfunctional requirements |
| 31  Objective schema | 44  Developer epics and acceptance criteria |
| 32  Learner model and adaptation | 45  Build sequence |
| 33  Teacher workflows and screens | 46  Testing strategy |
| 34  Student application | 47  St. Lucie discovery checklist |
| 35  Assignment-aware bot | 48  Recommended first meeting pitch |
| 36  Assessment and grading | 49  Sources and verification notes |
| 37  Remediation and classwide logic | 50  Immediate builder decisions |
| 38  Branching simulation engine |  |

## 26. The St. Lucie proposition

St. Lucie Public Schools publicly identifies Canvas as its K-12 LMS and also provides Nearpod, Discovery Education, IXL and Microsoft tools. Skyward supports family access to grades and attendance. Florida requires FAST progress monitoring three times per year for covered ELA and mathematics grades. ILP should not ask the district to abandon those investments before it proves value.

**ONE-SENTENCE PITCH** — ILP converts the standards, assignments and student evidence St. Lucie already has into automatically individualized instruction, objective-aligned assessment, targeted remediation and a short teacher action plan — without requiring teachers to create separate lessons for every child.

### What St. Lucie is being asked to approve

- A contained grade 3 pilot in a small number of classrooms and schools.
- A discovery audit of existing devices, roster/SSO, Canvas workflows, FAST data availability, IXL use and district privacy requirements.
- Use of synthetic student data before any live student data enters the system.
- A limited set of 8-12 Florida B.E.S.T.-mapped objectives across mathematics and literacy, plus one short history/civics simulation.
- Teacher control over lesson approval, adaptations, interventions and final grades.
- Independent evaluation of learning, teacher workload, assessment validity, safety and usability before expansion.

### What St. Lucie is not being asked to approve

- Replacement of Canvas, Skyward, FAST or the district identity system during the pilot.
- Automated high-stakes grading or autonomous instructional decisions.
- A districtwide social network or unrestricted student messaging.
- A new statewide curriculum adoption.
- Purchase of dedicated new hardware before available managed devices are audited.
- A final special-education or IEP solution in the first release.

| Current layer | What it does now | How ILP enhances it |
| --- | --- | --- |
| Canvas | Posts assignments, feedback, resources and communication | Receives or links the teacher assignment; ILP compiles student-specific versions and returns completion, evidence and approved grades |
| FAST | State progress monitoring and accountability evidence | Imports permitted score/objective data as one signal; never treats FAST as the complete learner model |
| Skyward | Student information, grades, attendance and family access | Uses roster/identity data and exports final teacher-approved grade events or summaries |
| IXL / existing practice | Practice, diagnostic information and analytics | Consumes useful objective evidence when licensed and available; fills the missing lesson-to-remediation cycle |
| Nearpod / Discovery | Interactive activities and digital content | May supply approved content assets; ILP selects and adapts delivery around the objective |
| Microsoft 365 | Writing, productivity and district identity environment | Supports document exchange and SSO while ILP provides objective context, rubrics and evidence |

## 27. Pilot outcome commitments

**SUCCESS CONDITION** — The pilot should continue only if it improves objective mastery or remediation while measurably reducing teacher production work, with no unacceptable loss of rigor, privacy or safety.

| District question | Pilot evidence |
| --- | --- |
| Does it improve learning? | Objective mastery, time to mastery, retention, transfer and remediation success |
| Does it reduce teacher burden? | Planning, differentiation, grading and documentation minutes before versus during pilot |
| Does it preserve rigor? | Objective and assessment-version equivalence review; no silent objective modification |
| Does it help FAST performance? | FAST and other external results used as validation, not as the only definition of success |
| Is it safe? | Access controls, moderation results, incident response, audit completeness and red-team findings |
| Can it fit existing operations? | Canvas/Skyward/SSO compatibility, device performance, training time and support tickets |

## 28. First product scope

Build a narrow vertical slice that proves the complete connected cycle. Do not begin with a statewide curriculum, every grade or a national student network.

| Dimension | Pilot specification |
| --- | --- |
| Grade | Grade 3 first; interaction patterns must remain reusable for K-2 with teacher-supported delivery |
| Subjects | One mathematics unit; one reading/writing unit; one short history/civics simulation |
| Objectives | 8-12 versioned objectives, each with prerequisites, mastery rules, sources, common misconceptions and remediation |
| Users | Teacher, student, curriculum reviewer, school administrator and district administrator |
| Profiles | Synthetic learners first; live profiles only after district approval and consent workflow |
| Delivery | Tablet-first responsive web application; browser support for teacher administration |
| Integrations | CSV/OneRoster roster import first; Canvas deep link or LTI later; grade export optional after validation |
| AI | Grounded generation and analysis using approved sources and deterministic policy checks |
| Network | One teacher-authorized, class/district-contained assignment thread; no direct messages |
| Reporting | Teacher daily action list, objective dashboard, grading review and pilot analytics |

## 29. Product architecture

### Recommended MVP technology shape

- Responsive tablet-first web application or installable PWA for the pilot; preserve the option for a native iPad shell when handwriting, offline storage or managed-device controls require it.
- Teacher web console optimized for desktop or tablet; student player optimized for touch and stylus.
- Relational database for authoritative records; object storage for submissions and media; vector/search index only for approved source retrieval.
- Event-driven evidence pipeline so lesson, help, assessment, remediation and teacher actions update the learner model consistently.
- Model gateway that can switch AI providers and enforces grounding, logging, redaction, rate limits and policy checks.
- Standards-based integration path: OneRoster for rosters, LTI 1.3/Advantage for LMS launch and assignment exchange, and district-approved grade passback only after validation.

| Service | MVP responsibility | Implementation boundary |
| --- | --- | --- |
| Identity and tenancy | District, school, class, roster, roles and SSO placeholders | Every query scoped by district tenant; no cross-tenant student access |
| Objective graph | Objectives, prerequisites, mastery, sources, misconceptions and successor links | Versioned and immutable after assignment publication |
| Content repository | Approved lesson blocks, media, prompts, items, rubrics and remediation patterns | Only approved content can reach students |
| Learner model | Evidence events, hypotheses, confidence, effective supports and review dates | No diagnosis; every inference visible and correctable by teacher |
| Assignment compiler | Teacher assignment plus objective plus ILP into a student delivery manifest | Locks objective, knowledge, rigor and mastery rules |
| Assessment engine | Item specifications, version generation, equivalence checks and submission capture | No final grade release without teacher decision |
| AI orchestration | Grounded adaptation, bot help, first-pass grading, misconception analysis and simulation | Model output never writes directly to authoritative records |
| Teacher command center | Priorities, groupings, approvals, interventions and quality alerts | Checklist model; suppress duplicate tasks and raw-data overload |
| Student application | Lessons, handwriting, speech-to-text, practice, assessment, bot, simulation and thread | Locked assignment modes govern available help |
| Analytics and audit | Event stream, outcomes, system recommendations, teacher overrides and pilot measures | Append-only decision history with retention controls |

## 30. Core data model

| Entity | Minimum fields | Critical rule |
| --- | --- | --- |
| Tenant | id, name, policy_version, retention_policy, feature_flags | No data crosses tenant boundary |
| User | id, tenant_id, role, external_id, status | Student identity separated from analytic payload where practical |
| ClassMembership | class_id, user_id, role, start_at, end_at | Verified roster controls collaboration access |
| ObjectiveVersion | id, code, subject, grade_band, version, mastery_rule, status | Published version is immutable |
| ObjectiveEdge | from_id, to_id, relation, strength | Relations include prerequisite, successor and transfer |
| SourceRecord | id, citation, URI, authority_type, review_status, reviewed_at | Student content uses approved sources only |
| LearnerEvidenceEvent | student_id, objective_id, event_type, value, support_used, timestamp | Raw evidence is preserved; later inference cannot overwrite it |
| ILPHypothesis | student_id, domain, statement, confidence, evidence_ids, review_at | Hypothesis is not diagnosis or permanent label |
| AdaptationRule | id, trigger, permitted_change, prohibited_change, fade_rule | Objective and rigor remain locked unless teacher explicitly modifies |
| Assignment | id, class_id, objective_ids, mode, teacher_settings, published_at | Teacher assigns once |
| DeliveryManifest | assignment_id, student_id, objective_version, adaptation_ids, content_ids | Exact student version is reproducible and auditable |
| AssessmentSpec | objective_id, evidence_claims, item_constraints, rubric_id, equivalence_band | Generated items must satisfy specification before delivery |
| Submission | id, student_id, manifest_id, response, supports_used, submitted_at | Original response never silently rewritten |
| AIRecommendation | type, target_id, output, evidence, confidence, model_version | Recommendation is non-authoritative |
| TeacherDecision | recommendation_id, action, change, reason, decided_at | Teacher decision is authoritative for grades and consequential actions |
| RemediationPlan | objective_id, diagnosis, new_method, success_criterion, reassessment_spec | Must be materially different from failed lesson |
| SimulationEvent | scenario_id, student_id, state, decision, rationale, consequence | Stores process evidence, not just final outcome |
| CollaborationPost | space_id, author_id, objective_id, content, moderation_status | No public indexing or unrestricted adults |

## 31. Objective schema

Every product feature begins with a versioned objective object. The objective is the contract among curriculum, lesson generation, assessment, remediation and analytics.

```json
{
  "objective_id": "M3.NF.01",
  "version": 1,
  "standard_refs": ["Florida B.E.S.T. benchmark code"],
  "student_outcome": "Explain and represent a fraction as equal parts of a whole.",
  "essential_knowledge": ["numerator", "denominator", "equal parts"],
  "required_reasoning": ["represent", "explain", "transfer"],
  "prerequisites": ["equal partitioning", "whole/part relationship"],
  "mastery": {"threshold": 0.80, "minimum_evidence_types": 2, "transfer_required": true},
  "permitted_adaptations": ["visual_first", "vocabulary_preview", "chunked_prompt"],
  "prohibited_adaptations": ["remove_explanation", "reduce_to_recognition_only"],
  "misconceptions": ["larger denominator means larger fraction"],
  "source_ids": ["SRC-001", "SRC-002"],
  "remediation_pattern_ids": ["REM-FRACTION-AREA", "REM-FRACTION-SET"]
}
```

## 32. Learner model and adaptation engine

The learner model combines beginning- and end-of-year baseline evidence with performance throughout the year. It stores evidence-based working hypotheses, not fixed student types.

### Adaptation decision order

1. Load the published objective version and lock its essential knowledge, required reasoning and mastery rule.
2. Retrieve the student ILP hypotheses that apply to the objective and remain inside their review dates.
3. Rank permitted adaptations by evidence strength, prior effectiveness and teacher policy.
4. Select the smallest set of supports needed to provide access.
5. Add one capacity-development target when an underlying weakness should be strengthened.
6. Compile and validate the student delivery manifest.
7. Expose the class-level adaptation summary to the teacher before release.
8. Record which adaptations were used and whether they improved independent performance.
9. Fade temporary scaffolds when evidence supports independence.

| Adaptation class | Example | Automatic? | Reporting |
| --- | --- | --- | --- |
| Access adaptation | Vocabulary preview or text segmentation unrelated to the science objective | Yes, within teacher policy | Shown in manifest and student evidence |
| Instructional scaffold | Worked example followed by gradual removal | Yes, with fade rule | Effectiveness and duration tracked |
| Difficulty adjustment | More complex transfer case after early mastery | Yes, inside objective bounds | Difficulty band recorded |
| Objective modification | Student is expected to learn less or different content | No | Requires explicit teacher authorization and cannot be reported as equivalent mastery |

## 33. Teacher workflows and screens

### Teacher assignment workflow

1. Teacher chooses the class and objective.
2. System displays prerequisites, mastery requirement, approved core lesson and current class readiness.
3. Teacher selects instructional time, delivery mode, bot permissions, collaboration window and due date.
4. System compiles student versions and runs objective-integrity and source checks.
5. Teacher sees a concise summary: core, vocabulary-supported, visual-first, guided-practice and advanced-transfer counts.
6. Teacher publishes once.
7. Students receive their manifests on managed tablets.
8. System returns mastery, misconception, grading and intervention summaries to the teacher.

| Screen | Teacher job | Required controls |
| --- | --- | --- |
| Today | See the smallest high-impact action list | Approve, modify, defer, dismiss, open evidence, launch prepared intervention |
| Class overview | See objective status and current needs | Filter by objective; inspect student; create temporary group |
| Objective builder | Select or create the instructional target | Standard mapping, prerequisites, mastery rule, sources and publish validation |
| Assignment composer | Assign once to a class | Time, format, bot mode, collaboration, assessment and adaptation boundaries |
| Adaptation summary | Review how the assignment will vary | Counts by pattern, inspect examples, lock/override adaptation, verify zero silent modifications |
| Grading review | Review AI recommendations and issue grades | Criterion evidence, confidence, accept/change/reject, batch approve low-risk items |
| Lesson quality | Find classwide instruction or item failure | 75% workflow, item audit, suspend grade, approve reteach and retest |
| Interventions | Work directly with individuals or temporary groups | Prepared material, time estimate, success criterion and quick outcome capture |
| Growth | Understand baseline-to-current development | Evidence timeline, support fading and readiness recommendations |
| Approvals | Resolve consequential AI recommendations | Reason, evidence, scope, audit trail and teacher decision |

## 34. Student application specification

| Student surface | Required behavior |
| --- | --- |
| Home | Shows today, due soon, continue, teacher messages and active collaboration spaces — no infinite feed |
| Lesson player | Supports touch, stylus handwriting, typed response, speech-to-text, text-to-speech and offline content |
| Help bot | Knows the assignment, objective, sources, student version and teacher-configured help boundary |
| Practice | Provides progressive feedback and records support used without punishing help-seeking |
| Assessment | Locks the configured mode; shows accessibility functions but blocks tutoring and answer generation |
| Simulation | Presents evidence and constraints, accepts decisions, simulates consequences and pauses at critical points |
| Collaboration | Verified objective-linked thread with reporting, moderation and no public follower mechanics |
| Reflection | Asks what changed, what remains difficult and which strategy worked |

## 35. Assignment-aware bot specification

**BOT RULE** — Every bot response must identify the active objective, use only permitted assignment context, log the help category and preserve an independent mastery check. Asking for help never reduces a grade.

| Mode | May do | Must not do |
| --- | --- | --- |
| Lesson | Explain, model, question, compare examples and reteach from approved material | Complete the required mastery response |
| Homework | Clarify directions, give hints, decompose and offer parallel examples | Supply the assigned answer or write the paper |
| Research/project | Support search planning, source evaluation and citation from approved access | Invent sources or disguise copied work |
| Quiz | Clarify directions only unless teacher explicitly permits another support | Reveal content answers |
| Exam | Provide approved accessibility functions | Tutor, hint or generate answers |

## 36. Assessment and grading specification

### Assessment generation gate

1. Select the objective version and evidence claim.
2. Select an approved item specification and difficulty/equivalence band.
3. Generate a candidate item using approved content and prohibited-shortcut rules.
4. Run deterministic checks for objective alignment, answerability, answer-key consistency and prohibited clues.
5. Run an independent model review for ambiguity and unintended demand.
6. For pilot items, require curriculum/teacher approval before student delivery.
7. Record the final item version, rationale and source trace.

### Written work grading output

| Field | Requirement |
| --- | --- |
| Criterion score | Recommended points by rubric criterion, never an unexplained total |
| Evidence | Exact student text or work supporting the recommendation |
| Flags | Factual error, unsupported reasoning, prompt mismatch, possible ambiguity or low confidence |
| Source check | Approved instructional source supporting factual correction |
| Confidence | Criterion-level confidence and reason for teacher review |
| Teacher action | Accept, change, reject or request second review |
| Final grade | Issued only after teacher action; AI cannot release it |

## 37. Remediation and classwide failure logic

```
IF same objective/item group miss_rate >= 0.75:
  suspend affected grade section
  create assessment-integrity audit
  compare taught content, practice evidence and item demand
  identify shared misconception or missing prerequisite
  generate materially different reteach lesson
  require teacher approval
  generate equivalent reassessment
  use teacher-approved reassessment as valid grade evidence
ELSE:
  create individual or temporary-group remediation as evidence warrants
```

| Remediation requirement | Acceptance rule |
| --- | --- |
| Different method | Not a paraphrase or visual recoloring of the failed lesson |
| Specific diagnosis | Names the likely misconception or missing prerequisite with evidence |
| Success criterion | Defines what independent performance will close the need |
| Reassessment | Measures the same objective using a new, equivalent task |
| Profile update | Records success/failure and changes support only with sufficient evidence |
| Teacher authority | Teacher may edit, replace or reject the recommendation |

## 38. Branching simulation engine

| Component | Specification |
| --- | --- |
| Scenario package | Historical or applied problem, approved facts, starting conditions, constraints and stakeholders |
| State variables | Resources, time, public support, equity effects, risk, implementation capacity and domain-specific variables |
| Student decision | Chosen action plus evidence-based rationale; free response or structured option depending on ILP |
| Consequence engine | Applies approved causal rules, bounded AI narration and uncertainty labels |
| Critical pause | Stops when a threshold, unintended consequence or contradiction requires revision |
| Recovery loop | Student maintains, modifies or abandons the plan and explains why |
| Scoring | Problem definition, evidence, constraints, consequences, stakeholders, revision, recovery and transfer |
| Teacher view | Decision timeline, rationale, consequence, revision and growth dimension summary |

## 39. Verified collaboration specification

- District tenant first; class, grade and teacher-authorized cross-class spaces only.
- Every academic thread is linked to an assignment or approved topic and carries collaboration rules.
- No public profiles, follower counts, advertisements, location sharing, disappearing messages or public indexing.
- No student direct messages in the MVP.
- Automated moderation may hold or route content, but trained humans resolve escalations.
- Students can explain, compare and ask questions; answer dumping triggers intervention and independent mastery verification.
- Recognition is based on helpful, accurate, constructive contribution rather than popularity or outrage.
- Expansion beyond the district requires a separate safety, legal, moderation and data-governance approval.

## 40. API contract outline

### Example assignment compile request

`POST /v1/assignments/compile`

```json
{
  "class_id": "CLS-103",
  "objective_version_ids": ["M3.NF.01:v1"],
  "duration_minutes": 35,
  "delivery_mode": "lesson_practice",
  "bot_mode": "lesson",
  "collaboration": {"enabled": true, "scope": "class"},
  "teacher_constraints": {"require_handwriting": true, "max_read_aloud_fraction": 0.50}
}
```

### Example compile response

```json
{
  "status": "ready_for_teacher_review",
  "objective_integrity": "pass",
  "student_count": 24,
  "patterns": {"core": 12, "vocabulary_supported": 4, "visual_first": 3,
               "guided_practice": 3, "advanced_transfer": 2},
  "objective_modifications": 0,
  "warnings": [],
  "publish_token": "one-time-token"
}
```

| Endpoint | Method | Purpose | Authority |
| --- | --- | --- | --- |
| /v1/classes | GET/POST | List or create classes; MVP import may be CSV/OneRoster | District/teacher by role |
| /v1/objectives/{id} | GET | Retrieve published objective version and dependencies | Authenticated instructional users |
| /v1/objectives | POST | Create draft objective version | Curriculum reviewer |
| /v1/assignments/compile | POST | Validate teacher intent and produce class adaptation summary | Teacher |
| /v1/assignments/{id}/publish | POST | Freeze objective versions and create student manifests | Teacher |
| /v1/student/manifests/today | GET | Retrieve the student assignment queue | Assigned student |
| /v1/bot/respond | POST | Return a mode-governed, grounded assistance response | Assigned student |
| /v1/submissions | POST | Store student response and support metadata | Assigned student |
| /v1/grading/recommend | POST | Create criterion evidence and score recommendation | System/teacher |
| /v1/teacher-decisions | POST | Accept, change or reject AI recommendation | Teacher |
| /v1/remediation/plan | POST | Create evidence-backed alternative lesson and reassessment | System/teacher |
| /v1/teacher/today | GET | Return prioritized action cards and prepared materials | Teacher |
| /v1/simulations/{id}/decisions | POST | Advance scenario and return next state or critical pause | Assigned student |
| /v1/spaces/{id}/posts | GET/POST | Read or contribute within verified collaboration space | Authorized roster member |

## 41. AI orchestration and guardrails

| Pipeline step | Required control |
| --- | --- |
| Input assembly | Remove unnecessary identifiers; attach tenant policy, objective version, assignment mode and approved sources |
| Retrieval | Search only approved curriculum corpus for student-facing factual content |
| Generation | Use structured output schema; reject free-form output that omits objective or source trace |
| Validation | Run schema, source, alignment, prohibited-change and safety checks |
| Second review | Use independent verifier or deterministic rule for consequential outputs |
| Human gate | Require teacher/reviewer action for grades, objective modifications, live curriculum publication and safety outcomes |
| Logging | Store model/provider/version, prompt policy version, retrieved sources, output, confidence and disposition |
| Evaluation | Maintain test sets for hallucination, answer leakage, bias, equivalence, prompt injection and moderation evasion |

## 42. Security, privacy and device requirements

| Control family | MVP requirement |
| --- | --- |
| Identity | District-scoped roles; MFA for staff; short-lived student sessions; verified roster membership |
| Data protection | Encryption in transit and at rest; managed keys; least privilege; separate production and test data |
| Student data | No external general-purpose model training; minimum necessary data; retention/deletion controls |
| Audit | Append-only record of AI recommendations, teacher decisions, grade releases, content versions and moderation events |
| Device | Managed allow-list or single-app mode where district permits; remote lock/wipe; offline encryption and safe synchronization |
| Network safety | Rate limits, content filtering, human escalation, evidence preservation and incident response runbook |
| Development | Synthetic data by default; secrets management; dependency scanning; security review before classroom use |
| Legal review | FERPA, COPPA, CIPA, Florida student privacy, district policy and procurement terms reviewed by qualified counsel |

## 43. Nonfunctional requirements

| ID | Requirement | Pilot target |
| --- | --- | --- |
| NFR-01 | Student lesson response | 95th percentile interaction under 1.5 seconds excluding model generation |
| NFR-02 | AI help response | First useful response under 5 seconds for ordinary requests |
| NFR-03 | Availability | 99.5% during defined school and homework windows for pilot |
| NFR-04 | Offline | Assigned lesson opens and core responses queue safely without connectivity |
| NFR-05 | Accessibility | WCAG 2.2 AA target; keyboard, screen reader, text-to-speech, zoom and contrast verification |
| NFR-06 | Auditability | 100% of consequential AI recommendations and teacher decisions carry trace records |
| NFR-07 | Tenant isolation | Automated tests demonstrate no cross-tenant data access |
| NFR-08 | Recovery | Defined backup, restore and incident response objectives before live pilot |
| NFR-09 | Observability | Metrics and alerts for errors, latency, model failures, unsafe output and synchronization |
| NFR-10 | Cost | Per-student inference and storage budgets visible by assignment and feature |

## 44. Developer epics and acceptance criteria

| Epic | Definition of done |
| --- | --- |
| E1 Foundation | Tenant, role, roster, class and synthetic student management with audit and automated tenant-isolation tests |
| E2 Objective graph | Create, review, publish and retrieve immutable objective versions with prerequisites and sources |
| E3 Learner evidence | Record evidence events; create transparent ILP hypotheses; teacher can correct and expire them |
| E4 Assignment compiler | One teacher assignment generates reproducible student manifests with zero silent objective changes |
| E5 Student player | Tablet lesson, handwriting/typing/speech hooks, local progress and safe synchronization |
| E6 Assignment bot | Mode-aware grounded help that passes answer-leakage and source-fabrication evaluations |
| E7 Assessment | Approved specifications generate versioned items that pass alignment and equivalence review |
| E8 Grading review | Criterion evidence, confidence and teacher decision; system cannot release final grade alone |
| E9 Remediation | Failure produces a different lesson, success criterion and equivalent reassessment |
| E10 Teacher command center | Prioritized checklist, temporary group, intervention material and duplicate suppression |
| E11 Simulation | Scenario advances, pauses at critical point and records revision/recovery evidence |
| E12 Collaboration | Verified assignment thread, reporting, moderation and no direct messages |
| E13 Integrations | Roster import and export tested; Canvas/LTI discovery interfaces documented |
| E14 Pilot analytics | Mastery, growth, workload, engagement, model quality and safety measures exportable |

## 45. Build sequence

1. Choose the grade 3 objective set and curriculum/psychometric reviewers.
2. Implement tenant, identity, role, roster and synthetic learner fixtures.
3. Implement the objective/source/version schema and editorial approval workflow.
4. Implement learner evidence events, ILP hypotheses and teacher correction.
5. Implement assignment compilation and objective-integrity validation.
6. Implement the tablet student lesson player and offline queue.
7. Implement assignment-aware bot modes and red-team test suite.
8. Implement assessment specifications, submissions and grading recommendations.
9. Implement teacher final-grade workflow and audit trail.
10. Implement individual remediation, reassessment and 75% classwide failure workflow.
11. Implement the teacher Today board and temporary group generation.
12. Implement one branching simulation and problem-solving evidence model.
13. Implement one district-contained collaboration thread and moderation workflow.
14. Add roster/SSO integration path and Canvas/Skyward discovery adapters.
15. Run content, psychometric, accessibility, security, privacy and classroom usability gates.

## 46. Testing strategy

| Test layer | Required coverage |
| --- | --- |
| Unit | Objective locks, rule evaluation, mastery calculations, permissions and evidence event creation |
| Contract | API schemas, integration adapters, model structured outputs and audit payloads |
| Golden set | Approved lesson adaptations, bot responses, grading examples and remediation cases |
| Psychometric | Item alignment, difficulty, equivalent evidence, subgroup consistency and teacher override patterns |
| Safety | Answer leakage, prompt injection, fabricated sources, bullying, grooming, self-harm and adult impersonation |
| Accessibility | Keyboard, screen reader, speech, handwriting alternatives, zoom, contrast and reduced motion |
| Offline/sync | Conflict handling, duplicate submission prevention and recovery after device/network loss |
| Load | Class publication, simultaneous lesson start, bot bursts and grading batches |
| Classroom usability | Teacher assigns once; students start independently; exceptions are understandable and resolvable |

## 47. St. Lucie discovery checklist

| Owner group | Questions to resolve |
| --- | --- |
| Curriculum | Which grade 3 objectives, pacing materials, approved sources and remediation methods should anchor the pilot? |
| Assessment | What FAST/other evidence is accessible at objective or reporting-category level, under what terms, and with what limitations? |
| Instructional technology | How are Canvas, IXL, Nearpod, Discovery and Microsoft actually used by pilot teachers? |
| Information technology | What devices, OS versions, MDM, SSO, network filters, support processes and offline constraints exist? |
| Data/privacy/legal | What student data may enter the pilot, where may it be processed, and what retention/vendor terms apply? |
| Teachers | Where do planning, differentiation, grading, reteaching and documentation consume the most time? |
| School leaders | Which classrooms, schedules, training windows and outcome measures are feasible? |
| Families/students | What consent, transparency, take-home, accessibility and support expectations must be met? |

## 48. Recommended first meeting pitch

**Opening:** St. Lucie already has capable tools. The problem is that they remain separate. Canvas transports assignments; FAST reports progress; IXL provides practice and analytics; Skyward records grades and attendance. Teachers still have to interpret the evidence, build or find the lesson, differentiate it, create the assessment, grade it and determine remediation.

**Proposal:** Pilot an instructional intelligence layer that allows one teacher assignment to become the appropriate lesson and assessment version for each student while preserving the same objective and mastery requirement. The system performs the production and first-pass analysis; teachers retain instruction, judgment and final grades.

**Proof:** Begin with one grade, a small objective set, existing managed devices and synthetic data. Measure learning, remediation, teacher time, rigor, integration, safety and external results. Expand only if the evidence supports expansion.

**ASK** — Authorize a joint discovery and prototype-validation phase — not a districtwide purchase — with named St. Lucie curriculum, assessment, technology, privacy and teacher representatives.

## 49. Sources and verification notes

Publicly verified current context as of August 24, 2026:

- St. Lucie Public Schools — Instructional Technology (Canvas, Nearpod, Discovery Education, IXL and Microsoft): https://www.stlucie.k12.fl.us/departments/curriculum/instructional-technology/
- St. Lucie Public Schools — Digital Learning (student laptop and remote access context): https://www.stlucie.k12.fl.us/digital-learning/
- St. Lucie Public Schools — Skyward Family Access Mobile: https://www.stlucie.k12.fl.us/parents-students/family-access-mobile/
- Florida Department of Education — FAST Assessments: https://www.fldoe.org/accountability/assessments/k-12-student-assessment/best/
- 1EdTech — Learning Tools Interoperability: https://www.1edtech.org/standards/lti
- 1EdTech — OneRoster: https://www.1edtech.org/standards/oneroster

Before any district presentation, verify actual licenses, device inventory, integrations, data rights and classroom use directly with St. Lucie. Public web pages establish the current environment but do not reveal configuration, adoption depth, pricing or data availability.

## 50. Immediate decisions for the builder

| Decision | Recommended default |
| --- | --- |
| Pilot grade | Grade 3 |
| First math unit | Fractions or multiplication/division relationship; finalize with St. Lucie curriculum lead |
| First literacy unit | Evidence-based reading response with vocabulary and written explanation |
| First simulation | Age-appropriate community resource decision or historical civic choice |
| Client architecture | Tablet-first PWA plus teacher web console; preserve native iPad wrapper option |
| Backend | Relational authoritative store, object storage, event stream and approved-source retrieval index |
| Integration start | CSV/OneRoster import and secure export; LTI discovery after core workflow works |
| AI boundary | Provider-agnostic gateway with structured outputs, source grounding and deterministic policy gates |
| Data during build | Synthetic students only |
| First demo | Teacher assigns one objective; system produces five adaptation patterns; two sample students complete lesson, bot help, assessment and remediation; teacher reviews one grade and one 75% alert |
