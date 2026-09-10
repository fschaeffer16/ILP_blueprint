import { describe, expect, it } from 'vitest';
import {
  checkItemIntegrity,
  renderSymbolItem,
  scoreSymbolResponse,
} from '../src/index.js';
import {
  FRACTION_SYMBOLS,
  LIBRARY_ITEMS,
  LIBRARY_OBJECTIVES,
  SYMBOL_DEMO_ITEM,
} from '../src/fixtures/index.js';

const objective = (id: string) => {
  const o = LIBRARY_OBJECTIVES.find((x) => x.objectiveId === id);
  if (!o) throw new Error(`missing objective ${id}`);
  return o;
};
const item = (id: string) => {
  const i = LIBRARY_ITEMS.find((x) => x.itemId === id);
  if (!i) throw new Error(`missing item ${id}`);
  return i;
};

describe('picture-response items (IEP build step 1)', () => {
  it('renders exactly the text item’s answer set — same key, same distractors, labels = values', () => {
    const it1 = item('IT-M3.NF.02-1');
    const { rendering, findings } = renderSymbolItem(it1, FRACTION_SYMBOLS, objective('M3.NF.02'));
    expect(findings).toHaveLength(0);
    expect(rendering).not.toBeNull();
    const values = rendering!.choices.map((c) => c.value).sort();
    expect(values).toEqual([...it1.answerKey, ...it1.distractors].sort());
    for (const c of rendering!.choices) expect(c.symbol.label).toBe(c.value);
  });

  it('is deterministic, and the correct answer holds no fixed slot across items', () => {
    const a1 = renderSymbolItem(item('IT-M3.NF.01-1'), FRACTION_SYMBOLS, objective('M3.NF.01'));
    const a2 = renderSymbolItem(item('IT-M3.NF.01-1'), FRACTION_SYMBOLS, objective('M3.NF.01'));
    expect(a1).toEqual(a2);
    const b = renderSymbolItem(item('IT-M3.NF.02-1'), FRACTION_SYMBOLS, objective('M3.NF.02'));
    const keyIndex = (r: typeof a1, key: string) =>
      r.rendering!.choices.findIndex((c) => c.value === key);
    const positions = [keyIndex(a1, '1/4'), keyIndex(b, '1/3')];
    // Not both first: hash-ordered, not key-first.
    expect(positions.some((p) => p !== 0)).toBe(true);
  });

  it('refuses an undeliverable item — the picture channel never bypasses the gate', () => {
    const draft = { ...item('IT-M3.NF.02-1'), status: 'draft' as const };
    const res = renderSymbolItem(draft, FRACTION_SYMBOLS, objective('M3.NF.02'));
    expect(res.rendering).toBeNull();
    expect(res.findings.some((f) => f.code === 'SYMBOL_ITEM_NOT_DELIVERABLE')).toBe(true);
  });

  it('fails closed on a vocabulary gap', () => {
    const gapVocab = { vocabId: 'V-GAP', symbols: FRACTION_SYMBOLS.symbols.slice(0, 2) };
    const res = renderSymbolItem(item('IT-M3.NF.02-1'), gapVocab, objective('M3.NF.02'));
    expect(res.rendering).toBeNull();
    expect(res.findings.some((f) => f.code === 'SYMBOL_VOCAB_GAP')).toBe(true);
  });

  it('scores a tap by the same rule as text, tagging channel and prompt level', () => {
    const it1 = item('IT-M3.NF.02-1');
    const { rendering } = renderSymbolItem(it1, FRACTION_SYMBOLS, objective('M3.NF.02'));
    const right = rendering!.choices.find((c) => c.value === '1/3')!;
    const wrong = rendering!.choices.find((c) => c.value === '1/6')!;
    const ev = scoreSymbolResponse(it1, rendering!, right.choiceId);
    expect(ev).toMatchObject({
      correct: true,
      responseChannel: 'symbol_tap',
      promptLevel: 'independent',
      moduleId: null,
    });
    expect(scoreSymbolResponse(it1, rendering!, wrong.choiceId, 'modeled')).toMatchObject({
      correct: false,
      promptLevel: 'modeled',
    });
    expect(scoreSymbolResponse(it1, rendering!, 'nope')).toBeNull();
  });

  it('a module-tagged item’s tap carries its _M# into evidence, and still passes the gate', () => {
    const obj = objective('M3.NF.02');
    expect(checkItemIntegrity(SYMBOL_DEMO_ITEM, obj).filter((f) => f.severity === 'blocking')).toHaveLength(0);
    const { rendering } = renderSymbolItem(SYMBOL_DEMO_ITEM, FRACTION_SYMBOLS, obj);
    const tap = rendering!.choices[0];
    const ev = scoreSymbolResponse(SYMBOL_DEMO_ITEM, rendering!, tap.choiceId, 'gestural_prompt');
    expect(ev!.moduleId).toBe('M2');
    expect(ev!.responseChannel).toBe('symbol_tap');
  });
});
