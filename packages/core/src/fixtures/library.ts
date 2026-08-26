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
  { id: 'SRC-023', title: 'Decodable texts and phonics (grade 3)', citation: 'Openly-licensed decodable passages and word-analysis practice, incl. common affixes.', uri: 'https://www.ckla.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by', reviewStatus: 'approved', reviewedAt: '2026-08-14', reviewBy: '2027-08-14' },
  { id: 'SRC-024', title: 'Informational text set (grade 3)', citation: 'Leveled informational passages with text features (headings, captions, diagrams).', uri: 'https://www.readworks.org/', tier: 'licensed', authorityType: 'publisher', license: 'licensed', reviewStatus: 'approved', reviewedAt: '2026-08-14', reviewBy: '2027-02-14' },
  { id: 'SRC-025', title: 'Speaking and listening reference', citation: 'Openly-licensed guidance for oral presentation — sequence, volume, clarity, nonverbal cues.', uri: 'https://openstax.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by', reviewStatus: 'approved', reviewedAt: '2026-08-15', reviewBy: '2027-08-15' },
  { id: 'SRC-026', title: 'Research and multimedia reference (grade 3)', citation: 'Openly-licensed guide to gathering information from sources and using multimedia and digital tools.', uri: 'https://openstax.org/', tier: 'oer', authorityType: 'open_courseware', license: 'cc_by', reviewStatus: 'approved', reviewedAt: '2026-08-15', reviewBy: '2027-08-15' },
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

  // --- Fractions (completing the strand) ---
  objective({
    objectiveId: 'M3.FR.12', version: 1, subject: 'mathematics', standardRefs: ['MA.3.FR.1.2'],
    studentOutcome: 'Represent a fraction m/b, including fractions greater than one, as the unit fraction 1/b added to itself m times.',
    essentialKnowledge: ['unit fraction', 'numerator', 'iterate', 'fraction greater than one'],
    requiredReasoning: ['represent', 'explain'],
    prerequisites: ['represent fractions'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['a fraction can never be greater than one whole'], sourceIds: ['SRC-001', 'SRC-011'],
  }),
  objective({
    objectiveId: 'M3.FR.13', version: 1, subject: 'mathematics', standardRefs: ['MA.3.FR.1.3'],
    studentOutcome: 'Read and write fractions, including fractions greater than one, in standard form and word form.',
    essentialKnowledge: ['standard form', 'word form', 'numerator', 'denominator'],
    requiredReasoning: ['read', 'write'],
    prerequisites: ['represent fractions'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['you read the top number as a whole number'], sourceIds: ['SRC-010', 'SRC-001'],
  }),

  // --- Number Sense & Operations (core) ---
  objective({
    objectiveId: 'M3.NSO.13', version: 1, subject: 'mathematics', standardRefs: ['MA.3.NSO.1.3'],
    studentOutcome: 'Plot, order and compare whole numbers up to 10,000, and explain the comparison.',
    essentialKnowledge: ['place value', 'number line', 'greater than', 'less than'],
    requiredReasoning: ['plot', 'order', 'compare'],
    prerequisites: ['read and write numbers'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['you compare numbers starting from the ones place'], sourceIds: ['SRC-017', 'SRC-010'],
  }),
  objective({
    objectiveId: 'M3.NSO.21', version: 1, subject: 'mathematics', standardRefs: ['MA.3.NSO.2.1'],
    studentOutcome: 'Add and subtract multi-digit whole numbers using a standard algorithm, and explain any regrouping.',
    essentialKnowledge: ['regrouping', 'place value', 'standard algorithm'],
    requiredReasoning: ['compute', 'explain'],
    prerequisites: ['place value to thousands'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['you always subtract the smaller digit from the larger in each column'], sourceIds: ['SRC-017'],
  }),

  // --- Algebraic Reasoning (even/odd) ---
  objective({
    objectiveId: 'M3.AR.31', version: 1, subject: 'mathematics', standardRefs: ['MA.3.AR.3.1'],
    studentOutcome: 'Determine whether a whole number from 1 to 1,000 is even or odd, and explain how you know.',
    essentialKnowledge: ['even', 'odd', 'ones digit', 'equal groups'],
    requiredReasoning: ['determine', 'explain'],
    prerequisites: ['skip counting by 2'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['you check the first digit to tell even or odd'], sourceIds: ['SRC-017'],
  }),

  // --- Number Sense & Operations (completing the strand) ---
  objective({
    objectiveId: 'M3.NSO.11', version: 1, subject: 'mathematics', standardRefs: ['MA.3.NSO.1.1'],
    studentOutcome: 'Read and write numbers from 0 to 10,000 in standard, expanded and word form.',
    essentialKnowledge: ['standard form', 'expanded form', 'word form', 'place value'],
    requiredReasoning: ['read', 'write'],
    prerequisites: ['place value to hundreds'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['you write a number exactly the way you say it, word for word'], sourceIds: ['SRC-017', 'SRC-010'],
  }),
  objective({
    objectiveId: 'M3.NSO.12', version: 1, subject: 'mathematics', standardRefs: ['MA.3.NSO.1.2'],
    studentOutcome: 'Compose and decompose four-digit numbers in more than one way using thousands, hundreds, tens and ones.',
    essentialKnowledge: ['thousands', 'hundreds', 'tens', 'ones', 'regroup'],
    requiredReasoning: ['compose', 'decompose'],
    prerequisites: ['place value to thousands'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['a number can only be broken apart one way'], sourceIds: ['SRC-017'],
  }),
  objective({
    objectiveId: 'M3.NSO.22', version: 1, subject: 'mathematics', standardRefs: ['MA.3.NSO.2.2'],
    studentOutcome: 'Represent multiplication with equal groups and arrays (products to 144) and relate it to division.',
    essentialKnowledge: ['equal groups', 'array', 'repeated addition', 'division'],
    requiredReasoning: ['represent', 'explain'],
    prerequisites: ['skip counting'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['multiplication is just counting by ones quickly'], sourceIds: ['SRC-017'],
  }),
  objective({
    objectiveId: 'M3.NSO.23', version: 1, subject: 'mathematics', standardRefs: ['MA.3.NSO.2.3'],
    studentOutcome: 'Multiply a one-digit number by a multiple of 10 or 100, and explain using place value.',
    essentialKnowledge: ['multiple of ten', 'multiple of hundred', 'basic fact', 'place value'],
    requiredReasoning: ['compute', 'explain'],
    prerequisites: ['multiplication facts'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['6 times 30 is the same as 6 times 3'], sourceIds: ['SRC-017'],
  }),

  // --- Measurement (completing the strand) ---
  objective({
    objectiveId: 'M3.M.11', version: 1, subject: 'mathematics', standardRefs: ['MA.3.M.1.1'],
    studentOutcome: 'Select and use the right tool to measure length, liquid volume or temperature, reading it correctly.',
    essentialKnowledge: ['ruler', 'beaker', 'thermometer', 'unit'],
    requiredReasoning: ['select', 'measure'],
    prerequisites: ['count by ones and fives'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['you can start measuring from any point on the ruler'], sourceIds: ['SRC-018'],
  }),
  objective({
    objectiveId: 'M3.M.12', version: 1, subject: 'mathematics', standardRefs: ['MA.3.M.1.2'],
    studentOutcome: 'Solve real-world problems with the four operations using measurements in the same unit.',
    essentialKnowledge: ['length', 'mass', 'liquid volume', 'operation choice'],
    requiredReasoning: ['model', 'solve'],
    prerequisites: ['add and subtract'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['the numbers in a measurement problem are always added'], sourceIds: ['SRC-018'],
  }),
  objective({
    objectiveId: 'M3.M.21', version: 1, subject: 'mathematics', standardRefs: ['MA.3.M.2.1'],
    studentOutcome: 'Tell and write time to the nearest minute on analog and digital clocks, using a.m. and p.m.',
    essentialKnowledge: ['hour', 'minute', 'a.m.', 'p.m.'],
    requiredReasoning: ['read', 'write'],
    prerequisites: ['count by fives'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['the short hand tells the minutes'], sourceIds: ['SRC-018'],
  }),

  // --- Data Analysis & Probability (completing the strand) ---
  objective({
    objectiveId: 'M3.DP.11', version: 1, subject: 'mathematics', standardRefs: ['MA.3.DP.1.1'],
    studentOutcome: 'Collect data and represent it in a scaled pictograph or bar graph with a title, labels and a key.',
    essentialKnowledge: ['table', 'scaled pictograph', 'scaled bar graph', 'key'],
    requiredReasoning: ['represent', 'explain'],
    prerequisites: ['count and tally'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['every square or picture on a graph must stand for one'], sourceIds: ['SRC-020'],
  }),

  // --- Algebraic Reasoning (completing the strand) ---
  objective({
    objectiveId: 'M3.AR.11', version: 1, subject: 'mathematics', standardRefs: ['MA.3.AR.1.1'],
    studentOutcome: 'Apply the distributive property to multiply a one-digit number by a two-digit number, and explain it.',
    essentialKnowledge: ['distributive property', 'break apart', 'partial products'],
    requiredReasoning: ['apply', 'explain'],
    prerequisites: ['multiplication facts'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['you can only multiply numbers you already know as a fact'], sourceIds: ['SRC-017'],
  }),
  objective({
    objectiveId: 'M3.AR.21', version: 1, subject: 'mathematics', standardRefs: ['MA.3.AR.2.1'],
    studentOutcome: 'Restate a division problem as a missing-factor multiplication problem, and explain the link.',
    essentialKnowledge: ['missing factor', 'fact family', 'dividend', 'divisor'],
    requiredReasoning: ['restate', 'explain'],
    prerequisites: ['multiplication and division facts'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['division has nothing to do with multiplication'], sourceIds: ['SRC-017'],
  }),
  objective({
    objectiveId: 'M3.AR.22', version: 1, subject: 'mathematics', standardRefs: ['MA.3.AR.2.2'],
    studentOutcome: 'Determine and justify whether a multiplication or division equation is true or false.',
    essentialKnowledge: ['equal sign', 'equation', 'balance'],
    requiredReasoning: ['determine', 'justify'],
    prerequisites: ['multiplication facts'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['the equal sign just means the answer comes next'], sourceIds: ['SRC-017'],
  }),
  objective({
    objectiveId: 'M3.AR.23', version: 1, subject: 'mathematics', standardRefs: ['MA.3.AR.2.3'],
    studentOutcome: 'Find the unknown whole number in a multiplication or division equation in any position.',
    essentialKnowledge: ['unknown', 'equation', 'inverse operation'],
    requiredReasoning: ['solve', 'explain'],
    prerequisites: ['fact families'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['the unknown is always at the end of the equation'], sourceIds: ['SRC-017'],
  }),
  objective({
    objectiveId: 'M3.AR.32', version: 1, subject: 'mathematics', standardRefs: ['MA.3.AR.3.2'],
    studentOutcome: 'Determine whether a whole number from 1 to 144 is a multiple of a given one-digit number.',
    essentialKnowledge: ['multiple', 'skip count', 'factor'],
    requiredReasoning: ['determine', 'explain'],
    prerequisites: ['skip counting'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['a multiple of 5 must end in 5'], sourceIds: ['SRC-017'],
  }),
  objective({
    objectiveId: 'M3.AR.33', version: 1, subject: 'mathematics', standardRefs: ['MA.3.AR.3.3'],
    studentOutcome: 'Identify, create and extend a numerical pattern, and state its rule.',
    essentialKnowledge: ['pattern', 'rule', 'term'],
    requiredReasoning: ['extend', 'explain'],
    prerequisites: ['skip counting'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['you find the next term by copying the last number'], sourceIds: ['SRC-017'],
  }),

  // --- Geometric Reasoning (completing the strand) ---
  objective({
    objectiveId: 'M3.GR.11', version: 1, subject: 'mathematics', standardRefs: ['MA.3.GR.1.1'],
    studentOutcome: 'Identify and draw points, lines, segments, rays, and parallel and perpendicular lines.',
    essentialKnowledge: ['point', 'line segment', 'ray', 'parallel', 'perpendicular'],
    requiredReasoning: ['identify', 'draw'],
    prerequisites: ['recognize 2-D shapes'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['any two lines that do not touch on the page are parallel'], sourceIds: ['SRC-019'],
  }),
  objective({
    objectiveId: 'M3.GR.12', version: 1, subject: 'mathematics', standardRefs: ['MA.3.GR.1.2'],
    studentOutcome: 'Identify and classify quadrilaterals by their defining attributes.',
    essentialKnowledge: ['quadrilateral', 'parallel sides', 'right angle', 'trapezoid'],
    requiredReasoning: ['identify', 'classify'],
    prerequisites: ['sides and angles'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['a square and a rectangle are completely different shapes'], sourceIds: ['SRC-019'],
  }),
  objective({
    objectiveId: 'M3.GR.13', version: 1, subject: 'mathematics', standardRefs: ['MA.3.GR.1.3'],
    studentOutcome: 'Identify line-symmetric figures and draw their line(s) of symmetry.',
    essentialKnowledge: ['line of symmetry', 'fold', 'match', 'mirror'],
    requiredReasoning: ['identify', 'draw'],
    prerequisites: ['recognize 2-D shapes'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['every shape has exactly one line of symmetry'], sourceIds: ['SRC-019'],
  }),
  objective({
    objectiveId: 'M3.GR.21', version: 1, subject: 'mathematics', standardRefs: ['MA.3.GR.2.1'],
    studentOutcome: 'Find the area of a figure by covering it with unit squares and counting, with no gaps or overlaps.',
    essentialKnowledge: ['area', 'unit square', 'cover', 'no gaps'],
    requiredReasoning: ['measure', 'explain'],
    prerequisites: ['count by rows'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['you find area by measuring around the outside'], sourceIds: ['SRC-019'],
  }),
  objective({
    objectiveId: 'M3.GR.22', version: 1, subject: 'mathematics', standardRefs: ['MA.3.GR.2.2'],
    studentOutcome: 'Find the area of a rectangle with a multiplication formula, and explain why it works.',
    essentialKnowledge: ['area', 'length', 'width', 'square units'],
    requiredReasoning: ['compute', 'explain'],
    prerequisites: ['multiplication facts', 'area by counting'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['area is length plus width'], sourceIds: ['SRC-019'],
  }),
  objective({
    objectiveId: 'M3.GR.24', version: 1, subject: 'mathematics', standardRefs: ['MA.3.GR.2.4'],
    studentOutcome: 'Find the area of a composite figure by decomposing it into non-overlapping rectangles.',
    essentialKnowledge: ['composite figure', 'decompose', 'area', 'rectangle'],
    requiredReasoning: ['decompose', 'compute'],
    prerequisites: ['area of a rectangle'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['you can find the area of an L-shape with one multiplication'], sourceIds: ['SRC-019'],
  }),

  // --- ELA Foundations ---
  objective({
    objectiveId: 'F3.13', version: 1, subject: 'reading', standardRefs: ['ELA.3.F.1.3'],
    studentOutcome: 'Decode grade-level words using phonics and word parts, including common roots and affixes.',
    essentialKnowledge: ['decode', 'root', 'prefix', 'suffix', 'syllable'],
    requiredReasoning: ['decode', 'explain'],
    prerequisites: ['letter sounds', 'blend sounds'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['you sound out every word one letter at a time'], sourceIds: ['SRC-023', 'SRC-022'],
  }),
  objective({
    objectiveId: 'F3.14', version: 1, subject: 'reading', standardRefs: ['ELA.3.F.1.4'],
    studentOutcome: 'Read a grade-level text with accuracy, an even pace, and expression that fits the meaning.',
    essentialKnowledge: ['accuracy', 'automaticity', 'prosody', 'phrasing'],
    requiredReasoning: ['read', 'self-correct'],
    prerequisites: ['decode grade-level words'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['reading fast is the same as reading well'], sourceIds: ['SRC-021', 'SRC-012'],
  }),

  // --- ELA Reading: Prose & Poetry ---
  objective({
    objectiveId: 'RD3.02', version: 1, subject: 'reading', standardRefs: ['ELA.3.R.1.2'],
    studentOutcome: 'Explain a theme of a story and how details across the text develop it.',
    essentialKnowledge: ['theme', 'message', 'lesson', 'detail'],
    requiredReasoning: ['identify', 'explain'],
    prerequisites: ['retell a story'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['the theme is the same as the topic'], sourceIds: ['SRC-021', 'SRC-012'],
  }),
  objective({
    objectiveId: 'RD3.03', version: 1, subject: 'reading', standardRefs: ['ELA.3.R.1.3'],
    studentOutcome: 'Explain how different characters see the same event differently, using text details.',
    essentialKnowledge: ['perspective', 'point of view', 'character', 'feelings'],
    requiredReasoning: ['compare', 'explain'],
    prerequisites: ['identify characters'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['every character feels the same way about what happens'], sourceIds: ['SRC-021', 'SRC-012'],
  }),
  objective({
    objectiveId: 'RD3.04', version: 1, subject: 'reading', standardRefs: ['ELA.3.R.1.4'],
    studentOutcome: 'Identify types of poems — free verse, rhymed verse, haiku and limerick — by their features.',
    essentialKnowledge: ['free verse', 'rhymed verse', 'haiku', 'limerick'],
    requiredReasoning: ['identify', 'distinguish'],
    prerequisites: ['read a poem'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['all poems have to rhyme'], sourceIds: ['SRC-021', 'SRC-012'],
  }),

  // --- ELA Reading: Informational ---
  objective({
    objectiveId: 'RI3.01', version: 1, subject: 'reading', standardRefs: ['ELA.3.R.2.1'],
    studentOutcome: 'Explain how text features — headings, captions, bold words, diagrams — add to the meaning of a text.',
    essentialKnowledge: ['heading', 'caption', 'bold word', 'text feature'],
    requiredReasoning: ['identify', 'explain'],
    prerequisites: ['read informational text'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['text features are just decoration you can skip'], sourceIds: ['SRC-024', 'SRC-013'],
  }),
  objective({
    objectiveId: 'RI3.03', version: 1, subject: 'reading', standardRefs: ['ELA.3.R.2.3'],
    studentOutcome: 'Explain the author’s purpose in an informational text and how it develops.',
    essentialKnowledge: ['author purpose', 'inform', 'persuade', 'entertain'],
    requiredReasoning: ['identify', 'explain'],
    prerequisites: ['central idea'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: false },
    misconceptions: ['an author only ever writes to tell facts'], sourceIds: ['SRC-013', 'SRC-024'],
  }),
  objective({
    objectiveId: 'RI3.04', version: 1, subject: 'reading', standardRefs: ['ELA.3.R.2.4'],
    studentOutcome: 'Identify an author’s claim and explain how the author uses evidence to support it.',
    essentialKnowledge: ['claim', 'evidence', 'support', 'reason'],
    requiredReasoning: ['identify', 'explain'],
    prerequisites: ['central idea', 'key details'], mastery: { threshold: 0.8, minimumEvidenceTypes: 2, transferRequired: true },
    misconceptions: ['a claim is true just because the author wrote it'], sourceIds: ['SRC-013', 'SRC-024'],
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
  {
    id: 'LP-M3.FR.12', objectiveId: 'M3.FR.12', objectiveVersion: 1, authorId: 'T-100',
    title: 'Building fractions from unit fractions',
    blocks: [
      { id: 'p1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will build a fraction by adding the same unit fraction over and over — even past one whole.', sourceIds: [], targets: [] },
      { id: 'p2', kind: 'instruction', title: 'Count unit fractions', body: 'Every fraction is just a unit fraction counted up. 3/4 means three copies of 1/4: 1/4 + 1/4 + 1/4. Because you can keep adding copies, a fraction can go past one whole — 5/4 is five copies of 1/4, which is one whole and one more fourth.', sourceIds: ['SRC-001'], targets: ['represent', 'explain'], techniqueId: 'visual_first_models' },
      { id: 'p3', kind: 'worked_example', title: 'Show 5/3 on a number line', body: 'Start at 0 and make jumps of 1/3. After three jumps you are at 1 whole (3/3). Two more jumps of 1/3 lands on 5/3 — that is one whole and two thirds.', sourceIds: ['SRC-011'], targets: ['represent'], techniqueId: 'worked_example_fade' },
      { id: 'p4', kind: 'practice', title: 'Add the copies', body: 'Show 4/3 as a sum of unit fractions and mark it on a number line from 0 past 1.', sourceIds: ['SRC-001'], targets: ['represent'] },
      { id: 'p5', kind: 'mastery_task', title: 'Represent and explain', body: 'Show 7/4 as unit fractions on a new number line, and explain why it is more than one whole.', sourceIds: ['SRC-001'], targets: ['represent', 'explain'] },
      { id: 'p6', kind: 'reflection', title: 'Think back', body: 'How can a fraction be bigger than one whole?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.FR.13', objectiveId: 'M3.FR.13', objectiveVersion: 1, authorId: 'T-100',
    title: 'Reading and writing fractions',
    blocks: [
      { id: 'q1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will read a fraction out loud and write it in words and in numbers.', sourceIds: [], targets: [] },
      { id: 'q2', kind: 'instruction', title: 'Say the top, then the size', body: 'To read a fraction, say the numerator as a counting number, then the denominator as the size of the parts: 3/5 is “three fifths.” The bottom number names the pieces (fifths), the top number counts them (three). Fractions greater than one work the same way — 7/4 is “seven fourths.”', sourceIds: ['SRC-010'], targets: ['read', 'write'], techniqueId: 'chunked_prompt' },
      { id: 'q3', kind: 'practice', title: 'Words and numbers', body: 'Write 2/3 in words, and write “five sixths” as a fraction.', sourceIds: ['SRC-001'], targets: ['read', 'write'] },
      { id: 'q4', kind: 'mastery_task', title: 'Read and write', body: 'Write 7/4 in word form, and write “three eighths” in standard form. Read each one out loud to a partner.', sourceIds: ['SRC-010'], targets: ['read', 'write'] },
      { id: 'q5', kind: 'reflection', title: 'Think back', body: 'Why is the bottom number said as “fifths” or “fourths”?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.NSO.13', objectiveId: 'M3.NSO.13', objectiveVersion: 1, authorId: 'T-101',
    title: 'Comparing and ordering whole numbers',
    blocks: [
      { id: 'r1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will place numbers in order and tell which is greater, and explain how you know.', sourceIds: [], targets: [] },
      { id: 'r2', kind: 'instruction', title: 'Start from the biggest place', body: 'To compare whole numbers, line them up by place value and start from the largest place — thousands first, then hundreds, and so on. The first place where the digits differ decides it. Don’t start from the ones; 1,240 beats 1,204 because the tens place differs, not the ones.', sourceIds: ['SRC-017'], targets: ['compare', 'order'], techniqueId: 'visual_first_models' },
      { id: 'r3', kind: 'worked_example', title: 'Order three numbers', body: '1,024; 1,240; 1,204. All share 1 thousand and 0 hundreds. Compare the tens: 2, 4, 0 → so 1,024 (0 tens) is least, then 1,204 (0… wait compare tens then ones), then 1,240. Least to greatest: 1,024; 1,204; 1,240.', sourceIds: ['SRC-010'], targets: ['order', 'plot'], techniqueId: 'worked_example_fade' },
      { id: 'r4', kind: 'practice', title: 'Plot and compare', body: 'Plot 3,050 and 3,500 on a number line and circle the greater one.', sourceIds: ['SRC-017'], targets: ['plot', 'compare'] },
      { id: 'r5', kind: 'mastery_task', title: 'Order and explain', body: 'Order 2,405; 2,045; 2,450 from least to greatest and explain, using place value, how you decided.', sourceIds: ['SRC-017'], targets: ['order', 'compare', 'plot'] },
      { id: 'r6', kind: 'reflection', title: 'Think back', body: 'Why start comparing from the largest place, not the ones?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.NSO.21', objectiveId: 'M3.NSO.21', objectiveVersion: 1, authorId: 'T-101',
    title: 'Adding and subtracting with regrouping',
    blocks: [
      { id: 's1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will add and subtract big numbers and explain when you regroup.', sourceIds: [], targets: [] },
      { id: 's2', kind: 'instruction', title: 'Line up the places, regroup when needed', body: 'Add or subtract one place at a time, ones first. When a column makes ten or more, carry a group to the next place; when you don’t have enough to subtract, borrow a group from the next place. You never just take the smaller digit from the larger — the position tells you whether to regroup.', sourceIds: ['SRC-017'], targets: ['compute', 'explain'], techniqueId: 'worked_example_fade' },
      { id: 's3', kind: 'worked_example', title: 'Subtract 405 − 128', body: 'Ones: 5 − 8 needs a borrow → borrow a ten (but tens is 0, so borrow from hundreds first). After regrouping: 405 becomes 3 hundreds, 9 tens, 15 ones. 15 − 8 = 7, 9 − 2 = 7, 3 − 1 = 2. Answer: 277.', sourceIds: ['SRC-017'], targets: ['compute'], techniqueId: 'worked_example_fade' },
      { id: 's4', kind: 'practice', title: 'Where did you regroup?', body: 'Find 367 + 285. Circle the columns where you had to carry a group.', sourceIds: ['SRC-017'], targets: ['compute'] },
      { id: 's5', kind: 'mastery_task', title: 'Compute and explain', body: 'Solve 502 − 246. Show your work and explain where and why you had to borrow.', sourceIds: ['SRC-017'], targets: ['compute', 'explain'] },
      { id: 's6', kind: 'reflection', title: 'Think back', body: 'Why can’t you just subtract the smaller digit from the larger in each column?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.AR.31', objectiveId: 'M3.AR.31', objectiveVersion: 1, authorId: 'T-101',
    title: 'Even and odd numbers',
    blocks: [
      { id: 't1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will tell whether a number is even or odd, and explain how you know.', sourceIds: [], targets: [] },
      { id: 't2', kind: 'instruction', title: 'Look at the ones digit', body: 'A number is even if it can be split into two equal groups with none left over. The quick check is the ones digit: a number ending in 0, 2, 4, 6, or 8 is even; ending in 1, 3, 5, 7, or 9 is odd. It’s the last digit that decides, not the first — 634 is even because it ends in 4.', sourceIds: ['SRC-017'], targets: ['determine', 'explain'], techniqueId: 'chunked_prompt' },
      { id: 't3', kind: 'practice', title: 'Sort them', body: 'Sort 128, 275, 640 and 903 into even and odd. Underline the digit you used to decide.', sourceIds: ['SRC-017'], targets: ['determine'] },
      { id: 't4', kind: 'mastery_task', title: 'Determine and explain', body: 'Is 570 even or odd? Explain how you know, using the ones digit or equal groups.', sourceIds: ['SRC-017'], targets: ['determine', 'explain'] },
      { id: 't5', kind: 'reflection', title: 'Think back', body: 'Why does only the ones digit matter for even or odd?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.NSO.11', objectiveId: 'M3.NSO.11', objectiveVersion: 1, authorId: 'T-101',
    title: 'Standard, expanded and word form',
    blocks: [
      { id: 'u1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will read a number and write it three ways: as digits, in expanded form, and in words.', sourceIds: [], targets: [] },
      { id: 'u2', kind: 'instruction', title: 'Three ways to show a number', body: 'Standard form is the digits: 3,024. Expanded form breaks it into the value of each place: 3,000 + 20 + 4. Word form spells it: “three thousand, twenty-four.” A zero holds a place — you do not write it as an extra word, so 3,024 is not “three thousand, two hundred, twenty-four.”', sourceIds: ['SRC-017'], targets: ['read', 'write'], techniqueId: 'chunked_prompt' },
      { id: 'u3', kind: 'worked_example', title: 'Write 4,007 three ways', body: 'Standard: 4,007. Expanded: 4,000 + 7 (the hundreds and tens are zero, so they add nothing). Word form: “four thousand, seven.”', sourceIds: ['SRC-010'], targets: ['read', 'write'], techniqueId: 'worked_example_fade' },
      { id: 'u4', kind: 'practice', title: 'Match the forms', body: 'Write 2,530 in expanded form and in word form.', sourceIds: ['SRC-017'], targets: ['read', 'write'] },
      { id: 'u5', kind: 'mastery_task', title: 'Read and write', body: 'Write “six thousand, forty” in standard form, then show it in expanded form. Explain what the zero is doing.', sourceIds: ['SRC-017'], targets: ['read', 'write'] },
      { id: 'u6', kind: 'reflection', title: 'Think back', body: 'Why does a zero still matter even though it adds nothing?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.NSO.12', objectiveId: 'M3.NSO.12', objectiveVersion: 1, authorId: 'T-101',
    title: 'Breaking numbers apart more than one way',
    blocks: [
      { id: 'v1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will build a four-digit number and break it apart in more than one way.', sourceIds: [], targets: [] },
      { id: 'v2', kind: 'instruction', title: 'Many ways to make one number', body: 'A number is a total made of place-value parts, and there is more than one way to make it. 1,250 is 1 thousand + 2 hundreds + 5 tens, but it is also 12 hundreds + 5 tens, or 1,000 + 250. Regrouping ten of one place into one of the next lets you rename the same amount.', sourceIds: ['SRC-017'], targets: ['compose', 'decompose'], techniqueId: 'visual_first_models' },
      { id: 'v3', kind: 'worked_example', title: 'Compose 13 hundreds', body: '2 thousands + 13 hundreds + 5 ones: the 13 hundreds regroup into 1 thousand and 3 hundreds, so the total is 3 thousands, 3 hundreds, 5 ones = 3,305.', sourceIds: ['SRC-017'], targets: ['compose'], techniqueId: 'worked_example_fade' },
      { id: 'v4', kind: 'practice', title: 'Two ways', body: 'Show 1,420 broken apart in two different place-value ways.', sourceIds: ['SRC-017'], targets: ['decompose'] },
      { id: 'v5', kind: 'mastery_task', title: 'Compose and decompose', body: 'Break 2,060 apart in two different ways, then combine 1 thousand, 11 hundreds and 6 tens and name the number. Show your regrouping.', sourceIds: ['SRC-017'], targets: ['compose', 'decompose'] },
      { id: 'v6', kind: 'reflection', title: 'Think back', body: 'How can the same number be written in more than one place-value way?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.NSO.22', objectiveId: 'M3.NSO.22', objectiveVersion: 1, authorId: 'T-101',
    title: 'Multiplication as equal groups and arrays',
    blocks: [
      { id: 'w1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will show multiplication with equal groups and arrays, and connect it to division.', sourceIds: [], targets: [] },
      { id: 'w2', kind: 'instruction', title: 'Equal groups, not one-by-one', body: 'Multiplication is counting equal groups fast: 4 × 7 is 4 groups of 7, which you can draw as an array of 4 rows and 7 columns. It is not the same as counting by ones. Division undoes it: the same array shows 28 ÷ 4 = 7.', sourceIds: ['SRC-017'], targets: ['represent', 'explain'], techniqueId: 'visual_first_models' },
      { id: 'w3', kind: 'practice', title: 'Draw the array', body: 'Draw an array for 6 × 5 and write the product.', sourceIds: ['SRC-017'], targets: ['represent'] },
      { id: 'w4', kind: 'mastery_task', title: 'Represent and explain', body: 'Draw 4 × 8 as an array, write the product, and explain how the same picture shows a division fact.', sourceIds: ['SRC-017'], targets: ['represent', 'explain'] },
      { id: 'w5', kind: 'reflection', title: 'Think back', body: 'Why is multiplication faster than counting by ones?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.NSO.23', objectiveId: 'M3.NSO.23', objectiveVersion: 1, authorId: 'T-101',
    title: 'Multiplying by tens and hundreds',
    blocks: [
      { id: 'x1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will use a basic fact to multiply by a multiple of ten or a hundred.', sourceIds: [], targets: [] },
      { id: 'x2', kind: 'instruction', title: 'Use the fact, then the place value', body: 'To find 6 × 30, first use the fact 6 × 3 = 18, then scale by the place value: 30 is 3 tens, so the answer is 18 tens = 180. 6 × 30 is not the same as 6 × 3 — the ten makes the product ten times bigger.', sourceIds: ['SRC-017'], targets: ['compute', 'explain'], techniqueId: 'worked_example_fade' },
      { id: 'x3', kind: 'worked_example', title: 'Find 4 × 200', body: '4 × 2 = 8. The 200 is 2 hundreds, so 4 × 200 = 8 hundreds = 800.', sourceIds: ['SRC-017'], targets: ['compute'], techniqueId: 'worked_example_fade' },
      { id: 'x4', kind: 'practice', title: 'Fact then scale', body: 'Find 7 × 40. Write the basic fact you used first.', sourceIds: ['SRC-017'], targets: ['compute'] },
      { id: 'x5', kind: 'mastery_task', title: 'Compute and explain', body: 'Find 8 × 300. Explain how the basic fact 8 × 3 and place value give the answer.', sourceIds: ['SRC-017'], targets: ['compute', 'explain'] },
      { id: 'x6', kind: 'reflection', title: 'Think back', body: 'Why isn’t 6 × 30 the same as 6 × 3?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.M.11', objectiveId: 'M3.M.11', objectiveVersion: 1, authorId: 'T-101',
    title: 'Choosing and reading measuring tools',
    blocks: [
      { id: 'y1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will pick the right tool to measure something and read it the right way.', sourceIds: [], targets: [] },
      { id: 'y2', kind: 'instruction', title: 'Right tool, read from zero', body: 'Match the tool to what you measure: a ruler for length, a beaker for liquid volume, a thermometer for temperature. However you measure, start at the zero mark and read the number where the object ends — starting anywhere else gives the wrong length.', sourceIds: ['SRC-018'], targets: ['select', 'measure'], techniqueId: 'visual_first_models' },
      { id: 'y3', kind: 'practice', title: 'Pick the tool', body: 'Name the tool you would use to measure how cold the water is, and one to measure how long the desk is.', sourceIds: ['SRC-018'], targets: ['select'] },
      { id: 'y4', kind: 'mastery_task', title: 'Select and measure', body: 'You need to measure how much juice is in a cup. Choose the tool and explain why, then explain how to read it correctly starting from zero.', sourceIds: ['SRC-018'], targets: ['select', 'measure'] },
      { id: 'y5', kind: 'reflection', title: 'Think back', body: 'Why does it matter where you start reading on a ruler?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.M.12', objectiveId: 'M3.M.12', objectiveVersion: 1, authorId: 'T-101',
    title: 'Measurement word problems',
    blocks: [
      { id: 'z1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will solve a word problem about measurements and choose the right operation.', sourceIds: [], targets: [] },
      { id: 'z2', kind: 'instruction', title: 'Same units, right operation', body: 'A measurement problem is still a story problem — decide what is happening (joining, taking away, equal groups) and pick the operation. Keep the units the same and label your answer. The numbers are not automatically added just because they are measurements.', sourceIds: ['SRC-018'], targets: ['model', 'explain'], techniqueId: 'chunked_prompt' },
      { id: 'z3', kind: 'worked_example', title: 'A jug of water', body: 'A jug holds 8 liters. You pour out 3 liters, then add 2 liters. Step 1: 8 − 3 = 5. Step 2: 5 + 2 = 7 liters.', sourceIds: ['SRC-018'], targets: ['model', 'solve'], techniqueId: 'worked_example_fade' },
      { id: 'z4', kind: 'practice', title: 'Name the operation', body: 'A rope is 12 meters. You cut off 5 meters. Write the operation and the answer with its unit.', sourceIds: ['SRC-018'], targets: ['model', 'solve'] },
      { id: 'z5', kind: 'mastery_task', title: 'Model and solve', body: 'Two bags weigh 9 kilograms and 6 kilograms; you take 4 kilograms out of the total. Model the two steps, solve, and label the units.', sourceIds: ['SRC-018'], targets: ['model', 'solve'] },
      { id: 'z6', kind: 'reflection', title: 'Think back', body: 'How do you decide whether to add or subtract in a measurement problem?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.M.21', objectiveId: 'M3.M.21', objectiveVersion: 1, authorId: 'T-101',
    title: 'Telling time to the minute',
    blocks: [
      { id: 'aa1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will read a clock to the exact minute and write the time with a.m. or p.m.', sourceIds: [], targets: [] },
      { id: 'aa2', kind: 'instruction', title: 'Two hands, two jobs', body: 'The short hand shows the hour; the long hand shows the minutes. Count minutes by fives around the clock, then by ones. Write it hour:minutes. Use a.m. for morning and p.m. for afternoon and evening. The short hand never tells the minutes.', sourceIds: ['SRC-018'], targets: ['read', 'write'], techniqueId: 'chunked_prompt' },
      { id: 'aa3', kind: 'worked_example', title: 'Read 2:35', body: 'The short hand is just past 2, so the hour is 2. The long hand is on the 7, which is 35 minutes (7 × 5). The time is 2:35.', sourceIds: ['SRC-018'], targets: ['read'], techniqueId: 'worked_example_fade' },
      { id: 'aa4', kind: 'practice', title: 'Write the time', body: 'The clock shows the hour hand past 9 and the minute hand on the 3. Write the digital time.', sourceIds: ['SRC-018'], targets: ['read', 'write'] },
      { id: 'aa5', kind: 'mastery_task', title: 'Read and write', body: 'Write “quarter past nine in the morning” as a digital time with a.m. or p.m., and explain which hand told you the minutes.', sourceIds: ['SRC-018'], targets: ['read', 'write'] },
      { id: 'aa6', kind: 'reflection', title: 'Think back', body: 'How do you know whether a time is a.m. or p.m.?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.DP.11', objectiveId: 'M3.DP.11', objectiveVersion: 1, authorId: 'T-101',
    title: 'Making a scaled graph',
    blocks: [
      { id: 'bb1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will turn a set of counts into a scaled bar graph or pictograph.', sourceIds: [], targets: [] },
      { id: 'bb2', kind: 'instruction', title: 'Title, labels, and a key', body: 'A good graph needs a title, labels on both sides, and — for a scaled graph — a key or scale that tells how much each step or picture is worth. When counts are large, let each grid line be 2 or 5 so the graph fits; a picture or square does not have to stand for just one.', sourceIds: ['SRC-020'], targets: ['represent', 'explain'], techniqueId: 'visual_first_models' },
      { id: 'bb3', kind: 'practice', title: 'Choose a scale', body: 'For counts of 10, 15 and 25, choose a scale for a bar graph and draw the first bar.', sourceIds: ['SRC-020'], targets: ['represent'] },
      { id: 'bb4', kind: 'mastery_task', title: 'Represent and explain', body: 'Make a scaled pictograph for this data with a key of 1 picture = 2, and explain why you chose your key and what your title and labels say.', sourceIds: ['SRC-020'], targets: ['represent', 'explain'] },
      { id: 'bb5', kind: 'reflection', title: 'Think back', body: 'Why might one picture stand for more than one?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.AR.11', objectiveId: 'M3.AR.11', objectiveVersion: 1, authorId: 'T-101',
    title: 'Breaking apart to multiply',
    blocks: [
      { id: 'cc1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will multiply a bigger number by breaking it into friendly parts.', sourceIds: [], targets: [] },
      { id: 'cc2', kind: 'instruction', title: 'Split, multiply, add', body: 'You do not need a memorized fact for every product. The distributive property lets you break a two-digit number into tens and ones, multiply each part, then add: 6 × 13 = (6 × 10) + (6 × 3). Both partial products together make the whole.', sourceIds: ['SRC-017'], targets: ['apply', 'explain'], techniqueId: 'worked_example_fade' },
      { id: 'cc3', kind: 'worked_example', title: 'Find 4 × 12', body: 'Break 12 into 10 and 2. 4 × 10 = 40 and 4 × 2 = 8. Add the partial products: 40 + 8 = 48.', sourceIds: ['SRC-017'], targets: ['apply'], techniqueId: 'worked_example_fade' },
      { id: 'cc4', kind: 'practice', title: 'Break it apart', body: 'Find 5 × 14 by breaking 14 into 10 and 4. Show both partial products.', sourceIds: ['SRC-017'], targets: ['apply'] },
      { id: 'cc5', kind: 'mastery_task', title: 'Apply and explain', body: 'Find 6 × 13 using the distributive property, and explain why breaking the number apart gives the same answer.', sourceIds: ['SRC-017'], targets: ['apply', 'explain'] },
      { id: 'cc6', kind: 'reflection', title: 'Think back', body: 'How does breaking a number apart help you multiply?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.AR.21', objectiveId: 'M3.AR.21', objectiveVersion: 1, authorId: 'T-101',
    title: 'Division as a missing factor',
    blocks: [
      { id: 'dd1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will turn a division problem into a multiplication problem with a missing factor.', sourceIds: [], targets: [] },
      { id: 'dd2', kind: 'instruction', title: 'What times the divisor?', body: 'Every division question is really a missing-factor question. 24 ÷ 4 asks “4 times what equals 24?” — that is 4 × ? = 24. Because multiplication and division are inverses, solving one solves the other.', sourceIds: ['SRC-017'], targets: ['restate', 'explain'], techniqueId: 'visual_first_models' },
      { id: 'dd3', kind: 'practice', title: 'Rewrite it', body: 'Rewrite 30 ÷ 5 = ? as a multiplication problem with a missing factor.', sourceIds: ['SRC-017'], targets: ['restate'] },
      { id: 'dd4', kind: 'mastery_task', title: 'Restate and explain', body: 'Rewrite 24 ÷ 4 as a missing-factor multiplication problem, solve it, and explain how the two facts are connected.', sourceIds: ['SRC-017'], targets: ['restate', 'explain'] },
      { id: 'dd5', kind: 'reflection', title: 'Think back', body: 'Why is division a “missing factor” problem?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.AR.22', objectiveId: 'M3.AR.22', objectiveVersion: 1, authorId: 'T-101',
    title: 'True or false equations',
    blocks: [
      { id: 'ee1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will decide whether an equation is true or false, and prove it.', sourceIds: [], targets: [] },
      { id: 'ee2', kind: 'instruction', title: 'The equal sign means balance', body: 'The equal sign does not mean “the answer is next” — it means both sides are worth the same. To check an equation, work out each side and compare. 4 × 5 = 2 × 10 is true because both sides are 20; 6 × 3 = 20 is false because 18 is not 20.', sourceIds: ['SRC-017'], targets: ['determine', 'justify'], techniqueId: 'chunked_prompt' },
      { id: 'ee3', kind: 'practice', title: 'Check both sides', body: 'Is 3 × 6 = 9 × 2 true or false? Work out each side.', sourceIds: ['SRC-017'], targets: ['determine'] },
      { id: 'ee4', kind: 'mastery_task', title: 'Determine and justify', body: 'Decide whether 4 × 5 = 2 × 10 is true or false, and justify your answer by comparing both sides.', sourceIds: ['SRC-017'], targets: ['determine', 'justify'] },
      { id: 'ee5', kind: 'reflection', title: 'Think back', body: 'What does the equal sign really tell you?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.AR.23', objectiveId: 'M3.AR.23', objectiveVersion: 1, authorId: 'T-101',
    title: 'Finding the unknown',
    blocks: [
      { id: 'ff1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will find a missing number in a multiplication or division equation, wherever it hides.', sourceIds: [], targets: [] },
      { id: 'ff2', kind: 'instruction', title: 'Use the inverse', body: 'The unknown can be in any spot: ? × 6 = 42, 42 ÷ ? = 7, or 6 × 7 = ?. Use the inverse operation and the fact family to find it. For ? × 6 = 42, think 42 ÷ 6 = 7.', sourceIds: ['SRC-017'], targets: ['solve', 'explain'], techniqueId: 'worked_example_fade' },
      { id: 'ff3', kind: 'practice', title: 'Any position', body: 'Find the unknown: 8 × ? = 40, and ? ÷ 3 = 9.', sourceIds: ['SRC-017'], targets: ['solve'] },
      { id: 'ff4', kind: 'mastery_task', title: 'Solve and explain', body: 'Find the unknown in ? × 6 = 42, and explain how you used the inverse operation to find it.', sourceIds: ['SRC-017'], targets: ['solve', 'explain'] },
      { id: 'ff5', kind: 'reflection', title: 'Think back', body: 'How does a fact family help you find a missing number?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.AR.32', objectiveId: 'M3.AR.32', objectiveVersion: 1, authorId: 'T-101',
    title: 'Is it a multiple?',
    blocks: [
      { id: 'gg1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will decide whether a number is a multiple of another number.', sourceIds: [], targets: [] },
      { id: 'gg2', kind: 'instruction', title: 'Skip count to check', body: 'A multiple of a number is what you land on when you skip count by it: multiples of 4 are 4, 8, 12, 16… To check if 36 is a multiple of 4, skip count by 4 until you reach or pass it. A multiple of 5 can end in 0 or 5 — 30 is a multiple of 5, even though it does not end in 5 alone.', sourceIds: ['SRC-017'], targets: ['determine', 'explain'], techniqueId: 'chunked_prompt' },
      { id: 'gg3', kind: 'practice', title: 'Skip and check', body: 'Is 24 a multiple of 6? Skip count to find out.', sourceIds: ['SRC-017'], targets: ['determine'] },
      { id: 'gg4', kind: 'mastery_task', title: 'Determine and explain', body: 'Is 45 a multiple of 9? Explain how skip counting shows your answer.', sourceIds: ['SRC-017'], targets: ['determine', 'explain'] },
      { id: 'gg5', kind: 'reflection', title: 'Think back', body: 'How can skip counting tell you if a number is a multiple?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.AR.33', objectiveId: 'M3.AR.33', objectiveVersion: 1, authorId: 'T-101',
    title: 'Number patterns',
    blocks: [
      { id: 'hh1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will find the rule of a pattern and use it to keep the pattern going.', sourceIds: [], targets: [] },
      { id: 'hh2', kind: 'instruction', title: 'Find the rule first', body: 'A pattern follows a rule — how each term changes to get the next. Some patterns add the same amount (3, 6, 9, 12: add 3); others multiply (2, 4, 8, 16: times 2). You cannot just copy the last number; you have to apply the rule.', sourceIds: ['SRC-017'], targets: ['extend', 'explain'], techniqueId: 'visual_first_models' },
      { id: 'hh3', kind: 'practice', title: 'Keep it going', body: 'Extend the pattern 5, 10, 15, 20, __, __ and name the rule.', sourceIds: ['SRC-017'], targets: ['extend'] },
      { id: 'hh4', kind: 'mastery_task', title: 'Extend and explain', body: 'Give the next two terms of 2, 4, 8, 16, and explain the rule you used.', sourceIds: ['SRC-017'], targets: ['extend', 'explain'] },
      { id: 'hh5', kind: 'reflection', title: 'Think back', body: 'Why do you need the rule, not just the last number?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.GR.11', objectiveId: 'M3.GR.11', objectiveVersion: 1, authorId: 'T-101',
    title: 'Points, lines, and angles',
    blocks: [
      { id: 'ii1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will name and draw points, lines, rays, and parallel and perpendicular lines.', sourceIds: [], targets: [] },
      { id: 'ii2', kind: 'instruction', title: 'The building blocks', body: 'A point is a spot; a line goes forever both ways; a segment has two ends; a ray has one end and goes forever the other way. Parallel lines stay the same distance apart and never meet. Perpendicular lines cross to make a square corner (right angle). Lines that just miss on the page are not automatically parallel.', sourceIds: ['SRC-019'], targets: ['identify', 'draw'], techniqueId: 'visual_first_models' },
      { id: 'ii3', kind: 'practice', title: 'Name them', body: 'In the figure, find one pair of parallel lines and one pair of perpendicular lines.', sourceIds: ['SRC-019'], targets: ['identify'] },
      { id: 'ii4', kind: 'mastery_task', title: 'Identify and draw', body: 'Draw two perpendicular segments and mark the right angle, then draw two parallel segments and explain how you know they are parallel.', sourceIds: ['SRC-019'], targets: ['identify', 'draw'] },
      { id: 'ii5', kind: 'reflection', title: 'Think back', body: 'What makes two lines parallel, not just close?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.GR.12', objectiveId: 'M3.GR.12', objectiveVersion: 1, authorId: 'T-101',
    title: 'Sorting quadrilaterals',
    blocks: [
      { id: 'jj1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will sort four-sided shapes by their attributes.', sourceIds: [], targets: [] },
      { id: 'jj2', kind: 'instruction', title: 'Attributes, not just looks', body: 'A quadrilateral has four sides. Classify by attributes: a trapezoid has one pair of parallel sides; a parallelogram has two pairs; a rectangle is a parallelogram with four right angles; a square is a rectangle with four equal sides. A square is a special rectangle — not a different family.', sourceIds: ['SRC-019'], targets: ['identify', 'classify'], techniqueId: 'chunked_prompt' },
      { id: 'jj3', kind: 'practice', title: 'Which is which', body: 'Name the shape that has exactly one pair of parallel sides.', sourceIds: ['SRC-019'], targets: ['identify'] },
      { id: 'jj4', kind: 'mastery_task', title: 'Identify and classify', body: 'Explain why a square is also a rectangle, using its sides and angles, and name one shape that is a rectangle but not a square.', sourceIds: ['SRC-019'], targets: ['identify', 'classify'] },
      { id: 'jj5', kind: 'reflection', title: 'Think back', body: 'How can one shape belong to more than one group?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.GR.13', objectiveId: 'M3.GR.13', objectiveVersion: 1, authorId: 'T-101',
    title: 'Lines of symmetry',
    blocks: [
      { id: 'kk1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will find the lines that fold a shape into matching halves.', sourceIds: [], targets: [] },
      { id: 'kk2', kind: 'instruction', title: 'Fold to match', body: 'A line of symmetry folds a figure so the two halves match exactly, like a mirror. A shape can have none, one, or many: a square has 4 lines of symmetry, a rectangle has 2. To test a line, imagine folding along it — do the halves land on each other?', sourceIds: ['SRC-019'], targets: ['identify', 'draw'], techniqueId: 'visual_first_models' },
      { id: 'kk3', kind: 'practice', title: 'Fold test', body: 'Draw one line of symmetry for a rectangle and check it with the fold test.', sourceIds: ['SRC-019'], targets: ['draw'] },
      { id: 'kk4', kind: 'mastery_task', title: 'Identify and draw', body: 'Draw all the lines of symmetry for a square, and explain how the fold test shows each one is a line of symmetry.', sourceIds: ['SRC-019'], targets: ['identify', 'draw'] },
      { id: 'kk5', kind: 'reflection', title: 'Think back', body: 'Can a shape have more than one line of symmetry? Give an example.', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.GR.21', objectiveId: 'M3.GR.21', objectiveVersion: 1, authorId: 'T-101',
    title: 'Area by counting squares',
    blocks: [
      { id: 'll1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will measure the space inside a shape by covering it with squares.', sourceIds: [], targets: [] },
      { id: 'll2', kind: 'instruction', title: 'Cover with no gaps', body: 'Area is the space inside a figure, measured in unit squares. Cover the figure with same-size squares, no gaps and no overlaps, and count them. That count is the area, in square units. Counting the distance around the outside gives perimeter, not area.', sourceIds: ['SRC-019'], targets: ['measure', 'explain'], techniqueId: 'visual_first_models' },
      { id: 'll3', kind: 'practice', title: 'Count the squares', body: 'A rectangle is covered by 3 rows of 5 unit squares. How many square units is its area?', sourceIds: ['SRC-019'], targets: ['measure'] },
      { id: 'll4', kind: 'mastery_task', title: 'Measure and explain', body: 'Find the area of a figure covered by unit squares by counting, and explain why you count the squares inside rather than the distance around.', sourceIds: ['SRC-019'], targets: ['measure', 'explain'] },
      { id: 'll5', kind: 'reflection', title: 'Think back', body: 'What is the difference between area and the distance around?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.GR.22', objectiveId: 'M3.GR.22', objectiveVersion: 1, authorId: 'T-101',
    title: 'The area formula',
    blocks: [
      { id: 'mm1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will find a rectangle’s area with multiplication instead of counting every square.', sourceIds: [], targets: [] },
      { id: 'mm2', kind: 'instruction', title: 'Rows times columns', body: 'A rectangle of unit squares has equal rows, so instead of counting all of them you multiply: length × width. A 4 by 3 rectangle has 3 rows of 4 squares, which is 4 × 3 = 12 square units. Area is length times width, not length plus width.', sourceIds: ['SRC-019'], targets: ['compute', 'explain'], techniqueId: 'worked_example_fade' },
      { id: 'mm3', kind: 'worked_example', title: 'A 5 by 4 rectangle', body: 'It has 4 rows of 5 unit squares. 5 × 4 = 20 square units.', sourceIds: ['SRC-019'], targets: ['compute'], techniqueId: 'worked_example_fade' },
      { id: 'mm4', kind: 'practice', title: 'Use the formula', body: 'Find the area of a 7 by 3 rectangle using length × width.', sourceIds: ['SRC-019'], targets: ['compute'] },
      { id: 'mm5', kind: 'mastery_task', title: 'Compute and explain', body: 'Find the area of a 7 by 4 rectangle with the formula, and explain why length × width counts the unit squares.', sourceIds: ['SRC-019'], targets: ['compute', 'explain'] },
      { id: 'mm6', kind: 'reflection', title: 'Think back', body: 'Why does multiplying the sides give the number of squares?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-M3.GR.24', objectiveId: 'M3.GR.24', objectiveVersion: 1, authorId: 'T-101',
    title: 'Area of L-shapes',
    blocks: [
      { id: 'nn1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will find the area of a shape made of two rectangles.', sourceIds: [], targets: [] },
      { id: 'nn2', kind: 'instruction', title: 'Split into rectangles', body: 'A composite figure like an L-shape is not one rectangle, so one multiplication will not do it. Split it into non-overlapping rectangles, find each area with length × width, then add them. You cannot find an L-shape’s area with a single multiplication.', sourceIds: ['SRC-019'], targets: ['decompose', 'compute'], techniqueId: 'chunked_prompt' },
      { id: 'nn3', kind: 'worked_example', title: 'An L-shape', body: 'Split the L into a 4 by 2 rectangle (area 8) and a 2 by 3 rectangle (area 6). Total area = 8 + 6 = 14 square units.', sourceIds: ['SRC-019'], targets: ['decompose', 'compute'], techniqueId: 'worked_example_fade' },
      { id: 'nn4', kind: 'practice', title: 'Split and add', body: 'Split the given L-shape into two rectangles and write each one’s area.', sourceIds: ['SRC-019'], targets: ['decompose'] },
      { id: 'nn5', kind: 'mastery_task', title: 'Decompose and compute', body: 'Find the total area of an L-shape by splitting it into two rectangles, finding each area, and adding them.', sourceIds: ['SRC-019'], targets: ['decompose', 'compute'] },
      { id: 'nn6', kind: 'reflection', title: 'Think back', body: 'Why can’t you find an L-shape’s area with just one multiplication?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-F3.13', objectiveId: 'F3.13', objectiveVersion: 1, authorId: 'T-102',
    title: 'Decoding with word parts',
    blocks: [
      { id: 'fa1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will read tricky words by breaking them into parts instead of one letter at a time.', sourceIds: [], targets: [] },
      { id: 'fa2', kind: 'instruction', title: 'Chunk it, don’t crawl it', body: 'Good readers don’t sound out every single letter — they read in chunks: syllables, and word parts like prefixes and suffixes. Spotting a known part (re-, -ing, -able, a root like “port”) lets you read a long word quickly and often figure out its meaning.', sourceIds: ['SRC-023'], targets: ['decode', 'explain'], techniqueId: 'chunked_prompt' },
      { id: 'fa3', kind: 'worked_example', title: 'Read “unhelpful”', body: 'Break it into un + help + ful. Blend the chunks: un-help-ful. You read it fast, and the parts even tell you it means “not full of help.”', sourceIds: ['SRC-022'], targets: ['decode'], techniqueId: 'worked_example_fade' },
      { id: 'fa4', kind: 'practice', title: 'Break and blend', body: 'Break “replaying” into parts and read it. Underline the prefix and the suffix.', sourceIds: ['SRC-023'], targets: ['decode'] },
      { id: 'fa5', kind: 'mastery_task', title: 'Decode and explain', body: 'Read the word “disagreement” by breaking it into parts, then explain which chunks helped you read it.', sourceIds: ['SRC-023'], targets: ['decode', 'explain'] },
      { id: 'fa6', kind: 'reflection', title: 'Think back', body: 'Why is breaking a word into chunks faster than letter by letter?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-F3.14', objectiveId: 'F3.14', objectiveVersion: 1, authorId: 'T-102',
    title: 'Reading smoothly and with expression',
    blocks: [
      { id: 'fb1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will read a passage smoothly, at a steady pace, with expression that fits the meaning.', sourceIds: [], targets: [] },
      { id: 'fb2', kind: 'instruction', title: 'Accuracy, pace, expression', body: 'Fluent reading is three things at once: accuracy (right words), automaticity (a steady, comfortable pace — not racing), and prosody (expression — pausing at punctuation, changing your voice to match the meaning). Fast is not the goal; smooth and clear is. Good readers also notice a mistake and fix it.', sourceIds: ['SRC-021'], targets: ['read', 'self-correct'], techniqueId: 'chunked_prompt' },
      { id: 'fb3', kind: 'practice', title: 'Read it twice', body: 'Read the short paragraph once, then again — slow down at commas and stop at periods.', sourceIds: ['SRC-012'], targets: ['read'] },
      { id: 'fb4', kind: 'mastery_task', title: 'Read and self-correct', body: 'Read the passage aloud with expression. If a word comes out wrong, go back and fix it, and tell how you knew it was wrong.', sourceIds: ['SRC-021'], targets: ['read', 'self-correct'] },
      { id: 'fb5', kind: 'reflection', title: 'Think back', body: 'Why is reading smoothly more helpful than reading fast?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-RD3.02', objectiveId: 'RD3.02', objectiveVersion: 1, authorId: 'T-102',
    title: 'Finding the theme',
    blocks: [
      { id: 'ra1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will find the theme — the big message — of a story and show how it grows.', sourceIds: [], targets: [] },
      { id: 'ra2', kind: 'instruction', title: 'Message, not topic', body: 'The topic is what a story is about in a word (friendship). The theme is the lesson or message the story teaches about it (“real friends help even when it’s hard”). Find it by asking what the characters learn or how they change, and track the details that build toward it.', sourceIds: ['SRC-021'], targets: ['identify', 'explain'], techniqueId: 'chunked_prompt' },
      { id: 'ra3', kind: 'practice', title: 'Topic vs. theme', body: 'For the story, write the one-word topic, then write the theme as a full sentence.', sourceIds: ['SRC-012'], targets: ['identify'] },
      { id: 'ra4', kind: 'mastery_task', title: 'Explain the theme', body: 'State the theme of the story in a sentence, and explain how two details across the story develop it.', sourceIds: ['SRC-021'], targets: ['identify', 'explain'] },
      { id: 'ra5', kind: 'reflection', title: 'Think back', body: 'How is a theme different from just the topic?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-RD3.03', objectiveId: 'RD3.03', objectiveVersion: 1, authorId: 'T-102',
    title: 'Different characters, different views',
    blocks: [
      { id: 'rb1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will show how two characters can see the same event in different ways.', sourceIds: [], targets: [] },
      { id: 'rb2', kind: 'instruction', title: 'Same event, different eyes', body: 'A perspective is how a character sees things, based on what they want and feel. The same event can look great to one character and terrible to another. To find a character’s perspective, notice what they say, do, and feel about the event — and remember other characters may feel the opposite.', sourceIds: ['SRC-021'], targets: ['compare', 'explain'], techniqueId: 'chunked_prompt' },
      { id: 'rb3', kind: 'practice', title: 'Two reactions', body: 'For one event in the story, write how two different characters feel about it.', sourceIds: ['SRC-012'], targets: ['compare'] },
      { id: 'rb4', kind: 'mastery_task', title: 'Compare and explain', body: 'Explain how two characters see the same event differently, using a detail from the text for each one.', sourceIds: ['SRC-021'], targets: ['compare', 'explain'] },
      { id: 'rb5', kind: 'reflection', title: 'Think back', body: 'Why might two characters feel so differently about the same thing?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-RD3.04', objectiveId: 'RD3.04', objectiveVersion: 1, authorId: 'T-102',
    title: 'Kinds of poems',
    blocks: [
      { id: 'rc1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will tell different kinds of poems apart by their features.', sourceIds: [], targets: [] },
      { id: 'rc2', kind: 'instruction', title: 'Poems come in types', body: 'Not all poems rhyme. Free verse has no set rhyme or rhythm. Rhymed verse has lines that rhyme. A haiku is three lines about nature with a 5-7-5 syllable pattern. A limerick is a funny five-line poem with a bouncy rhythm. Look at rhyme, line count and syllables to tell them apart.', sourceIds: ['SRC-021'], targets: ['identify', 'distinguish'], techniqueId: 'chunked_prompt' },
      { id: 'rc3', kind: 'practice', title: 'Name that poem', body: 'Read the two short poems and label each one’s type, with the feature that tells you.', sourceIds: ['SRC-012'], targets: ['identify'] },
      { id: 'rc4', kind: 'mastery_task', title: 'Identify and distinguish', body: 'Given a haiku and a free-verse poem, identify each type and explain the feature that distinguishes them.', sourceIds: ['SRC-021'], targets: ['identify', 'distinguish'] },
      { id: 'rc5', kind: 'reflection', title: 'Think back', body: 'Does a poem have to rhyme to be a poem? Explain.', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-RI3.01', objectiveId: 'RI3.01', objectiveVersion: 1, authorId: 'T-102',
    title: 'How text features help',
    blocks: [
      { id: 'ia1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will explain how headings, captions and pictures help you understand a text.', sourceIds: [], targets: [] },
      { id: 'ia2', kind: 'instruction', title: 'Features do a job', body: 'Text features are not decoration. A heading tells what a section is about; a caption explains a picture; bold words flag important vocabulary; a diagram shows how something works. Each one helps you find and understand information faster.', sourceIds: ['SRC-024'], targets: ['identify', 'explain'], techniqueId: 'chunked_prompt' },
      { id: 'ia3', kind: 'practice', title: 'Spot the feature', body: 'Find one heading and one caption in the passage. Write what each one tells you.', sourceIds: ['SRC-024'], targets: ['identify'] },
      { id: 'ia4', kind: 'mastery_task', title: 'Identify and explain', body: 'Choose two text features in the article and explain how each one adds to the meaning of the text.', sourceIds: ['SRC-013'], targets: ['identify', 'explain'] },
      { id: 'ia5', kind: 'reflection', title: 'Think back', body: 'Why is it a mistake to skip the headings and captions?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-RI3.03', objectiveId: 'RI3.03', objectiveVersion: 1, authorId: 'T-102',
    title: 'Why the author wrote it',
    blocks: [
      { id: 'ib1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will figure out why an author wrote a text and how you can tell.', sourceIds: [], targets: [] },
      { id: 'ib2', kind: 'instruction', title: 'Inform, persuade, entertain', body: 'Authors write for a purpose: to inform (teach facts), to persuade (get you to agree or act), or to entertain (tell a fun story). One text can lean one way. Look at the words and details — lots of facts and headings means inform; opinion words and reasons means persuade.', sourceIds: ['SRC-013'], targets: ['identify', 'explain'], techniqueId: 'chunked_prompt' },
      { id: 'ib3', kind: 'practice', title: 'Purpose clues', body: 'Read the passage. Decide the author’s purpose and underline one clue that shows it.', sourceIds: ['SRC-024'], targets: ['identify'] },
      { id: 'ib4', kind: 'mastery_task', title: 'Identify and explain', body: 'State the author’s purpose in the text and explain how the details develop it.', sourceIds: ['SRC-013'], targets: ['identify', 'explain'] },
      { id: 'ib5', kind: 'reflection', title: 'Think back', body: 'How can the same topic be written to inform or to persuade?', sourceIds: [], targets: [] },
    ],
  },
  {
    id: 'LP-RI3.04', objectiveId: 'RI3.04', objectiveVersion: 1, authorId: 'T-102',
    title: 'Claim and evidence',
    blocks: [
      { id: 'ic1', kind: 'objective_preview', title: 'Today you will…', body: 'Today you will find an author’s claim and show how they back it up.', sourceIds: [], targets: [] },
      { id: 'ic2', kind: 'instruction', title: 'A claim needs proof', body: 'A claim is what the author wants you to believe (“recess helps kids learn”). A claim is not true just because it is written — a good author supports it with evidence: facts, examples and reasons. To judge a text, find the claim, then find the evidence that backs it.', sourceIds: ['SRC-013'], targets: ['identify', 'explain'], techniqueId: 'worked_example_fade' },
      { id: 'ic3', kind: 'practice', title: 'Find the proof', body: 'Write the author’s claim, then copy one piece of evidence that supports it.', sourceIds: ['SRC-024'], targets: ['identify'] },
      { id: 'ic4', kind: 'mastery_task', title: 'Identify and explain', body: 'Identify the author’s claim and explain how two pieces of evidence support it.', sourceIds: ['SRC-013'], targets: ['identify', 'explain'] },
      { id: 'ic5', kind: 'reflection', title: 'Think back', body: 'Why isn’t a claim true just because the author wrote it?', sourceIds: [], targets: [] },
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

  cr('IT-M3.FR.12-1', 'M3.FR.12', 'represent', 'Show 3/4 as a sum of unit fractions and mark it on a number line.', ['SRC-001'], ['a fraction can never be greater than one whole']),
  cr('IT-M3.FR.12-2', 'M3.FR.12', 'explain', 'Explain why 5/3 is greater than one whole, using unit fractions.', ['SRC-011'], ['a fraction can never be greater than one whole']),
  mc('IT-M3.FR.13-1', 'M3.FR.13', 'read', 'Which is 3/5 written in word form?', ['three fifths'], ['five thirds', 'three fives', 'thirty-five'], ['SRC-010'], ['you read the top number as a whole number']),
  cr('IT-M3.FR.13-2', 'M3.FR.13', 'write', 'Write “seven fourths” in standard form as a fraction.', ['SRC-001'], ['you read the top number as a whole number']),
  cr('IT-M3.NSO.13-1', 'M3.NSO.13', 'order', 'Order 2,405; 2,045; 2,450 from least to greatest.', ['SRC-017'], ['you compare numbers starting from the ones place']),
  cr('IT-M3.NSO.13-2', 'M3.NSO.13', 'compare', 'Compare 3,050 and 3,500 and explain which is greater using place value.', ['SRC-017'], ['you compare numbers starting from the ones place']),
  mc('IT-M3.NSO.21-1', 'M3.NSO.21', 'compute', 'What is 405 − 128?', ['277'], ['323', '283', '387'], ['SRC-017'], ['you always subtract the smaller digit from the larger in each column']),
  cr('IT-M3.NSO.21-2', 'M3.NSO.21', 'explain', 'Add 367 + 285. Explain where you had to regroup.', ['SRC-017'], ['you always subtract the smaller digit from the larger in each column']),
  mc('IT-M3.AR.31-1', 'M3.AR.31', 'determine', 'Which of these numbers is odd?', ['457'], ['312', '628', '940'], ['SRC-017'], ['you check the first digit to tell even or odd']),
  cr('IT-M3.AR.31-2', 'M3.AR.31', 'explain', 'Explain how you know 570 is even, using the ones digit or equal groups.', ['SRC-017'], ['you check the first digit to tell even or odd']),

  mc('IT-M3.NSO.11-1', 'M3.NSO.11', 'read', 'Which is 3,024 written in expanded form?', ['3,000 + 20 + 4'], ['3,000 + 200 + 4', '300 + 24', '3,000 + 24'], ['SRC-017'], ['you write a number exactly the way you say it, word for word']),
  cr('IT-M3.NSO.11-2', 'M3.NSO.11', 'write', 'Write “four thousand, seven” in standard form and in expanded form.', ['SRC-010'], ['you write a number exactly the way you say it, word for word']),
  cr('IT-M3.NSO.12-1', 'M3.NSO.12', 'decompose', 'Show the number 1,420 broken apart in two different place-value ways.', ['SRC-017'], ['a number can only be broken apart one way']),
  cr('IT-M3.NSO.12-2', 'M3.NSO.12', 'compose', 'Combine 1 thousand, 11 hundreds and 6 tens. What number is it?', ['SRC-017'], ['a number can only be broken apart one way']),
  cr('IT-M3.NSO.22-1', 'M3.NSO.22', 'represent', 'Draw an array for 4 × 7 and write the product.', ['SRC-017'], ['multiplication is just counting by ones quickly']),
  cr('IT-M3.NSO.22-2', 'M3.NSO.22', 'explain', 'Explain how the array for 6 × 8 also shows a division fact.', ['SRC-017'], ['multiplication is just counting by ones quickly']),
  mc('IT-M3.NSO.23-1', 'M3.NSO.23', 'compute', 'What is 6 × 30?', ['180'], ['18', '90', '63'], ['SRC-017'], ['6 times 30 is the same as 6 times 3']),
  cr('IT-M3.NSO.23-2', 'M3.NSO.23', 'explain', 'Explain how the fact 8 × 3 helps you find 8 × 300.', ['SRC-017'], ['6 times 30 is the same as 6 times 3']),
  cr('IT-M3.M.11-1', 'M3.M.11', 'select', 'Which tool would you use to measure how much juice is in a cup, and why?', ['SRC-018'], ['you can start measuring from any point on the ruler']),
  cr('IT-M3.M.11-2', 'M3.M.11', 'measure', 'A crayon lines up from 0 to the 8 mark on a centimeter ruler. How long is it, and how do you know you read it correctly?', ['SRC-018'], ['you can start measuring from any point on the ruler']),
  cr('IT-M3.M.12-1', 'M3.M.12', 'model', 'A rope is 12 meters. You cut off 5 meters, then tie on 3 meters. Write the two steps you would use.', ['SRC-018'], ['the numbers in a measurement problem are always added']),
  cr('IT-M3.M.12-2', 'M3.M.12', 'solve', 'Solve the rope problem and label your answer with its unit.', ['SRC-018'], ['the numbers in a measurement problem are always added']),
  mc('IT-M3.M.21-1', 'M3.M.21', 'read', 'The hour hand is just past 2 and the minute hand is on the 7. What time is it?', ['2:35'], ['7:10', '2:07', '35 past 7'], ['SRC-018'], ['the short hand tells the minutes']),
  cr('IT-M3.M.21-2', 'M3.M.21', 'write', 'Write “quarter past nine in the morning” as a digital time with a.m. or p.m.', ['SRC-018'], ['the short hand tells the minutes']),
  cr('IT-M3.DP.11-1', 'M3.DP.11', 'represent', 'Make a scaled bar graph for the counts 10, 15 and 25. Choose a scale and label it.', ['SRC-020'], ['every square or picture on a graph must stand for one']),
  cr('IT-M3.DP.11-2', 'M3.DP.11', 'explain', 'Explain what key or scale your graph uses and why you chose it.', ['SRC-020'], ['every square or picture on a graph must stand for one']),

  cr('IT-M3.AR.11-1', 'M3.AR.11', 'apply', 'Use the distributive property to find 6 × 13 by breaking 13 into 10 and 3.', ['SRC-017'], ['you can only multiply numbers you already know as a fact']),
  cr('IT-M3.AR.11-2', 'M3.AR.11', 'explain', 'Explain why 4 × 12 equals (4 × 10) + (4 × 2).', ['SRC-017'], ['you can only multiply numbers you already know as a fact']),
  cr('IT-M3.AR.21-1', 'M3.AR.21', 'restate', 'Rewrite 24 ÷ 4 = ? as a multiplication problem with a missing factor.', ['SRC-017'], ['division has nothing to do with multiplication']),
  cr('IT-M3.AR.21-2', 'M3.AR.21', 'explain', 'Explain how solving 4 × ? = 24 also solves 24 ÷ 4.', ['SRC-017'], ['division has nothing to do with multiplication']),
  cr('IT-M3.AR.22-1', 'M3.AR.22', 'determine', 'Decide whether the equation 6 × 3 = 20 is true or false, and state which it is.', ['SRC-017'], ['the equal sign just means the answer comes next']),
  cr('IT-M3.AR.22-2', 'M3.AR.22', 'justify', 'Justify whether 4 × 5 = 2 × 10 is true or false by comparing both sides.', ['SRC-017'], ['the equal sign just means the answer comes next']),
  cr('IT-M3.AR.23-1', 'M3.AR.23', 'solve', 'Find the unknown: ? × 6 = 42.', ['SRC-017'], ['the unknown is always at the end of the equation']),
  cr('IT-M3.AR.23-2', 'M3.AR.23', 'explain', 'Explain how you found the unknown in 42 ÷ ? = 7.', ['SRC-017'], ['the unknown is always at the end of the equation']),
  mc('IT-M3.AR.32-1', 'M3.AR.32', 'determine', 'Which number is a multiple of 4?', ['36'], ['30', '42', '50'], ['SRC-017'], ['a multiple of 5 must end in 5']),
  cr('IT-M3.AR.32-2', 'M3.AR.32', 'explain', 'Explain how skip counting shows whether 45 is a multiple of 9.', ['SRC-017'], ['a multiple of 5 must end in 5']),
  cr('IT-M3.AR.33-1', 'M3.AR.33', 'extend', 'Extend the pattern 3, 6, 9, 12, __, __ and give the rule.', ['SRC-017'], ['you find the next term by copying the last number']),
  cr('IT-M3.AR.33-2', 'M3.AR.33', 'explain', 'Explain the rule for the pattern 2, 4, 8, 16 and give the next term.', ['SRC-017'], ['you find the next term by copying the last number']),
  cr('IT-M3.GR.11-1', 'M3.GR.11', 'identify', 'In the figure, name one pair of parallel lines and one pair of perpendicular lines.', ['SRC-019'], ['any two lines that do not touch on the page are parallel']),
  cr('IT-M3.GR.11-2', 'M3.GR.11', 'draw', 'Draw two perpendicular line segments and mark the right angle.', ['SRC-019'], ['any two lines that do not touch on the page are parallel']),
  mc('IT-M3.GR.12-1', 'M3.GR.12', 'identify', 'Which shape has exactly one pair of parallel sides?', ['trapezoid'], ['square', 'rectangle', 'rhombus'], ['SRC-019'], ['a square and a rectangle are completely different shapes']),
  cr('IT-M3.GR.12-2', 'M3.GR.12', 'classify', 'Explain why a square is also a rectangle, using its sides and angles.', ['SRC-019'], ['a square and a rectangle are completely different shapes']),
  cr('IT-M3.GR.13-1', 'M3.GR.13', 'draw', 'Draw all the lines of symmetry for a square.', ['SRC-019'], ['every shape has exactly one line of symmetry']),
  cr('IT-M3.GR.13-2', 'M3.GR.13', 'identify', 'A dashed line is drawn on a shape. Explain how the fold test checks whether it is a line of symmetry.', ['SRC-019'], ['every shape has exactly one line of symmetry']),
  cr('IT-M3.GR.21-1', 'M3.GR.21', 'measure', 'A rectangle is covered by 3 rows of 5 unit squares. What is its area, in square units?', ['SRC-019'], ['you find area by measuring around the outside']),
  cr('IT-M3.GR.21-2', 'M3.GR.21', 'explain', 'Explain why you count the unit squares inside, not the distance around, to find area.', ['SRC-019'], ['you find area by measuring around the outside']),
  mc('IT-M3.GR.22-1', 'M3.GR.22', 'compute', 'A rectangle is 7 units by 4 units. What is its area?', ['28 square units'], ['22 units', '11 units', '28 units'], ['SRC-019'], ['area is length plus width']),
  cr('IT-M3.GR.22-2', 'M3.GR.22', 'explain', 'Explain why length × width gives the number of unit squares in a rectangle.', ['SRC-019'], ['area is length plus width']),
  cr('IT-M3.GR.24-1', 'M3.GR.24', 'decompose', 'An L-shape is made of two rectangles. Show how you would split it to find the area.', ['SRC-019'], ['you can find the area of an L-shape with one multiplication']),
  cr('IT-M3.GR.24-2', 'M3.GR.24', 'compute', 'Find the total area of the L-shape by adding the two rectangles’ areas.', ['SRC-019'], ['you can find the area of an L-shape with one multiplication']),

  cr('IT-F3.13-1', 'F3.13', 'decode', 'Read the word “disagreement” by breaking it into parts, and write the parts you used.', ['SRC-023'], ['you sound out every word one letter at a time']),
  cr('IT-F3.13-2', 'F3.13', 'explain', 'Explain which word parts helped you read “unhelpful” quickly.', ['SRC-022'], ['you sound out every word one letter at a time']),
  cr('IT-F3.14-1', 'F3.14', 'read', 'Read the passage aloud. Mark where you pause for commas and stop for periods.', ['SRC-021'], ['reading fast is the same as reading well']),
  cr('IT-F3.14-2', 'F3.14', 'self-correct', 'You read the word “house” as “horse.” Explain how you would notice and fix that mistake.', ['SRC-012'], ['reading fast is the same as reading well']),
  cr('IT-RD3.02-1', 'RD3.02', 'identify', 'Write the theme of the story in one sentence.', ['SRC-021'], ['the theme is the same as the topic']),
  cr('IT-RD3.02-2', 'RD3.02', 'explain', 'Explain how two details in the story develop that theme.', ['SRC-012'], ['the theme is the same as the topic']),
  cr('IT-RD3.03-1', 'RD3.03', 'compare', 'For one event in the story, write how two different characters feel about it.', ['SRC-021'], ['every character feels the same way about what happens']),
  cr('IT-RD3.03-2', 'RD3.03', 'explain', 'Explain why the two characters see the event differently, using a detail for each.', ['SRC-012'], ['every character feels the same way about what happens']),
  mc('IT-RD3.04-1', 'RD3.04', 'identify', 'Which poem type is always three lines about nature with a 5-7-5 syllable pattern?', ['haiku'], ['limerick', 'free verse', 'rhymed verse'], ['SRC-021'], ['all poems have to rhyme']),
  cr('IT-RD3.04-2', 'RD3.04', 'distinguish', 'Given a haiku and a free-verse poem, explain the feature that tells them apart.', ['SRC-012'], ['all poems have to rhyme']),
  cr('IT-RI3.01-1', 'RI3.01', 'identify', 'Find one heading and one caption in the article and write what each one tells you.', ['SRC-024'], ['text features are just decoration you can skip']),
  cr('IT-RI3.01-2', 'RI3.01', 'explain', 'Explain how a diagram in the text helps you understand the information.', ['SRC-013'], ['text features are just decoration you can skip']),
  mc('IT-RI3.03-1', 'RI3.03', 'identify', 'An author fills a text with facts, headings and diagrams. What is the most likely purpose?', ['to inform'], ['to persuade', 'to entertain', 'to rhyme'], ['SRC-013'], ['an author only ever writes to tell facts']),
  cr('IT-RI3.03-2', 'RI3.03', 'explain', 'Explain how the details in the text show the author’s purpose.', ['SRC-024'], ['an author only ever writes to tell facts']),
  cr('IT-RI3.04-1', 'RI3.04', 'identify', 'Write the author’s claim and copy one piece of evidence that supports it.', ['SRC-013'], ['a claim is true just because the author wrote it']),
  cr('IT-RI3.04-2', 'RI3.04', 'explain', 'Explain how the evidence supports the author’s claim.', ['SRC-024'], ['a claim is true just because the author wrote it']),
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
  rubric('M3.FR.12', [{ trace: 'represent', desc: 'Represents m/b as iterated unit fractions.', max: 3 }, { trace: 'explain', desc: 'Explains fractions greater than one.', max: 3 }]),
  rubric('M3.FR.13', [{ trace: 'read', desc: 'Reads fractions correctly.', max: 3 }, { trace: 'write', desc: 'Writes fractions in standard and word form.', max: 3 }]),
  rubric('M3.NSO.13', [{ trace: 'plot', desc: 'Plots numbers on a number line.', max: 2 }, { trace: 'order', desc: 'Orders whole numbers correctly.', max: 3 }, { trace: 'compare', desc: 'Compares using place value.', max: 3 }]),
  rubric('M3.NSO.21', [{ trace: 'compute', desc: 'Adds and subtracts accurately with regrouping.', max: 4 }, { trace: 'explain', desc: 'Explains the regrouping.', max: 2 }]),
  rubric('M3.AR.31', [{ trace: 'determine', desc: 'Determines even or odd correctly.', max: 3 }, { trace: 'explain', desc: 'Explains using the ones digit or equal groups.', max: 3 }]),
  rubric('M3.NSO.11', [{ trace: 'read', desc: 'Reads numbers across forms.', max: 3 }, { trace: 'write', desc: 'Writes standard, expanded and word form.', max: 3 }]),
  rubric('M3.NSO.12', [{ trace: 'compose', desc: 'Composes four-digit numbers, regrouping.', max: 3 }, { trace: 'decompose', desc: 'Decomposes in more than one way.', max: 3 }]),
  rubric('M3.NSO.22', [{ trace: 'represent', desc: 'Represents multiplication with an array.', max: 3 }, { trace: 'explain', desc: 'Connects multiplication and division.', max: 3 }]),
  rubric('M3.NSO.23', [{ trace: 'compute', desc: 'Multiplies by multiples of 10/100.', max: 3 }, { trace: 'explain', desc: 'Explains using place value.', max: 3 }]),
  rubric('M3.M.11', [{ trace: 'select', desc: 'Selects the correct tool.', max: 3 }, { trace: 'measure', desc: 'Reads the measurement from zero.', max: 3 }]),
  rubric('M3.M.12', [{ trace: 'model', desc: 'Models the problem with the right operations.', max: 3 }, { trace: 'solve', desc: 'Solves and labels the units.', max: 3 }]),
  rubric('M3.M.21', [{ trace: 'read', desc: 'Reads time to the minute.', max: 3 }, { trace: 'write', desc: 'Writes time with a.m./p.m.', max: 3 }]),
  rubric('M3.DP.11', [{ trace: 'represent', desc: 'Represents data on a scaled graph.', max: 3 }, { trace: 'explain', desc: 'Explains the scale/key, title and labels.', max: 3 }]),
  rubric('M3.AR.11', [{ trace: 'apply', desc: 'Applies the distributive property.', max: 3 }, { trace: 'explain', desc: 'Explains why breaking apart works.', max: 3 }]),
  rubric('M3.AR.21', [{ trace: 'restate', desc: 'Restates division as a missing factor.', max: 3 }, { trace: 'explain', desc: 'Explains the multiplication–division link.', max: 3 }]),
  rubric('M3.AR.22', [{ trace: 'determine', desc: 'Determines true or false correctly.', max: 3 }, { trace: 'justify', desc: 'Justifies by comparing both sides.', max: 3 }]),
  rubric('M3.AR.23', [{ trace: 'solve', desc: 'Finds the unknown in any position.', max: 3 }, { trace: 'explain', desc: 'Explains using the inverse operation.', max: 3 }]),
  rubric('M3.AR.32', [{ trace: 'determine', desc: 'Determines whether it is a multiple.', max: 3 }, { trace: 'explain', desc: 'Explains using skip counting.', max: 3 }]),
  rubric('M3.AR.33', [{ trace: 'extend', desc: 'Extends the pattern correctly.', max: 3 }, { trace: 'explain', desc: 'States and explains the rule.', max: 3 }]),
  rubric('M3.GR.11', [{ trace: 'identify', desc: 'Identifies lines, rays and angle types.', max: 3 }, { trace: 'draw', desc: 'Draws parallel and perpendicular segments.', max: 3 }]),
  rubric('M3.GR.12', [{ trace: 'identify', desc: 'Identifies quadrilaterals by attributes.', max: 3 }, { trace: 'classify', desc: 'Classifies across overlapping groups.', max: 3 }]),
  rubric('M3.GR.13', [{ trace: 'identify', desc: 'Identifies line-symmetric figures.', max: 3 }, { trace: 'draw', desc: 'Draws the line(s) of symmetry.', max: 3 }]),
  rubric('M3.GR.21', [{ trace: 'measure', desc: 'Finds area by counting unit squares.', max: 3 }, { trace: 'explain', desc: 'Distinguishes area from perimeter.', max: 3 }]),
  rubric('M3.GR.22', [{ trace: 'compute', desc: 'Uses length × width for area.', max: 3 }, { trace: 'explain', desc: 'Explains why the formula counts squares.', max: 3 }]),
  rubric('M3.GR.24', [{ trace: 'decompose', desc: 'Decomposes into non-overlapping rectangles.', max: 3 }, { trace: 'compute', desc: 'Adds the rectangle areas correctly.', max: 3 }]),
  rubric('F3.13', [{ trace: 'decode', desc: 'Decodes by breaking words into parts.', max: 3 }, { trace: 'explain', desc: 'Explains which parts helped.', max: 3 }]),
  rubric('F3.14', [{ trace: 'read', desc: 'Reads accurately with pace and expression.', max: 3 }, { trace: 'self-correct', desc: 'Notices and fixes miscues.', max: 3 }]),
  rubric('RD3.02', [{ trace: 'identify', desc: 'Identifies the theme (not the topic).', max: 3 }, { trace: 'explain', desc: 'Explains how details develop it.', max: 3 }]),
  rubric('RD3.03', [{ trace: 'compare', desc: 'Compares two characters’ perspectives.', max: 3 }, { trace: 'explain', desc: 'Explains the difference with text detail.', max: 3 }]),
  rubric('RD3.04', [{ trace: 'identify', desc: 'Identifies the poem type.', max: 3 }, { trace: 'distinguish', desc: 'Distinguishes by features.', max: 3 }]),
  rubric('RI3.01', [{ trace: 'identify', desc: 'Identifies text features.', max: 3 }, { trace: 'explain', desc: 'Explains how they add meaning.', max: 3 }]),
  rubric('RI3.03', [{ trace: 'identify', desc: 'Identifies the author’s purpose.', max: 3 }, { trace: 'explain', desc: 'Explains how details develop it.', max: 3 }]),
  rubric('RI3.04', [{ trace: 'identify', desc: 'Identifies claim and evidence.', max: 3 }, { trace: 'explain', desc: 'Explains how evidence supports the claim.', max: 3 }]),
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
