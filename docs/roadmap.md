# Build roadmap

Where the build is, and the order that gets it to a pilot-ready vertical slice. This merges
the blueprint's implementation order (§24) and the build spec's build sequence (§45) with the
developer epics (§44).

## Current state

**Slice 1 — the assign-once compiler — is built.** ([`@ilp/core`](../packages/core))

- One teacher assignment compiles into a reproducible, individualized delivery manifest per
  student, with the objective, rigor and mastery rule locked identically across all of them.
- District-customizable adaptation engine with objective-integrity enforcement.
- Runnable on synthetic data, no AI keys, 24 passing tests.

This is deliberately the *hardest and most differentiating* piece first: it is the thing a
menu-of-generators competitor (Kira, SchoolAI) does not do, and everything else composes
around it.

## Slice order

| # | Slice | Epic (spec §44) | Depends on |
| --- | --- | --- | --- |
| 1 | **Objective graph + assign-once compiler** ✅ | E2, E4 | — |
| 2 | Foundation: tenant, role, roster, class, synthetic students + audit log | E1 | 1 |
| 3 | Learner-evidence events + ILP hypothesis lifecycle (create/correct/expire) | E3 | 2 |
| 4 | Student lesson player (tablet PWA: touch, handwriting, speech, offline queue) | E5 | 1 |
| 5 | Assignment-aware bot (mode-governed, grounded) + red-team suite | E6 | 4 |
| 6 | Assessment specs, submissions, grading recommendations | E7, E8 | 3 |
| 7 | Teacher final-grade workflow + audit trail | E8 | 6 |
| 8 | Remediation, reassessment, and the 75% classwide-failure workflow | E9 | 6 |
| 9 | Teacher command center (Today board, temporary groups, duplicate suppression) | E10 | 3, 7 |
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
