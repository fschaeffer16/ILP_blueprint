# Transportation track — design foundations

The research-backed design doc for a modern, reliable ILP school-transportation module, to
replace the "50/50 at best" experience of the current stack. Emphasis: Florida / St. Lucie
Public Schools (SLPS). This is a *plan*, not yet built.

## Executive summary

The K-12 bus-tracking market is a handful of GPS/AVL + parent-app vendors. The promise is
consistent — live bus location, an ETA, a "bus is near" alert — but the *delivered* experience is
unreliable: reviews and district notices repeatedly report inaccurate locations, stale maps, and
alerts that fire late or not at all. Districts still fall back on 1990s-style **robocall** systems
for delay/weather/breakdown announcements, which take **60–90 minutes** to complete a call cycle and
are one-way. The root causes are structural: cellular dead zones + low GPS ping rates → stale data,
ETAs from static schedules rather than live traffic, and "proximity-only" alerting that has **no
concept of a delay**. The modern module inverts this: **predictive ETAs, proactive
delay/weather/breakdown alerts with acknowledge-to-clear, and layered reliability** (offline
store-and-forward, SMS/voice fallback).

> **Vendor-risk finding:** **CalAmp — parent of Synovia and "Here Comes The Bus" — filed Chapter 11
> on June 3, 2024**, emerging private on July 31, 2024. Operations reportedly continued, but this is
> material context for a district (incl. SLPS) betting long-term on that stack.

*SLPS context:* the district transports **~23,000+ students**, uses Here Comes The Bus, and — like most
Florida districts — runs against a chronic **driver shortage** that directly causes the late-bus /
double-run delays a proactive alert system exists to communicate.

## 1. "Here Comes The Bus" (Synovia / CalAmp) — what SLPS runs today

- **What it is:** a GPS bus-tracking parent app; CalAmp acquired Synovia for $50M (2019). It tracks the
  **bus/route, not the student**.
- **How it works:** GPS on each bus → live map; a **radius/geofence** alert fires when the bus enters a
  parent-set zone around the stop. Parent binds to the bus with the child's **student ID**.
- **Documented complaints (accuracy + alert timing — the two things it exists to do):**
  - **Inaccurate location** — blank maps; the icon dropping to a random point "15–20 min away"; a bus
    "sitting in a neighborhood 3.5 miles away" that can't catch up to its real position.
  - **Delayed / missing alerts** — notifications arriving *after* the bus left; pickup/drop-off
    confirmations up to an hour late.
  - **Not updating in real time; intermittent outages** (e.g., start-of-year); login/session drops;
    dated UI.

## 2. The market (two architectural camps)

| Vendor / Product | GPS / AVL | Real-time ETA | Ridership (RFID on/off) | Parent notifications |
| --- | --- | --- | --- | --- |
| **Zonar** — MyView, Z Pass | Integrated AVL + day-of routing | Yes | **Z Pass** passive RFID tap board/exit | Track bus, geofence zones, **board/exit** + delay/route-change alerts |
| **Tyler** — Traversa; **My Ride K-12**; **Tyler Drive** (driver) | Yes (1,100+ districts) | Yes | Scan surfaced in app | Stop/route/pickup time, live location, scans |
| **Transfinder** — Routefinder, **Stopfinder**, **Wayfinder** (driver) | Yes | Yes — ETA alerts at 5/10/15/20 min | Via platform | **Two-way messaging** (parent↔transport, photos), change pushes, multilingual |
| **SMART tag** | Tablet per bus | Via ridership + GPS | **Core strength** — RFID on/off, audit/Medicaid trail | Board/exit, delay tracking, real-time |
| **Samsara** (+ Edulog) | Strong telematics + dashcams + diagnostics | Yes | ID card readers | Parent visibility via Edulog |
| **Geotab** | Strong telematics/data platform | Yes | Via partners | Location visibility (less a consumer app) |
| **First Student — FirstView** (operator) | Centralized fleet tracking (~200 districts) | Yes | Improved specialized-transport | Push/delay alerts — **but** reviews note distance alerts breaking + firing too early |

**Camps:** (1) **routing-first suites** (Tyler, Transfinder, Zonar) own the route/roster + a parent app;
(2) **telematics-first** (Samsara, Geotab) own hardware/data + integrate a routing/parent layer. **RFID
ridership** (Z Pass, SMART tag) is the clearest safety differentiator; **two-way messaging** and
**proactive change alerts** are where newer products beat proximity-only apps like HCTB.

## 3. The robocall layer (what announces late buses today)

- **Blackboard Connect** / **SchoolMessenger** — incumbent mass-notification for closures, delays, late
  buses. Why they're dated:
  - **Slow:** a full call cycle takes **1–1.5 hours** — useless for a bus 20 min late *now*.
  - **Unreliable delivery:** carrier issues delay/interrupt calls; districts advise checking other channels.
  - **One-way & un-targeted:** blasts everyone, no per-route/stop targeting, no acknowledgment.
  - Framed under the TCPA "emergency purpose" exception — built for rare emergencies, not routine
    per-route delay updates.
- **Net:** the robocall answers "school is closed," not "*your* bus is 18 minutes late." That gap is
  exactly what a modern proactive-delay module should own.

## 4. Safety & operations a full system must cover

- **Student check-in/out (tag on/off):** RFID cards tapped at the door → timestamped board/exit records
  for authorized-ridership safety, "did my child get on/off" alerts, and **compliance/Medicaid** docs for
  special-ed transport.
- **Driver navigation / turn-by-turn** (Wayfinder, Tyler Drive): turn-by-turn on the *approved* route +
  stop list — especially valued for **substitute drivers**.
- **Dispatch / operations dashboards:** live fleet map, run status, late/off-route flags; cut inbound
  "where's the bus" calls.
- **Substitute-driver handling:** any driver assigned to a run gets the full route + student/IEP context.
- **Special-needs transportation:** IEP-defined needs (lift, door-to-door, medical) that drivers/aides
  *and substitutes* must see; ridership scans document it for compliance/Medicaid.
- **SIS / rostering integration** (PowerSchool, Tyler SIS, Infinite Campus): a front-office address change
  auto-updates the route and keeps the student↔bus binding correct — which is *also* what makes the parent
  app show the right bus.

## 5. What actually breaks (root causes of "50/50 at best")

1. **Stale GPS from cellular dead zones** — updates stop, the map freezes, the icon "teleports" on
   reconnect. Under-used mitigations: **store-and-forward** buffering, cellular+satellite redundancy.
2. **Low ping rate / update latency** — too coarse for a fast bus near a stop.
3. **Schedule-based, not traffic-based ETAs** — ignore live traffic + real dwell times, so "near" fires
   at the wrong moment.
4. **Notifications fire too late or not at all** — brittle alerting logic; slow to detect/fix.
5. **No concept of a proactive delay** — apps alert on *proximity*, not *lateness*, *route change*,
   *breakdown*, or *weather*; those go via the slow robocall layer or not at all; no acknowledgment.
6. **Brittle roster binding & session issues** — login drops, de-registration, SIS mismatches put parents
   on the wrong bus, especially at start-of-year peak load.

## 6. Proposed modern design — a reliable transportation module

### Principles
1. **Freshness first** — nothing is trusted downstream of stale GPS; every location carries an age/quality
   flag; the UI degrades honestly ("last seen 2 min ago") instead of showing a confidently wrong dot.
2. **Predict, don't schedule** — ETAs from live location + live traffic + learned per-stop dwell times.
3. **Proactive, not proximity-only** — detect and *push* delays, route changes, breakdowns, weather before
   the parent asks.
4. **Acknowledge-to-clear** — high-importance transport alerts use the **existing ILP parent-app
   acknowledgment model**: the alert stays open until the parent taps to confirm; unacknowledged critical
   alerts **escalate** (repeat push → SMS → voice).
5. **Redundancy everywhere** — offline device buffering, server-side interpolation, SMS/voice fallback so a
   message *always* lands.

### Components
- **A. Bus device / edge:** adaptive GPS ping (faster near stops), **store-and-forward** buffer for dead
  zones (server marks buffered vs. live), engine-diagnostics for **breakdown detection**, RFID reader for
  tag on/off.
- **B. Predictive ETA service:** live position + traffic + historical segment times + measured dwell +
  bell schedule → continuously recalculated ETA **+ confidence band**; low confidence suppresses false
  "near" alerts.
- **C. Proactive alert engine (the differentiator):** **delay** alerts to *affected stops only*;
  **breakdown** alerts from diagnostics or a driver button; **weather/operational** pushes from dispatch to
  selected routes (replaces the robocall for transport messaging); **route/substitute-change** alerts;
  proximity alerts retained but **gated on ETA confidence**. Critical alerts → acknowledge-to-clear +
  escalation; idempotent/deduplicated so backfills don't spam.
- **D. Parent app / module:** live map with **honest freshness indicator**; predicted ETA + confidence;
  per-child geofence + quiet hours; **tag on/off confirmations**; acknowledge-to-clear inbox matching the
  district app; optional **two-way message** to transportation; multilingual (EN/ES/FR).
- **E. Driver app / tablet:** turn-by-turn on the **approved route** (critical for subs); stop manifest
  with RFID scan status + **flagged special-needs/IEP instructions**; one-tap **"running late / breakdown /
  no-show"** buttons feeding the alert engine; works offline, syncs on reconnect.
- **F. Dispatch / operations dashboard:** live fleet map with late/off-route/stale-signal flags; assign a
  **substitute** to any run (route + IEP context follows); compose **targeted** delay/weather pushes;
  ridership + special-ed/Medicaid audit export.
- **G. Integrations:** **SIS/roster sync** (PowerSchool/Infinite Campus/Tyler SIS); reuse of the existing
  ILP parent-app **notification + acknowledgment infrastructure** — one identity, one inbox, one ack model.

### Reliability / redundancy
- **Offline queue** on bus device + driver tablet; server reconciles buffered vs. live and never presents
  buffered data as live.
- **Delivery fallback ladder:** push → (if a critical alert is unacknowledged within N min) → **SMS** →
  **automated voice**, keeping the robocall channel only as a *last-resort fallback*, not the primary path.
- **Stale-data honesty:** confidence/age on every location + ETA; suppress alerts computed from stale data.
- **Start-of-year load hardening** (the exact window HCTB failures cluster in): pre-provisioned roster sync,
  session-token stability, capacity headroom.

## Why this fits ILP

The transportation module is not a detour — it **reuses the parent app we already built**: the
acknowledge-to-clear notification model, the read-receipt loop, and the district→school roster. One parent
app, one inbox, one acknowledgment model, now covering both the classroom *and* the bus. It also reinforces
the core ILP promise — **honest data over confident-but-wrong data** — applied to a bus's location instead
of a child's mastery.

## Sources

**Here Comes The Bus / Synovia / CalAmp**
- https://herecomesthebus.com/ · https://herecomesthebus.com/schools/
- https://grand-screen.com/apps/here-comes-the-bus/ · https://justuseapp.com/en/app/981902595/here-comes-the-bus/reviews
- https://www.aol.com/wake-county-school-bus-locator-183802551.html (start-of-year outage)
- https://www.ibj.com/articles/73337-local-transportation-tech-firm-acquired-for-50-million (CalAmp–Synovia $50M)
- https://finance.yahoo.com/news/calamp-files-bankruptcy-complete-lender-130126166.html (Chapter 11, 2024)
- https://cases.stretto.com/calamp/ (bankruptcy docket; Synovia Solutions LLC a debtor)

**St. Lucie / Florida**
- https://www.stlucie.k12.fl.us/departments/transportation/
- https://lucielink.stlucie.k12.fl.us/here-comes-the-bus-app-for-parents/
- https://portstlucie.macaronikid.com/articles/5a0e8f99bba77b757c45a43a/here-comes-the-bus-app-for-parents (radius system)
- https://cbs12.com/news/local/here-comes-the-bus-app-is-a-game-changer-for-parents-in-st-lucie-county
- https://www.news4jax.com/news/local/2026/08/03/st-johns-county-is-dozens-of-drivers-short-for-school-bus-routes-as-new-year-begins-what-your-family-needs-to-know/ (FL driver shortage)

**Competitors**
- https://www.zonar.com/solutions/myview-bus-tracking-app/ · https://www.zonar.com/solutions/z-pass-student-tracking/
- https://www.tylertech.com/products/versatrans · https://www.tylertech.com/products/student-transportation/my-ride-k-12
- https://www.transfinder.com/solutions/Stopfinder · https://www.transfinder.com/solutions/Wayfinder
- https://smart-tag.net/parent-app/ · https://smart-tag.net/ridership-solution/
- https://www.samsara.com/industries/public-sector/k-12 · https://www.geotab.com/industries/student-transportation/
- https://firststudentinc.com/innovation/firstview/ · https://buscmms.com/blog/top-5-bus-fleet-telematics-providers-2026

**Robocall / mass notification**
- https://www.blackboard.com/engage-your-community/communications/mass-notifications-for-k-12
- https://www.acpsmd.org/Page/1819 (1–1.5 hr call cycle; delivery caveats)
- https://www.fcc.gov/robocalls-schools-and-school-systems-update (TCPA emergency-purpose exception)

**Root causes / ETA / SIS / special-needs**
- https://www.busboss.com/school-bus-gps-tracking (dead zones, store-and-forward)
- https://www.busboss.com/blog/bid/194683/benefits-of-integrating-student-info-systems-with-bus-routing-software (SIS integration)
- https://locus.sh/blogs/predictive-eta-software-reduces-wismo/ (ML ETA vs. schedule-based)
- https://arxiv.org/pdf/2512.07200 (bus arrival prediction research)

*Some app-store review pages and local-news/district pages were egress-blocked during research and are
reflected via search summaries + corroborating pages; spot-verify verbatim review quotes in the app stores
before formal use. Prepared for ILP district discovery — a design plan, not a shipped feature.*
