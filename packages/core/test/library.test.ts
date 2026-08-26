import { describe, expect, it } from 'vitest';
import { buildCatalog, lessonFor } from '../src/index.js';
import { CONTENT_LIBRARY, BEST_GRADE3, benchmark, coverageReport } from '../src/fixtures/index.js';

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
    expect(catalog.summary.objectives).toBe(40);
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

describe('B.E.S.T. grade-3 standards spine', () => {
  it('has the full math + ELA benchmark set with unique codes', () => {
    expect(BEST_GRADE3.length).toBe(60); // 34 math + 26 ELA (per the enumerated CPALMS list)
    const codes = BEST_GRADE3.map((b) => b.code);
    expect(new Set(codes).size).toBe(codes.length); // no duplicates
    for (const b of BEST_GRADE3) expect(b.code).toMatch(/^(MA|ELA)\.3\./);
  });

  it('every authored objective maps to a real B.E.S.T. benchmark', () => {
    for (const obj of CONTENT_LIBRARY.objectives) {
      for (const ref of obj.standardRefs) {
        // Civics (SS.*) is out of the math/ELA spine; every math & ELA ref must resolve.
        if (ref.startsWith('MA.') || ref.startsWith('ELA.')) {
          expect(benchmark(ref), `${obj.objectiveId} → ${ref}`).toBeDefined();
        }
      }
    }
  });

  it('coverage report reflects the authored library and never exceeds the spine', () => {
    const refs = CONTENT_LIBRARY.objectives.flatMap((o) => o.standardRefs);
    const cov = coverageReport(refs);
    expect(cov.totals.authored).toBeGreaterThanOrEqual(13);
    expect(cov.totals.authored).toBeLessThanOrEqual(cov.totals.total);
    for (const row of cov.rows) expect(row.authored).toBeLessThanOrEqual(row.total);
  });
});
