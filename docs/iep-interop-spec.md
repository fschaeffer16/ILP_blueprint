# IEP import/export: the system-of-record interface (step 6 specification)

The final step of the IEP build ([`ese-program.md`](ese-program.md) §8). Steps 1–5 run today
(`/ese`, `/iep`, `/facilitator`); this step is deliberately a **specification, not speculative
code**, because it must be built against the district's real IEP system in discovery. It is
written so an ESE director and an IT director can read it and say yes.

> **The prime rule: ILP is never the system of record for an IEP.** The district's IEP system
> (in Florida, typically PCG's PEER/EdPlan or the Focus/SIS ecosystem — confirm in discovery)
> holds the legal document. ILP *mirrors* the parts of the plan that drive instruction, and
> *returns* the evidence the next review needs. When the two disagree, **the system of record
> always wins.**

---

## 1. What flows IN (import: the plan drives the software)

Mirrored from the system of record into the ILP structures already built and tested:

| From the IEP document | Into ILP | Built |
| --- | --- | --- |
| Accommodations (verbatim text) | `IEPPlan.accommodations[].planText` + a mapped `adaptationId` | ✅ steps 1–2 |
| Accommodation exclusions | `IEPPlan.excludedAdaptations` (exclusion beats force) | ✅ step 2 |
| Annual goals (verbatim text) | `IEPGoal.goalText` + module chain + criterion (accuracy, **prompt level**, consecutive sessions) | ✅ step 4 |
| Service schedule (minutes, settings, providers) | `SupportTask[]` — the facilitator's day plan | ✅ step 5 |
| Alternate-standards authorization (Access Points) | `IEPPlan.alternateStandards` — read-only; the engine never sets it | ✅ by construction |
| Plan/review dates | plan versioning (below) | spec |

**The mapping is human-confirmed, never blind.** An import lands as a *draft*: the ESE
teacher sees the plan's own text beside the proposed adaptation mapping on the `/iep` screen,
runs the same `validateIEPPlan` gate (unknown adaptations, modification-lane attempts, fade
mismatches all surface), and confirms. Only a confirmed plan drives the compiler. The gate is
already built and test-pinned; import adds the transport, not the trust model.

**Formats, in order of preference:**
1. **CSV/flat-file export** from the IEP system (every major system can produce one) — the
   pilot path, matching ILP's CSV/OneRoster-first integration principle.
2. **Vendor API** where licensed and available — the scale path.
3. Manual entry on `/iep` remains the fallback and is already live.

**Cadence & versioning:** nightly diff import; a changed plan creates a new plan version with
an effective date; compiles after that date use the new version; every version is retained
(the audit trail includes *which* plan version rode on *which* assignment).

## 2. What flows OUT (export: the evidence the review needs)

The **review evidence packet**, generated per student per reporting period — everything steps
3–5 already compute, shaped for the meeting:

- **Goal progress** per goal: qualifying attempts, accuracy at the criterion's prompt level,
  consecutive criterion sessions, status (met / on track / progressing / needs review /
  no qualifying evidence yet), the supported work kept visible.
- **Independence trend** per objective: direction, latest prompt level, independent-mastery
  rate, fade-conversation flags.
- **Module mastery through the child's channel** — the same rollups the whole class gets,
  channel-tagged.
- **Service fidelity**: promises made vs. delivered/partial/missed, with reasons, by provider
  (district staff and contracted agencies on the same record).
- **The safety record**: incident-free days accrued.

**Delivery:** human-readable PDF for the meeting + CSV for the IEP system's progress-report
fields (mapped per vendor in discovery). Progress-report *narratives* remain human-written;
ILP supplies the numbers and charts, the teacher supplies the words.

## 3. What never crosses, in either direction

- **No diagnosis fields** — ILP's data model has nowhere to store one, by construction.
- **No placement, eligibility, or modification decisions** — ILP exports evidence; humans
  decide in the system of record and the meeting.
- **No grade penalties from prompt levels** — the export states both correctness and
  independence separately, as the engine computes them.
- **Nothing leaves district infrastructure.** Deployed ILP runs on district servers (per the
  deployment plan); the interop link is district-internal. The no-PII join-code provisioning
  from the device strategy applies to student devices regardless.

## 4. Security & compliance envelope

FERPA + IDEA confidentiality throughout; role-based access (the facilitator sees the day, the
ESE teacher the caseload, the director the program); every import, confirmation, and export in
the append-only audit log; a data-sharing agreement and district legal review are Phase-2
gates (already in the program's rollout).

## 5. Discovery checklist (what unlocks the build)

1. Which IEP system and version the district runs, and what export it can produce today
   (fields, format, schedule).
2. Student identifier matching (SIS ID ↔ IEP system ID ↔ ILP roster import).
3. Whether a vendor API license exists, and its scopes.
4. Which progress-report fields the district wants populated from the evidence packet.
5. A sandbox/test extract with synthetic or redacted records for integration testing.
6. Data-sharing agreement + legal sign-off.

## 6. Acceptance criteria (when step 6 is "built")

- A real district export imports to draft plans; the ESE teacher confirms on `/iep`; the
  compiler carries the confirmed plan on the next assignment. Round-trip demonstrated.
- A changed accommodation in the system of record shows up as a flagged diff, not a silent
  overwrite.
- A review evidence packet generates for a pilot student and its numbers reconcile 1:1 with
  the live screens.
- The audit log answers: which plan version, confirmed by whom, drove which assignment, and
  what evidence was exported when.

---

*Status: specification complete; build gated on discovery items 1–6 with the district. Steps
1–5 of the IEP build are live and test-pinned; nothing in this step changes their behavior —
it connects them to the paperwork the law already requires.*
