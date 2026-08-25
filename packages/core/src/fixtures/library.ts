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
  { id: 'SRC-017', title: 'Base-ten and operations tasks (grade 3)', citation: 'Illustrative Mathematics — place value, rounding, multiplication/division tasks.', uri: 'https://www.illustrativemathematics.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by', reviewStatus: 'approved', reviewedAt: '2026-08-11', reviewBy: '2027-08-11' },
  { id: 'SRC-018', title: 'Measurement and time tasks (grade 3)', citation: 'OER elementary measurement set — clocks, elapsed time, length and volume.', uri: 'https://openstax.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by', reviewStatus: 'approved', reviewedAt: '2026-08-11', reviewBy: '2027-08-11' },
  { id: 'SRC-019', title: 'Geometry, area and perimeter tasks (grade 3)', citation: 'CK-12 Foundation — area/perimeter and 2-D figures concept set.', uri: 'https://www.ck12.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by_nc', reviewStatus: 'approved', reviewedAt: '2026-08-12', reviewBy: '2027-08-12' },
  { id: 'SRC-020', title: 'Data and graphing tasks (grade 3)', citation: 'Illustrative Mathematics — scaled bar graphs, pictographs and line plots.', uri: 'https://www.illustrativemathematics.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by', reviewStatus: 'approved', reviewedAt: '2026-08-12', reviewBy: '2027-08-12' },
  { id: 'SRC-021', title: 'Grade-3 literary anthology', citation: 'Project Gutenberg / Library of Congress — public-domain short stories and fables.', uri: 'https://www.gutenberg.org/', tier: 'primary', authorityType: 'museum_library', license: 'public_domain', reviewStatus: 'approved', reviewedAt: '2026-08-13', reviewBy: '2027-08-13' },
  { id: 'SRC-022', title: 'Morphology reference: Greek and Latin roots', citation: 'Openly-licensed word-study reference for common roots, base words and affixes.', uri: 'https://openstax.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by', reviewStatus: 'approved', reviewedAt: '2026-08-13', reviewBy: '2027-08-13' },
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
    objectiveId: 'M3.NF.02', version: 1, subject: 'mathematics', standardRefs: ['MA.3.FR.2.1'],
    studentOutcome: 'Compare two fractions with the same numerator or the same denominator, and justify the comparison.',
    essentialKnowledge: ['numerator', 'denominator', 'same whole'],
    requiredReasoning: ['compare', 'justify'],
    prerequisites: ['represent fractions'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['a bigger bottom number always means a bigger fraction'], sourceIds: ['SRC-001', 'SRC-011'],
  }),
  objective({
    objectiveId: 'M3.NF.03', version: 1, subject: 'mathematics', standardRefs: ['MA.3.FR.2.2'],
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

  // --- Number Sense & Operations ---
  objective({
    objectiveId: 'M3.NSO.04', version: 1, subject: 'mathematics', standardRefs: ['MA.3.NSO.1.4'],
    studentOutcome: 'Round a whole number from 0 to 1,000 to the nearest 10 or 100 and explain the choice.',
    essentialKnowledge: ['nearest ten', 'nearest hundred', 'number line', 'halfway point'],
    requiredReasoning: ['round', 'explain'],
    prerequisites: ['plot whole numbers'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['you always round the last digit down'], sourceIds: ['SRC-017', 'SRC-010'],
  }),
  objective({
    objectiveId: 'M3.NSO.24', version: 1, subject: 'mathematics', standardRefs: ['MA.3.NSO.2.4'],
    studentOutcome: 'Multiply within 12 and divide using related facts, and explain how multiplication and division are related.',
    essentialKnowledge: ['factor', 'product', 'quotient', 'fact family'],
    requiredReasoning: ['represent', 'relate', 'explain'],
    prerequisites: ['skip counting', 'equal groups'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['multiplication and division are unrelated'], sourceIds: ['SRC-017'],
  }),

  // --- Algebraic Reasoning ---
  objective({
    objectiveId: 'M3.AR.12', version: 1, subject: 'mathematics', standardRefs: ['MA.3.AR.1.2'],
    studentOutcome: 'Solve one- and two-step real-world problems with the four operations, and explain the plan.',
    essentialKnowledge: ['operation choice', 'two-step problem', 'equation'],
    requiredReasoning: ['model', 'solve', 'explain'],
    prerequisites: ['multiplication facts', 'add and subtract'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['the biggest number is always the answer'], sourceIds: ['SRC-017', 'SRC-010'],
  }),

  // --- Measurement ---
  objective({
    objectiveId: 'M3.M.22', version: 1, subject: 'mathematics', standardRefs: ['MA.3.M.2.2'],
    studentOutcome: 'Solve one- and two-step real-world problems involving elapsed time and explain the reasoning.',
    essentialKnowledge: ['start time', 'end time', 'elapsed time', 'number line'],
    requiredReasoning: ['model', 'solve', 'explain'],
    prerequisites: ['tell time to the minute'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['you can subtract clock times like plain whole numbers'], sourceIds: ['SRC-018'],
  }),

  // --- Geometric Reasoning ---
  objective({
    objectiveId: 'M3.GR.23', version: 1, subject: 'mathematics', standardRefs: ['MA.3.GR.2.3'],
    studentOutcome: 'Find the perimeter and area of rectangles with whole-number sides, and explain how they differ.',
    essentialKnowledge: ['perimeter', 'area', 'side length', 'unit square'],
    requiredReasoning: ['compute', 'distinguish', 'explain'],
    prerequisites: ['multiplication facts'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['perimeter and area are the same thing'], sourceIds: ['SRC-019'],
  }),

  // --- Data Analysis & Probability ---
  objective({
    objectiveId: 'M3.DP.12', version: 1, subject: 'mathematics', standardRefs: ['MA.3.DP.1.2'],
    studentOutcome: 'Interpret a scaled bar graph or pictograph to answer one- and two-step questions, and explain the answer.',
    essentialKnowledge: ['scale', 'bar graph', 'pictograph', 'key'],
    requiredReasoning: ['interpret', 'solve', 'explain'],
    prerequisites: ['read a table'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['each square or picture always stands for one'], sourceIds: ['SRC-020'],
  }),

  // --- ELA: Reading literature ---
  objective({
    objectiveId: 'RD3.01', version: 1, subject: 'reading', standardRefs: ['ELA.3.R.1.1'],
    studentOutcome: 'Explain how a character develops across the plot, using details from the text.',
    essentialKnowledge: ['character', 'trait', 'motivation', 'plot'],
    requiredReasoning: ['identify', 'explain', 'cite'],
    prerequisites: ['read grade-level literature'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['what a character says is always what they truly feel'], sourceIds: ['SRC-021', 'SRC-012'],
  }),

  // --- ELA: Vocabulary / morphology ---
  objective({
    objectiveId: 'V3.01', version: 1, subject: 'reading', standardRefs: ['ELA.3.V.1.2'],
    studentOutcome: 'Use common Greek and Latin roots, base words and affixes to figure out the meaning of a new word.',
    essentialKnowledge: ['root', 'prefix', 'suffix', 'base word'],
    requiredReasoning: ['identify', 'apply', 'explain'],
    prerequisites: ['decode grade-level words'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['you can only learn a word by memorizing it whole'], sourceIds: ['SRC-022', 'SRC-012'],
  }),

  // --- ELA: Opinion writing ---
  objective({
    objectiveId: 'WR3.01', version: 1, subject: 'writing', standardRefs: ['ELA.3.C.1.3'],
    studentOutcome: 'Write an opinion about a topic or text with reasons supported by details and a conclusion.',
    essentialKnowledge: ['opinion', 'reason', 'detail', 'transition', 'conclusion'],
    requiredReasoning: ['state', 'support', 'conclude'],
    prerequisites: ['write a complete sentence'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['an opinion does not need reasons'], sourceIds: ['SRC-012', 'SRC-013'],
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
  {
    id: 'LP-M3.NSO.04', objectiveId: 'M3.NSO.04', objectiveVersion: 1, authorId: 'T-101',
    title: 'Rounding to the nearest 10 and 100',
    blocks: [
      { id: 'g1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will round a number to the nearest ten or hundred, and explain how you decided.', sourceIds: [], targets: [] },
      { id: 'g2', kind: 'instruction', title: 'Find the closer benchmark', body: 'To round, find the two "tens" (or "hundreds") the number sits between, then decide which one it is closer to on the number line. The halfway point decides: a number at the halfway mark rounds up. Rounding is about closeness, not about the last digit by itself.', sourceIds: ['SRC-017'], targets: ['round', 'explain'], techniqueId: 'visual_first_models' },
      { id: 'g3', kind: 'worked_example', title: 'Round 47 to the nearest ten', body: '47 is between 40 and 50. Halfway is 45. Because 47 is past 45, it is closer to 50. So 47 rounds to 50.', sourceIds: ['SRC-010'], targets: ['round'], techniqueId: 'worked_example_fade' },
      { id: 'g4', kind: 'practice', title: 'Round and place', body: 'Round 63 and 128 to the nearest ten. Mark each on a number line to show which benchmark is closer.', sourceIds: ['SRC-017'], targets: ['round'] },
      { id: 'g5', kind: 'mastery_task', title: 'Round and explain', body: 'Round 350 to the nearest hundred. Explain which two hundreds it is between and how the halfway point decides the answer.', sourceIds: ['SRC-017'], targets: ['round', 'explain'] },
      { id: 'g6', kind: 'reflection', title: 'Think back', body: 'Why isn’t rounding just "make the last digit a zero"?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.NSO.24', objectiveId: 'M3.NSO.24', objectiveVersion: 1, authorId: 'T-101',
    title: 'Multiplication and division fact families',
    blocks: [
      { id: 'h1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will use a fact family to show how multiplication and division are two views of the same equal groups.', sourceIds: [], targets: [] },
      { id: 'h2', kind: 'instruction', title: 'One picture, two operations', body: 'Equal groups can be read two ways. 3 groups of 4 is 3 × 4 = 12 (multiplication). Starting from 12 shared into 3 groups is 12 ÷ 3 = 4 (division). The same three numbers — 3, 4, 12 — make a fact family, so knowing one fact gives you the others.', sourceIds: ['SRC-017'], targets: ['represent', 'relate'], techniqueId: 'visual_first_models' },
      { id: 'h3', kind: 'worked_example', title: 'Build the family', body: 'From 4 × 6 = 24 you also know 6 × 4 = 24, 24 ÷ 4 = 6, and 24 ÷ 6 = 4. One array, four facts.', sourceIds: ['SRC-017'], targets: ['relate', 'explain'], techniqueId: 'worked_example_fade' },
      { id: 'h4', kind: 'practice', title: 'Write the family', body: 'Draw an array for 5 × 3. Write all four facts in its fact family.', sourceIds: ['SRC-017'], targets: ['represent'] },
      { id: 'h5', kind: 'mastery_task', title: 'Represent, relate, explain', body: 'Show 7 × 2 with an array. Write its fact family, then explain how the division facts come from the same picture.', sourceIds: ['SRC-017'], targets: ['represent', 'relate', 'explain'] },
      { id: 'h6', kind: 'reflection', title: 'Think back', body: 'How does knowing a multiplication fact help you divide?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.AR.12', objectiveId: 'M3.AR.12', objectiveVersion: 1, authorId: 'T-101',
    title: 'Two-step word problems',
    blocks: [
      { id: 'i1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will plan and solve a word problem that takes two steps, and explain why you chose each operation.', sourceIds: [], targets: [] },
      { id: 'i2', kind: 'instruction', title: 'Plan before you compute', body: 'A word problem is a story with a question. First decide what is happening — joining, separating, equal groups, or sharing — and choose the operation that matches. A two-step problem hides a smaller question inside; answer that first, then use it. The biggest number in the story is not automatically the answer.', sourceIds: ['SRC-017'], targets: ['model', 'explain'], techniqueId: 'chunked_prompt' },
      { id: 'i3', kind: 'worked_example', title: 'A two-step plan', body: 'Maria buys 3 packs of 6 markers, then gives away 4. Step 1: 3 × 6 = 18 markers. Step 2: 18 − 4 = 14 markers left. The plan is multiply, then subtract.', sourceIds: ['SRC-010'], targets: ['model', 'solve'], techniqueId: 'worked_example_fade' },
      { id: 'i4', kind: 'practice', title: 'Name the steps', body: 'For the problem given, write the two steps and the equation for each before you solve.', sourceIds: ['SRC-017'], targets: ['model', 'solve'] },
      { id: 'i5', kind: 'mastery_task', title: 'Model, solve, explain', body: 'Solve a new two-step problem. Write the equation for each step, find the answer, and explain why each operation fits the story.', sourceIds: ['SRC-017'], targets: ['model', 'solve', 'explain'] },
      { id: 'i6', kind: 'reflection', title: 'Think back', body: 'How do you decide which operation a story needs?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.M.22', objectiveId: 'M3.M.22', objectiveVersion: 1, authorId: 'T-101',
    title: 'Elapsed time on a number line',
    blocks: [
      { id: 'j1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will find how much time has passed between two clock times, and explain how you counted.', sourceIds: [], targets: [] },
      { id: 'j2', kind: 'instruction', title: 'Count up in friendly jumps', body: 'Elapsed time is the distance between a start time and an end time. Use an open number line: jump from the start to the next easy time, then to the end, and add the jumps. Clock time is not plain place value — an hour is 60 minutes, not 100 — so you cannot just subtract the digits.', sourceIds: ['SRC-018'], targets: ['model', 'explain'], techniqueId: 'visual_first_models' },
      { id: 'j3', kind: 'worked_example', title: 'From 2:40 to 3:15', body: 'Start at 2:40. Jump 20 minutes to 3:00. Jump 15 minutes to 3:15. Total elapsed time = 20 + 15 = 35 minutes.', sourceIds: ['SRC-018'], targets: ['model', 'solve'], techniqueId: 'worked_example_fade' },
      { id: 'j4', kind: 'practice', title: 'Draw the jumps', body: 'Find the time from 1:50 to 2:30 using an open number line. Show each jump.', sourceIds: ['SRC-018'], targets: ['model', 'solve'] },
      { id: 'j5', kind: 'mastery_task', title: 'Model, solve, explain', body: 'A movie starts at 4:25 and ends at 6:10. Find the elapsed time on a number line, then explain why you counted up in jumps instead of subtracting the digits.', sourceIds: ['SRC-018'], targets: ['model', 'solve', 'explain'] },
      { id: 'j6', kind: 'reflection', title: 'Think back', body: 'Why can’t you subtract 6:10 − 4:25 like ordinary numbers?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.GR.23', objectiveId: 'M3.GR.23', objectiveVersion: 1, authorId: 'T-101',
    title: 'Perimeter and area of rectangles',
    blocks: [
      { id: 'k1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will measure the perimeter and the area of a rectangle, and explain how they are different.', sourceIds: [], targets: [] },
      { id: 'k2', kind: 'instruction', title: 'Around vs. inside', body: 'Perimeter is the distance around a shape — add all the side lengths (measured in units). Area is the space inside — count the unit squares that cover it, which for a rectangle is length × width (measured in square units). They answer two different questions, so a fence uses perimeter and carpet uses area.', sourceIds: ['SRC-019'], targets: ['compute', 'distinguish'], techniqueId: 'visual_first_models' },
      { id: 'k3', kind: 'worked_example', title: 'A 4 by 3 rectangle', body: 'Perimeter = 4 + 3 + 4 + 3 = 14 units. Area = 4 × 3 = 12 square units. Same rectangle, two different measurements with different units.', sourceIds: ['SRC-019'], targets: ['compute', 'explain'], techniqueId: 'worked_example_fade' },
      { id: 'k4', kind: 'practice', title: 'Both measurements', body: 'For a 6 by 2 rectangle, find the perimeter and the area. Label the units for each.', sourceIds: ['SRC-019'], targets: ['compute'] },
      { id: 'k5', kind: 'mastery_task', title: 'Compute, distinguish, explain', body: 'Find the perimeter and area of a 5 by 3 rectangle. Explain, in your own words, why one is measured in units and the other in square units.', sourceIds: ['SRC-019'], targets: ['compute', 'distinguish', 'explain'] },
      { id: 'k6', kind: 'reflection', title: 'Think back', body: 'When would you need area, and when would you need perimeter?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.DP.12', objectiveId: 'M3.DP.12', objectiveVersion: 1, authorId: 'T-101',
    title: 'Reading scaled bar graphs and pictographs',
    blocks: [
      { id: 'l1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will read a graph where each step counts by more than one, and use it to answer questions.', sourceIds: [], targets: [] },
      { id: 'l2', kind: 'instruction', title: 'Check the scale and the key first', body: 'Before reading any value, find the scale on a bar graph or the key on a pictograph. If each grid line is 5, a bar at the third line is 15, not 3. If one picture stands for 2, then 4 pictures mean 8. Two-step questions often ask you to compare or combine two values after you read them.', sourceIds: ['SRC-020'], targets: ['interpret', 'explain'], techniqueId: 'chunked_prompt' },
      { id: 'l3', kind: 'worked_example', title: 'Each picture = 2', body: 'A pictograph shows apples with a key of 1 picture = 2 apples. Room A has 4 pictures → 8 apples. Room B has 3 pictures → 6 apples. Together that is 8 + 6 = 14 apples.', sourceIds: ['SRC-020'], targets: ['interpret', 'solve'], techniqueId: 'worked_example_fade' },
      { id: 'l4', kind: 'practice', title: 'Use the scale', body: 'On the bar graph given, each line is 5. Read two bars, then find how many more one has than the other.', sourceIds: ['SRC-020'], targets: ['interpret', 'solve'] },
      { id: 'l5', kind: 'mastery_task', title: 'Interpret, solve, explain', body: 'Use the scaled graph to answer a two-step question, then explain how you used the scale or key to get your numbers.', sourceIds: ['SRC-020'], targets: ['interpret', 'solve', 'explain'] },
      { id: 'l6', kind: 'reflection', title: 'Think back', body: 'Why must you read the scale or key before reading the bars or pictures?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-RD3.01', objectiveId: 'RD3.01', objectiveVersion: 1, authorId: 'T-102',
    title: 'How a character changes',
    blocks: [
      { id: 'm1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will explain how a character changes across a story, using details from the text as proof.', sourceIds: [], targets: [] },
      { id: 'm2', kind: 'instruction', title: 'Watch what a character does', body: 'A character develops when their feelings, choices or actions change from the beginning to the end. To track it, notice what they do and why (their motivation), not only what they say — sometimes a character says one thing but their actions show another. Point to the moment in the text where the change happens.', sourceIds: ['SRC-021'], targets: ['identify', 'explain'], techniqueId: 'chunked_prompt' },
      { id: 'm3', kind: 'practice', title: 'Beginning vs. end', body: 'Write one word for how the character feels at the start and one for the end. Find the sentence that shows the change.', sourceIds: ['SRC-021'], targets: ['identify', 'cite'] },
      { id: 'm4', kind: 'mastery_task', title: 'Explain with evidence', body: 'Explain how the character is different by the end of the story. Cite two details from the text that show the change.', sourceIds: ['SRC-012'], targets: ['identify', 'explain', 'cite'] },
      { id: 'm5', kind: 'reflection', title: 'Think back', body: 'Why look at what a character does, not just what they say?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-V3.01', objectiveId: 'V3.01', objectiveVersion: 1, authorId: 'T-102',
    title: 'Roots, prefixes and suffixes',
    blocks: [
      { id: 'n1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will break a new word into parts to figure out what it means.', sourceIds: [], targets: [] },
      { id: 'n2', kind: 'instruction', title: 'Words are built from parts', body: 'Many words are made of a base word or root plus a prefix (front) or suffix (end). Knowing common parts unlocks new words: "re-" means again, "-able" means can be done, the root "port" means carry. You do not have to memorize every word whole — you can build the meaning from its parts.', sourceIds: ['SRC-022'], targets: ['identify', 'explain'], techniqueId: 'chunked_prompt' },
      { id: 'n3', kind: 'worked_example', title: 'Un + lock + able', body: '"Unlockable" = un (not) + lock + able (can be). Put together: something that can be unlocked. The parts give the meaning.', sourceIds: ['SRC-022'], targets: ['apply'], techniqueId: 'worked_example_fade' },
      { id: 'n4', kind: 'practice', title: 'Break it down', body: 'Underline the prefix, root and suffix in "replayable". Write what each part means.', sourceIds: ['SRC-022'], targets: ['identify', 'apply'] },
      { id: 'n5', kind: 'mastery_task', title: 'Identify, apply, explain', body: 'Use the parts of a new word (for example "transportable") to figure out its meaning. Name each part and explain how the parts build the meaning.', sourceIds: ['SRC-022'], targets: ['identify', 'apply', 'explain'] },
      { id: 'n6', kind: 'reflection', title: 'Think back', body: 'How can knowing word parts help you read a word you have never seen?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-WR3.01', objectiveId: 'WR3.01', objectiveVersion: 1, authorId: 'T-102',
    title: 'Writing an opinion with reasons',
    blocks: [
      { id: 'o1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will write an opinion and back it up with reasons and details, ending with a conclusion.', sourceIds: [], targets: [] },
      { id: 'o2', kind: 'instruction', title: 'Opinion, reasons, conclusion', body: 'An opinion tells what you think. On its own it is not convincing — it needs reasons, and each reason needs a detail or example. Use transition words (because, also, for example) to connect them, and end with a conclusion that restates your opinion. An opinion without reasons is just a statement.', sourceIds: ['SRC-013'], targets: ['state', 'support'], techniqueId: 'worked_example_fade' },
      { id: 'o3', kind: 'practice', title: 'Reasons and details', body: 'Write your opinion in one sentence, then list two reasons. Add one detail under each reason.', sourceIds: ['SRC-012'], targets: ['state', 'support'] },
      { id: 'o4', kind: 'mastery_task', title: 'State, support, conclude', body: 'Write a short opinion paragraph: state your opinion, give two reasons supported by details with transitions, and finish with a conclusion.', sourceIds: ['SRC-012'], targets: ['state', 'support', 'conclude'] },
      { id: 'o5', kind: 'reflection', title: 'Think back', body: 'What turns an opinion into a convincing one?', sourceIds: [], targets: [] },
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

  mc('IT-M3.NSO.04-1', 'M3.NSO.04', 'round', 'Round 68 to the nearest ten.', ['70'], ['60', '80', '68'], ['SRC-017'], ['you always round the last digit down']),
  cr('IT-M3.NSO.04-2', 'M3.NSO.04', 'explain', 'Round 250 to the nearest hundred and explain how the halfway point decides your answer.', ['SRC-017'], ['you always round the last digit down']),
  cr('IT-M3.NSO.24-1', 'M3.NSO.24', 'represent', 'Draw an array for 6 × 3 and write all four facts in its fact family.', ['SRC-017'], ['multiplication and division are unrelated']),
  cr('IT-M3.NSO.24-2', 'M3.NSO.24', 'relate', 'Explain how the fact 24 ÷ 6 = 4 comes from a multiplication fact.', ['SRC-017'], ['multiplication and division are unrelated']),
  cr('IT-M3.AR.12-1', 'M3.AR.12', 'model', 'A store has 4 boxes of 5 pencils and sells 6 pencils. Write the two steps you would use to find how many are left.', ['SRC-017'], ['the biggest number is always the answer']),
  cr('IT-M3.AR.12-2', 'M3.AR.12', 'solve', 'Solve the problem: first multiply, then subtract. Show each step and the final answer.', ['SRC-017'], ['the biggest number is always the answer']),
  cr('IT-M3.M.22-1', 'M3.M.22', 'model', 'Show the time from 3:20 to 4:05 on an open number line with your jumps.', ['SRC-018'], ['you can subtract clock times like plain whole numbers']),
  cr('IT-M3.M.22-2', 'M3.M.22', 'solve', 'Find the elapsed time from 3:20 to 4:05.', ['SRC-018'], ['you can subtract clock times like plain whole numbers']),
  mc('IT-M3.GR.23-1', 'M3.GR.23', 'compute', 'A rectangle is 5 units long and 2 units wide. What is its area?', ['10 square units'], ['14 units', '7 units', '10 units'], ['SRC-019'], ['perimeter and area are the same thing']),
  cr('IT-M3.GR.23-2', 'M3.GR.23', 'distinguish', 'For the same rectangle, explain the difference between its perimeter and its area, including the units.', ['SRC-019'], ['perimeter and area are the same thing']),
  cr('IT-M3.DP.12-1', 'M3.DP.12', 'interpret', 'On a pictograph where each picture stands for 2, a row has 5 pictures. How many does that represent?', ['SRC-020'], ['each square or picture always stands for one']),
  cr('IT-M3.DP.12-2', 'M3.DP.12', 'solve', 'Using the scaled bar graph, find how many more Room A has than Room B.', ['SRC-020'], ['each square or picture always stands for one']),
  cr('IT-RD3.01-1', 'RD3.01', 'identify', 'Name one way the character is different at the end of the story than at the beginning.', ['SRC-021'], ['what a character says is always what they truly feel']),
  cr('IT-RD3.01-2', 'RD3.01', 'cite', 'Copy the sentence from the text that shows the character changing.', ['SRC-012'], ['what a character says is always what they truly feel']),
  cr('IT-V3.01-1', 'V3.01', 'identify', 'Underline the prefix, root and suffix in the word "replayable" and label each part.', ['SRC-022'], ['you can only learn a word by memorizing it whole']),
  cr('IT-V3.01-2', 'V3.01', 'apply', 'Use the parts of the word "unbreakable" to explain what it means.', ['SRC-022'], ['you can only learn a word by memorizing it whole']),
  cr('IT-WR3.01-1', 'WR3.01', 'state', 'Write your opinion about the topic in one clear sentence.', ['SRC-012'], ['an opinion does not need reasons']),
  cr('IT-WR3.01-2', 'WR3.01', 'support', 'Give two reasons for your opinion, and add one detail under each reason.', ['SRC-013'], ['an opinion does not need reasons']),
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
  rubric('M3.NSO.04', [{ trace: 'round', desc: 'Rounds to the nearest 10 or 100 correctly.', max: 3 }, { trace: 'explain', desc: 'Explains the choice using the halfway point.', max: 3 }]),
  rubric('M3.NSO.24', [{ trace: 'represent', desc: 'Represents the facts with an array.', max: 3 }, { trace: 'relate', desc: 'Relates multiplication and division facts.', max: 3 }, { trace: 'explain', desc: 'Explains the relationship.', max: 2 }]),
  rubric('M3.AR.12', [{ trace: 'model', desc: 'Models the problem with the right operations.', max: 3 }, { trace: 'solve', desc: 'Solves both steps correctly.', max: 3 }, { trace: 'explain', desc: 'Explains why each operation fits.', max: 2 }]),
  rubric('M3.M.22', [{ trace: 'model', desc: 'Models elapsed time on a number line.', max: 3 }, { trace: 'solve', desc: 'Finds the elapsed time correctly.', max: 3 }, { trace: 'explain', desc: 'Explains the counting method.', max: 2 }]),
  rubric('M3.GR.23', [{ trace: 'compute', desc: 'Computes perimeter and area correctly.', max: 3 }, { trace: 'distinguish', desc: 'Distinguishes perimeter from area with units.', max: 3 }, { trace: 'explain', desc: 'Explains the difference.', max: 2 }]),
  rubric('M3.DP.12', [{ trace: 'interpret', desc: 'Interprets the scale or key correctly.', max: 3 }, { trace: 'solve', desc: 'Answers the two-step question.', max: 3 }, { trace: 'explain', desc: 'Explains how the scale was used.', max: 2 }]),
  rubric('RD3.01', [{ trace: 'identify', desc: 'Identifies how the character develops.', max: 3 }, { trace: 'explain', desc: 'Explains the change.', max: 3 }, { trace: 'cite', desc: 'Cites text evidence.', max: 2 }]),
  rubric('V3.01', [{ trace: 'identify', desc: 'Identifies roots, prefixes and suffixes.', max: 3 }, { trace: 'apply', desc: 'Applies parts to determine meaning.', max: 3 }, { trace: 'explain', desc: 'Explains how parts build the meaning.', max: 2 }]),
  rubric('WR3.01', [{ trace: 'state', desc: 'States a clear opinion.', max: 3 }, { trace: 'support', desc: 'Supports it with reasons and details.', max: 3 }, { trace: 'conclude', desc: 'Ends with a conclusion.', max: 2 }]),
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
