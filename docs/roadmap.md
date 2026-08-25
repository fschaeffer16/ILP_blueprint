# Build roadmap

Where the build is, and the order that gets it to a pilot-ready vertical slice. This merges
the blueprint's implementation order (§24) and the build spec's build sequence (§45) with the
developer epics (§44).

## Current state

**Most of the connected cycle's engine is built** ([`@ilp/core`](../packages/core)) — runnable
on synthetic data, no AI keys, **51 passing tests**, two demos (`npm run demo`, `npm run demo:cycle`).

- **Assign-once compiler** — one teacher assignment → a reproducible, individualized delivery
  manifest per student, with the objective, rigor and mastery rule locked identically.
- **Assessment engine** — rubrics, specs, items, and a deterministic item-integrity gate
  (alignment, answerability, answer-key/leak, prohibited clues); a pluggable `ItemGenerator`.
- **Grading engine** — a pluggable `SubmissionGrader` + reference grader producing
  criterion evidence, flags and confidence; a `releaseFinalGrade` gate that makes a grade
  impossible without a teacher accept/modify decision; an append-only audit log.
- **Remediation + the 75% rule** — classwide-failure evaluation that suspends the grade and
  opens an integrity audit, plus materially-different / equivalent-reassessment checks.

This started with the *hardest and most differentiating* piece — the assign-once compiler,
the thing a menu-of-generators competitor (Kira, SchoolAI) does not do — and has now
deepened through assessment, teacher-reviewed grading, and remediation. The AI seams
(`ItemGenerator`, `SubmissionGrader`) are where a real model gateway slots in later; the
guardrails around them are deterministic and tested.

**A teacher command center UI** ([`@ilp/web`](../apps/web), Next.js) now sits on top of the
engine: a Today board, a class overview, the assign-once composer with a live compile preview,
and an interactive grading review. Every screen renders real engine output on synthetic data.

**Content governance + the objective builder.** The `SourceRecord` model and the authoring
gate (`validateObjectiveDraft`) enforce that a published objective is mapped to a standard and
cites only approved, deliverable-licensed sources — nothing unvetted reaches a student. The
`/author` screen in `@ilp/web` authors against that gate live. The sourcing model (standards
frameworks, the 5-tier content library, the vetting pipeline, and the evidence-based technique
catalog) is documented in [`content-governance.md`](content-governance.md).

**The three authoring layers + rollup analytics.** The full authoring stack now exists as
gated, tested engine functions with real screens: **Layer 1** objective + source approval
(district), **Layer 2** the teacher's lesson builder (`validateLessonPlan` — a lesson must
teach, assess, cite approved sources, and cover the objective's required reasoning), and
**Layer 3** the mastery dashboard (`buildRollups` — student → class → grade → school →
district). See [`content-governance.md`](content-governance.md) for the two-role model.

**Student app (student role).** `/student` is the student's one app: an individualized
assignment queue (the compiler's per-student versions), study guides built by
`buildStudyGuide` from the same approved lesson content, and verified subject collaboration
channels. The channels are the blueprint's §15 network done right — `moderatePost` enforces
verified-roster-only, holds answer-dumping (with an independent mastery check), holds
bullying/PII, and escalates possible self-harm to a trained adult; `computeRecognition` ranks
helpfulness, not popularity. The data model has no direct-message field and no follower counts.

**Family view (parent role).** `buildParentSummary` produces a plain-language, no-surprises
summary of one child: time in each surface (including the collaboration lab and simulations),
collaboration and problem-solving activity, growth, and safety — with flags that surface
anything a parent should know. The privacy line is enforced by the data model itself: it
carries patterns, time and safety, and has **no message-content field** — parents never see
their child's or other children's conversations. Screen: `/parent` in `@ilp/web`.

## Slice order

| # | Slice | Epic (spec §44) | Depends on |
| --- | --- | --- | --- |
| 1 | **Objective graph + assign-once compiler** ✅ | E2, E4 | — |
| 6 | **Assessment specs, items, item-integrity gate, grading recommendations** ✅ | E7, E8 | 1 |
| 7 | **Teacher final-grade workflow + audit trail** ✅ | E8 | 6 |
| 8 | **Remediation, reassessment, and the 75% classwide-failure workflow** ✅ | E9 | 6 |
| 2 | Foundation: tenant, role, roster, class, synthetic students + audit log | E1 | 1 |
| 3 | Learner-evidence events + ILP hypothesis lifecycle (create/correct/expire) | E3 | 2 |
| 4 | Student lesson player (tablet PWA: touch, handwriting, speech, offline queue) | E5 | 1 |
| 5 | Assignment-aware bot (mode-governed, grounded) + red-team suite | E6 | 4 |
| 9 | **Teacher command center (Today board, class overview, assign composer, grading review)** 🟡 | E10 | 1, 6, 7 |
| 10 | One branching simulation + problem-solving evidence model | E11 | 2 |
| 11 | District-contained collaboration thread + moderation | E12 | 2 |
| 12 | Roster/SSO integration path; Canvas/Skyward discovery adapters | E13 | 2 |
| 13 | Pilot analytics export (mastery, growth, workload, safety) | E14 | 3, 7 |
| 14 | Validation gates: content, psychometric, accessibility, security, privacy, usability | — | all |

## Product architecture (MVP shape)

Confirmed decisions for this build:

- **Client:** tablet-first responsive web app / installable PWA + a teacher web console.
  Preserve the option of a native iPad wrapper when handwriting, offline storage or
  managed-device controls require it.
- **Backend:** TypeScript. Relational store for authoritative records; object storage for
  submissions/media; a search/vector index *only* for approved-source retrieval.
- **AI:** a provider-agnostic **model gateway** that enforces grounding, structured outputs,
  logging, redaction, rate limits and policy checks — so the AI provider can change without
  touching domain logic, and so a district can run a cheaper or self-hosted model. The
  compiler itself is deterministic and needs no model at all.
- **Integrations:** CSV/OneRoster first; LTI 1.3 / Canvas deep-link discovery later;
  district-approved grade passback only after validation.

## Pilot decision gates

The build does not go near real students until these gates pass, in order:

1. Technical feasibility with synthetic data and teacher review.
2. Content and assessment review by subject experts and psychometric advisors.
3. Privacy, security and district legal approval.
4. Small classroom usability pilot without high-stakes grading.
5. Controlled instructional pilot with predefined outcome measures.
6. Independent evaluation before broader district expansion.

## Immediate builder decisions (recommended defaults)

| Decision | Recommended default |
| --- | --- |
| Pilot grade | Grade 3 |
| First math unit | Fractions or the multiplication/division relationship (finalize with district curriculum lead) |
| First literacy unit | Evidence-based reading response with vocabulary and written explanation |
| First simulation | Age-appropriate community-resource decision or historical civic choice |
| Client architecture | Tablet-first PWA + teacher web console; preserve native iPad wrapper option |
| Backend | Relational authoritative store, object storage, event stream, approved-source retrieval index |
| Integration start | CSV/OneRoster import and secure export; LTI discovery after core workflow works |
| AI boundary | Provider-agnostic gateway with structured outputs, source grounding, deterministic policy gates |
| Data during build | Synthetic students only |
| First demo | Teacher assigns one objective; system produces five adaptation patterns; two sample students complete lesson, bot help, assessment and remediation; teacher reviews one grade and one 75% alert |

Slice 1 already delivers the first half of that "first demo" line: assign once → five
adaptation patterns. Run it with `npm run demo`.
