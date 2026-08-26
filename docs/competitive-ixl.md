# Competitive analysis: IXL vs. ILP

A fair-minded look at **IXL** — what it does well, where independent reviewers say it falls
short, and where ILP is built on a different model. Not a takedown; a clear picture of two tools
that do different jobs. Visual version:
<https://ilp-blueprint-web.vercel.app/ixl-vs-ilp.html>.

> **Sourcing caveat.** IXL's own domain (`ixl.com`) was unreachable during research, so IXL's
> feature and efficacy claims here are drawn from secondary sources (Common Sense, Tech &
> Learning, EdReports, SRI, ERIC, practitioner reviews) and IXL-page search snippets. Re-verify
> against the live product before any formal presentation. Independent critiques are corroborated
> across multiple reviewers.

## What IXL is

A mature, standards-aligned K-12 **practice** platform: **20,000+ granular skills** across math,
ELA, science, social studies and Spanish, each a stream of auto-generated questions scored by a
per-skill **SmartScore** (0–100), with an adaptive **Diagnostic** that places students on a
grade-level scale (roughly 0–1300, per strand). Used at scale, tightly mapped to state standards
(including Florida B.E.S.T. and B.E.S.T. Access Points), with teacher analytics widely considered
best-in-class. It is fundamentally a **practice-and-measure** engine.

## Strengths (genuine)

- **Breadth** — 20,000+ skills, five subjects, K-12.
- **Standards alignment** — every skill mapped to state standards, incl. Florida B.E.S.T., FAST
  test-prep plans, and B.E.S.T. Access Points.
- **Teacher analytics** — granular "trouble spots" and item-level data; reviewers' most-cited strength.
- **Adaptive diagnostic** — per-strand, grade-mapped, updates in real time.
- **Immediate worked explanations** after a miss; strong **multilingual audio & translation** for ELs.

## Weaknesses (independently reported)

- **It drills; it doesn't teach.** The most consistent independent critique — IXL quizzes and
  practices but doesn't introduce concepts well; students can be left to trial-and-error.
- **The "SmartScore crash."** Points climb slowly, then a single miss subtracts a large chunk near
  the top — widely reported as demoralizing/anxiety-inducing. IXL frames it as intentional mastery design.
- **Rote over reasoning.** Heavy multiple-choice; light on extended writing and applied reasoning.
- **Thin evidence.** One small, **vendor-sponsored** RCT (Johns Hopkins CRRE, single district);
  the rest is correlational/quasi-experimental (SRI validated an ESSA Tier 2 study). **No official
  What Works Clearinghouse rating.** EdReports rates only the *separate* "Takeoff by IXL" product,
  with weak marks on teacher/student supports.
- **Accessibility is self-attested.** IXL's VPAT is self-authored, not an independent audit.

## The core difference

Point IXL and ILP at the same B.E.S.T. benchmark and they do opposite things.

| Dimension | IXL | ILP |
| --- | --- | --- |
| Core job | Practice & measure a skill | Teach → assess → remediate, one connected loop |
| Instruction | Light — drills, some videos | Lesson-first, teacher-authored, vetted sources |
| In command | The algorithm routes to skills | Teacher assigns once, holds the grade; AI recommends only |
| On a miss | SmartScore drops; retry same skill | Materially-different reteach → equivalent reassessment |
| Help while working | Worked explanation of the item | Grounded bot that coaches, never gives the graded answer |
| Content | Vendor black box you rent | District-owned, teacher-authored, sources visible |
| Motivation | Awards, streaks, chase SmartScore 100 | Mastery & helpfulness; no manipulative engagement |
| Parent view | Usage & trouble spots | Plain-language, no-surprises; never private messages |
| Rigor | Vendor's item bank | Locked to the objective in code; route adapts, rigor never silently drops |

## Accessibility & students with disabilities

This is where the gap is widest. IXL has strong EL audio/translation and basic **self-attested**
screen-reader support — but for students with significant cognitive disabilities it **maps skills
to Access Points and stops there**; no AAC, switch, or symbol support was found, and the
penalty-weighted model is a poor fit for these learners.

ILP's design order is deliberate: **build one strong system for every student first, then extend
it for nonverbal / AAC learners and other disabilities, with special-education specialists** —
consistent with Principle 4 (access must never hide subject knowledge; the route adapts without
lowering rigor). Stated honestly as a **planned** track, not a shipped feature.

## The honest bottom line

IXL is a capable, shipping product with real breadth and best-in-class analytics. If a district
only wants standards-aligned practice and a diagnostic, it delivers.

**ILP is not another practice tool — it's the connected, teacher-controlled instruction layer that
practice tools leave out.** Same standards; a different job. And unlike IXL, **ILP is early**: a
working engine and demo, not a validated product with efficacy studies yet — which is exactly why
the model insists on expert review and a pilot before real students. This is what it *is*, not an
oversell of what it's proven.

**They can coexist.** Nothing here requires ripping IXL out; ILP can consume useful signal from
tools a district already licenses while providing the lesson-to-mastery loop they don't — the
enhancement-not-replacement path in [`st-lucie-entry.md`](st-lucie-entry.md).

## Key sources

Independent: Common Sense Education teacher reviews; EdReports ("Takeoff by IXL", 2025); SRI
International (ESSA Tier 2 validation); Johns Hopkins CRRE RCT (ERIC ED641940, 2023); Evidence for
ESSA; Tech & Learning; thelearningstandard.org; Boddle Learning; Trustpilot. IXL (marketing, via
snippets): ixl.com product/diagnostic/help pages, IXL blog, IXL ESSA/research page, IXL VPAT.
Full URL list is in the research record for this analysis.
