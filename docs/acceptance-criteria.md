# MVP acceptance criteria

The pilot-level acceptance criteria for the first buildable product. The **Status** column
tracks what the current build satisfies; update it as slices land.

| ID | Acceptance criterion | Status |
| --- | --- | --- |
| AC-01 | Teacher assigns one objective without authoring student-specific versions. | ✅ Compiler (`compileAssignment`) |
| AC-02 | Every generated lesson and item displays its objective, version and source trace. | 🟡 Objective/version on every manifest (`lockedContract`) and item (integrity gate checks traceability + source); source-trace *display* pending lesson player |
| AC-03 | System produces at least four adaptation patterns without altering the mastery requirement. | ✅ Five patterns; mastery locked (tests) |
| AC-04 | Teacher can inspect and override every consequential ILP inference. | 🟡 Grading review UI exposes accept/modify/reject; ILP-hypothesis override UI still pending |
| AC-05 | Bot behavior changes correctly between lesson, homework, quiz and exam modes. | ⬜ Bot slice pending (`botMode` modeled) |
| AC-06 | AI grading displays criterion-level evidence and cannot release a final grade. | ✅ `referenceGrader` + `releaseFinalGrade` gate; a non-accept decision releases no grade (tests) |
| AC-07 | A failed objective produces a different remediation lesson and equivalent reassessment. | ✅ `checkRemediationPlan` — materially-different + equivalent-reassessment checks (tests) |
| AC-08 | A classwide 75% failure suspends the affected grade and generates an audit card. | ✅ `evaluateClasswideFailure` (tests; see `demo:cycle`) |
| AC-09 | Teacher dashboard prioritizes actionable items and suppresses duplicate noise. | 🟡 Today board prioritizes cards (`@ilp/web`); duplicate-suppression logic pending |
| AC-10 | Simulation records decision, consequence, revision and recovery evidence. | ⬜ Simulation slice pending (spec §38) |
| AC-11 | Collaboration is limited to verified roster members and followed by configurable mastery verification. | ⬜ Collaboration slice pending (spec §39) |
| AC-12 | All AI recommendations, teacher changes, content versions and grade releases are auditable. | 🟡 Compile results carry rationale + integrity; grading has an append-only audit log (`appendAudit`); unified store pending |
| AC-13 | Essential assigned work functions offline and synchronizes safely. | ⬜ Student player / offline queue pending |
| AC-14 | No student data is used to train an external general-purpose model. | ✅ Policy + synthetic-only build; enforced at the model gateway (spec §41) |

Legend: ✅ met · 🟡 partially met / modeled · ⬜ not yet built.

See [`roadmap.md`](roadmap.md) for the slice order that closes the ⬜ items, and the
[developer epics](build-spec.md) (§44) for each slice's definition of done.
