/**
 * Baseline intake and processing screener (blueprint §7 baseline system; §6 learner
 * model; §2 non-goals).
 *
 * Purpose: catch subtle, early indications of *how a child receives and processes
 * information* — reading/phonological signals, working memory, processing speed,
 * attention, number sense, oral-vs-written gaps — so a child gets help sooner.
 *
 * THE LINE THIS MODULE HOLDS: it **screens, it does not diagnose.** Diagnosing a
 * learning disability is a specialist-led, legally-safeguarded process; the blueprint
 * forbids ILP from making disability determinations or medical diagnoses. So every
 * output here is a *screening indicator* routed to a human — a teacher, a specialist
 * screener, or a family conversation — never a label. This mirrors the MTSS/RTI
 * universal-screening model districts already use, and Florida's K-3 dyslexia
 * screening statute (F.S. 1008.25), which requires screening, immediate intervention,
 * and immediate parent notification — and still leaves diagnosis to qualified evaluators.
 *
 * Two guardrails are structural, not stylistic:
 *   - No single session decides anything (`minSessions`, default 2). One test never
 *     produces an indicator.
 *   - Every indicator carries `isDiagnosis: false` and `requiresHumanReview: true`,
 *     and the type has no field in which a diagnosis could be stored.
 */

import type { EvidenceDomain, GradeBand, ILPHypothesis, StudentILP } from './types.js';

/** How a child receives and processes information — the screening domains. */
export type ProcessingDomain =
  | 'phonological_awareness' // reading / dyslexia-characteristic predictor
  | 'letter_sound_decoding' // reading / dyslexia-characteristic predictor
  | 'rapid_naming' // RAN — reading / dyslexia-characteristic predictor
  | 'oral_language' // listening comprehension
  | 'working_memory'
  | 'processing_speed'
  | 'sustained_attention'
  | 'number_sense' // math / dyscalculia-characteristic predictor
  | 'visual_motor' // fine-motor / handwriting
  | 'oral_written_gap' // understands orally but not in writing
  | 'performance_conditions'; // timing pressure / test anxiety

export type ObservationMethod = 'game_task' | 'teacher_observation' | 'tablet_task' | 'oral' | 'written';

export interface BaselineObservation {
  readonly studentId: string;
  readonly domain: ProcessingDomain;
  readonly sessionId: string;
  readonly date: string;
  /** 0..1 normalized performance on this domain in this observation. */
  readonly score: number;
  readonly method: ObservationMethod;
  readonly evidenceId: string;
}

export type SignalStrength = 'none' | 'monitor' | 'emerging' | 'notable';
export type NextStep =
  | 'continue_monitoring'
  | 'classroom_support'
  | 'targeted_intervention'
  | 'specialist_screening_referral'
  | 'family_notification';

/**
 * A screening indicator. NOT a diagnosis and structurally incapable of being one —
 * there is no `diagnosis` or `disability` field, only a signal, its evidence, plain
 * language, and the human next steps it routes to.
 */
export interface ScreeningIndicator {
  readonly domain: ProcessingDomain;
  readonly signal: SignalStrength;
  readonly confidence: number;
  readonly evidenceIds: readonly string[];
  /** How to describe the pattern to a person — an indicator, never a label. */
  readonly indicatorType: string;
  readonly plainLanguage: string;
  readonly nextSteps: readonly NextStep[];
  readonly requiresHumanReview: true;
  readonly isDiagnosis: false;
}

export interface DomainReadout {
  readonly domain: ProcessingDomain;
  readonly readiness: number;
  readonly confidence: number;
}

export interface BaselineProfile {
  readonly studentId: string;
  readonly gradeBand: GradeBand;
  readonly sessionsUsed: number;
  readonly sufficientEvidence: boolean;
  readonly domains: readonly DomainReadout[];
  readonly indicators: readonly ScreeningIndicator[];
  /** Seeds the learner model the compiler already uses (starting point + supports). */
  readonly ilpHypotheses: readonly ILPHypothesis[];
  /** Plain-language family notification when required (reading deficiency / notable signal). */
  readonly familyNotification: string | null;
  readonly disclaimer: string;
}

const DISCLAIMER =
  'This is a screening, not a diagnosis. It highlights where a child may need a closer ' +
  'look so support can start early. Only qualified professionals, with the family, can ' +
  'determine a learning disability.';

/** How each processing domain is described to a person, and which reading-type signals
 * trigger Florida-statute-style intervention + family notification. */
const DOMAIN_META: Record<ProcessingDomain, { label: string; indicator: string; reading: boolean; evidence: EvidenceDomain }> = {
  phonological_awareness: { label: 'Phonological awareness (hearing sounds in words)', indicator: 'reading / dyslexia-characteristic indicator', reading: true, evidence: 'language_access' },
  letter_sound_decoding: { label: 'Letter–sound decoding', indicator: 'reading / dyslexia-characteristic indicator', reading: true, evidence: 'language_access' },
  rapid_naming: { label: 'Rapid naming (quick recall of familiar names)', indicator: 'reading / dyslexia-characteristic indicator', reading: true, evidence: 'language_access' },
  oral_language: { label: 'Oral language comprehension', indicator: 'language-comprehension indicator', reading: false, evidence: 'language_access' },
  working_memory: { label: 'Working memory (holding steps in mind)', indicator: 'working-memory / processing indicator', reading: false, evidence: 'assessment_conditions' },
  processing_speed: { label: 'Processing speed', indicator: 'processing-speed indicator', reading: false, evidence: 'assessment_conditions' },
  sustained_attention: { label: 'Sustained attention', indicator: 'attention / focus indicator', reading: false, evidence: 'assessment_conditions' },
  number_sense: { label: 'Number sense', indicator: 'math / dyscalculia-characteristic indicator', reading: false, evidence: 'mathematical_reasoning' },
  visual_motor: { label: 'Visual-motor / handwriting', indicator: 'fine-motor / handwriting indicator', reading: false, evidence: 'written_expression' },
  oral_written_gap: { label: 'Oral-vs-written gap', indicator: 'expression-channel indicator (knows it, can’t yet write it)', reading: false, evidence: 'written_expression' },
  performance_conditions: { label: 'Performance conditions (timing pressure)', indicator: 'test-conditions indicator', reading: false, evidence: 'assessment_conditions' },
};

export interface BaselineOptions {
  readonly gradeBand: GradeBand;
  readonly minSessions?: number;
  readonly today?: Date;
}

/**
 * Build a baseline profile from a set of observations. Emits screening indicators only
 * when evidence spans at least `minSessions` distinct sessions.
 */
export function buildBaselineProfile(
  observations: readonly BaselineObservation[],
  opts: BaselineOptions,
): BaselineProfile {
  const minSessions = opts.minSessions ?? 2;
  const today = opts.today ?? new Date();
  const studentId = observations[0]?.studentId ?? 'unknown';

  const byDomain = new Map<ProcessingDomain, BaselineObservation[]>();
  for (const o of observations) {
    const g = byDomain.get(o.domain);
    if (g) g.push(o);
    else byDomain.set(o.domain, [o]);
  }
  const sessionsUsed = new Set(observations.map((o) => o.sessionId)).size;
  const sufficientEvidence = sessionsUsed >= minSessions;

  const domains: DomainReadout[] = [...byDomain.entries()].map(([domain, obs]) => {
    const readiness = round(obs.reduce((s, o) => s + o.score, 0) / obs.length);
    // Confidence grows with more observations and lower spread.
    const spread = obs.length > 1 ? stdev(obs.map((o) => o.score)) : 0.35;
    const confidence = round(clamp01(0.4 + 0.15 * Math.min(obs.length, 3) - spread));
    return { domain, readiness, confidence };
  }).sort((a, b) => a.readiness - b.readiness);

  const indicators: ScreeningIndicator[] = [];
  const ilpHypotheses: ILPHypothesis[] = [];

  if (sufficientEvidence) {
    for (const d of domains) {
      const meta = DOMAIN_META[d.domain];
      const signal = signalFor(d.readiness, d.confidence);
      if (signal !== 'none') {
        indicators.push({
          domain: d.domain,
          signal,
          confidence: d.confidence,
          evidenceIds: (byDomain.get(d.domain) ?? []).map((o) => o.evidenceId),
          indicatorType: meta.indicator,
          plainLanguage: plainLanguageFor(meta.label, signal),
          nextSteps: nextStepsFor(signal, meta.reading),
          requiresHumanReview: true,
          isDiagnosis: false,
        });
      }
      // Every below-ceiling domain seeds the learner model with a starting point +
      // support hypothesis — access first, and a development target over time.
      if (d.readiness < 0.7) {
        ilpHypotheses.push({
          domain: meta.evidence,
          statement: `Baseline screening: ${meta.label.toLowerCase()} is a current growth area (establishes support, not a lower standard).`,
          readiness: d.readiness,
          confidence: d.confidence,
          evidenceIds: (byDomain.get(d.domain) ?? []).map((o) => o.evidenceId),
          reviewAt: addDays(today, 30),
          teacherConfirmed: false,
        });
      }
    }
  }

  const familyNotification = buildFamilyNotification(indicators);

  return {
    studentId,
    gradeBand: opts.gradeBand,
    sessionsUsed,
    sufficientEvidence,
    domains,
    indicators,
    ilpHypotheses,
    familyNotification,
    disclaimer: DISCLAIMER,
  };
}

function signalFor(readiness: number, confidence: number): SignalStrength {
  if (confidence < 0.45) return 'none'; // not confident enough to signal anything
  if (readiness < 0.3) return 'notable';
  if (readiness < 0.45) return 'emerging';
  if (readiness < 0.6) return 'monitor';
  return 'none';
}

function nextStepsFor(signal: SignalStrength, reading: boolean): NextStep[] {
  if (signal === 'notable') {
    const base: NextStep[] = ['targeted_intervention', 'specialist_screening_referral', 'family_notification'];
    return base;
  }
  if (signal === 'emerging') {
    // Reading deficiencies trigger immediate intervention + family notification (statute-aligned).
    return reading
      ? ['classroom_support', 'targeted_intervention', 'family_notification']
      : ['classroom_support', 'targeted_intervention'];
  }
  return ['continue_monitoring', 'classroom_support'];
}

function plainLanguageFor(label: string, signal: SignalStrength): string {
  const s = signal === 'notable' ? 'a clear early signal' : signal === 'emerging' ? 'an early signal' : 'a pattern worth watching';
  return `${label}: ${s} that a person should look at more closely. This is where support starts, not a conclusion.`;
}

function buildFamilyNotification(indicators: readonly ScreeningIndicator[]): string | null {
  const notify = indicators.filter((i) => i.nextSteps.includes('family_notification'));
  if (notify.length === 0) return null;
  const readingConcern = notify.some((i) => i.indicatorType.startsWith('reading'));
  const lead = readingConcern
    ? 'Early screening shows your child may benefit from extra reading support, which will begin right away.'
    : 'Early screening shows an area where your child will get extra support, starting now.';
  return `${lead} This is a screening, not a diagnosis — a specialist may follow up. The teacher will share what support looks like and answer your questions.`;
}

// --- helpers ---------------------------------------------------------------
function clamp01(n: number): number { return Math.max(0, Math.min(1, n)); }
function round(n: number): number { return Math.round(n * 1000) / 1000; }
function stdev(xs: readonly number[]): number {
  const m = xs.reduce((s, x) => s + x, 0) / xs.length;
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length);
}
function addDays(d: Date, days: number): string {
  const t = new Date(d.getTime() + days * 86400000);
  return t.toISOString().slice(0, 10);
}

/**
 * Bridge: turn a completed baseline screening into the learner model the assign-once
 * compiler reads. The baseline's `ilpHypotheses` ARE the compiler's `StudentILP.hypotheses`,
 * so a screening result flows straight into individualized delivery — no re-keying, no
 * separate profile. Supports are seeded as access first (rigor unchanged); the compiler
 * then selects the matching adaptation per objective.
 */
export function studentILPFromBaseline(profile: BaselineProfile, displayName?: string): StudentILP {
  return {
    studentId: profile.studentId,
    displayName: displayName ?? profile.studentId,
    gradeBand: profile.gradeBand,
    hypotheses: profile.ilpHypotheses,
  };
}
