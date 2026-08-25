/**
 * A small vetted source library for the grade-3 fractions slice. These are the
 * SourceRecords the objective's `sourceIds` point at. Two are approved and usable;
 * one is deliberately left in review to exercise the authoring gate's rejection path.
 *
 * Source names are representative candidate sources by tier; licensing/access is
 * confirmed per source during the vetting pipeline (see docs/content-governance.md).
 */

import type { SourceRecord } from '../types.js';

export const SAMPLE_SOURCES: readonly SourceRecord[] = [
  {
    id: 'SRC-001',
    title: 'Fraction models and tasks (grade 3)',
    citation: 'Illustrative Mathematics, Grade 3 Unit — fractions as equal parts.',
    uri: 'https://www.illustrativemathematics.org/',
    tier: 'oer',
    authorityType: 'open_courseware',
    license: 'cc_by',
    reviewStatus: 'approved',
    reviewedAt: '2026-08-01',
    reviewBy: '2027-08-01',
  },
  {
    id: 'SRC-002',
    title: 'Real-world fractions media',
    citation: 'Smithsonian Open Access — objects and images in the public domain.',
    uri: 'https://www.si.edu/openaccess',
    tier: 'primary',
    authorityType: 'museum_library',
    license: 'public_domain',
    reviewStatus: 'approved',
    reviewedAt: '2026-08-05',
    reviewBy: '2027-08-05',
  },
  {
    id: 'SRC-DRAFT',
    title: 'Community fraction lesson (unreviewed)',
    citation: 'Submitted teacher lesson pending editorial review.',
    tier: 'oer',
    authorityType: 'open_courseware',
    license: 'cc_by',
    reviewStatus: 'in_review',
  },
];
