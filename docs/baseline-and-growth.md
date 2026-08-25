# Baseline intake, growth, and early screening

How ILP **meets a child where they are** — fairly — and catches subtle, early signals of how
a child receives and processes information, so support starts sooner.

> **The line this holds: ILP screens; it does not diagnose.** Diagnosing a learning
> disability is a specialist-led process with legal safeguards under IDEA. ILP surfaces
> *screening indicators* and routes them to people; it never assigns a label. This is the
> MTSS/RTI universal-screening model districts already use, and it aligns with Florida's K-3
> dyslexia-screening statute (F.S. 1008.25) — which requires screening, immediate
> intervention, and immediate family notification, while still leaving diagnosis to qualified
> evaluators.

## Where the baseline comes from

Three sources, none of which is allowed to lower a child's standard:

1. **Existing district instruments, imported as one signal** — FAST (Florida's 3×/year
   progress monitor), plus i-Ready / IXL where licensed. Audited for validity, used as
   evidence; never the whole learner model, never the instructional engine.
2. **ILP's own short, age-appropriate baseline** — calibrated to avoid over-testing young
   children: K–1 game-like tasks + structured teacher observation (no single long diagnostic);
   grades 2–3 independent tablet tasks with visual/oral/written/hands-on response; grades 4–5
   multi-step reasoning, written explanation, source use, and transfer.
3. **Daily classroom evidence** — continuously refines the profile between the start- and
   end-of-year baselines.

**No major decision rests on one session.** The screener requires evidence across at least two
sessions before it will emit any indicator (`minSessions`, default 2).

## What it screens for — how a child receives and processes information

| Domain | What it signals | Maps to |
| --- | --- | --- |
| Phonological awareness | Reading / dyslexia-characteristic indicator | reading support |
| Letter–sound decoding | Reading / dyslexia-characteristic indicator | reading support |
| Rapid naming (RAN) | Reading / dyslexia-characteristic indicator | reading support |
| Oral language | Listening-comprehension indicator | language support |
| Working memory | Processing indicator | pacing, chunking, extra time |
| Processing speed | Processing indicator | pacing, extra time |
| Sustained attention | Attention / focus indicator | task segmentation |
| Number sense | Math / dyscalculia-characteristic indicator | math support |
| Visual-motor / handwriting | Fine-motor indicator | response method, speech-to-text |
| Oral-vs-written gap | Expression-channel indicator | planning scaffold, speech-to-text |
| Performance conditions | Test-conditions indicator | timing, presentation |

Reading-processing signals (the first three) are the dyslexia-characteristic predictors
Florida's statute is written around; a notable or emerging signal there triggers immediate
classroom/targeted intervention **and family notification**.

## From signal to action — always through a person

Each indicator (`ScreeningIndicator`) carries a **signal strength** (monitor / emerging /
notable), a **confidence**, its **evidence**, plain language, and the **next steps** it routes
to — and two structural guarantees: `isDiagnosis: false` and `requiresHumanReview: true`. The
type has no field in which a diagnosis could be stored.

| Signal | Routes to |
| --- | --- |
| Monitor | Keep monitoring · classroom support |
| Emerging | Classroom support · targeted intervention · (reading: notify family) |
| Notable | Targeted intervention · **specialist screening referral** · **notify family** |

## Fairness — meet them where they are, then strengthen

The baseline sets a child's **starting point and supports, never a lower standard**. Each
below-ceiling domain seeds an ILP hypothesis into the learner model the compiler already uses,
so the child's *first* lessons start with the right supports. Supports are **access** (level
the field, rigor unchanged) and **development** (strengthen the underlying skill), and they
carry fade rules so they're removed as independence grows. A strength stays a strength — the
screener never labels the whole child (in the sample profile, strong number sense produces no
indicator even as reading signals do).

## Build status

- `buildBaselineProfile` and the screening model are **built and tested** in `@ilp/core`
  (`baseline.ts`), including the no-single-session guard, the no-diagnosis guarantees, human
  routing, family notification, and learner-model seeding.
- The `/baseline` screen in `@ilp/web` shows the intake and the routed signals.
- **Not yet built:** the actual baseline *task delivery* (the game-like/tablet tasks
  themselves) and the FAST/i-Ready import adapters.

## Sources

- [National Center on Improving Literacy — screening & assessment](https://improvingliteracy.org/category/literacy-screening-and-assessment/) — "Screening does not diagnose."
- [Florida Statutes — Chapter 1008.25 (2024)](https://www.flsenate.gov/laws/statutes/2024/1008.25) — K-3 screening, immediate intervention, family notification.
- [CAST — UDL Guidelines 3.0](https://udlguidelines.cast.org/) (multiple means of representation, engagement, action).
- MTSS/RTI universal screening (e.g., Response to Intervention frameworks; state universal-literacy/dyslexia screener guides).
