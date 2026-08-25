import { describe, expect, it } from 'vitest';
import { buildCatalog, lessonFor } from '../src/index.js';
import { CONTENT_LIBRARY } from '../src/fixtures/index.js';

describe('content library catalog', () => {
  const catalog = buildCatalog(CONTENT_LIBRARY);

  it('every objective in the library passes every gate', () => {
    const bad = catalog.entries.filter((e) => !e.ok);
    // Surface the specific failures if any, so the message is useful.
    expect(bad.map((e) => `${e.objectiveId}: ${e.issues.join(', ')}`)).toEqual([]);
    expect(catalog.summary.allValid).toBe(true);
  });

  it('covers multiple subjects and has a lesson + items per objective', () => {
    expect(catalog.summary.subjects).toBeGreaterThanOrEqual(3); // math, reading/writing, civics
    expect(catalog.summary.objectives).toBe(6);
    for (const e of catalog.entries) {
      expect(e.lessonId).not.toBeNull();
      expect(e.blockCount).toBeGreaterThanOrEqual(4);
      expect(e.itemCount).toBeGreaterThanOrEqual(2);
      expect(e.sourceCount).toBeGreaterThanOrEqual(1);
    }
  });

  it('every lesson block that teaches or assesses has real content and covers the reasoning', () => {
    for (const obj of CONTENT_LIBRARY.objectives) {
      const lesson = lessonFor(CONTENT_LIBRARY, obj.objectiveId, obj.version)!;
      const taught = new Set(lesson.blocks.flatMap((b) => b.targets.map((t) => t.toLowerCase())));
      for (const r of obj.requiredReasoning) expect(taught.has(r.toLowerCase())).toBe(true);
      for (const b of lesson.blocks) {
        if (b.kind === 'instruction' || b.kind === 'worked_example' || b.kind === 'mastery_task') {
          expect((b.body ?? '').length).toBeGreaterThan(20); // actual content, not a placeholder
        }
      }
    }
  });

  it('every cited source in the library is approved', () => {
    const approved = new Set(CONTENT_LIBRARY.sources.filter((s) => s.reviewStatus === 'approved').map((s) => s.id));
    for (const obj of CONTENT_LIBRARY.objectives) for (const s of obj.sourceIds) expect(approved.has(s)).toBe(true);
    for (const l of CONTENT_LIBRARY.lessons) for (const b of l.blocks) for (const s of b.sourceIds) expect(approved.has(s)).toBe(true);
    for (const it of CONTENT_LIBRARY.items) for (const s of it.sourceIds) expect(approved.has(s)).toBe(true);
  });
});
