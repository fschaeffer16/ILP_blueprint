# ESE / IEP track — design foundations

The special-education track for ILP. This is the research-backed design doc for meeting
students with disabilities **where they are, without lowering the standard** — the deliberate
next major track after the general grade-3 experience is polished. It is a *plan*, not yet
built. Geographic emphasis: U.S. federal law → Florida → St. Lucie Public Schools (SLPS).

> **Design order (unchanged):** build one strong system for every student first, then extend it
> for ESE / nonverbal / AAC learners **with special-education specialists** — consistent with
> Principle 4 (access must never hide subject knowledge; the route adapts without lowering rigor).

## The five decisions that define this track

1. **Accommodation vs. modification is the core architecture decision.** Auto-adaptation lives
   **entirely in the accommodation lane** (changes *how* a student accesses/demonstrates learning;
   the standard is unchanged). **Modifications** (changing *what* is expected) are a separate,
   human-authorized, documented state the adaptive engine may *recommend* but never silently apply.
   This is what lets ILP truthfully claim "meet them where they are without lowering the standard."
2. **The differentiator is honest, continuous, per-objective progress data** generated *as a
   byproduct of instruction* — the exact thing today's process does worst, and the thing the
   *Endrew F.* standard now legally demands.
3. **Input modality (switch / AAC / symbol) is first-class**, so nonverbal and significant-cognitive
   learners work in the same platform, on the same Learning Objectives, as their peers.
4. **In Florida, integrate — don't replace.** Model B.E.S.T. **and** Access Points / Essential
   Understandings (via CPALMS); respect FSAA and the Matrix of Services; interoperate with
   EdPlan / PowerSchool Special Programs / Focus ESE as the compliance system of record.
5. **UDL 3.0 is the native design frame** — map ILP's adaptivity axes to CAST's
   Engagement / Representation / Action-&-Expression so educators recognize the model on sight.

---

## 1. Legal framework (three wrappers, not interchangeable)

| Law | Type | Vehicle | Eligibility |
| --- | --- | --- | --- |
| **IDEA** | Education + funding statute | **IEP** | Narrow — one of 13 categories **and** needs specially designed instruction; age 3 to 22nd birthday |
| **Section 504** (Rehabilitation Act) | Civil-rights / anti-discrimination | **504 Plan** (accommodations) | Broad — any impairment substantially limiting a major life activity |
| **ADA** | Civil-rights, no funding | — | Broadest; public & private entities |

- **FAPE** (34 CFR §300.101) + the **Endrew F.** (SCOTUS 2017) standard: an IEP "reasonably calculated
  to enable a child to make progress appropriate in light of the child's circumstances" — meaningfully
  more than *de minimis*. **Honest per-objective progress evidence is the artifact that defends an IEP
  as FAPE-compliant.**
- **LRE** (34 CFR §300.114): educate with non-disabled peers to the maximum extent appropriate; a
  *continuum* (co-taught inclusion → resource → separate class → separate school), not one placement.
- **13 IDEA categories:** Autism; Deaf-blindness; Deafness; Emotional disturbance; Hearing impairment;
  Intellectual disability; Multiple disabilities; Orthopedic impairment; Other health impairment (incl.
  ADHD); Specific learning disability (incl. dyslexia); Speech/language impairment; Traumatic brain
  injury; Visual impairment. (Florida's ESE labels differ in wording.)

**Product implication:** model at least three legal wrappers (IDEA/IEP, 504, general-ed) — obligations,
paperwork, and data-retention rules differ.

## 2. The IEP process (a stateful, dated, audit-logged workflow — not a form)

1. **Child Find / Referral** — affirmative duty to locate/identify/evaluate; parental written consent
   before evaluation (often after tiered RtI/MTSS data).
2. **Evaluation & Eligibility** — full individual evaluation across all areas of suspected disability;
   team (incl. parents) confirms category *and* need for specially designed instruction.
3. **PLAAFP** (Present Levels of Academic Achievement and Functional Performance) — the narrative
   baseline; **every goal must trace to a need named here.** This is the anchor ILP's baseline maps to.
4. **Measurable annual goals (+ short-term objectives/benchmarks)** — conditions + observable behavior
   + criterion + measurement method; short-term objectives required for students on alternate assessment.
5. **Service minutes / related services / supplementary aids / assistive technology** — what, how much,
   where, by whom.
6. **Progress monitoring & reporting cadence** — IEP states method + frequency; parents get reports at
   least as often as general-ed report cards.
7. **Annual review** — at least every 12 months.
8. **Triennial re-evaluation** — at least every 3 years.
9. **Transition planning** — federal by **age 16**; **Florida requires it earlier — by the first IEP in
   effect when the student turns 14** (Rule 6A-6.03028), incl. a course of study leading to a standard
   diploma.

Each stage has consent gates, legal clocks, and required signatories. **Any ILP module data must be
attributable to a specific IEP goal and time-stamped to survive due-process scrutiny.**

## 3. Accommodations vs. modifications (the load-bearing distinction)

- **Accommodation** — changes **HOW** a student accesses content or shows learning; **standard unchanged.**
  Four categories: **presentation** (read-aloud, audio, large print, visuals), **response** (scribe,
  speech-to-text, type, AAC), **setting** (small group, reduced-distraction, seating), **timing/scheduling**
  (extended time, breaks).
- **Modification** — changes **WHAT** is expected; **standard altered** (fewer/lower-complexity objectives,
  reduced criteria, Access-Point-only targets). Can affect diploma track; must be deliberate and documented.

> Rule of thumb: *an accommodation levels the playing field without changing the game; a modification
> changes the game.*

**Product implication — the most important decision.** The adaptive engine's "adapt delivery without
lowering the standard" thesis maps **exactly onto accommodations**. Auto-adaptation (modality, pacing,
input method, scaffolds, remediation) defaults to the **accommodation** class and must prove the Learning
Objective was unchanged. **Modifications** are a separate, explicitly-flagged, human-authorized state
(which objective? whose signature? diploma-track impact?). Conflating them is both a pedagogical and a
**legal** failure mode.

## 4. Florida specifics

- **ESE (Exceptional Student Education)** — Florida's umbrella term (covers disabilities *and* gifted).
  Governed by FAC **Rule 6A-6.03028** (FAPE/IEP) and **6A-1.0943** (alternate standards). SLPS publishes
  its own **SP&P (Special Policies and Procedures)**.
- **B.E.S.T. + Access Points.** Access Points are the *alternate academic standards* for students with the
  **most significant cognitive disabilities** (for whom grade-level standards are inappropriate even with
  the full range of accommodations). Structure to model precisely:
  - ELA & Math Access Points: no tiers; carry **Essential Understandings (EUs)** at varying complexity.
  - Science / Social Studies / etc.: **three tiers — Participatory, Supported, Independent.**
  - Hosted on **CPALMS** — a machine-referenceable taxonomy ILP can import.
- **FSAA (Florida Standards Alternate Assessment)** — statewide alternate assessment on Access Points
  (ELA, Math, Science, + Social Studies/civics as applicable).
- **ESE Matrix of Services / cost factors** — funds ESE via FEFP; the IEP team rates need across **five
  domains** on **Levels 1–5**, yielding a **cost factor (251–255)**. **All ESE students at Support Levels 4
  and 5 must have a completed Matrix.** This is the money layer districts care about intensely.
- **IEP/ESE software actually used by FL districts:** **EdPlan** (Time for Ed/PCG), **PowerSchool Special
  Programs**, **Focus SIS** (ESE module). ILP should **complement, not replace** these — import goals +
  accommodations + Access-Point standards, generate defensible per-goal progress, export progress reports
  back to the system of record.

## 5. Nonverbal / AAC / significant-cognitive-disability learners

- **Who:** the ~1% on alternate standards (Access Points) and FSAA; often nonverbal/minimally verbal, may
  have significant motor involvement.
- **AAC continuum:** low-tech / symbol-based (**PECS**, core/fringe symbol boards) → high-tech
  speech-generating (**Proloquo2Go**, LAMP Words for Life, TouchChat). **Access methods:** direct touch;
  **switch access** (mechanical, sip-and-puff) with **scanning** for severe motor impairment; eye-gaze.
- **Today:** communication competence profiled (e.g., Communication Matrix); instruction targets Access
  Points/EUs with prompting hierarchies; progress is largely **teacher-collected trial/observation data** —
  labor-intensive and highly variable between raters.

**Product implication:** input modality is first-class. The engine must accept **switch/scanning and
symbol/AAC input** as valid response channels (an accommodation — objective unchanged), support
single-switch timing and scanning, and let a nonverbal student *demonstrate* mastery of an Access Point
without speech or a keyboard. Align symbol sets to the student's existing AAC vocabulary.

## 6. Progress monitoring today (and ILP's wedge)

- **Required:** monitor + report progress toward each measurable annual goal; IEP states method + frequency;
  parents get reports at least as often as report cards.
- **Measured via:** Curriculum-Based Measurement (CBM), observations, work samples, trial-by-trial data;
  best practice graphs frequent data points against a goal/aim line.
- **Reality:** data is often **subjective, inconsistently collected, and reconstructed near report-card
  deadlines**; the same information is tracked in three or four places.

**ILP's structural advantage:** objective, continuously-captured, **per-module evidence** — every attempt
is a timestamped data point tied to a specific objective and the IEP goal it serves. Progress monitoring
becomes a byproduct of instruction and an auditable graph, and can auto-draft the parent narrative. **This
is the single strongest wedge into a compliance-driven market.**

## 7. UDL 3.0 as the design frame (CAST, July 30, 2024)

Three principles aligned to brain networks — **Engagement** (the "why"), **Representation** (the "what"),
**Action & Expression** (the "how"); 3.0 restructures to **9 guidelines / 35 considerations** and adds
learner agency, joy, identity/belonging, and dismantling exclusionary barriers. UDL designs flexibility
into general instruction up front so **fewer individual accommodations are needed**; accommodations/
modifications are the individualized legal overlay on top.

**Map ILP's three adaptivity axes directly to CAST's three principles** so the design intent is legible to
educators who already speak UDL.

## 8. Real pain points in the current process (what ILP attacks)

- **Paperwork crushes instruction** — special-ed teachers spend ~0.5–1.5 days/week on forms; a primary
  driver of the staffing/morale crisis.
- **Subjective, inconsistent progress data** — hard to defend under *Endrew F.*
- **Duplication** — same data re-entered across SIS, IEP system, gradebook, data sheets.
- **One-size Access Points** — a heterogeneous population compressed into a thin band; daily instruction
  rarely adapts per student in real time.
- **IEP-to-instruction disconnect** — goals live in EdPlan; lessons live elsewhere; progress data isn't
  naturally generated by instruction.
- **Parents in the dark** — thin, jargon-heavy quarterly narratives that lag the learning.
- **AAC/nonverbal learners underserved by tooling** — most ed-tech assumes touch/keyboard/speech.
- **Accommodation/modification drift** — the line blurs; "modified" work masquerades as accommodated,
  quietly lowering standards without documentation.

## 9. Proposed ILP special-needs features

**A. IEP goals → modules mapping.** Import IEP goals + short-term objectives (EdPlan/PowerSchool/Focus) and
decompose each goal into a chain of **modules (Learning Objectives)**, each tagged to a B.E.S.T. standard or
**Access Point / Essential Understanding** (CPALMS). Every module attempt writes a data point back to the
goal it serves → progress monitoring becomes a byproduct of instruction.

**B. Accommodations engine (standard unchanged) vs. modifications ledger (standard changed).** The engine
may change modality, pacing, scaffolds, chunking, response channel, and remediation — always asserting +
logging that the objective/criterion is unchanged, stamped with which IEP accommodation it enacts. A
modification is a separate, human-authorized, documented action (which objective, by whom, when,
diploma-track impact). The engine recommends but never silently applies a modification.

**C. Multimodal / AAC / switch input as first-class response channels** — switch + scanning, symbol/AAC
selection (aligned to the student's core vocabulary), eye-gaze, speech-to-text, typing; any can demonstrate
mastery of the same objective, so a nonverbal student's data is comparable to peers' on the same LO.

**D. Honest, continuous progress monitoring + auto-reporting** — per-objective mastery curves with aim
lines; distinguish **assisted vs. independent** and **prompt level** (full physical → partial → gestural →
verbal → independent) so gains aren't overstated; auto-draft the parent narrative on the IEP cadence + a
live parent view between reports; roll up student→class→school→district on the same objective.

**E. UDL-native module authoring (CAST 3.0)** — multiple representations, expression paths, and engagement
hooks authored once, so the baseline is already accessible and fewer individual accommodations are needed.

**F. Florida/SLPS fit** — model Access Points + EUs + the 3-tier structure as a native standards layer
alongside B.E.S.T.; align mastery to FSAA; interoperate with EdPlan/PowerSchool/Focus; respect the Matrix
of Services funding context.

**G. Guardrails to keep it legal** — every adaptation, prompt level, and modification is timestamped,
attributable, and exportable — ILP becomes the **evidence layer** that proves FAPE-level meaningful progress.

## Open questions for the specialist team

- Exactly how IEP goals decompose into module chains (with an ESE specialist + a psychometrician).
- The prompt-level rubric and assisted-vs-independent capture that AAC/nonverbal progress requires.
- The CPALMS Access Points / EU import format and the FSAA alignment method.
- The EdPlan/PowerSchool/Focus integration surface (import goals & accommodations; export progress).
- Data-retention and consent handling across the three legal wrappers.

## Sources

**Federal law / IDEA / FAPE / LRE / categories**
- IDEA — About IDEA (US DoE): https://sites.ed.gov/idea/about-idea/
- FAPE, 34 CFR §300.101: https://sites.ed.gov/idea/regs/b/b/300.101 · LRE, §300.114: https://sites.ed.gov/idea/regs/b/b/300.114
- A Guide to the IEP (US DoE): https://www.ed.gov/sites/ed/files/parents/needs/speced/iepguide/iepguide.pdf
- Categories of Disability under IDEA (ERIC): https://eric.ed.gov/?id=ED572702

**504 / ADA / IDEA comparison**
- Wrightslaw — Key differences: https://www.wrightslaw.com/info/sec504.summ.rights.htm
- Understood — Which laws do what: https://www.understood.org/en/articles/at-a-glance-which-laws-do-what
- DREDF — Comparison of ADA, IDEA, §504: https://dredf.org/a-comparison-of-ada-idea-and-section-504/

**IEP process / evaluation / transition**
- LDA — Evaluation & reevaluation: https://ldaamerica.org/info/evaluating-children-who-have-been-referred-to-determine-eligibility-for-special-education-services-and-requirements-for-reevaluation/
- NYSED §200.4 — Referral→IEP→review: https://www.nysed.gov/special-education/section-2004-procedures-referral-evaluation-iep-development-placement-and-review
- Support for Families — IEP step-by-step: https://supportforfamilies.org/the-iep-process-step-by-step-evaluations-goals-and-placement/

**Accommodations vs. modifications**
- Understood: https://www.understood.org/en/articles/the-difference-between-accommodations-and-modifications
- WeAreTeachers: https://www.weareteachers.com/accommodations-vs-modifications/
- Life Skills Advocate: https://lifeskillsadvocate.com/blog/accommodations-vs-modifications-iep-504/

**Florida ESE / Access Points / FSAA / Matrix / rules**
- FLDOE — Matrix of Services (2021): https://www.fldoe.org/file/7690/2021MatrixServices.pdf
- FLDOE — Florida Alternate Assessment (FSAA): https://www.fldoe.org/accountability/assessments/k-12-student-assessment/fl-alternate-assessment.stml
- CPALMS — Access Points overview: https://www.cpalms.org/support/Access_Points_for_Students_with_Significant_Cognitive_Disabilities_Overview.aspx
- CPALMS — Access Point search: https://www.cpalms.org/public/search/AccessPoint
- Access to FLS — Access Points brochure (tiers/EUs): https://www.accesstofls.org/Classroom_resources/Publications/2022-23_access_points_brochure_English.pdf
- FLDOE — Rule 6A-6.03028 (FAPE/IEP; transition at 14): https://www.fldoe.org/core/fileparse.php/20070/urlt/15-2.pdf

**St. Lucie Public Schools (SLPS)**
- ESE department: https://www.stlucie.k12.fl.us/departments/exceptional-student-education/
- ESE Policies & Procedures (SP&P): https://www.stlucie.k12.fl.us/pdf/departments/ese/SPP.pdf
- Inclusion: https://www.stlucie.k12.fl.us/departments/exceptional-student-education/inclusion/ · Transition: https://www.stlucie.k12.fl.us/departments/exceptional-student-education/transition/

**AAC / nonverbal / assistive technology**
- AssistiveWare — Proloquo2Go: https://www.assistiveware.com/products/proloquo2go
- Communication Matrix — AAC options: https://communicationmatrix.org/Community/Posts/Content/8250
- Indiana Resource Center for Autism — AAC spectrum: https://iidc.indiana.edu/irca/articles/the-augmentative-alternative-communication-spectrum.html

**Progress monitoring**
- IRIS Center (Vanderbilt) — Monitoring & reporting progress: https://iris.peabody.vanderbilt.edu/module/iep01/cresource/q3/p09/
- Texas SPED Support — Data collection & progress monitoring: https://spedsupport.tea.texas.gov/resource-library/data-collection-and-progress-monitoring

**UDL / CAST 3.0**
- CAST — UDL Guidelines 3.0: https://udlguidelines.cast.org/ · About 3.0: https://udlguidelines.cast.org/more/about-guidelines-3-0/

**Pain points / paperwork**
- Frontline Education — How special educators spend their day: https://www.frontlineeducation.com/blog/how-special-educators-spend-work-day/
- EdWeek — "Disabled by Paperwork?": https://www.edweek.org/teaching-learning/disabled-by-paperwork/2003/05

**IEP/ESE software (FL)**
- PowerSchool Special Programs: https://www.powerschool.com/products/student-information/special-programs/
- EDPlan: https://www.edplan.com/solutions/index.html

*Prepared for ILP district discovery. Verify all figures and rule citations against current FLDOE/SLPS
publications before any formal presentation. This is a design plan, not a shipped feature.*
