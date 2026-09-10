/**
 * Picture-response fixtures (IEP build, step 1). The glyphs here are honest
 * part-whole pictures built from filled/empty squares — a stand-in for the
 * child's own AAC symbol set, which a deployed district build imports instead.
 */

import type { AssessmentItem } from '../assessment.js';
import type { SymbolVocabulary } from '../symbolResponse.js';

/** Part-whole pictures for the grade-3 fraction items. Label = the answer value. */
export const FRACTION_SYMBOLS: SymbolVocabulary = {
  vocabId: 'VOCAB-FRACTIONS-1',
  symbols: [
    { glyph: '🟦⬜⬜⬜', label: '1/4' },
    { glyph: '🟦⬜⬜', label: '1/3' },
    { glyph: '🟦🟦🟦⬜', label: '3/4' },
    { glyph: '🟦 🟦 🟦 🟦', label: '4/1' },
    { glyph: '🟦⬜⬜⬜⬜⬜', label: '1/6' },
    { glyph: '🟦⬜⬜⬜⬜⬜⬜⬜', label: '1/8' },
  ],
};

/**
 * The module-tagged picture-response demo item: the same compare-fractions
 * question the class gets (library item IT-M3.NF.02-1), carried on an exam
 * with an `_M2` module tag so a symbol tap rolls into module tracking.
 */
export const SYMBOL_DEMO_ITEM: AssessmentItem = {
  itemId: 'IT-M3.NF.02-mc1_M2',
  objectiveId: 'M3.NF.02',
  objectiveVersion: 1,
  format: 'multiple_choice',
  prompt: 'Which fraction is greater, if the wholes are the same size?',
  evidenceClaim: 'compare',
  answerKey: ['1/3'],
  distractors: ['1/6', '1/8'],
  equivalenceBand: 'B2',
  sourceIds: ['SRC-011'],
  prohibitedClues: ['a bigger bottom number always means a bigger fraction'],
  status: 'approved',
};
