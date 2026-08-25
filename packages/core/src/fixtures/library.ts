/**
 * A synthetic-but-real grade-3 content library — enough to drive a full demo.
 *
 * Six standards-mapped objectives across a mathematics unit (fractions), an
 * evidence-based reading/writing unit, and one history/civics simulation. Each carries
 * an authored lesson with actual student-facing content, assessment items, and a rubric,
 * all drawn from an approved source library. Every piece is built to pass the guardrail
 * gates (objective authoring, lesson coverage, item integrity) — see `buildCatalog`.
 *
 * Content is original, age-appropriate, and grounded in the kinds of vetted sources the
 * content-governance model approves. No real student data; source names are
 * representative candidates whose licensing is confirmed in the vetting pipeline.
 */

import type { ObjectiveVersion, SourceRecord } from '../types.js';
import type { LessonPlan } from '../lessons.js';
import type { AssessmentItem, Rubric } from '../assessment.js';

// ---------------------------------------------------------------------------
// Approved source library (all approved + dated; spans tiers 2–4)
// ---------------------------------------------------------------------------

export const LIBRARY_SOURCES: readonly SourceRecord[] = [
  { id: 'SRC-001', title: 'Fraction models and tasks (grade 3)', citation: 'Illustrative Mathematics — fractions as equal parts.', uri: 'https://www.illustrativemathematics.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by', reviewStatus: 'approved', reviewedAt: '2026-08-01', reviewBy: '2027-08-01' },
  { id: 'SRC-002', title: 'Real-world fractions media', citation: 'Smithsonian Open Access — public-domain objects and images.', uri: 'https://www.si.edu/openaccess', tier: 'primary', authorityType: 'museum_library', license: 'public_domain', reviewStatus: 'approved', reviewedAt: '2026-08-05', reviewBy: '2027-08-05' },
  { id: 'SRC-010', title: 'Elementary mathematics reference', citation: 'OpenStax-style openly-licensed K–5 math reference.', uri: 'https://openstax.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by', reviewStatus: 'approved', reviewedAt: '2026-08-03', reviewBy: '2027-08-03' },
  { id: 'SRC-011', title: 'Fractions FlexBook', citation: 'CK-12 Foundation — fractions concept set.', uri: 'https://www.ck12.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by_nc', reviewStatus: 'approved', reviewedAt: '2026-08-04', reviewBy: '2027-08-04' },
  { id: 'SRC-012', title: 'Primary texts for young readers', citation: 'Library of Congress — digitized public-domain texts.', uri: 'https://www.loc.gov/', tier: 'primary', authorityType: 'museum_library', license: 'public_domain', reviewStatus: 'approved', reviewedAt: '2026-08-06', reviewBy: '2027-08-06' },
  { id: 'SRC-013', title: 'Leveled current-events article', citation: 'Leveled nonfiction passage (licensed), grade-3 band.', uri: 'https://newsela.com/', tier: 'licensed', authorityType: 'publisher', license: 'licensed', reviewStatus: 'approved', reviewedAt: '2026-08-07', reviewBy: '2027-02-07' },
  { id: 'SRC-014', title: 'Community decision primary documents', citation: 'National Archives — DocsTeach public-domain documents.', uri: 'https://www.docsteach.org/', tier: 'primary', authorityType: 'government', license: 'public_domain', reviewStatus: 'approved', reviewedAt: '2026-08-08', reviewBy: '2027-08-08' },
  { id: 'SRC-015', title: 'Water and community media clip', citation: 'PBS LearningMedia — classroom clip (licensed for education).', uri: 'https://www.pbslearningmedia.org/', tier: 'licensed', authorityType: 'publisher', license: 'licensed', reviewStatus: 'approved', reviewedAt: '2026-08-09', reviewBy: '2027-02-09' },
  { id: 'SRC-016', title: 'Local water-use data', citation: 'USGS Water Science — public-domain data and figures.', uri: 'https://www.usgs.gov/mission-areas/water-resources', tier: 'primary', authorityType: 'government', license: 'public_domain', reviewStatus: 'approved', reviewedAt: '2026-08-10', reviewBy: '2027-08-10' },
];

// ---------------------------------------------------------------------------
// Objectives
// ---------------------------------------------------------------------------

const PROHIBITED = ['reduce_to_recognition_only', 'remove_explanation'];
const COMMON_ADAPTATIONS = ['vocabulary_preview', 'read_aloud', 'chunked_prompt', 'worked_example_fade', 'advanced_transfer_case'];

function objective(o: Omit<ObjectiveVersion, 'status' | 'gradeBand' | 'permittedAdaptations' | 'prohibitedAdaptations' | 'remediationPatternIds'> & Partial<ObjectiveVersion>): ObjectiveVersion {
  return {
    status: 'published',
    gradeBand: '3',
    permittedAdaptations: COMMON_ADAPTATIONS,
    prohibitedAdaptations: PROHIBITED,
    remediationPatternIds: [],
    ...o,
  };
}

export const LIBRARY_OBJECTIVES: readonly ObjectiveVersion[] = [
  objective({
    objectiveId: 'M3.NF.01', version: 1, subject: 'mathematics', standardRefs: ['MA.3.FR.1.1'],
    studentOutcome: 'Explain and represent a fraction as equal parts of a whole.',
    essentialKnowledge: ['numerator', 'denominator', 'equal parts', 'whole/part relationship'],
    requiredReasoning: ['represent', 'explain', 'transfer'],
    prerequisites: ['equal partitioning'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['larger denominator means larger fraction'], sourceIds: ['SRC-001', 'SRC-002'], remediationPatternIds: ['REM-FRACTION-AREA'],
  }),
  objective({
    objectiveId: 'M3.NF.02', version: 1, subject: 'mathematics', standardRefs: ['MA.3.FR.1.2'],
    studentOutcome: 'Compare two fractions with the same numerator or the same denominator, and justify the comparison.',
    essentialKnowledge: ['numerator', 'denominator', 'same whole'],
    requiredReasoning: ['compare', 'justify'],
    prerequisites: ['represent fractions'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['a bigger bottom number always means a bigger fraction'], sourceIds: ['SRC-001', 'SRC-011'],
  }),
  objective({
    objectiveId: 'M3.NF.03', version: 1, subject: 'mathematics', standardRefs: ['MA.3.FR.1.3'],
    studentOutcome: 'Recognize and generate simple equivalent fractions and explain why they are equal.',
    essentialKnowledge: ['equivalent', 'equal parts', 'same whole'],
    requiredReasoning: ['represent', 'generate', 'explain'],
    prerequisites: ['represent fractions'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['different numbers always mean different amounts'], sourceIds: ['SRC-001', 'SRC-010'],
  }),
  objective({
    objectiveId: 'RW3.01', version: 1, subject: 'reading', standardRefs: ['ELA.3.R.2.2'],
    studentOutcome: 'Determine the main idea of a text and explain how key details support it.',
    essentialKnowledge: ['main idea', 'key detail', 'supporting evidence'],
    requiredReasoning: ['identify', 'explain'],
    prerequisites: ['read grade-level text'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['the first sentence is always the main idea'], sourceIds: ['SRC-013', 'SRC-012'],
  }),
  objective({
    objectiveId: 'RW3.02', version: 1, subject: 'writing', standardRefs: ['ELA.3.C.1.4'],
    studentOutcome: 'Write an answer that states a claim and supports it with specific evidence from the text.',
    essentialKnowledge: ['claim', 'textual evidence', 'explanation'],
    requiredReasoning: ['state', 'cite', 'explain'],
    prerequisites: ['identify key details'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['a longer answer is always a better answer'], sourceIds: ['SRC-012', 'SRC-013'],
  }),
  objective({
    objectiveId: 'CIV3.01', version: 1, subject: 'history_civics', standardRefs: ['SS.3.CG.1.4'],
    studentOutcome: 'Weigh community needs and evidence to make a resource decision and defend it, revising when evidence changes.',
    essentialKnowledge: ['community need', 'trade-off', 'stakeholder', 'evidence'],
    requiredReasoning: ['analyze', 'decide', 'defend', 'revise'],
    prerequisites: ['read informational text'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['the choice most people want is always the best choice'], sourceIds: ['SRC-014', 'SRC-016'],
  }),
];

// ---------------------------------------------------------------------------
// Lessons (with real, student-facing content)
// ---------------------------------------------------------------------------

export const LIBRARY_LESSONS: readonly LessonPlan[] = [
  {
    id: 'LP-M3.NF.01', objectiveId: 'M3.NF.01', objectiveVersion: 1, authorId: 'T-100',
    title: 'Fractions as equal parts',
    blocks: [
      { id: 'a1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will show a fraction using equal parts of a whole, and explain what the top and bottom numbers mean.', sourceIds: [], targets: [] },
      { id: 'a2', kind: 'instruction', title: 'Equal parts and the whole', body: 'When we split one whole into equal parts, each part is a unit fraction. The bottom number (denominator) tells how many equal parts the whole was split into. The top number (numerator) tells how many of those parts we are talking about. So 1/4 means the whole was split into 4 equal parts, and we have 1 of them.', sourceIds: ['SRC-001'], targets: ['represent', 'explain'], techniqueId: 'visual_first_models' },
      { id: 'a3', kind: 'worked_example', title: 'Naming a shaded part', body: 'A rectangle is split into 3 equal parts and 1 part is shaded. There are 3 equal parts, so the denominator is 3. One part is shaded, so the numerator is 1. The shaded amount is 1/3.', sourceIds: ['SRC-001'], targets: ['represent'], techniqueId: 'worked_example_fade' },
      { id: 'a4', kind: 'practice', title: 'Shade and name', body: 'Shade the fraction shown and write the fraction. Explain how you know the parts are equal.', sourceIds: ['SRC-001'], targets: ['represent', 'explain'] },
      { id: 'a5', kind: 'mastery_task', title: 'Represent, explain, transfer', body: 'Draw 2/6 on a bar model. Explain what the 2 and the 6 mean. Then show the same amount on a different whole (a circle) and explain why it is still 2/6.', sourceIds: ['SRC-002'], targets: ['represent', 'explain', 'transfer'] },
      { id: 'a6', kind: 'reflection', title: 'Think back', body: 'What helped you know the parts were equal? What is still tricky?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.NF.02', objectiveId: 'M3.NF.02', objectiveVersion: 1, authorId: 'T-100',
    title: 'Comparing fractions',
    blocks: [
      { id: 'b1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will compare two fractions and explain which is greater — and why.', sourceIds: [], targets: [] },
      { id: 'b2', kind: 'instruction', title: 'Same whole, compare the parts', body: 'To compare fairly, both fractions must come from the same-size whole. With the same denominator, the fraction with the bigger numerator is greater (3/5 > 2/5). With the same numerator, the fraction with the SMALLER denominator is greater, because the whole was cut into fewer, bigger pieces (1/3 > 1/4).', sourceIds: ['SRC-011'], targets: ['compare'], techniqueId: 'visual_first_models' },
      { id: 'b3', kind: 'practice', title: 'Which is greater?', body: 'Use a bar model to compare 2/6 and 4/6, then 1/2 and 1/5. Circle the greater fraction each time.', sourceIds: ['SRC-001'], targets: ['compare'] },
      { id: 'b4', kind: 'mastery_task', title: 'Compare and justify', body: 'Compare 1/3 and 1/6. Which is greater? Justify your answer with a picture and a sentence about the size of the pieces.', sourceIds: ['SRC-001'], targets: ['compare', 'justify'] },
      { id: 'b5', kind: 'reflection', title: 'Think back', body: 'When can a bigger bottom number make a SMALLER fraction? Explain.', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.NF.03', objectiveId: 'M3.NF.03', objectiveVersion: 1, authorId: 'T-100',
    title: 'Equivalent fractions',
    blocks: [
      { id: 'c1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will find fractions that name the same amount and explain why they are equal.', sourceIds: [], targets: [] },
      { id: 'c2', kind: 'instruction', title: 'Same amount, different names', body: 'Two fractions are equivalent when they cover the same amount of the same whole. If you split each part in half, you have twice as many parts (a bigger denominator) but each is half the size — so 1/2 and 2/4 name the same amount.', sourceIds: ['SRC-010'], targets: ['represent', 'explain'], techniqueId: 'visual_first_models' },
      { id: 'c3', kind: 'worked_example', title: 'Making an equivalent fraction', body: 'Start with 1/2 of a bar. Split each half into 2. Now there are 4 parts and 2 are shaded: 2/4. The shaded amount did not change, so 1/2 = 2/4.', sourceIds: ['SRC-001'], targets: ['generate'], techniqueId: 'worked_example_fade' },
      { id: 'c4', kind: 'practice', title: 'Find a match', body: 'Draw a fraction equal to 1/3 by splitting each part into 2. Write both fractions.', sourceIds: ['SRC-001'], targets: ['represent', 'generate'] },
      { id: 'c5', kind: 'mastery_task', title: 'Generate and explain', body: 'Show a fraction equivalent to 2/3 using a new whole, and explain why the two fractions are equal.', sourceIds: ['SRC-010'], targets: ['represent', 'generate', 'explain'] },
      { id: 'c6', kind: 'reflection', title: 'Think back', body: 'How can two fractions with different numbers name the same amount?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-RW3.01', objectiveId: 'RW3.01', objectiveVersion: 1, authorId: 'T-100',
    title: 'Finding the main idea',
    blocks: [
      { id: 'd1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will find the main idea of a passage and show the details that back it up.', sourceIds: [], targets: [] },
      { id: 'd2', kind: 'instruction', title: 'Main idea vs. details', body: 'The main idea is what the whole text is mostly about — not just the first sentence. Key details are the facts and examples that support it. To find the main idea, ask: what do most of the details have in common?', sourceIds: ['SRC-013'], targets: ['identify', 'explain'], techniqueId: 'chunked_prompt' },
      { id: 'd3', kind: 'practice', title: 'Detail hunt', body: 'Read the passage. Underline three key details. Then write one sentence for the main idea they support.', sourceIds: ['SRC-013'], targets: ['identify'] },
      { id: 'd4', kind: 'mastery_task', title: 'Main idea + support', body: 'Read the short passage. Write the main idea in one sentence, then explain how two key details support it.', sourceIds: ['SRC-012'], targets: ['identify', 'explain'] },
      { id: 'd5', kind: 'reflection', title: 'Think back', body: 'Why is the first sentence not always the main idea?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-RW3.02', objectiveId: 'RW3.02', objectiveVersion: 1, authorId: 'T-100',
    title: 'Answer with evidence',
    blocks: [
      { id: 'e1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will answer a question by making a claim and backing it up with evidence from the text.', sourceIds: [], targets: [] },
      { id: 'e2', kind: 'instruction', title: 'Claim, evidence, explain', body: 'A strong answer has three parts: a claim (your answer in one sentence), evidence (a specific detail or quote from the text), and an explanation (how the evidence supports your claim). Longer is not better — specific is better.', sourceIds: ['SRC-013'], targets: ['state', 'cite', 'explain'], techniqueId: 'worked_example_fade' },
      { id: 'e3', kind: 'practice', title: 'Find the evidence', body: 'For the question given, write your claim, then copy the exact sentence from the text that proves it.', sourceIds: ['SRC-012'], targets: ['state', 'cite'] },
      { id: 'e4', kind: 'mastery_task', title: 'Full answer', body: 'Answer the question in a short paragraph: state your claim, cite one piece of evidence from the text, and explain how it supports your claim.', sourceIds: ['SRC-012'], targets: ['state', 'cite', 'explain'] },
      { id: 'e5', kind: 'reflection', title: 'Think back', body: 'What makes evidence strong instead of just long?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-CIV3.01', objectiveId: 'CIV3.01', objectiveVersion: 1, authorId: 'T-100',
    title: 'The community water decision (simulation)',
    blocks: [
      { id: 'f1', kind: 'objective_preview', title: 'Your mission', body: 'Your town has one budget and three needs: a new park, repairing old water pipes, and a summer reading program. You will study the evidence, make a choice, defend it, and revise if the facts change.', sourceIds: [], targets: [] },
      { id: 'f2', kind: 'instruction', title: 'Needs, trade-offs, stakeholders', body: 'Every choice has trade-offs — spending on one need means less for another. Different people (stakeholders) care about different things. A good decision weighs the evidence and thinks about who is affected, not just who is loudest.', sourceIds: ['SRC-014'], targets: ['analyze'], techniqueId: 'chunked_prompt' },
      { id: 'f3', kind: 'instruction', title: 'Read the evidence', body: 'Study the water-use data and the town notes. Which need affects health and safety? Which affects the most people? Which can wait?', sourceIds: ['SRC-016'], targets: ['analyze'] },
      { id: 'f4', kind: 'practice', title: 'Make your choice', body: 'Choose one need to fund first. Write one reason based on the evidence.', sourceIds: ['SRC-016'], targets: ['decide'] },
      { id: 'f5', kind: 'mastery_task', title: 'Decide, defend, revise', body: 'A pause: a new report shows the old pipes are leaking clean water faster than expected. Decide what to fund first, defend it with evidence, and explain whether the new report changes your plan and why.', sourceIds: ['SRC-016'], targets: ['decide', 'defend', 'revise'] },
      { id: 'f6', kind: 'reflection', title: 'Think back', body: 'Did changing your mind when the evidence changed make your decision weaker or stronger? Why?', sourceIds: [], targets: [] },
    ],
  },
];

// ---------------------------------------------------------------------------
// Assessment items (each traces to its objective; MC items answerable + leak-free)
// ---------------------------------------------------------------------------

function mc(itemId: string, objectiveId: string, evidenceClaim: string, prompt: string, answerKey: string[], distractors: string[], sourceIds: string[], prohibitedClues: string[]): AssessmentItem {
  return { itemId, objectiveId, objectiveVersion: 1, format: 'multiple_choice', prompt, evidenceClaim, answerKey, distractors, equivalenceBand: 'B2', sourceIds, prohibitedClues, status: 'approved' };
}
function cr(itemId: string, objectiveId: string, evidenceClaim: string, prompt: string, sourceIds: string[], prohibitedClues: string[]): AssessmentItem {
  return { itemId, objectiveId, objectiveVersion: 1, format: 'constructed_response', prompt, evidenceClaim, answerKey: [], distractors: [], equivalenceBand: 'B2', sourceIds, prohibitedClues, status: 'approved' };
}

export const LIBRARY_ITEMS: readonly AssessmentItem[] = [
  mc('IT-M3.NF.01-1', 'M3.NF.01', 'represent', 'A pizza is cut into 4 equal slices and you take 1 slice. Which fraction shows how much you took?', ['1/4'], ['1/3', '4/1', '3/4'], ['SRC-001'], ['larger denominator means larger fraction']),
  cr('IT-M3.NF.01-2', 'M3.NF.01', 'explain', 'Draw 2/6 and explain what the 2 and the 6 mean, then show the same amount on a different whole.', ['SRC-002'], ['larger denominator means larger fraction']),
  mc('IT-M3.NF.02-1', 'M3.NF.02', 'compare', 'Which fraction is greater, if the wholes are the same size?', ['1/3'], ['1/6', '1/8'], ['SRC-011'], ['a bigger bottom number always means a bigger fraction']),
  cr('IT-M3.NF.02-2', 'M3.NF.02', 'justify', 'Compare 1/3 and 1/6. Justify which is greater using the size of the pieces.', ['SRC-001'], ['a bigger bottom number always means a bigger fraction']),
  cr('IT-M3.NF.03-1', 'M3.NF.03', 'generate', 'Show a fraction equal to 1/2 by splitting the parts, and write both fractions.', ['SRC-010'], ['different numbers always mean different amounts']),
  cr('IT-M3.NF.03-2', 'M3.NF.03', 'explain', 'Explain why 2/3 and 4/6 name the same amount.', ['SRC-001'], ['different numbers always mean different amounts']),
  cr('IT-RW3.01-1', 'RW3.01', 'identify', 'Read the passage and write the main idea in one sentence.', ['SRC-013'], ['the first sentence is always the main idea']),
  cr('IT-RW3.01-2', 'RW3.01', 'explain', 'Explain how two key details support the main idea you found.', ['SRC-012'], ['the first sentence is always the main idea']),
  cr('IT-RW3.02-1', 'RW3.02', 'cite', 'Answer the question and copy the exact sentence from the text that proves your answer.', ['SRC-012'], ['a longer answer is always a better answer']),
  cr('IT-RW3.02-2', 'RW3.02', 'explain', 'Explain how your evidence supports your claim.', ['SRC-013'], ['a longer answer is always a better answer']),
  cr('IT-CIV3.01-1', 'CIV3.01', 'decide', 'Choose which community need to fund first and give one reason based on the evidence.', ['SRC-016'], ['the choice most people want is always the best choice']),
  cr('IT-CIV3.01-2', 'CIV3.01', 'revise', 'The pipe report changed. Explain whether your plan changes and why, using the new evidence.', ['SRC-016'], ['the choice most people want is always the best choice']),
];

// ---------------------------------------------------------------------------
// Rubrics (one per objective, criteria mapped to required reasoning)
// ---------------------------------------------------------------------------

function rubric(objectiveId: string, criteria: { trace: string; desc: string; max: number }[]): Rubric {
  return {
    rubricId: `RUB-${objectiveId}`, objectiveId, objectiveVersion: 1,
    criteria: criteria.map((c, i) => ({ id: `${objectiveId}-c${i + 1}`, description: c.desc, maxPoints: c.max, objectiveTrace: c.trace })),
  };
}

export const LIBRARY_RUBRICS: readonly Rubric[] = [
  rubric('M3.NF.01', [{ trace: 'represent', desc: 'Represents the fraction with equal parts.', max: 3 }, { trace: 'explain', desc: 'Explains numerator and denominator.', max: 3 }, { trace: 'transfer', desc: 'Transfers to a new whole.', max: 2 }]),
  rubric('M3.NF.02', [{ trace: 'compare', desc: 'Compares the fractions correctly.', max: 3 }, { trace: 'justify', desc: 'Justifies using the size of the pieces.', max: 3 }]),
  rubric('M3.NF.03', [{ trace: 'generate', desc: 'Generates an equivalent fraction.', max: 3 }, { trace: 'explain', desc: 'Explains why they are equal.', max: 3 }]),
  rubric('RW3.01', [{ trace: 'identify', desc: 'Identifies the main idea.', max: 3 }, { trace: 'explain', desc: 'Explains how details support it.', max: 3 }]),
  rubric('RW3.02', [{ trace: 'cite', desc: 'Cites specific textual evidence.', max: 3 }, { trace: 'explain', desc: 'Explains how evidence supports the claim.', max: 3 }]),
  rubric('CIV3.01', [{ trace: 'decide', desc: 'Makes an evidence-based decision.', max: 3 }, { trace: 'defend', desc: 'Defends it with evidence.', max: 3 }, { trace: 'revise', desc: 'Revises appropriately when evidence changes.', max: 2 }]),
];

// ---------------------------------------------------------------------------
// The pack
// ---------------------------------------------------------------------------

export const CONTENT_LIBRARY = {
  sources: LIBRARY_SOURCES,
  objectives: LIBRARY_OBJECTIVES,
  lessons: LIBRARY_LESSONS,
  items: LIBRARY_ITEMS,
  rubrics: LIBRARY_RUBRICS,
} as const;
