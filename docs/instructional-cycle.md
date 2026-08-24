# The connected instructional cycle

Every subject in ILP uses the same traceable chain. The product's value is that these steps
are *connected* — evidence flows from one to the next automatically — instead of being
stitched together by hand across separate tools.

```
Standard/competency → Prerequisites → Learning objective → Instruction → Practice →
Assessment → Teacher-reviewed grading → Diagnosis → Remediation → Reassessment →
Mastery → Next objective
```

1. **Standard or competency** — the jurisdictional anchor (e.g. Florida B.E.S.T.).
2. **Prerequisites** — what must already be in place; a gap here routes to review.
3. **Learning objective** — the versioned contract (`ObjectiveVersion`).
4. **Instruction** — the adaptive lesson version compiled per student.
5. **Practice** — progressive tasks with feedback and scaffold control.
6. **Assessment** — objective-aligned, equivalence-checked items.
7. **Teacher-reviewed grading** — AI recommends with evidence; the teacher decides.
8. **Diagnosis** — the shared misconception or missing prerequisite behind a failure.
9. **Remediation** — a *materially different* reteach, plus prepared teacher materials.
10. **Reassessment** — a new, equivalent task measuring the same objective.
11. **Mastery** — the locked mastery rule met with the required evidence types and transfer.
12. **Next objective** — the successor in the objective graph.

## Traceability requirements

These are the invariants that make the cycle auditable (P2, P7):

- No lesson without a named objective and prerequisite map.
- No activity without an instructional purpose.
- No assessment item without evidence that the required knowledge or reasoning was taught and practiced.
- No AI score without criterion-level evidence and confidence information.
- No remediation that simply repeats the failed lesson in different colors.
- No advancement that hides a critical prerequisite gap.

## Where the cycle lives in this repo today

| Step | Artifact |
| --- | --- |
| 1–3 | `ObjectiveVersion` — [`schemas/objective.schema.json`](../schemas/objective.schema.json), [`packages/core/src/types.ts`](../packages/core/src/types.ts) |
| 4 | The **assign-once compiler** — [`packages/core/src/compiler.ts`](../packages/core/src/compiler.ts) — turns one objective + each ILP into an individualized, integrity-checked delivery manifest |
| 6–7 | Assessment & grading specs — [`build-spec.md`](build-spec.md) §36 *(engine: later slice)* |
| 8–10 | Remediation & the 75% rule — [`build-spec.md`](build-spec.md) §37 *(engine: later slice)* |
| 11–12 | Mastery rule (locked) + objective graph successors |

The compiler (step 4) is the first fully-built stage; the remaining stages are specified in
the build spec and scheduled in [`roadmap.md`](roadmap.md).
