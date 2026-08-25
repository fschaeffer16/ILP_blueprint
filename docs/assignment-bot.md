# The assignment-aware help bot ("Navi")

The blueprint's Slice 5 / Epic E6 is a **mode-governed, grounded** help bot: a student can ask
for help on an assignment and get coached toward understanding **without the bot ever handing
over the graded answer**. This document describes the working bot in
[`apps/web/public/navi-assignment-helper.html`](../apps/web/public/navi-assignment-helper.html)
and how to point it at any objective.

> **Try it:** open that file in a browser, or run the web app (`npm run dev --workspace @ilp/web`)
> and visit `/navi-assignment-helper.html`. Tap **Navi** in the corner and try to make it give
> you the answer.

## Why this design

The bot is a **grounded, retrieval-style engine**, not a free-form LLM. It answers only from a
knowledge base you load it with, and it **stays in its lane** — a question outside the loaded
assignment gets "that's outside this assignment" rather than a hallucinated answer. That property
is exactly what a K-12 help bot needs: no invented math, no off-curriculum tangents, and a hard
line between *coaching the idea* and *doing the work*.

The engine (matcher / definitional gate / phonetics / router) is carried over verbatim from a
production grounded-assistant build; the only ILP-specific addition is the **answer-protection
gate**. Because the engine is deterministic and KB-only, it is safe to ship to a child today,
and it slots cleanly behind the future model gateway (the same seam pattern as `ItemGenerator`
and `SubmissionGrader`): a model can *draft* KB entries for teacher approval later without
changing the runtime guardrail.

## The four guardrails

| Guardrail | How it works | Principle |
| --- | --- | --- |
| **Grounded** | Answers come only from the loaded KB / glossary. Longer, more specific keyword matches win. | Knowledge before invention |
| **In its lane** | A `hasDomainSignal` gate detects whether the question is about the assignment at all; if not, the bot declines instead of guessing. | Objective integrity |
| **Answer-protected** | An `ANSWER_SEEKING` detector fires *before* the matcher. "Just tell me the answer", "is it 1/4", "do it for me" → the bot refuses and offers a scaffold: explain the idea, a first step, or a **worked example with different numbers**. | Teacher authority · assessment is evidence |
| **Teacher-visible** | When the bot can't answer, it offers to **flag the question for the teacher** (queued in `localStorage` in the demo; a real deployment writes it to the teacher's dashboard). The teacher learns exactly where students got stuck. | Teacher authority · remediation is mandatory |

The worked-example scaffold deliberately mirrors ILP's *materially-different reassessment* idea:
the student gets a fully worked model on **other numbers** (a ribbon in 5 parts) and then applies
the same reasoning to their own figure — help without leakage.

## How the content is loaded (the "self-contained" design)

Everything the bot knows lives in a **data layer** at the top of the file; the engine below it is
never edited. To bind the bot to a different objective, you replace the data layer. The layers:

| Global | Shape | Purpose |
| --- | --- | --- |
| `window.KB_INDEX` | `{ current, modules:[{ id, title, sections:[{ id, title, topics:[{label,key}], items:[…] }] }] }` | Which objective this instance is bound to; drives the topic chips. |
| `window.KB_MODULE` | `[{ keywords:[…lowercase…], answer:"…html…" }]` | Concept coaching for **this** objective. Every answer teaches the idea with *different* numbers than the graded items. |
| `window.KB_BASE` | same shape | Cross-assignment help ("how do you work", "talk to my teacher"). |
| `window.GLOSSARY` | `[{ term, keys:[…], def }]` | Vocabulary lookups (definitional questions). |
| `window.SPEECH_DICT` | `{ "1/4":"one fourth", … }` | How the read-aloud voice pronounces fractions and terms. |
| `window.ANSWER_SEEKING` | `["just tell me","is it 1/4", …]` | Phrases that trip the answer-protection gate. |

Matching rule: **longer, more specific keywords win** (score is the summed length of matched
keywords), so a precise entry beats a generic one.

### Binding it to a new objective (worked example)

The shipped instance is bound to **grade-3 fractions, Florida B.E.S.T. MA.3.FR.1.1** (unit
fractions / naming equal parts). To retarget it — say to a reading-response objective:

1. Set `KB_INDEX.current` and the module `id`/`title` to the new objective; rewrite `sections`
   and `topics` for that objective's sub-skills.
2. Replace `KB_MODULE` with concept coaching for the new objective — remembering the rule:
   *teach the idea, never state the specific graded answer.*
3. Swap `GLOSSARY` to the new vocabulary and `SPEECH_DICT` to any terms the voice should
   pronounce specially.
4. Add the new objective's answer-seeking phrasings to `ANSWER_SEEKING`.

No engine code changes. In the product, this data layer is generated from the **same approved
lesson and source records** that already back the objective (see
[`content-governance.md`](content-governance.md)) — so the bot can only ever repeat
district-approved content, and the answer key is never in its knowledge base to begin with.

## Capabilities preserved from the source engine

Text and **microphone** input; **read-aloud** answers with a phonetics dictionary; topic chips
from the assignment index; a "where is this covered" locator; a "stuck?" triage flow; and the
forward-to-teacher queue. The look (a friendly SVG mascot, the assignment worksheet it docks
onto) is a thin skin over that engine and can be redesigned freely.

## What a production version adds

- The forward-to-teacher queue writes to the teacher command center, not `localStorage`.
- The KB is compiled from approved `LessonPlan` + `SourceRecord` content at publish time, so it
  inherits the objective's provenance and can't drift from the vetted curriculum.
- A **red-team suite** (Slice 5's second half) runs adversarial answer-extraction prompts against
  every published assignment bot as a release gate — the automated version of "try to make it
  give you the answer."
