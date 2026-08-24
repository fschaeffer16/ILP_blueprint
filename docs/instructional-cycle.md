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
| 6 | **Assessment engine** — [`packages/core/src/assessment.ts`](../packages/core/src/assessment.ts) — rubrics, specs, items, and the item-integrity gate |
| 7 | **Grading engine** — [`packages/core/src/grading.ts`](../packages/core/src/grading.ts) — AI recommends with criterion evidence; only a teacher decision releases a grade |
| 8–10 | **Remediation + the 75% rule** — [`packages/core/src/remediation.ts`](../packages/core/src/remediation.ts) — classwide-failure evaluation, materially-different reteach, equivalent reassessment |
| 11–12 | Mastery rule (locked, enforced in `releaseFinalGrade`) + objective graph successors |

Steps 4 and 6–10 are built; run the second half end-to-end with `npm run demo:cycle`. The
remaining stages (instruction delivery UI, the bot, simulations, collaboration) are specified
in the build spec and scheduled in [`roadmap.md`](roadmap.md).
