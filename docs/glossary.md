# Glossary

Shared vocabulary for ILP. When a term has a precise meaning in the system, use it that way.

| Term | Meaning |
| --- | --- |
| **ILP** | Individualized Lesson Planning — the product, and also a student's evolving evidence profile. |
| **Objective / ObjectiveVersion** | The versioned, immutable-after-publication learning target. The contract among curriculum, delivery, assessment and remediation. |
| **Locked contract** | The subset of an objective — student outcome, essential knowledge, required reasoning, mastery rule — that must be identical across every student's version. |
| **Mastery rule** | Threshold + minimum evidence types + transfer requirement. Part of the locked contract. |
| **Adaptation** | A district-customizable unit of individualization that declares what it may and may not change. |
| **Adaptation class** | One of `access`, `scaffold`, `difficulty`, `objective_modification`. Only the last changes expected learning. |
| **Objective modification** | A change to *what* a student is expected to learn. Never automatic; always teacher-authorized; never reportable as equivalent mastery. |
| **Delivery pattern** | The single teacher-facing label for a compiled version: `core`, `vocabulary_supported`, `visual_first`, `guided_practice`, `advanced_transfer`. |
| **ILP hypothesis** | An evidence-based, review-dated, teacher-correctable working belief about a student in one domain. Not a diagnosis or a permanent label. |
| **Readiness** | 0–1 estimate of demonstrated readiness in a domain. Lower ⇒ more support warranted. |
| **Assign-once compiler** | The engine that turns one teacher assignment + each student's ILP into individualized, integrity-checked delivery manifests. |
| **Delivery manifest** | The compiled, reproducible, auditable delivery instructions for one student. |
| **Objective integrity** | The property (enforced in code) that individualization never silently changed a student's expected learning. |
| **The 75% rule** | If 75% of a class misses the same objective/item group, presume instructional or assessment failure before student failure; suspend the grade and audit. |
| **Assignment-aware bot** | The embedded helper that knows the objective, student version, sources and teacher-set help boundary, and never lowers a grade for asking. |
| **Evidence domain** | A dimension of the learner model (e.g. `language_access`, `mathematical_reasoning`) that adaptations key off. |
| **Model gateway** | The provider-agnostic AI boundary that enforces grounding, structured outputs, logging, redaction and policy checks. |
| **Tenant** | A district's isolated data boundary. No data crosses tenant boundaries. |
| **FAST** | Florida Assessment of Student Thinking — the state progress-monitoring assessment. An external signal, never the instructional engine. |
| **B.E.S.T.** | Florida's Benchmarks for Excellent Student Thinking standards. |
| **OneRoster / LTI** | 1EdTech interoperability standards for rosters and LMS launch/assignment exchange. |
| **Vertical slice** | A narrow but complete proof of the entire connected cycle in one grade band before expanding breadth. |
