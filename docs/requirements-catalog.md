# Requirement catalog

The traceable requirement catalog (Appendix A) plus the non-functional requirements from the
build spec (§43). The **Status** column links requirements to the code that satisfies them.

## Functional requirements

| ID | Area | Requirement | Status |
| --- | --- | --- | --- |
| LRN-01 | Learner model | Store evidence, hypothesis, confidence, review date and teacher correction. | ✅ `ILPHypothesis` |
| LRN-02 | Learner model | Fade temporary scaffolds when evidence supports independence. | 🟡 `fadeRule` on adaptations; fade execution pending evidence pipeline |
| OBJ-01 | Objective graph | Trace every instructional and assessment component to an objective. | ✅ manifest `lockedContract` + integrity checks |
| OBJ-02 | Objective graph | Store prerequisites, misconceptions, remediation and successors. | ✅ `ObjectiveVersion` fields |
| ASN-01 | Assignment | Compile individualized versions from one teacher assignment. | ✅ `compileAssignment` |
| ASN-02 | Assignment | Record every adaptation and whether rigor changed. | ✅ `appliedAdaptationIds`, `objectiveModified` |
| BOT-01 | Bot | Ground responses in approved assignment material and sources. | ⬜ bot slice |
| BOT-02 | Bot | Enforce teacher-configured help boundaries. | ⬜ bot slice (`botMode` modeled) |
| ASM-01 | Assessment | Generate equivalent items from an approved specification. | ⬜ assessment slice |
| ASM-02 | Assessment | Flag ambiguity, misalignment and abnormal item behavior. | ⬜ assessment slice |
| GRD-01 | Grading | Provide criterion recommendations, evidence and confidence. | ⬜ grading slice |
| GRD-02 | Grading | Require teacher action before final grade release. | ⬜ grading slice (modeled: `TeacherDecision` authoritative) |
| REM-01 | Remediation | Generate a materially different lesson for failed objectives. | ⬜ remediation slice |
| REM-02 | Remediation | Suspend affected grades at the classwide threshold. | ⬜ 75% workflow |
| SIM-01 | Simulation | Pause at critical points and return decisions to the student. | ⬜ simulation slice |
| SIM-02 | Simulation | Track reasoning, consequences, revision, recovery and transfer. | ⬜ simulation slice |
| NET-01 | Network | Restrict participation to verified, policy-appropriate users. | ⬜ collaboration slice |
| NET-02 | Network | Integrate collaboration with assignments and mastery checks. | ⬜ collaboration slice |
| TCH-01 | Teacher UX | Present a short prioritized action list instead of raw data overload. | ⬜ teacher command center |
| TCH-02 | Teacher UX | Generate temporary groups and ready-to-use intervention materials. | ⬜ teacher command center |
| DEV-01 | Device | Run in locked managed mode with offline assignment support. | ⬜ device / player slice |
| AUD-01 | Audit | Preserve AI recommendation, teacher decision and curriculum-version history. | 🟡 compile results carry integrity + rationale; append-only audit log pending |

Legend: ✅ met · 🟡 partially met / modeled · ⬜ not yet built.

## Non-functional requirements (pilot targets)

| ID | Requirement | Pilot target |
| --- | --- | --- |
| NFR-01 | Student lesson response | 95th percentile interaction under 1.5 s (excluding model generation) |
| NFR-02 | AI help response | First useful response under 5 s for ordinary requests |
| NFR-03 | Availability | 99.5% during defined school and homework windows |
| NFR-04 | Offline | Assigned lesson opens and core responses queue safely without connectivity |
| NFR-05 | Accessibility | WCAG 2.2 AA; keyboard, screen reader, text-to-speech, zoom, contrast |
| NFR-06 | Auditability | 100% of consequential AI recommendations and teacher decisions carry trace records |
| NFR-07 | Tenant isolation | Automated tests demonstrate no cross-tenant data access |
| NFR-08 | Recovery | Defined backup, restore and incident-response objectives before live pilot |
| NFR-09 | Observability | Metrics/alerts for errors, latency, model failures, unsafe output, sync |
| NFR-10 | Cost | Per-student inference and storage budgets visible by assignment and feature |

The affordability goal ("cheaper than Kira/SchoolAI") is anchored by **NFR-10**: cost is a
first-class, measured requirement, not an afterthought. The deterministic compiler helps here
too — individualization that does not require a model call per student is individualization
that does not cost per student.
