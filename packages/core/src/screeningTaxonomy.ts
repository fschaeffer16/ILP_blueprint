/**
 * The universal-screening taxonomy, as engine-readable reference data
 * (see docs/screening-taxonomy.md). This is what the screener is *prepared to watch for*
 * and route to a human — it is NOT a diagnostic map. Conditions listed are what a domain
 * signal may implicate; the eligibility category is always a human/team determination.
 */

import type { ProcessingDomain, NextStep, SignalStrength } from './baseline.js';

export interface ScreeningDomainRef {
  readonly domain: ProcessingDomain;
  readonly group: 'reading_language' | 'math' | 'attention_cognition' | 'motor_visual' | 'social_emotional_sensory' | 'cross_cutting';
  readonly implicates: readonly string[]; // conditions a signal here may point toward
}

/** Every screening domain → the conditions it may implicate (never a diagnosis). */
export const SCREENING_DOMAINS: readonly ScreeningDomainRef[] = [
  { domain: 'phonological_awareness', group: 'reading_language', implicates: ['Dyslexia', 'Speech/Language impairment', 'CAPD'] },
  { domain: 'letter_sound_decoding', group: 'reading_language', implicates: ['Dyslexia'] },
  { domain: 'rapid_naming', group: 'reading_language', implicates: ['Dyslexia'] },
  { domain: 'orthographic_processing', group: 'reading_language', implicates: ['Dyslexia', 'Dysgraphia'] },
  { domain: 'reading_fluency', group: 'reading_language', implicates: ['Dyslexia'] },
  { domain: 'reading_comprehension', group: 'reading_language', implicates: ['Nonverbal LD', 'Autism spectrum', 'Speech/Language impairment'] },
  { domain: 'oral_language', group: 'reading_language', implicates: ['Speech/Language impairment', 'CAPD', 'Autism spectrum'] },
  { domain: 'oral_language_expressive', group: 'reading_language', implicates: ['Speech/Language impairment'] },
  { domain: 'articulation', group: 'reading_language', implicates: ['Speech impairment'] },
  { domain: 'auditory_processing', group: 'reading_language', implicates: ['CAPD', 'Hearing impairment', 'Speech/Language impairment'] },
  { domain: 'number_sense', group: 'math', implicates: ['Dyscalculia'] },
  { domain: 'math_reasoning', group: 'math', implicates: ['Dyscalculia', 'Nonverbal LD'] },
  { domain: 'visual_spatial', group: 'math', implicates: ['Nonverbal LD', 'Dyscalculia'] },
  { domain: 'working_memory', group: 'attention_cognition', implicates: ['ADHD', 'Dyslexia', 'Dyscalculia', 'CAPD', 'Intellectual disability'] },
  { domain: 'processing_speed', group: 'attention_cognition', implicates: ['ADHD', 'Dyslexia', 'DCD', 'Intellectual disability'] },
  { domain: 'sustained_attention', group: 'attention_cognition', implicates: ['ADHD', 'Anxiety', 'CAPD', 'Hearing impairment'] },
  { domain: 'executive_function', group: 'attention_cognition', implicates: ['ADHD', 'Autism spectrum', 'Nonverbal LD', 'Emotional/behavioral'] },
  { domain: 'adaptive_cognitive', group: 'attention_cognition', implicates: ['Intellectual disability'] },
  { domain: 'visual_motor', group: 'motor_visual', implicates: ['Dysgraphia', 'DCD'] },
  { domain: 'fine_motor', group: 'motor_visual', implicates: ['Dysgraphia', 'DCD'] },
  { domain: 'gross_motor', group: 'motor_visual', implicates: ['DCD / dyspraxia'] },
  { domain: 'visual_processing', group: 'motor_visual', implicates: ['Visual processing disorder', 'Dyslexia (overlap)', 'Visual impairment'] },
  { domain: 'social_communication', group: 'social_emotional_sensory', implicates: ['Autism spectrum', 'Nonverbal LD', 'Speech/Language (pragmatic)'] },
  { domain: 'emotional_regulation', group: 'social_emotional_sensory', implicates: ['Emotional/behavioral', 'Anxiety'] },
  { domain: 'sensory_regulation', group: 'social_emotional_sensory', implicates: ['Autism spectrum', 'DCD'] },
  { domain: 'auditory_acuity', group: 'social_emotional_sensory', implicates: ['Hearing impairment / deafness'] },
  { domain: 'visual_acuity', group: 'social_emotional_sensory', implicates: ['Visual impairment / blindness'] },
  { domain: 'oral_written_gap', group: 'cross_cutting', implicates: ['Dysgraphia', 'Specific LD (written expression)'] },
  { domain: 'performance_conditions', group: 'cross_cutting', implicates: ['Anxiety', 'ADHD'] },
  { domain: 'advanced_ability', group: 'cross_cutting', implicates: ['Gifted', 'Twice-exceptional (with any deficit signal)'] },
];

/**
 * Cross-cutting filters — mandatory modifiers on every signal, the primary defense
 * against over-identification and missed twice-exceptional learners.
 */
export const CROSS_CUTTING_FILTERS = [
  { id: 'ell_l1', label: 'ELL / home-language filter', question: 'Is the difficulty present in the home language too? Only-in-English points to language acquisition, not a disability.' },
  { id: 'instructional_adequacy', label: 'Instructional-adequacy filter', question: 'Has the student had adequate, appropriate instruction and opportunity? (RTI’s core question.)' },
  { id: 'sensory_first', label: 'Sensory-first filter', question: 'Rule out uncorrected hearing/vision loss before attributing to a processing disorder.' },
  { id: 'twice_exceptional', label: 'Twice-exceptional co-occurrence', question: 'A high-ability signal alongside any deficit signal triggers a 2e review — strong overall performance must never suppress a disability referral.' },
] as const;

/** The signal-strength → next-step routing ladder. Every rung is a support or a hand-off. */
export interface SignalRoutingRung {
  readonly signal: SignalStrength;
  readonly meaning: string;
  readonly automatedStep: string;
  readonly humanStep: string;
  readonly nextSteps: readonly NextStep[];
}
export const SIGNAL_ROUTING: readonly SignalRoutingRung[] = [
  { signal: 'none', meaning: 'Isolated / occasional indicator', automatedStep: 'Universal monitoring; light differentiation', humanStep: 'None', nextSteps: ['continue_monitoring'] },
  { signal: 'monitor', meaning: 'Watch — a pattern beginning to show', automatedStep: 'Monitor; adapt delivery lightly', humanStep: 'None yet', nextSteps: ['continue_monitoring', 'classroom_support'] },
  { signal: 'emerging', meaning: 'Pattern below benchmark (Tier 1/2)', automatedStep: 'Adapt delivery, targeted practice; begin progress monitoring', humanStep: 'Teacher notified; log in MTSS (+ family notice for reading)', nextSteps: ['classroom_support', 'targeted_intervention', 'family_notification'] },
  { signal: 'notable', meaning: 'Durable, cross-domain, adverse impact after intervention (Tier 3 / referral threshold)', automatedStep: 'Stop escalating autonomously; assemble evidence packet', humanStep: 'Team reviews; recommend formal evaluation; obtain written parental consent', nextSteps: ['targeted_intervention', 'specialist_screening_referral', 'recommend_formal_evaluation', 'family_notification'] },
];
