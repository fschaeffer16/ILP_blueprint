# St. Lucie entry strategy

How ILP enters St. Lucie County Public Schools: as an **enhancement layer** on top of the
tools the district already runs, not a rip-and-replace. Full detail is in
[`build-spec.md`](build-spec.md) §26–§28 and §47–§49; this is the strategy at a glance.

> **One-sentence pitch:** ILP converts the standards, assignments and student evidence St.
> Lucie already has into automatically individualized instruction, objective-aligned
> assessment, targeted remediation and a short teacher action plan — without requiring
> teachers to create separate lessons for every child.

## The current environment (verify in discovery)

St. Lucie publicly identifies **Canvas** (K-12 LMS), **Nearpod**, **Discovery Education**,
**IXL** and **Microsoft** tools; **Skyward** provides family access to grades and attendance;
Florida requires **FAST** progress monitoring three times a year. Public web pages establish
the environment but not configuration, adoption depth, pricing or data availability — all of
which must be confirmed directly with the district.

## Enhancement map — enter alongside, don't replace

| Current layer | What it does now | How ILP enhances it |
| --- | --- | --- |
| Canvas | Posts assignments, feedback, resources | Receives/links the teacher assignment; ILP compiles the student-specific versions and returns completion, evidence and approved grades |
| FAST | State progress monitoring | Imports permitted score/objective data as *one signal*; never treats FAST as the complete learner model |
| Skyward | SIS: grades, attendance, family access | Uses roster/identity data; exports final teacher-approved grade events |
| IXL / practice | Practice, diagnostics, analytics | Consumes useful objective evidence when licensed; fills the missing lesson-to-remediation cycle |
| Nearpod / Discovery | Interactive activities and content | May supply approved content assets; ILP selects and adapts delivery around the objective |
| Microsoft 365 | Writing, productivity, SSO | Document exchange and SSO while ILP provides objective context, rubrics and evidence |

## What St. Lucie is asked to approve — and not

**Approve:** a contained **grade 3** pilot in a few classrooms; a discovery audit of devices,
roster/SSO, Canvas workflows, FAST data availability, IXL use and privacy requirements;
**synthetic data first**; 8–12 Florida B.E.S.T.-mapped objectives across math and literacy plus
one short history/civics simulation; teacher control over lessons, adaptations, interventions
and final grades; independent evaluation before any expansion.

**Not approve:** replacement of Canvas/Skyward/FAST/identity; automated high-stakes grading; a
districtwide social network or unrestricted messaging; a new statewide curriculum; new hardware
before existing managed devices are audited; a final special-education/IEP solution.

## Success condition

> The pilot continues only if it improves objective mastery or remediation while measurably
> reducing teacher production work, with no unacceptable loss of rigor, privacy or safety.

## Discovery checklist (owners)

| Owner group | Questions to resolve |
| --- | --- |
| Curriculum | Which grade-3 objectives, pacing materials, approved sources and remediation methods anchor the pilot? |
| Assessment | What FAST/other evidence is accessible at objective level, under what terms and limits? |
| Instructional technology | How are Canvas, IXL, Nearpod, Discovery and Microsoft actually used by pilot teachers? |
| Information technology | What devices, OS versions, MDM, SSO, network filters, support and offline constraints exist? |
| Data/privacy/legal | What student data may enter the pilot, where may it be processed, what retention/vendor terms apply? |
| Teachers | Where do planning, differentiation, grading, reteaching and documentation consume the most time? |
| School leaders | Which classrooms, schedules, training windows and outcome measures are feasible? |
| Families/students | What consent, transparency, take-home, accessibility and support expectations must be met? |

## Outside resources available to utilize

The proposal does not ask the district to carry staffing or pilot costs alone. Two researched
tracks — [`staffing-pipeline.md`](staffing-pipeline.md) and
[`research-funding.md`](research-funding.md), digest at
[/staffing-and-funding.html](https://ilp-blueprint-web.vercel.app/staffing-and-funding.html) —
identify outside resources that are available now:

| Resource | What it provides |
| --- | --- |
| **FAU College of Education** | Already places student teachers in St. Lucie (15-week internships); expandable into ESE / support-facilitation placements. Its online ABA master's students need BCBA fieldwork sites — 1,500–2,000 supervised hours each — that district classrooms can supply |
| **FAU CARD (Port St. Lucie office)** | Free autism consultation and teacher/para PD — on paper; its visible footprint in local schools has been thin, so engage it only under a written deliverables agreement |
| **Indian River State College** | B.S. Exceptional Student Education and Elementary Ed with required field placements, in Fort Pierce; a candidate site for a joint grow-your-own teacher-apprenticeship application |
| **Keiser University (Port St. Lucie)** | Behavioral-health master's and psychology practicum students needing supervised hours; an accredited occupational-therapy-assistant degree whose students need clinical fieldwork placements |
| **Therapy-assistant pipelines** | Florida-licensed speech-language pathology assistants (one SLP may supervise up to two full-time) and OTAs/PTAs extend the reach of the therapists the district already employs — more hands on deck without more headcount |
| **Florida tuition programs** | UWF Para-to-Teacher and the PCOG-GYO apprenticeship pay tuition for working paras to become certified ESE teachers — at no district cost |
| **RBT grow-your-own** | A sponsored 40-hour training certifies district paras as registered behavior technicians, a role Florida schools already recognize |
| **Grant funding** | Ranked paths: ED/IES SBIR ($250K → $1M school-based pilot evaluation, paid to the platform company), Spencer Foundation research-practice partnership (up to $400K), IES/NCSER special-education research ($2M+ ceiling, watch fall 2026), OAR ($50K, autism-specific) |
| **Local funders** | Children's Services Council of St. Lucie County (school-success programs with mandatory outcome measurement), Community Foundation Martin–St. Lucie, St. Lucie Education Foundation |
| **No-competition bridges** | ESSA Tier-4 evidence flexibility (existing funds pay for an intervention by committing to evaluate it) and IDEA voluntary early-intervening funds (up to 15% of the district's allocation for supports in general education) |

The winning structure is a **triad — district + university + platform**: the university brings
the researcher, research oversight, and the intern pipeline; the district brings the classrooms
and the question; ILP brings the delivery and the data. Items flagged in the source documents
(current agreement statuses, program lists, live grant deadlines) must be confirmed directly
before any presentation names specifics.

## The ask

> Authorize a joint **discovery and prototype-validation** phase — not a districtwide
> purchase — with named St. Lucie curriculum, assessment, technology, privacy and teacher
> representatives.

## Sources (verify before any presentation)

- St. Lucie Public Schools — Instructional Technology: <https://www.stlucie.k12.fl.us/departments/curriculum/instructional-technology/>
- St. Lucie Public Schools — Digital Learning: <https://www.stlucie.k12.fl.us/digital-learning/>
- St. Lucie Public Schools — Skyward Family Access Mobile: <https://www.stlucie.k12.fl.us/parents-students/family-access-mobile/>
- Florida DOE — FAST Assessments: <https://www.fldoe.org/accountability/assessments/k-12-student-assessment/best/>
- 1EdTech — LTI: <https://www.1edtech.org/standards/lti> · OneRoster: <https://www.1edtech.org/standards/oneroster>

Public web pages establish the current environment but do not reveal configuration, adoption
depth, pricing or data availability. Verify licenses, device inventory, integrations and data
rights directly with the district before any presentation.
