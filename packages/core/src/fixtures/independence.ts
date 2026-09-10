/**
 * Prompt-level evidence fixtures (IEP build, step 3): three honest stories on the
 * same compare-fractions module (M2), all synthetic.
 *
 *  - Leo answers through his AAC channel and is *gaining independence*: the
 *    chunking scaffold has evidence behind fading; his channel never fades.
 *  - Zara is steady — no fade conversation yet, and that's fine.
 *  - Maya is getting everything right *with support* — real mastery, not yet
 *    independent; the flag keeps both mistakes off the table (calling it failure,
 *    or calling it independence).
 */

import type { PromptedAttempt } from '../independence.js';

const at = (
  studentId: string,
  date: string,
  n: number,
  correct: boolean,
  promptLevel: PromptedAttempt['promptLevel'],
  responseChannel: PromptedAttempt['responseChannel'],
): PromptedAttempt => ({
  studentId,
  itemId: `EX-G3-U1-QC${n}_M2`,
  objectiveId: 'M3.NF.02',
  moduleId: 'M2',
  date,
  correct,
  promptLevel,
  responseChannel,
});

export const ESE_INDEPENDENCE_ATTEMPTS: readonly PromptedAttempt[] = [
  // Leo — AAC channel, three weeks, support stepping back as evidence accrues.
  at('E-LEO', '2026-08-24', 1, false, 'full_support', 'symbol_tap'),
  at('E-LEO', '2026-08-26', 2, true, 'full_support', 'symbol_tap'),
  at('E-LEO', '2026-08-28', 3, true, 'modeled', 'symbol_tap'),
  at('E-LEO', '2026-09-01', 4, true, 'gestural_prompt', 'symbol_tap'),
  at('E-LEO', '2026-09-03', 5, true, 'gestural_prompt', 'symbol_tap'),
  at('E-LEO', '2026-09-05', 6, true, 'independent', 'symbol_tap'),
  at('E-LEO', '2026-09-08', 7, true, 'independent', 'symbol_tap'),
  at('E-LEO', '2026-09-09', 8, true, 'independent', 'symbol_tap'),

  // Zara — steady mix; keep supporting, nothing to fade yet.
  at('E-ZARA', '2026-08-25', 1, true, 'gestural_prompt', 'text'),
  at('E-ZARA', '2026-08-28', 2, false, 'independent', 'text'),
  at('E-ZARA', '2026-09-02', 3, true, 'gestural_prompt', 'text'),
  at('E-ZARA', '2026-09-04', 4, true, 'independent', 'text'),
  at('E-ZARA', '2026-09-08', 5, false, 'gestural_prompt', 'text'),
  at('E-ZARA', '2026-09-09', 6, true, 'gestural_prompt', 'text'),

  // Maya — everything correct, nothing independent yet: supported mastery.
  at('E-MAYA', '2026-08-25', 1, true, 'modeled', 'speech'),
  at('E-MAYA', '2026-08-28', 2, true, 'full_support', 'speech'),
  at('E-MAYA', '2026-09-01', 3, true, 'modeled', 'speech'),
  at('E-MAYA', '2026-09-03', 4, true, 'modeled', 'speech'),
  at('E-MAYA', '2026-09-05', 5, true, 'gestural_prompt', 'speech'),
  at('E-MAYA', '2026-09-08', 6, true, 'modeled', 'speech'),
];

/** UI notes for the three stories — which scaffold the evidence speaks to. */
export const INDEPENDENCE_STORIES = [
  {
    studentId: 'E-LEO',
    name: 'Leo',
    scaffold: 'Chunked prompt & pacing',
    note: 'His AAC channel is exempt — channels never fade. The chunking scaffold is what the evidence speaks to.',
  },
  {
    studentId: 'E-ZARA',
    name: 'Zara',
    scaffold: 'Chunked prompt & pacing',
    note: 'Steady is a finding too: keep the support, keep collecting evidence.',
  },
  {
    studentId: 'E-MAYA',
    name: 'Maya',
    scaffold: 'Read-aloud support',
    note: 'Every answer right, none independent yet — real mastery, still supported. Neither a failure nor a fade.',
  },
] as const;
