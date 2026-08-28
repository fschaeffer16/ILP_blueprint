# ESE, applied: how ILP meets every student where they are

This is the applied design for the ESE track — the bridge from research
([`ese-iep-track.md`](ese-iep-track.md), [`screening-taxonomy.md`](screening-taxonomy.md)) to
build. It answers one question: **what does "meet them where they are" actually mean, in the
mechanics of this system, for a child with a disability — across the whole wide range of
disabilities?**

> **The thesis.** "Meet them where they are" has a direction. You meet a child where they are in
> order to take them somewhere — it is a *starting point and a route*, never a destination or a
> ceiling. That is also the legal standard (*Endrew F.*: appropriately ambitious progress in light
> of the child's circumstances). A system that meets a child where they are and leaves them there
> has failed them politely. ILP's job is: right entry point, right channel, right support — same
> high expectation.

---

## 1. "Where they are" is not one number — it is five axes

For a general-education student, "where they are" mostly means a readiness point on grade-level
standards. For ESE students the phrase must carry more. ILP models it as five independent axes,
because a disability can move a child on one axis and not the others — and conflating them is
exactly how current systems fail these kids:

| Axis | Question | Engine mechanism | Who controls it |
| --- | --- | --- | --- |
| **1 · Starting point** | Which module in the Learning-Objective chain are they genuinely ready for? | Baseline + daily evidence → readiness per domain → the module/prerequisite chain | Engine proposes, teacher confirms |
| **2 · Access channel** | How do they best *take in* and *show* learning? (read-aloud, visual-first, AAC/symbols, switch, speech-to-text, braille/large print, captions) | Adaptation class **access**, `fadeRule: null` — the channel changes, the content doesn't | Engine + IEP; permanent |
| **3 · Support intensity** | How much scaffolding right now? (worked examples, chunking, prompt level: full → partial → gestural → verbal → independent) | Adaptation class **scaffold**, with a fade rule — always temporary by design | Engine, fading on evidence |
| **4 · Pace, load & environment** | Session length, breaks, sensory load, predictability, extended time | Access/scaffold adaptations + delivery settings | Engine + IEP |
| **5 · The standard itself** | Grade-level benchmark, or Access Points (the ~1% with the most significant cognitive disabilities)? | **Modification lane** — a separate, human-authorized, documented state | **Humans only.** The IEP team. Never the engine. |

**The prime rule:** the engine may move a child freely on axes 1–4 — that is the accommodation
lane, and the objective stays locked (`objectiveModified: false`). Axis 5 is the only place the
standard itself changes, and the engine can *recommend* but never *apply* it. This rule is already
enforced in code: `objective_modification`-class adaptations require explicit per-student teacher
pre-authorization, and the compiler warns instead of applying them silently.

## 2. Fade what develops. Never fade what gives access.

The single most important nuance in applying the mantra — and the engine already models it:

- **Development scaffolds fade** (`fadeRule` set): a chunked prompt, a worked example, a visual
  model for a forming concept. These exist to be removed; independence is the goal, and every
  fade is evidence of growth.
- **Access accommodations do not fade** (`fadeRule: null`): a Deaf student's captions, a blind
  student's screen reader, a nonverbal student's AAC device, a dysgraphic student's speech-to-text.
  These are the child's *channel*, not a crutch. **You never fade a child's wheelchair.**

A system that treats every support as something to wean off will quietly punish disabled students
for being disabled. A system that never fades anything will quietly stop teaching. ILP does
neither, because the distinction is typed into every adaptation.

## 3. The IEP becomes a live input, not a parallel binder

Today the IEP lives in EdPlan and the daily lesson lives everywhere else — the
IEP-to-instruction disconnect the research flagged as a top pain point. In ILP the IEP plugs
directly into machinery that already exists:

1. **IEP accommodations → forced adaptations.** The compiler already supports
   `teacherConstraints.forceAdaptations` (guaranteed supports) — an imported IEP's accommodations
   become exactly that: applied on *every* assignment, not left to memory, and logged with which
   IEP accommodation each one enacts. An IEP accommodation can never be forgotten on test day,
   because the compiler carries it.
2. **IEP goals → module chains.** Each measurable annual goal decomposes into a chain of modules
   (Learning Objectives) — 3, 5, 10 of them — exactly the module system already built. Every
   module attempt writes a timestamped data point back to the goal it serves, so **progress
   monitoring becomes a byproduct of instruction** instead of a Friday-afternoon reconstruction.
3. **The baseline still runs** — the IEP says what the team knew at the last annual review; the
   baseline and daily evidence say where the child is *this week*. Both feed the same profile,
   and the teacher resolves conflicts (hypotheses stay correctable, never permanent labels).

## 4. The wide variety: the mantra applied per disability family

Same engine, same mantra — different axis emphasis per family. This is the map the build follows:

| Disability family | "Where they are" looks like… | How ILP meets them (axes) | What stays locked |
| --- | --- | --- | --- |
| **SLD — dyslexia** | Grade-level thinking trapped behind decoding | Text-to-speech/read-aloud (2, permanent while needed), decodable formats, structured-literacy reteach modules (1), extended time (4) — knowledge never gated behind decoding speed | Grade-level content objectives; reading-skill modules keep their own rigor |
| **SLD — dysgraphia** | Knows it, can't handwrite it | Speech-to-text/typing as response channel (2), reduced copying, content graded separately from mechanics (4) | What the answer must demonstrate |
| **SLD — dyscalculia** | Number sense forming; reasoning intact | Visual-first/CRA models (3, fading), manipulatives, fact supports where fluency isn't the objective (2) | The math objective and its mastery bar |
| **ADHD / executive function** | Ability intact; attention, initiation & organization are the barrier | Chunked prompts with check-ins (3, fading), movement breaks, reduced-distraction settings, shorter sessions (4), explicit checklists | Task demands and rigor |
| **Autism spectrum** | Enormous range — from grade-level+ with sensory/social needs to significant support needs | Predictable structure & previewed transitions (4), visual schedules (2), literal unambiguous language, sensory load controls, interest-anchored contexts; AAC where needed (2) | The objective; each child's own axis-1 starting point |
| **Speech / language impairment** | Comprehension or expression lags the ideas | Receptive: simplified/chunked directions, visuals, pre-taught vocabulary (2/3). Expressive: response formats that don't require spoken output; therapy goals as their own module chains | Content knowledge expectations |
| **Deaf / hard of hearing** | Fully capable; audio is the barrier | Captions, transcripts, visual-first everything, interpreter workflows (2, permanent) | Everything else |
| **Blind / low vision** | Fully capable; print is the barrier | Screen reader, braille, large print, tactile/audio descriptions of visuals (2, permanent) | Everything else |
| **Motor / DCD / dyspraxia** | Output speed & coordination, not understanding | Alternative input (switch, keyboard, voice) (2), extra time on motor tasks (4), motor steps broken down (3) | Cognitive demands |
| **Emotional / behavioral / anxiety** | Knowledge present; performance conditions collapse it | Low-stakes practice, separate settings, breaks, re-take paths (4); the module system's built-in retake *is* an anxiety accommodation | The mastery bar — reached under conditions where the child can actually show it |
| **Intellectual disability** | Learning follows the same path, at a different pace with more repetition | Axis 1 honestly placed (prerequisite modules first), more practice cycles, concrete contexts (3/4) — high expectations at the true starting point | Grade-level standards *unless* the IEP team authorizes otherwise (axis 5) |
| **Most significant cognitive disabilities (~1%)** | Access Points territory | Everything above **plus** axis 5: Access-Point modules with Essential-Understanding complexity levels — authored, tagged `_M#`, tracked identically | The documented, team-decided alternate standard — still a real standard with real mastery |
| **Nonverbal / AAC users** | Mastery is present; speech and keyboards can't carry it | Symbol/AAC selection aligned to the child's own vocabulary, switch + scanning, eye-gaze as first-class **response channels** (2) — demonstrating the *same* module as peers | Comparable mastery data on the same Learning Objectives |
| **Gifted / twice-exceptional** | Ahead on some axes, blocked on another — each masking the other | Both at once: `advanced_transfer` on the strength **and** accommodation on the disability. The 2e filter forbids strength from suppressing the support, or the support from capping the challenge | The right to be challenged *and* the right to access |

Three cross-cutting truths fall out of this table:

- **Most of ESE is axes 1–4.** The overwhelming majority of students with disabilities work on
  grade-level standards with accommodations. The engine's existing accommodation lane, extended
  with new access channels, covers them without touching the standard.
- **Axis 5 is small and sacred.** Alternate standards apply to roughly 1% of students, the
  decision belongs to the IEP team, and ILP's job is to make that lane *documented and dignified*,
  not convenient.
- **Prompt level is the missing evidence dimension.** For students with more significant needs,
  "correct" isn't enough — mastery evidence must record *independent vs. supported* and at what
  prompt level, so progress is honest and gains aren't overstated. This is the one genuinely new
  measurement concept ESE adds to the engine.

## 5. Dignity is part of the mantra

One app. An AAC user opens the **same student app** as their tablemates, sees the same today
board, posts to the same moderated channels, and their parents get the same real-time parent app
with the same acknowledge-to-clear notifications. The research found ed-tech routinely exiles
these students to separate "special" software; ILP's position is that **belonging is an
accommodation too** — the delivery adapts inside a shared world, it doesn't build a separate one.
Same standard where possible, same *platform* always.

## 6. The placement gap — evidence for the least restrictive environment

The largest failure in ESE today is not inside any classroom. It is the decision about **which
classroom** — and the thin evidence that decision runs on.

**How the gap opens.** Many children on the spectrum are identified at ages 2–4; many others slip
through — never screened, families unaware, or **misdiagnosed across the ASD/ADHD boundary in
either direction** (the two overlap heavily on attention, executive function, and regulation, and
masking hides many children, especially girls). The universal K-entry baseline is the catch-net
for the never-screened, and the taxonomy deliberately models the overlapping domains — a
social-communication + sensory-regulation cluster routes differently than an attention-only
pattern, toward *evaluation*, never assumption.

**The self-contained trap.** A nonverbal or semi-verbal child who cannot show what they know on
the usual channels is routinely presumed unable to learn grade-level content, and placed in an
ASD self-contained classroom — often alongside children whose primary need is intensive behavior
support. For the child whose need was a *communication channel*, not behavior support, two
predictable outcomes follow: they **mimic the outbursts** that visibly command the adults'
attention, or they **retreat into a shell** to get away from it all. Either way, the placement
*manufactures* the profile it assumed. The same child mainstreamed with a behavior tech, a strong
IEP, and pull-aside instruction can be the difference between an adult on the spectrum with or
without behavior patterns that follow them for life. Environment teaches — that is the entire
premise of school — and it teaches in self-contained rooms too.

**Follow the money — why the trap persists.** The self-contained default is not only an evidence
problem; it is a **funding architecture** problem. ESE dollars flow from two streams — federal
(IDEA Part B) and state — and every state sets its own criteria for how much a child generates.
The common thread: **higher-support designations generate more money.** In Florida this is
concrete and already in our research: the **Matrix of Services** rates need across five domains
into Support Levels 1–5, producing FEFP cost factors (251–255) — and a nonverbal child rated at
Level 4–5 in a self-contained ASD room generates substantially more revenue than the same child
mainstreamed with supports. Worse, **many states do not require ESE-generated dollars to be spent
on ESE** — the money lands in the general budget, so the higher funding a restrictive placement
generates doesn't even reliably buy that child services. The result is a quiet structural
incentive: the placement that harms the mis-placed child is the placement that pays the district
most, and the surplus can vanish into the general fund. Nobody has to intend any of this for it to
happen. *(State-by-state mechanics vary; verify per state before quoting — the Florida Matrix
mechanics are sourced in [`ese-iep-track.md`](ese-iep-track.md).)*

**The lever that gets a child out.** In practice, the mainstreaming question turns on one thing:
**is this child a danger to themselves or others?** If not — and the parent requests the
general-education placement — the LRE presumption plus FAPE means the district must not only
place the child but **provide and pay for whatever support the placement needs**: a trained
behavior tech for class transitions and lunch, an aide, whatever the IEP requires, at no cost to
the family. This is not theoretical. **The lived proof:** one 11th-grader in a Florida district,
on the spectrum and semi-verbal, has been mainstreamed for years with a district-funded outside
behavior tech supporting transitions between classes and lunch — never bullied, no outbursts, a
standing refutation of every assumption a self-contained placement would have made about him. The
lever exists in law. What most families lack is (a) knowing it exists, and (b) the **evidence** to
swing it. ILP supplies the evidence; the family-facing side of the platform can make sure they
know the lever exists.

**ILP's answers:**

1. **Prove what they know.** AAC-channel mastery evidence on the *same* Learning Objectives as
   peers — timestamped, per-module, prompt-level honest. The IEP-meeting conversation changes
   from "we believe he's not ready for gen-ed" to *"he mastered 14 grade-level Learning
   Objectives this quarter through his AAC device — on what evidence is a self-contained room the
   least restrictive environment?"* The platform arms the family and the team; it never makes the
   placement decision, which is and must remain the team's.
2. **Make the mainstream placement workable.** The reason districts default to self-contained is
   logistics: gen-ed teachers can't hand-build an AAC child's materials. ILP removes that excuse —
   the compiler carries the IEP into every assignment automatically, the behavior tech / support
   facilitator sees the child's plan and today board, and **pull-aside instruction is the module
   system itself**: the resource session works the same module chain as the classroom, so pull-out
   never becomes a parallel curriculum.
3. **Keep the placement defended.** Continuous per-module progress in the mainstream setting is
   the standing answer to every "maybe he'd be better off in the self-contained room"
   reconsideration. The IEP-meeting evidence packet (build step 6) includes placement-relevant
   evidence: mastery by setting, independence trend, supports actually used — **and the safety
   record**: for the child with no incidents, the documented *absence* of danger-to-self-or-others
   is half the mainstreaming lever, and ILP's evidence layer keeps it on the record, not in
   anyone's impression.
4. **Make the money visible.** ILP cannot rewrite state finance law, but it can end the opacity
   the incentive hides in. Because every delivered support is logged (which accommodations ran,
   which pull-aside module sessions happened, which behavior-tech-supported transitions occurred),
   a district using ILP can show — and a district leader can *demand* — that **the dollars a child
   generates follow that child visibly**: funding tier on one side, services actually delivered on
   the other. The same rollup that audits referral disproportionality can audit
   placement-vs-progress: a self-contained placement that generates Level-4/5 funding while
   producing flat progress data is a question the dashboard now asks out loud.

**Honest limits.** ILP cannot diagnose, cannot decide placement, cannot staff a behavior tech,
and cannot change how a state disburses or ring-fences ESE money — those are human, budget, and
legislative decisions. What it can do is destroy the evidence vacuum those decisions currently
hide in, make the inclusive option cheap enough to run that "we can't support him in gen-ed"
stops being true, and make the money's path visible enough that spending it elsewhere has to be
defended in daylight.

## 7. What this gives each role

- **Teacher:** assign once still means assign once — the compiler carries every IEP accommodation
  automatically, and per-goal progress data writes itself. The half-day-per-week of ESE paperwork
  is what this attacks.
- **Parent:** a live, plain-language view of growth between IEP meetings — including prompt-level
  honesty ("now sorting beginning sounds with only a gesture prompt") instead of quarterly
  "progressing."
- **District:** per-goal, per-module evidence that stands up under *Endrew F.*; self-audited
  referral rates against the disproportionality guardrails (3.00 risk ratio, 1% alternate cap).
- **The student:** the right door into the same room as everyone else.

## 8. Build sequence (proposed, in order)

Each step is contained, testable, and demo-able; specialist co-design remains the gate before any
of this is presented as pilot-ready.

1. **ESE profile layer** — an `IEPPlan` input (plan type IEP/504, accommodations, goals) that maps
   accommodations → forced adaptations (with the IEP linkage logged) and goals → module chains.
2. **New access-channel adaptations & patterns** — `aac_symbol_response`, `switch_scanning`,
   `speech_to_text_response`, `captions_visual_first`, `sensory_reduced_load` — all
   access/scaffold class, correct fade semantics (mostly `fadeRule: null`).
3. **Prompt-level mastery evidence** — extend outcome records with
   `independence: 'independent' | 'verbal_prompt' | 'gestural_prompt' | 'partial_physical' | 'full_support'`
   so ESE progress is honest; rollups can show independent-only vs. supported mastery.
4. **Access-Point modules (axis 5, gated)** — an alternate-standard module type carrying its
   Essential-Understanding level and the authorizing decision record; flows through the same
   `_M#` tracking and exam analysis.
5. **The showcase** — "One class. Every ability." — the ESE counterpart to the Kindergarten page:
   several students (including a nonverbal AAC user and a 2e learner) meeting the same Learning
   Objective through different channels, each computed live by the compiler; plus one
   Access-Points student showing the documented axis-5 lane.
6. **Progress export** — the per-goal evidence packet formatted for the compliance system of
   record (EdPlan/PowerSchool/Focus) and the IEP meeting.

## 9. Guardrails (standing, from the research — restated as build constraints)

- The engine **screens and recommends; humans diagnose, decide eligibility, and authorize
  modifications.** No exceptions, enforced in types.
- Every adaptation, prompt level, and modification is **timestamped, attributed, exportable** —
  ILP is the evidence layer for FAPE, not a black box.
- **Specialist co-design is a gate:** ESE teachers, SLPs, OTs, and AAC specialists shape steps
  1–5 before any classroom use; this document is the starting brief for that work, not a substitute
  for it.
- Florida fit: B.E.S.T. + Access Points/EUs via CPALMS; FSAA alignment; Matrix of Services
  awareness; EdPlan/Focus interop — **complement the compliance system, never replace it.**

*The mantra, restated as an engineering spec: five axes of "where they are," four of them free
and automatic, one of them human and sacred; scaffolds that fade, channels that don't; one shared
platform; and evidence honest enough to prove every child is actually going somewhere.*
