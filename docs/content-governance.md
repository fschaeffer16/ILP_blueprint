# Content governance — where objectives and content come from

This is the sourcing and credibility model for ILP. It answers three questions a school
district will ask before trusting the platform with children:

1. Where do the **learning objectives** come from?
2. Where is the **teaching content** mined from?
3. How do you keep it **credible and current** — and not stuck in the 1950s?

The design principle: **nothing a child sees is invented free-hand or pulled from an
unvetted corner of the web.** Objectives are mapped from official standards; content comes
from a governed, tiered library where every item carries a license, an authority, and a
review date; and every teaching technique is grounded in named, modern learning science.

## Three authoring layers, two roles

Authoring is deliberately split so a district controls the guardrails while teachers keep
their professional freedom inside them.

| Layer | What it is | Who owns it | In the build |
| --- | --- | --- | --- |
| **1 · Objective + sources** | The standards-mapped target, its mastery rule, and the approved source library | **District** (curriculum office) — approves objectives *and* where content comes from | `/author` + `validateObjectiveDraft` + `SourceRecord` ✅ |
| **2 · Lesson plan** | The actual year-long lessons a class experiences, assembled from approved objectives + sources | **Teacher** — builds their own lessons, but only from Layer-1-approved pieces | `/lesson` + `validateLessonPlan` ✅ |
| **3 · Analytics** | Objectives, assignments and scores rolled up for oversight | **Everyone at their level** — teacher → principal → superintendent | `/dashboard` + `buildRollups` ✅ |

The gates enforce the boundary: a teacher's Layer-2 lesson can only cite **district-approved**
sources and must cover the **district-approved** objective's reasoning. Freedom inside the
guardrails, not instead of them.

---

## 1. Where learning objectives come from

An objective is authored from an official standards framework, reviewed by a curriculum
specialist, then published as a versioned, immutable record. That chain makes it auditable
and reusable across every classroom.

```
Standards framework  →  Objective drafted  →  Curriculum review  →  Published & version-locked
(e.g. MA.3.FR.1.1)      (outcome, mastery)     (alignment, sources)   (rigor can't drift after this)
```

### Standards frameworks feeding the objective graph

| Framework | Covers | Status |
| --- | --- | --- |
| **Florida B.E.S.T.** (Benchmarks for Excellent Student Thinking) | ELA & Mathematics | Current — full accountability 2024–25 |
| **NGSS** (Next Generation Science Standards) | Science | 2013 |
| **C3 Framework** (College, Career & Civic Life) | Social studies / civics | NCSS, 2013 |
| **WIDA** | English language development | Current |
| **National Core Arts Standards** | Arts | Current |

The **state framework is the legal anchor** — it is what FAST reports against — but ILP maps
to it without letting the state test dictate day-to-day instruction. Other frameworks fill
subjects B.E.S.T. does not cover.

A published objective (`ObjectiveVersion`, see [`data-model.md`](data-model.md)) carries its
standard reference, student outcome, essential knowledge, required reasoning, prerequisites,
mastery rule, common misconceptions, approved sources, permitted/prohibited adaptations, and
a version + review date. Everything downstream traces back to it.

---

## 2. Where the content is mined from

Content is drawn from five tiers, strongest first. Each tier maps to the `SourceTier` in the
data model, and every source is a `SourceRecord` with a license and review status before it
can reach a student.

| Tier | What it is | Representative sources | Typical license |
| --- | --- | --- | --- |
| **1 · standards** | The learning targets themselves (not student-facing content). | Florida B.E.S.T., NGSS, C3, WIDA | — |
| **2 · primary** | Original documents, images, data and texts from national institutions. | Library of Congress, National Archives (DocsTeach), Smithsonian Open Access, NASA, NOAA, USGS, Our World in Data, Project Gutenberg | Public domain / CC BY |
| **3 · oer** | Peer-reviewed or editorially-vetted open teaching materials. | OpenStax, CK-12, Illustrative Mathematics, Khan Academy, PBS LearningMedia, OER Commons, Newsela | Creative Commons |
| **4 · licensed** | Programs a district already pays for, used only where the license permits. | District-adopted core programs, Nearpod/Discovery, IXL evidence, publisher media under contract | Under license |
| **5 · pedagogy** | Research that informs *how* a lesson is built (not student-facing facts). | What Works Clearinghouse (IES), Education Endowment Foundation, Deans for Impact, peer-reviewed journals | — |

> Source names are **representative candidate sources by tier**, not a claim of existing
> partnerships. Licensing and access are confirmed per source during the vetting pipeline.

The system **prefers primary sources and openly-licensed materials**; district-licensed
publisher content is used only where the contract permits. ILP wraps a district's existing
investments — it does not pirate them.

---

## 3. How a source becomes usable — the vetting pipeline

No source reaches a student on discovery. Each passes a fixed gate and becomes a
`SourceRecord`, then is re-checked on a schedule.

```
1 Discover  →  2 License check  →  3 Authority/provenance  →  4 Editorial review  →  5 Approve + date + re-review schedule
```

### Editorial standard (built into every source record)

From the blueprint's editorial governance (§17):

- Statements are marked as documented **fact, inference, interpretation, or disputed**.
- Use primary sources where appropriate and authoritative secondary scholarship for context.
- Teach the **full documented record** — including Black, white, immigrant, Indigenous and
  global histories — as part of the record, not isolated commemorative units.
- Sources, revision history and editorial decisions are exposed to authorized reviewers.
- Verified errors are **corrected immediately**, with the audit trail preserved.
- The platform does **not** advocate a contemporary partisan or identity position.

### The `SourceRecord` contract

Fields (see [`../schemas/source-record.schema.json`](../schemas/source-record.schema.json)
and [`../packages/core/src/types.ts`](../packages/core/src/types.ts)):

`id · title · citation · uri · tier · authorityType · license · reviewStatus · reviewedAt · reviewBy`

Only a source with `reviewStatus: "approved"` **and** a deliverable license may be cited by a
published objective. This is enforced in code by the authoring gate
([`validateObjectiveDraft`](../packages/core/src/authoring.ts)) — publishing an objective that
cites an unapproved or wrongly-licensed source is blocked.

---

## 4. Teaching techniques — evidence-based, not mid-century

Every adaptation the compiler can apply is grounded in a named, modern body of research.
These replace one-size worksheets, rote recall, and fixed ability tracking.

| Technique | Origin | How ILP uses it |
| --- | --- | --- |
| Rosenshine's Principles of Instruction | 2012, cognitive science | Small steps, guided practice, high success rate → `guided_practice`, `worked_example_fade` |
| Universal Design for Learning (UDL) 3.0 | CAST, July 2024 | Multiple means of representation/engagement/action → read-aloud, visual-first, response choice |
| Worked-example effect & fading | cognitive-load research | Worked parallel example, steps removed → `worked_example_fade`, faded before mastery |
| Retrieval & spaced practice | Dunlosky et al., 2013 | Spacing and low-stakes recall → practice scheduling, delayed retention checks |
| Formative assessment | Black & Wiliam | Evidence used to adjust teaching → the teacher-reviewed grading + remediation loop |
| Concrete–Representational–Abstract (CRA) | math methods research | Models before symbols → `visual_first_models` |
| Structured literacy / science of reading | Scarborough's Reading Rope | Decoding + comprehension → vocabulary/read-aloud supports that don't mask the reading objective |
| Feedback that moves learning forward | Hattie; Wiliam | Criterion evidence + specific next steps → grading output, reflection |

### What ILP is not (the 1950s model) vs. what it uses

| ✕ 1950s model | ✓ ILP instead |
| --- | --- |
| One worksheet for thirty different children | One objective → an individualized version per child |
| Rote memorization as the goal | Knowledge in service of reasoning and transfer |
| Fixed ability tracks and permanent labels | Temporary, evidence-based groups that dissolve |
| A textbook chapter as the whole curriculum | Primary sources and current, licensed materials |
| Grades with no evidence and no next step | Evidence, teacher judgment, and mandatory remediation |

---

## 5. Baseline: meeting students where they are

Fair individualization starts with a fair baseline. ILP's baseline (blueprint §7) draws from
three places and never lets any of them lower a child's standard:

- **Existing district instruments as one signal** — FAST (3× a year), plus i-Ready / IXL
  where licensed. Audited for validity and imported as evidence; never the whole learner model.
- **ILP's own short, age-appropriate baseline** — objective-aligned, calibrated to avoid
  over-testing young children (K–1 game-like tasks + observation; 2–3 independent tablet
  tasks; 4–5 multi-step reasoning and transfer).
- **Daily classroom evidence** — continuously updates the profile between the start- and
  end-of-year baselines.

Fairness is enforced by the same principle the compiler already holds to: the baseline sets a
student's **starting point and supports, never a lower standard**. Supports are tagged
**access** (rigor unchanged) vs. **development** (strengthen the weakness), and scaffolds
carry a **fade rule** so they are removed as the student gains independence — the mechanism
for *strengthening weaknesses over time* instead of routing around them permanently.

*Open decisions (with a psychometrician): exactly which baseline dimensions can be measured
validly without over-testing, and the assessment-equivalence method. Tracked in the open
backlog.*

---

## The library is filled (grade-3 demo pack)

A synthetic-but-real grade-3 content pack now ships in the repo so the product can be driven
end-to-end: **61 objectives across 4 subjects**, each with an **authored lesson** (real
student-facing content blocks), **122 assessment items**, and **26 approved sources** across
tiers. `buildCatalog` runs the objective-authoring, lesson-coverage, and item-integrity gates
over the whole pack — and every entry passes. **All 60 grade-3 B.E.S.T. benchmarks are now
authored — 100% coverage** (34 mathematics + 26 ELA), plus one history/civics simulation.
Browse it at `/library` in `@ilp/web`.

### Mapped to the real Florida B.E.S.T. spine

The pack is no longer invented codes. Every objective maps to an actual **Florida B.E.S.T.
grade-3 benchmark**, and the complete grade-3 standard set — **34 mathematics + 26 ELA
benchmarks** — ships as a structured spine in
[`packages/core/src/fixtures/standards.ts`](../packages/core/src/fixtures/standards.ts). This
is the target the library grows toward: `coverageReport` shows how much of each strand is
authored, and the `/library` screen renders that coverage benchmark-by-benchmark. Current depth:

| Strand (math) | Authored | Strand (ELA) | Authored |
| --- | --- | --- | --- |
| Fractions | 3 / 5 | Reading — Prose & Poetry | 1 / 4 |
| Number Sense & Operations | 2 / 8 | Reading — Informational | 1 / 4 |
| Algebraic Reasoning | 1 / 8 | Communication — Writing | 2 / 5 |
| Measurement | 1 / 4 | Vocabulary | 1 / 3 |
| Geometric Reasoning | 1 / 7 | *(other ELA strands)* | 0 |
| Data Analysis & Probability | 1 / 2 | | |

The point isn't the current count — it's that the growth path is a **real state standard set**,
every new objective passes the same gates, and the coverage is measured, not asserted. Source:
FLDOE B.E.S.T. Standards (Rule 6A-1.09401); verify wording against the official PDFs before any
student-facing publication.

## Build status

- The `SourceRecord` model, the objective's source references, and the **authoring gate** that
  refuses unvetted sources are **built and tested** in `@ilp/core`.
- The objective-builder **screen** that authors against this gate is built in `@ilp/web`
  (`/author`).
- **Not yet built:** the connected content library itself (real source ingestion), the
  baseline intake screens, and the FAST/i-Ready import adapters.

## Verified references

- [CAST — UDL Guidelines 3.0](https://udlguidelines.cast.org/) (released July 2024)
- [Florida DOE — B.E.S.T. Standards for Mathematics](https://www.fldoe.org/academics/standards/subject-areas/math-science/mathematics/) (current, full accountability 2024–25)
- [Florida DOE — FAST Assessments](https://www.fldoe.org/accountability/assessments/k-12-student-assessment/best/)
- Rosenshine, *Principles of Instruction* (2012); Dunlosky et al., *Improving Students' Learning* (2013); Deans for Impact, *The Science of Learning* (2015)
