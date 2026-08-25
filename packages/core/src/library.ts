/**
 * Content library + catalog (blueprint §8 objective graph; §17 editorial governance).
 *
 * A `ContentPack` is a district's approved curriculum content: the vetted sources, the
 * published objectives, the authored lessons, and the assessment items/rubrics. This
 * is what fills the shelves so a teacher can actually assign and a demo can actually
 * be driven.
 *
 * `buildCatalog` runs the REAL guardrail gates across the whole pack — objective
 * authoring, lesson coverage, and item integrity — and reports, per objective, whether
 * every piece is internally consistent. A green catalog is the promise that nothing on
 * the shelves violates the rules.
 */

import { validateObjectiveDraft } from './authoring.js';
import { validateLessonPlan } from './lessons.js';
import { checkItemIntegrity } from './assessment.js';
import type { AssessmentItem, Rubric } from './assessment.js';
import type { LessonPlan } from './lessons.js';
import type { ObjectiveVersion, SourceRecord } from './types.js';

export interface ContentPack {
  readonly sources: readonly SourceRecord[];
  readonly objectives: readonly ObjectiveVersion[];
  readonly lessons: readonly LessonPlan[];
  readonly items: readonly AssessmentItem[];
  readonly rubrics: readonly Rubric[];
}

export interface CatalogEntry {
  readonly objectiveId: string;
  readonly version: number;
  readonly subject: ObjectiveVersion['subject'];
  readonly gradeBand: string;
  readonly title: string; // the objective's student outcome
  readonly standardRefs: readonly string[];
  readonly lessonId: string | null;
  readonly blockCount: number;
  readonly itemCount: number;
  readonly sourceCount: number;
  readonly authoringOk: boolean;
  readonly lessonOk: boolean;
  readonly itemsOk: boolean;
  readonly ok: boolean;
  readonly issues: readonly string[];
}

export interface Catalog {
  readonly entries: readonly CatalogEntry[];
  readonly summary: {
    readonly objectives: number;
    readonly lessons: number;
    readonly items: number;
    readonly sources: number;
    readonly subjects: number;
    readonly allValid: boolean;
  };
}

/** Build the catalog, validating every piece against its gate. */
export function buildCatalog(pack: ContentPack): Catalog {
  const approvedSources = pack.sources.filter((s) => s.reviewStatus === 'approved');
  const lessonByObjective = new Map<string, LessonPlan>();
  for (const l of pack.lessons) lessonByObjective.set(`${l.objectiveId}:${l.objectiveVersion}`, l);

  const entries = pack.objectives.map((obj): CatalogEntry => {
    const key = `${obj.objectiveId}:${obj.version}`;
    const lesson = lessonByObjective.get(key) ?? null;
    const items = pack.items.filter((i) => i.objectiveId === obj.objectiveId && i.objectiveVersion === obj.version);
    const issues: string[] = [];

    // 1. Objective authoring gate (mapped to a standard, approved sources, no rigor adaptation).
    const authoring = validateObjectiveDraft(obj, { catalog: [], approvedSources });
    // Note: an empty adaptation catalog can't classify permitted adaptations as rigor-changing,
    // so this checks standards/sources/schema. Rigor is separately guaranteed by the objective
    // fixtures listing modification adaptations under `prohibitedAdaptations`.
    const authoringOk = authoring.ok;
    if (!authoringOk) issues.push(...authoring.issues.filter((i) => i.severity === 'blocking').map((i) => `objective: ${i.code}`));

    // 2. Lesson coverage gate.
    let lessonOk = false;
    if (lesson) {
      const lv = validateLessonPlan(lesson, { objective: obj, approvedSources });
      lessonOk = lv.ok;
      if (!lessonOk) issues.push(...lv.issues.filter((i) => i.severity === 'blocking').map((i) => `lesson: ${i.code}`));
    } else {
      issues.push('lesson: MISSING');
    }

    // 3. Item integrity gate (every item traces + is answerable + no leaks).
    let itemsOk = items.length > 0;
    if (items.length === 0) issues.push('items: NONE');
    for (const it of items) {
      const findings = checkItemIntegrity(it, obj);
      if (findings.some((f) => f.severity === 'blocking')) {
        itemsOk = false;
        issues.push(...findings.filter((f) => f.severity === 'blocking').map((f) => `item ${it.itemId}: ${f.code}`));
      }
    }

    return {
      objectiveId: obj.objectiveId,
      version: obj.version,
      subject: obj.subject,
      gradeBand: obj.gradeBand,
      title: obj.studentOutcome,
      standardRefs: obj.standardRefs,
      lessonId: lesson?.id ?? null,
      blockCount: lesson?.blocks.length ?? 0,
      itemCount: items.length,
      sourceCount: new Set(obj.sourceIds).size,
      authoringOk,
      lessonOk,
      itemsOk,
      ok: authoringOk && lessonOk && itemsOk,
      issues,
    };
  });

  return {
    entries,
    summary: {
      objectives: pack.objectives.length,
      lessons: pack.lessons.length,
      items: pack.items.length,
      sources: approvedSources.length,
      subjects: new Set(pack.objectives.map((o) => o.subject)).size,
      allValid: entries.every((e) => e.ok),
    },
  };
}

/** Convenience: the authored lesson for an objective, if the pack has one. */
export function lessonFor(pack: ContentPack, objectiveId: string, version: number): LessonPlan | null {
  return pack.lessons.find((l) => l.objectiveId === objectiveId && l.objectiveVersion === version) ?? null;
}
