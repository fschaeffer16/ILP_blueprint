/**
 * A sample adaptation catalog for the grade-3 pilot slice.
 *
 * This is exactly the kind of object a district customizes: add adaptations, retune
 * their triggers, or disable ones its policy disallows. Every adaptation declares
 * what it may and may not change, so customization stays inside the guardrails.
 *
 * The two `objective_modification` entries are included deliberately to show that the
 * catalog *can* express rigor-changing adaptations — but objectives that need
 * equivalent mastery list them under `prohibitedAdaptations`, and the engine never
 * applies them automatically.
 */

import type { Adaptation } from '../types.js';

export const SAMPLE_ADAPTATIONS: readonly Adaptation[] = [
  {
    id: 'vocabulary_preview',
    label: 'Vocabulary preview',
    adaptationClass: 'access',
    permittedChange:
      'Front-load objective-irrelevant vocabulary and key terms before the lesson.',
    prohibitedChange: 'Remove or simplify the essential mathematical vocabulary itself.',
    triggers: [{ domain: 'language_access', maxReadiness: 0.55 }],
    fadeRule: null,
    contributesToPattern: 'vocabulary_supported',
    costWeight: 1,
  },
  {
    id: 'read_aloud',
    label: 'Read-aloud support',
    adaptationClass: 'access',
    permittedChange: 'Provide text-to-speech for lesson prose and directions.',
    prohibitedChange:
      'Read aloud the answer, or read content whose decoding is the objective being measured.',
    triggers: [{ domain: 'language_access', maxReadiness: 0.4 }],
    fadeRule: 'Fade when independent reading readiness rises above 0.6.',
    contributesToPattern: 'vocabulary_supported',
    costWeight: 1,
  },
  {
    id: 'visual_first_models',
    label: 'Visual-first models',
    adaptationClass: 'scaffold',
    permittedChange:
      'Lead with area/set fraction models and diagrams before symbolic notation.',
    prohibitedChange: 'Replace the requirement to explain or represent with recognition only.',
    triggers: [{ domain: 'mathematical_reasoning', maxReadiness: 0.55 }],
    fadeRule: 'Fade the model once the student represents fractions symbolically unaided.',
    contributesToPattern: 'visual_first',
    costWeight: 2,
  },
  {
    id: 'worked_example_fade',
    label: 'Worked example with fading',
    adaptationClass: 'scaffold',
    permittedChange:
      'Show a fully worked parallel example, then gradually remove steps across practice.',
    prohibitedChange: 'Leave scaffolding in place for the mastery task itself.',
    triggers: [{ domain: 'prerequisite_knowledge', maxReadiness: 0.5 }],
    fadeRule: 'Remove all steps before the mastery task; track independent performance.',
    contributesToPattern: 'guided_practice',
    costWeight: 2,
  },
  {
    id: 'chunked_prompt',
    label: 'Chunked prompt & pacing',
    adaptationClass: 'scaffold',
    permittedChange: 'Break multi-step prompts into smaller sequenced steps with check-ins.',
    prohibitedChange: 'Reduce the number of reasoning steps the objective requires.',
    triggers: [{ domain: 'assessment_conditions', maxReadiness: 0.5 }],
    fadeRule: 'Fade chunking as the student sustains multi-step work independently.',
    contributesToPattern: 'guided_practice',
    costWeight: 1,
  },
  {
    id: 'advanced_transfer_case',
    label: 'Advanced transfer case',
    adaptationClass: 'difficulty',
    permittedChange:
      'Extend with an unfamiliar transfer application at the SAME rigor and mastery rule.',
    prohibitedChange: 'Raise the mastery threshold or add out-of-objective content.',
    triggers: [{ domain: 'objective_mastery', minReadiness: 0.85 }],
    fadeRule: null,
    contributesToPattern: 'advanced_transfer',
    costWeight: 2,
  },
  // --- Rigor-changing adaptations: expressible, but guarded ------------------
  {
    id: 'reduce_to_recognition_only',
    label: 'Reduce to recognition only',
    adaptationClass: 'objective_modification',
    permittedChange: 'Change the task to multiple-choice recognition instead of representation.',
    prohibitedChange: 'Be reported as equivalent mastery of the represent/explain objective.',
    triggers: [{ domain: 'objective_mastery', maxReadiness: 0.15 }],
    fadeRule: null,
    contributesToPattern: 'core',
    costWeight: 1,
  },
  {
    id: 'remove_explanation',
    label: 'Remove explanation requirement',
    adaptationClass: 'objective_modification',
    permittedChange: 'Drop the "explain your reasoning" demand.',
    prohibitedChange: 'Be reported as equivalent mastery when explanation is required reasoning.',
    triggers: [{ domain: 'written_expression', maxReadiness: 0.15 }],
    fadeRule: null,
    contributesToPattern: 'core',
    costWeight: 1,
  },
];
