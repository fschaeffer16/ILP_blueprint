# The ESE device plan: phone-first, on purpose

Part of the ["Meet Them Where They Are" ESE Program](ese-program.md). ILP runs on a computer
and an iPad — and for the ESE student's school day, **the primary device is a phone**: a
large-screen (Pro Max-class) handset, district-purchased refurbished, locked down by the
district, with ILP loaded on it. This document is the plan and the reasoning, including the
Florida phone-law analysis a superintendent will ask for on the spot.

> **The one-sentence why:** a support that lives in a backpack is a support that isn't there.
> The ESE day is won and lost in the in-between — the bus loop, the hallway, the cafeteria,
> the transition into class — and the only device that is *in the child's pocket* for all of
> it is a phone. You never fade a child's wheelchair; you also never leave it in a locker.

---

## 1. Why a phone beats an iPad for the ESE day

1. **The channel must be always-present.** For the nonverbal or semi-verbal student, the
   device *is the voice* — AAC, the visual schedule, the today board, the way to tell the
   behavior tech something is wrong. An iPad comes out for a lesson; a phone is on the child
   at the bus loop, at lunch, in the hallway — exactly where transitions (and the program's
   whole behavior-prevention thesis) live.
2. **Dignity by camouflage.** Every teenager carries a phone. A Pro Max in an 11th-grader's
   hand is invisible; a 13-inch tablet in a bulky case marks the ESE student the moment it
   comes out. The program's rule is *same class, same app, same dignity* — the device should
   follow the same rule.
3. **It's the form factor AAC already chose.** Families and SLPs already run AAC apps on
   phones and phone-sized devices for exactly these reasons. ILP rides on the device the
   child's voice already lives on, instead of adding a second, bigger thing to carry.
4. **One-handed, pocketable, durable in the real day.** Lunch trays, bus steps, PE. A phone
   survives the parts of the day an iPad never attends.
5. **The support team is on phones anyway.** The behavior tech at the bus loop and the
   support facilitator between classrooms check the day's plan on *their* phones (that's
   already in the program's day-in-the-life). Child and team on the same form factor, same
   app, in real time.

**Where the big screens still win — and stay in the plan:** the teacher command center,
lesson authoring, and dashboards are desktop screens; longer writing, extended reading, and
some assessments are better on an iPad or laptop in class. Phone-first means the *child's
carried device* is a phone — not that big screens disappear. ILP is one web app that fits
all three (it is responsive by design, and installable — see §3).

## 2. Florida's phone law is a tailwind, not a wall (HB 1105, 2025)

The objection everyone will raise first: *"Florida just banned phones in school."* Read the
law — it does the opposite of blocking this plan:

- HB 1105 bars **personal** wireless devices: K-8 students may not *use* them during the
  school day; high schoolers may not use them during instructional time **"unless expressly
  directed by a teacher solely for educational purposes."**
- The statute keeps explicit carve-outs for use **pursuant to a student's IEP or 504 plan**
  and for documented medical need. The exact population this program serves is the population
  the legislature exempted — a child's AAC/communication device belongs in the IEP, which
  makes the exemption airtight and individual.
- A **district-purchased, MDM-supervised, locked-down device is district instructional
  technology** that happens to have a phone's shape — not the student's personal phone the
  law regulates. It has no personal apps, no social media, no open browser, and communicates
  only through ILP's moderated, verified channels.
- Bonus: the district-issued device gives administrators a *cleaner* story than today's,
  where an ESE student's personal phone doubles as their AAC — the plan separates "the
  child's voice and schoolwork" (district device, always allowed, on the IEP) from "a
  personal phone" (whatever policy applies to everyone).

*Verify with district counsel in discovery: written confirmation that district-issued
phone-form-factor instructional devices sit outside the wireless-device policy, and template
IEP/504 language naming the device as the student's communication/instructional device.*

## 3. The software side: already phone-ready, no app store required

- **ILP is one responsive web app** — the same engine and screens serve the desktop command
  center, the iPad, and the phone. The student app, parent app, study guides, and
  acknowledge-to-clear messages already render phone-width.
- **It installs like an app** ("load the app on there ourselves" — literally): ILP ships a
  web-app manifest, so *Add to Home Screen* puts the ILP icon on the phone and opens it
  full-screen with no browser chrome. On a district-managed device, MDM places that web clip
  on every home screen automatically — no App Store account, no per-device fiddling.
- **Lockdown for assessments:** managed devices support single-app/guided modes, so a quiz
  or exam can run with the device held to ILP alone — the same integrity story as any
  testing device, in the child's pocket-sized form factor.
- **In the deployed district build** (on district servers, per the deployment plan), the
  same PWA gains offline caching for the day's assignments and the AAC symbol set — the bus
  ride and the dead-zone hallway don't take the child's voice away.

## 4. The hardware plan (what "refurbished Pro Max" actually costs)

| Option | Ballpark (2026 refurb market) | Notes |
| --- | --- | --- |
| iPhone 13 Pro Max, refurb | **~$300–450** | 6.7" screen; the value pick — big enough for AAC grids and lesson cards |
| iPhone 15 Pro Max, refurb | from ~$600 | Newer, longer support runway |
| iPhone 16 Pro Max, Apple-certified refurb | ~$730–930 | Apple education discount applies; longest runway |

- **Per-child cost lands at or below an iPad + rugged case**, for a device the child
  actually keeps with them.
- Deployment is standard district practice: **Apple Business Manager + the district's MDM**
  — supervised mode, app/web-clip pushed automatically, personal Apple IDs not required,
  remote wipe, web filtering on or off network. (Refurbished units can be enrolled in Apple
  Business Manager; *confirm the reseller supports ABM enrollment before purchasing* — the
  one procurement detail that matters.)
- Cellular is optional: Wi-Fi-only keeps cost and policy simple; a cellular plan is a
  per-IEP decision (e.g., a student whose safety plan needs off-campus reachability).
- Case + insured breakage pool instead of per-device AppleCare at this price point.
- Funding: device purchases fit the same outside resources already in the proposal — IDEA
  AT (assistive technology named in the IEP), the local funders in
  [`research-funding.md`](research-funding.md) for device line items, and the district's
  existing instructional-technology budget.

## 5. What the child's phone actually shows (and never shows)

**Shows:** today board and visual schedule (previewed transitions), the current assignment
in the child's compiled delivery (AAC response channel, visual-first, chunked steps — per
their plan), the study guide queue, moderated class collaboration, and a "get my team"
action that reaches the support facilitator/behavior tech through the app.

**Never:** social media, open messaging, an open browser, personal apps, ads, or any
communication outside ILP's verified, moderated channels. The lockdown *is* the parent
conversation: this is a school tool and a voice, not a phone plan.

## 6. Rollout gates (mirrors the program's phases)

1. **Phase 0 (co-design):** SLPs/AAC specialists confirm phone-first fits each pilot child's
   motor/vision profile — for some children a larger screen or dedicated AAC device is the
   right call, and the plan yields to the IEP every time. Phone-first is the default, not a
   mandate: *the device, like everything else, meets the child where they are.*
2. **Phase 1:** demo the full phone day on synthetic students (installable app already live).
3. **Phase 2 pilot:** a device-per-child cohort with MDM lockdown, IEP language in place,
   counsel sign-off on the HB 1105 analysis, and breakage/replacement logistics tested.
4. **Measure:** device-with-child rate, channel-use in transitions, and the program's
   existing measures — if the phone is being left behind or fought over, the data will say so.

---

*Sources: Florida HB 1105 (2025) coverage and policy summaries (personal-device ban with
IEP/504 and teacher-directed exceptions; K-8 all-day, high-school instructional-time);
2026 refurbished-market pricing (Back Market, refurb.me, Apple Certified Refurbished w/
education discount). Verify statute text, district wireless-device policy, and current
pricing before formal use.*
