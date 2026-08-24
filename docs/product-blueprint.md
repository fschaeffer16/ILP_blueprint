# ILP Product Blueprint

**Individualized Lesson Planning — Product Blueprint and Pilot Build Specification**

*A teacher-controlled, AI-powered instructional operating system for K-12 education.*

> **Guiding principle:** Common objectives. Individual starting points. Adaptive pathways.
> Equivalent evidence of mastery. Teachers remain in command.

> **Product thesis:** The teacher assigns once. The system individualizes instruction,
> assessment and remediation automatically while preserving the learning objective, mastery
> requirement and teacher authority.

| Document | Value |
| --- | --- |
| Version | 0.1 — Foundational build blueprint (carried forward into v0.2) |
| Date | August 24, 2026 |
| Initial market | Elementary public education; St. Lucie County, Florida pilot pathway |
| Working definition | ILP means Individualized Lesson Planning |
| Status | Ready for product decomposition, prototyping and validation |

---

## Contents

1. Executive summary
2. Product definition and boundaries
3. Non-negotiable instructional principles
4. Users, authority and division of labor
5. The connected instructional cycle
6. The ILP learner model
7. Baseline and growth assessment system
8. Objective graph and living curriculum
9. Teacher command center
10. Student application and assignment delivery
11. Embedded assignment bot
12. Assessment, grading and teacher approval
13. Remediation and the 75% rule
14. Branching simulations and problem-solving development
15. Verified student collaboration network
16. Dedicated managed tablet
17. Content accuracy and editorial governance
18. System architecture and core data entities
19. Privacy, safety and AI governance
20. First buildable product
21. Pilot and evidence plan
22. St. Lucie entry strategy
23. Competitive position and defensibility
24. Build sequence and acceptance criteria
25. Open decisions and research backlog
- Appendix A. Requirement catalog
- Appendix B. Source notes

---

## 1. Executive summary

ILP is not an online school, digital textbook, generic chatbot, lesson-plan generator or
replacement for teachers. It is an instructional operating system that connects curriculum,
baseline evidence, individualized lesson delivery, assessment, teacher-reviewed grading,
remediation, reassessment and longitudinal growth around explicit learning objectives.

The core problem is not a lack of educational applications. Schools already use
learning-management systems, adaptive practice programs, state assessments, publisher
platforms and communication tools. The problem is fragmentation: teachers must connect
those pieces manually while also teaching, grading and intervening with students.

> **Outcome:** Return teacher time to students while giving each child a route to mastery
> based on current strengths, weaknesses and demonstrated progress.

### What makes the model distinct

- A living ILP profile is created from formal baselines and continuously refined by real classroom evidence.
- The teacher assigns one objective; the system generates appropriate lesson and assessment versions for every student.
- The learning objective, essential knowledge, reasoning demand and mastery threshold remain visible and controlled.
- Every failed objective has connected remediation, delivered through a materially different approach, followed by reassessment.
- AI performs first-pass analysis and grading, shows its evidence and flags uncertainty; the teacher issues the final grade.
- Branching simulations measure and develop problem-solving over time, including recovery after unintended consequences.
- A verified district-first student network allows academic collaboration, homework help and safe social participation.
- A dedicated managed tablet provides one protected learning environment at school and at home.

### Immediate build recommendation

Build a narrow but complete vertical slice before attempting a statewide curriculum. The
first product must prove the connected cycle with one elementary grade band, a small
objective set and real teacher workflows. It should demonstrate automatic
individualization, equivalent assessment, teacher-reviewed grading, remediation, an
assignment-aware bot, one branching simulation and a district-contained collaboration
thread.

---

## 2. Product definition and boundaries

### Initial population

The first build addresses general-education elementary students, including common learning
barriers such as reading difficulty, dyslexia indicators and test anxiety. Formal IEP
integration, significant disabilities, AAC and students with severe learning disabilities
are important later phases and must not be treated as a superficial extension of the
general-education model.

### Non-goals for the first release

- Replacing every Florida curriculum and textbook immediately.
- Launching an unrestricted statewide or international student network.
- Making high-stakes disability determinations or medical diagnoses.
- Issuing final grades without teacher approval.
- Building custom tablet hardware before the instructional model is proven.
- Attempting every grade, subject and assessment type in the first pilot.

---

## 3. Non-negotiable instructional principles

| ID | Principle | Requirement |
| --- | --- | --- |
| P1 | Teacher authority | AI creates, adapts, analyzes and recommends. Teachers teach, intervene, correct and decide. |
| P2 | Objective integrity | Every lesson, activity, question, rubric criterion, remediation and reassessment traces to a learning objective. |
| P3 | Adaptive route, visible rigor | The route may change. Any change to the actual objective or rigor must be explicit and teacher-approved. |
| P4 | Access plus development | Do not let an unrelated weakness hide subject knowledge; also strengthen that weakness over time instead of permanently routing around it. |
| P5 | Knowledge before unsupported opinion | Teach facts, chronology, context and competing evidence before asking students to evaluate or propose alternatives. |
| P6 | Remediation is mandatory | No failed objective becomes a dead-end grade. The next instructional action is part of the objective definition. |
| P7 | Assessment is evidence | A score must show what the student demonstrated, what support was used and where judgment remains. |
| P8 | No ideological advocacy | Content distinguishes documented fact, inference, interpretation and unresolved disagreement without demanding political or identity-based conformity. |
| P9 | Technology must serve learning | The tablet coordinates instruction, collaboration and evidence; it also directs students into discussion, experiments, handwriting and physical work. |
| P10 | No manipulative engagement | The student network rewards helpfulness, accuracy and constructive participation rather than outrage, follower counts or addictive infinite feeds. |

---

## 4. Users, authority and division of labor

| Role | Primary authority | System support |
| --- | --- | --- |
| Teacher | Objectives, lesson approval, intervention, final grades and consequential decisions | Generation, differentiation, first-pass analysis, grouping and prepared materials |
| Student | Own reasoning, responses, revisions and requests for help | Accessible instruction, hints, feedback, collaboration and mastery evidence |
| Parent/guardian | Awareness, support and appropriate consent | Plain-language growth summaries and safety controls |
| School/district | Curriculum policy, rosters, security, moderation policy and implementation | Dashboards, standards mapping, audit logs and outcome reporting |
| Curriculum/editorial team | Source selection, content approval and correction | Source comparison, contradiction detection and revision workflow |
| AI system | No independent institutional authority | Production, adaptation, analysis, simulation and recommendations within approved boundaries |

> **Division-of-labor rule:** The system handles instructional logistics. The teacher
> handles human learning and professional judgment.

---

## 5. The connected instructional cycle

Every subject uses the same traceable chain:

1. Standard or competency
2. Prerequisites
3. Learning objective
4. Instruction
5. Practice
6. Assessment
7. Teacher-reviewed grading
8. Diagnosis
9. Remediation
10. Reassessment
11. Mastery
12. Next objective

### Traceability requirements

- No lesson without a named objective and prerequisite map.
- No activity without an instructional purpose.
- No assessment item without evidence that the required knowledge or reasoning was taught and practiced.
- No AI score without criterion-level evidence and confidence information.
- No remediation that simply repeats the failed lesson in different colors.
- No advancement that hides a critical prerequisite gap.

---

## 6. The ILP learner model

The ILP is an evolving evidence model, not a permanent label. It represents the student's
current demonstrated readiness, barriers, effective supports and developmental targets.
Every inference must identify its evidence, confidence and review date.

### Required adaptation classifications

- **Access adaptation:** objective and rigor remain unchanged.
- **Instructional scaffold:** temporary support intended to develop independence.
- **Difficulty adjustment:** challenge changes within the objective based on readiness.
- **Objective modification:** expected learning changes and requires explicit teacher authorization.

### Evidence domains

| Domain | Examples of evidence | Permitted instructional effect |
| --- | --- | --- |
| Objective mastery | Correctness, explanation, transfer and retention | Starting point, practice selection and readiness to advance |
| Prerequisite knowledge | Baseline items, recurring error patterns and teacher observations | Embedded review or prerequisite mini-lesson |
| Language access | Reading load, vocabulary response and listening-versus-reading differences | Vocabulary preview, segmentation, read-aloud or gradual scaffold fading |
| Mathematical reasoning | Strategy choice, intermediate work and conceptual explanation | Visual models, alternative methods and application complexity |
| Written expression | Organization, evidence use, mechanics and oral-versus-written understanding | Planning scaffold, speech-to-text or targeted writing development |
| Problem-solving | Problem definition, constraints, consequences, revision and recovery | Simulation complexity, hints, stakeholder count and ambiguity |
| Assessment conditions | Time pressure, item format and inconsistency with classroom work | Presentation changes or teacher review; never automatic lowering of rigor |
| Effective supports | Measured improvement after a specific scaffold | Retain, modify or gradually fade the support |

> **Prohibition:** The system may not silently give one student an easier standard and
> report the result as equivalent mastery.

---

## 7. Baseline and growth assessment system

Formal evaluations occur near the beginning and end of each school year. Daily evidence
updates the profile between those points. No major programming decision should rely on one
test session alone.

| Evidence source | Purpose | Output |
| --- | --- | --- |
| Start-of-year baseline | Establish knowledge, prerequisites, strengths, barriers and response patterns | Initial ILP profile and confidence levels |
| Yearlong evidence | Refine the profile using authentic performance and intervention results | Continuous adaptation, grouping and scaffold fading |
| End-of-year baseline | Verify growth, retention, transfer and readiness for the next sequence | Verified growth profile passed to the next year |

### Elementary design

- **Kindergarten and grade 1:** short game-like tasks plus structured teacher observation; no single long diagnostic.
- **Grades 2-3:** increasingly independent tablet interaction, with visual, oral, written and hands-on response opportunities.
- **Grades 4-5:** multi-step reasoning, written explanation, source use, collaboration and transfer into unfamiliar situations.

### FAST, i-Ready and existing tools

Before implementation, audit FAST, i-Ready, IXL and other district systems for validity,
useful data, licensing and integration. Existing data may contribute to the ILP but must
not define it. State assessment remains an external accountability measure; it is not the
instructional engine.

---

## 8. Objective graph and living curriculum

The curriculum is stored as a governed objective graph rather than a sequence of static
textbook chapters. Each objective is a versioned object with prerequisites, essential
knowledge, common misconceptions, approved sources, lesson patterns, assessment evidence,
remediation strategies and successor objectives.

| Objective object field | Required content |
| --- | --- |
| Identity | Objective ID, subject, grade band, jurisdictional standards and version |
| Learning demand | Essential knowledge, reasoning level and mastery definition |
| Dependencies | Prerequisites, connected objectives and future use |
| Instruction | Multiple approved explanation methods, examples, activities and accessibility options |
| Assessment | Item specifications, rubric criteria, equivalence parameters and prohibited shortcuts |
| Misconceptions | Likely errors, diagnostic indicators and clarifying examples |
| Remediation | Materially different lesson patterns and reassessment specifications |
| Sources | Primary and authoritative secondary sources, provenance and review status |
| Governance | Approver, revision history, dispute record and next review date |

### Curriculum modernization

Foundational knowledge remains essential, but objectives should connect knowledge to
application, reasoning and transfer. History begins with full chronology and context,
including racial, cultural, economic and political development. Political systems such as
monarchy, democracy, autocracy, communism and socialism are taught through definitions,
historical development, implementations, evidence and consequences rather than slogans.

---

## 9. Teacher command center

The teacher home screen operates like an automatically generated instructional workboard.
Unlike project-management software, the teacher does not create and maintain hundreds of
student subtasks. The system discovers needs, prepares materials and presents a short
actionable checklist.

### Default views

- **Today:** the smallest set of actions with the highest instructional impact.
- **My class:** current status, strengths, risks and next action for each student.
- **Objectives:** mastered, developing, unassessed and in remediation.
- **Intervention groups:** temporary groups based on present evidence, never fixed ability tracks.
- **Grading review:** ready approvals and flagged submissions.
- **Lesson quality:** classwide patterns suggesting instructional failure.
- **Growth:** baseline-to-current and baseline-to-end-of-year development.
- **Approvals:** consequential AI recommendations awaiting teacher judgment.

### Priority cards

| Priority | Card | Required contents |
| --- | --- | --- |
| Urgent | Classwide failure | Affected objective, evidence, suspended grade, lesson/test audit and prepared reteach |
| High | Individual or small group | Barrier, evidence, effective prior approach, recommended interaction and materials |
| Review | Assessment integrity | Ambiguity, misalignment, answer-key conflict or abnormal item performance |
| Approval | Grading | AI recommendation, criterion evidence, confidence and teacher controls |
| Enrichment | Ready to advance | Mastery evidence and advanced transfer activity |

---

## 10. Student application and assignment delivery

The student sees one coherent application rather than separate logins for lessons, quizzes,
homework, simulations and collaboration. The teacher assigns the objective once. The
delivery engine reads each ILP, chooses approved adaptations and ships the correct version
to the student's tablet.

### Locked across all versions

- Learning objective
- Essential subject knowledge
- Required reasoning
- Mastery definition and threshold
- Academic-integrity rules
- Traceability between instruction and assessment

### May adapt automatically

- Starting point and sequence
- Vocabulary preparation and reading load unrelated to the objective
- Visual, oral and written supports
- Examples and context
- Modeling, chunk size and pacing
- Practice quantity and feedback timing
- Question presentation and order
- Response method and time structure
- Scaffolding and remediation strategy

### Assignment package (student experience)

| Component | Student experience |
| --- | --- |
| Objective preview | What the student will know or be able to do and why it matters |
| Adaptive lesson | Approved structure selected from the current ILP |
| Practice | Progressive tasks with feedback and scaffold control |
| Collaboration window | Teacher-authorized peer discussion tied to the objective |
| Mastery task | Equivalent evidence requirement appropriate to the objective |
| Reflection | What changed, what remains difficult and what strategy worked |

---

## 11. Embedded assignment bot

Every lesson and homework assignment includes an assignment-aware bot. It knows the
objective, student version, prerequisites, approved sources, teacher rules and permitted
level of assistance. It does not require the student to explain the assignment to a generic
chatbot.

| Mode | Permitted behavior | Prohibited behavior |
| --- | --- | --- |
| Lesson | Explain, model, ask questions, provide examples and reteach | Completing the student's required demonstration |
| Homework | Clarify, hint, break into steps and provide parallel examples | Supplying the assigned answer or writing the paper |
| Open-network project | Support research and peer collaboration with source checks | Inventing sources or disguising copied work |
| Quiz | Clarify directions only unless teacher configures otherwise | Revealing content answers |
| Exam | Only approved accessibility functions | Tutoring, hints or answer generation |

### Bot-to-ILP evidence rule

Requests for help never reduce a grade. The system records what support was requested, what
explanation worked and whether the student later demonstrated independent mastery. Teachers
receive a concise pattern summary, not a transcript dump.

---

## 12. Assessment, grading and teacher approval

Assessments must measure the stated objective while minimizing irrelevant cognitive load.
Different versions may vary in presentation, context and response method only when
equivalence can be defended. High-stakes use requires psychometric validation, item
calibration and bias review.

### Written work workflow

1. Teacher selects or approves the objective-aligned rubric.
2. AI reviews the original submission against each criterion.
3. AI recommends criterion scores and identifies exact supporting evidence.
4. AI flags factual errors, unsupported reasoning, uncertainty and judgment-dependent issues.
5. Teacher accepts, modifies or rejects recommendations.
6. Only the teacher releases the final grade and feedback.
7. Teacher corrections improve future recommendations without silently rewriting history.

### Assessment integrity checks

- Every item traces to taught and practiced material.
- Ambiguous wording, multiple valid answers and answer-key conflicts are flagged.
- Alternative valid mathematical methods receive review.
- Polished writing is not confused with factual or conceptual mastery.
- Mechanics weighting is teacher-controlled and objective-dependent.
- AI-writing detection never independently determines cheating or a grade.

---

## 13. Remediation and the 75% rule

1. Suspend the affected grade section.
2. Audit item clarity, alignment, difficulty and answer logic.
3. Examine whether the objective was taught and practiced sufficiently.
4. Identify the shared misconception or missing prerequisite.
5. Generate a materially different lesson and teacher-ready materials.
6. Deliver remediation with teacher control.
7. Create a new equivalent assessment.
8. Grade the valid reassessment after teacher review.
9. Update the lesson and item bank so the failure is not repeated.

If the failure is isolated, invalidate only the affected section. If the assessment is
broadly defective, invalidate the complete assessment. Thresholds below 75% may still
trigger review based on item statistics, teacher judgment or severity.

> **Formal rule:** If 75% of a class misses the same question group or objective, presume
> instructional or assessment failure before presuming simultaneous student failure.

---

## 14. Branching simulations and problem-solving development

Simulations turn history, mathematics, science and civics into decision laboratories.
Students first establish facts and constraints, then propose a solution. The system
simulates consequences, pauses at critical points and returns control to the student.

1. Establish facts and chronology
2. Identify the problem and available evidence
3. Recognize constraints and stakeholders
4. Choose or design a solution
5. Simulate first- and second-order consequences
6. Pause at a critical development
7. Maintain, revise or abandon the plan
8. Defend the decision with evidence
9. Transfer the reasoning to a new problem

### Longitudinal problem-solving dimensions

| Dimension | What the system observes |
| --- | --- |
| Problem definition | Whether the student addresses the actual problem rather than a symptom |
| Evidence use | Selection, verification and application of relevant information |
| Constraint recognition | Law, resources, time, technology, culture and incomplete information |
| Consequence analysis | Direct, indirect and delayed effects |
| Stakeholder awareness | Who benefits, who bears costs and whose perspective is missing |
| Revision | Response to contradictory evidence and changing conditions |
| Recovery | Ability to diagnose failure and repair a viable plan |
| Abandonment judgment | Recognition that a plan cannot or should not be rescued |
| Transfer | Application of the underlying reasoning in another domain |

---

## 15. Verified student collaboration network

The network begins inside a district, expands regionally and statewide only after safety
and learning outcomes are proven, and later supports approved national or international
partnerships. Students can ask for help, compare simulation outcomes, collaborate on
projects, explain concepts and participate in age-appropriate social spaces.

### Instructional integration

- Every assignment thread carries the learning objective and teacher collaboration rules.
- The system distinguishes explanation and contribution from answer dumping.
- A short independent mastery check follows collaboration when required.
- Helpful, accurate and constructive contributions are recognized; popularity is not the currency.
- Teacher summaries identify common questions and productive peer explanations.

### Safety requirements

- Verified roster identities with age- and grade-banded spaces.
- No advertising, public follower counts, location sharing or disappearing messages.
- Restricted direct messaging based on age and district policy.
- AI-assisted moderation with trained human escalation and complete incident audit trails.
- Reporting, blocking and emergency escalation for bullying, exploitation, threats and credible self-harm concerns.
- No unrestricted adult access and no public indexing of student content.

---

## 16. Dedicated managed tablet

The intended endpoint is a school-owned, take-home, stylus-capable tablet operating as a
dedicated educational appliance. It boots into the ILP environment and cannot be converted
into a consumer-entertainment device by the student.

For the pilot, use existing managed iPads or equivalent tablets. A national Apple
partnership is a scale strategy, not a dependency for proving the instructional system.

| Capability | Requirement |
| --- | --- |
| Input | Touch, finger handwriting, supported stylus/Apple Pencil and speech-to-text |
| Output | Readable text, diagrams, interactive media, text-to-speech and accessible audio |
| Management | Apple School Manager or equivalent MDM, supervision and single-app or allow-listed mode |
| Restrictions | No App Store, public social media, unrestricted browser, personal email, consumer games or unmanaged notifications |
| Offline operation | Assigned content downloads at school and synchronizes when connectivity returns |
| Durability | Rugged case, battery-health standard, repair process and replacement pool |
| Procurement | Evaluate capable refurbished iPads and a strategic Apple education-renewal partnership |

---

## 17. Content accuracy and editorial governance

The curriculum must remain in the middle lane by avoiding unsupported extreme
interpretations from either side. "Middle" does not mean splitting every claim in half or
hiding moral consequences. It means presenting the full documented record, distinguishing
evidence from interpretation and allowing students to reason without being required to
adopt an approved political conclusion.

### Editorial standard

- Use primary sources where appropriate and authoritative secondary scholarship for context.
- Teach chronology, causes, choices, constraints, consequences and areas of legitimate scholarly disagreement.
- Include Black, white, immigrant, Indigenous and global histories as part of the full record rather than isolated commemorative units.
- Teach democracy, monarchy, autocracy, communism and socialism through definitions, historical cases, variations and outcomes.
- Mark statements as documented fact, inference, interpretation or disputed claim.
- Expose sources, revision history and editorial decisions to authorized reviewers.
- Correct verified errors immediately while preserving the audit trail.
- Do not use the platform to advocate contemporary partisan or identity positions.

---

## 18. System architecture and core data entities

The architecture should be modular. A district may initially integrate ILP with its SIS and
LMS while the ILP platform progressively absorbs more of the instructional stack.

### Services

| Service | Responsibility |
| --- | --- |
| Identity and roster | District SSO, roles, classes, guardians and verified student access |
| Objective graph | Standards mapping, prerequisites, mastery definitions and versioning |
| Content repository | Approved lessons, sources, media, rubrics, items and remediation patterns |
| Learner-model service | ILP evidence, confidence, supports, growth and adaptation history |
| Assignment compiler | Teacher intent plus objective plus ILP converted into student versions |
| Assessment engine | Item selection, equivalence controls, rubrics and reassessment |
| AI orchestration | Grounded generation, tutoring, grading recommendations and simulation |
| Teacher command center | Priorities, approvals, groups, quality alerts and reports |
| Student application | Lessons, writing, assessment, simulations, bot and collaboration |
| Network and moderation | Verified spaces, safety controls, academic-integrity checks and escalation |
| Analytics and audit | Traceability, model decisions, changes, outcomes and compliance evidence |
| Device management integration | Enrollment, application restrictions, remote support and loss response |

### Core entities

Student, Teacher, Class, Objective, Prerequisite relationship, Learner evidence event, ILP
hypothesis, Adaptation, Lesson version, Assignment, Assessment specification, Assessment
item, Submission, Rubric, AI recommendation, Teacher decision, Misconception, Remediation
plan, Reassessment, Simulation decision, Collaboration contribution, Moderation event,
Source record, Curriculum version.

See [`data-model.md`](data-model.md) for the field-level MVP model and [`../schemas/`](../schemas/)
for machine-readable definitions.

---

## 19. Privacy, safety and AI governance

The system will contain sensitive longitudinal information about children. Privacy and
safety are product architecture, not paperwork added before procurement.

- Comply with FERPA, COPPA, CIPA, applicable Florida student-data requirements and district policy after qualified legal review.
- Use the minimum data necessary; separate identity from analytic processing where practical.
- Do not train external general-purpose models on student work.
- Encrypt data in transit and at rest; use strict role-based access and district tenancy boundaries.
- Maintain immutable audit records for AI recommendations, teacher overrides, grade release and curriculum changes.
- Provide deletion, correction, retention and parent-access procedures appropriate to law and policy.
- Test scoring consistency, disparate error rates and adaptation effects across student groups.
- Prevent the learner model from becoming a permanent label or unauthorized disciplinary profile.
- Require human escalation for safety incidents and consequential academic decisions.
- Run red-team testing for prompt injection, answer leakage, fabricated sources, bullying workarounds and adult impersonation.

---

## 20. First buildable product

> **Vertical slice:** Prove the complete learning cycle in one elementary grade band before
> expanding content breadth.

### Recommended prototype scope

| Area | First implementation |
| --- | --- |
| Grade band | Grade 3 as the first independent-use validation point; design patterns reusable downward into K-2 |
| Subjects | One mathematics unit, one evidence-based reading/writing unit and one short history/civics simulation |
| Objectives | Approximately 8-12 tightly mapped objectives with prerequisites and remediation |
| Learner profiles | Synthetic student profiles first, followed by consented pilot baseline data |
| Adaptations | Core, vocabulary-supported, visual-first, guided-practice and advanced-transfer patterns |
| Assessment | Objective-aligned quiz items plus one written response; teacher approval required |
| Bot | Lesson and homework modes with grounded sources and answer-protection rules |
| Simulation | One branching community-resource or historical decision scenario with critical pauses |
| Network | District-contained assignment discussion thread; no direct messaging in the first release |
| Teacher dashboard | Assign once, review generated group summary, approve grades and act on interventions |
| Device | Managed iPads/tablets already available for pilot use |

### Do not build first

- A custom hardware device or national Apple procurement program.
- Every grade and subject.
- Open-ended nationwide student social networking.
- Automated high-stakes final grading.
- A complete replacement for district SIS, LMS and state reporting.
- Full IEP/AAC/severe-disability functionality without specialist-led design.

---

## 21. Pilot and evidence plan

The first district pilot should compare ILP-supported instruction with similar conventional
classrooms while protecting teachers from extra documentation burden. The system should
collect necessary evidence automatically.

### Pilot decision gates

1. Technical feasibility with synthetic data and teacher review.
2. Content and assessment review by subject experts and psychometric advisors.
3. Privacy, security and district legal approval.
4. Small classroom usability pilot without high-stakes grading.
5. Controlled instructional pilot with predefined outcome measures.
6. Independent evaluation before broader district expansion.

### Outcome measures

| Outcome | Primary measure |
| --- | --- |
| Objective mastery | Percentage mastering each objective and time to mastery |
| Growth | Beginning-to-end comparable baseline performance |
| Retention | Delayed checks on previously mastered objectives |
| Transfer | Performance on unfamiliar applications of the same concept |
| Remediation | Success rate after a different lesson and reassessment |
| Assessment validity | Equivalence, item behavior, teacher overrides and subgroup consistency |
| Problem-solving | Growth across defined simulation dimensions |
| Teacher workload | Planning, grading and documentation time before versus during pilot |
| Teacher time with students | Direct instruction and intervention minutes |
| Engagement | Completion, voluntary return, help-seeking and productive collaboration |
| External performance | FAST or other approved external measures used as validation, not as the sole outcome |
| Safety | Moderation events, false positives, response time and incident resolution |

---

## 22. St. Lucie entry strategy

St. Lucie publicly identifies Canvas, IXL, Nearpod, Discovery Education and Microsoft tools
in its instructional technology environment; FAST and Skyward supply accountability and
student-record functions. The exact use of i-Ready, Renaissance/Star and other products
should be confirmed during district discovery. ILP should enter as the layer that connects
available evidence to prepared instructional action.

### Initial district proposition

1. Meet with curriculum, elementary instruction, assessment, instructional technology, data privacy and classroom teacher representatives.
2. Audit actual St. Lucie use of FAST, i-Ready, IXL, Canvas and available student devices.
3. Select one grade, a small number of teachers and a constrained objective set.
4. Map the objectives to Florida B.E.S.T. standards without allowing the state test to dictate instruction.
5. Use managed existing tablets for the first pilot.
6. Define evaluation measures and data access before implementation.
7. Publish results, limitations and teacher feedback before expansion.

> **Pitch:** Do not ask St. Lucie to discard its current systems on day one. Offer a
> contained elementary pilot that imports useful evidence, adds the missing individualized
> cycle and proves whether outcomes and teacher time improve.

See [`st-lucie-entry.md`](st-lucie-entry.md) for the full enhancement map and discovery checklist.

---

## 23. Competitive position and defensibility

No single feature is a durable advantage. SchoolAI, Kira, IXL, DreamBox, MagicSchool and
Brainly already cover important pieces. The advantage must come from the validated
connection among learner modeling, objective integrity, equivalent assessment,
remediation, problem-solving and teacher workflow.

| Competitive layer | ILP differentiation target |
| --- | --- |
| Teacher AI tools | Automatically connected production and action rather than a menu of generators |
| Adaptive practice | Full lesson-to-reassessment cycle across subjects rather than recommended drills |
| AI learning spaces | Persistent ILP evidence and objective-governed delivery across the school year |
| Assessment platforms | Equivalent individualized evidence plus transparent teacher-reviewed grading |
| Homework communities | Verified district roster, assignment context and independent mastery verification |
| Textbook/LMS stack | Living sourced curriculum and one coherent instructional environment |

### The defensible moat

- Validated objective and prerequisite graph.
- Longitudinal learner model with transparent adaptation evidence.
- Psychometrically defensible equivalent-assessment engine.
- Automatic remediation and lesson-quality feedback loop.
- Longitudinal problem-solving measurement framework.
- Governed source-backed curriculum corpus and editorial institution.
- District implementation evidence demonstrating improved learning and reduced teacher workload.

---

## 24. Build sequence and acceptance criteria

### Recommended implementation order

1. Define the objective, prerequisite and source schemas.
2. Define learner-evidence events, ILP hypotheses, confidence and adaptation records.
3. Build teacher, class, roster and synthetic student-profile management.
4. Build the assignment compiler using teacher intent, objective and ILP.
5. Build the student lesson player with touch, handwriting and speech-to-text hooks.
6. Add grounded assignment-bot modes and teacher assistance controls.
7. Build objective-aligned assessment specifications and submission capture.
8. Add AI grading recommendations, evidence display and teacher final approval.
9. Build misconception detection, remediation generation and reassessment.
10. Add the 75% classwide audit workflow.
11. Build the teacher priority board and temporary instructional groups.
12. Add one branching simulation with problem-solving event capture.
13. Add district-contained assignment discussion and moderation.
14. Integrate SSO, roster import, audit logging and managed-device deployment.
15. Conduct content, security, psychometric and classroom usability validation.

### MVP acceptance criteria

See [`acceptance-criteria.md`](acceptance-criteria.md) for AC-01 through AC-14.

---

## 25. Open decisions and research backlog

| Priority | Decision or research question |
| --- | --- |
| Immediate | Select the exact grade 3 objective set and content reviewers for the vertical slice. |
| Immediate | Audit FAST, i-Ready, IXL and St. Lucie device availability, licensing and accessible data. |
| Immediate | Choose the first AI model architecture, grounding method and district data boundary. |
| Immediate | Define assessment-equivalence methodology with a psychometrician. |
| Immediate | Define what baseline dimensions can be measured validly without overtesting young children. |
| Near-term | Choose native iPad application versus cross-platform application for the pilot. |
| Near-term | Define teacher, parent and student consent and transparency language. |
| Near-term | Specify network moderation staffing, escalation and after-hours responsibility. |
| Near-term | Determine offline content, local AI and speech-processing requirements. |
| Later | Develop formal IEP, AAC and significant-disability requirements with specialists and families. |
| Scale | Test refurbished-iPad total cost and pursue an Apple education-renewal partnership. |
| Scale | Establish an independent curriculum editorial board and public correction process. |

---

## Appendix A. Requirement catalog

See [`requirements-catalog.md`](requirements-catalog.md).

## Appendix B. Source notes

This blueprint primarily formalizes the product model developed through the working
conversation. The following public sources inform the market and Florida context and should
be refreshed before investor, procurement or legal use:

- Florida Department of Education — FAST Assessments
- St. Lucie Public Schools — Instructional Technology
- SchoolAI — Personalized Spaces
- Kira Learning — Platform overview
- IXL — Diagnostic
- DreamBox — Continuous assessment and adaptivity
- Apple — Device workflow in Apple School Manager
- NCES — 2024-25 one-to-one device findings

### Document status

Version 0.1 is a build blueprint, not a final curriculum, legal opinion, psychometric
validation report or district proposal. The next revision should incorporate the selected
prototype objectives, technical-stack decisions, named content reviewers and results of the
St. Lucie technology audit.
