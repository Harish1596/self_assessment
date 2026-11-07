import { describe, expect, it } from 'vitest';
import { buildSession, parseProgress, emptyProgress, shuffle } from './domain';
import { cards, concepts, fields } from './data';

describe('session selection', () => {
  it('restricts single-field sessions and never duplicates questions', () => {
    const result = buildSession(
      { mode: 'single', fields: ['algorithms'], count: 100, weakOnly: false },
      emptyProgress(),
    );
    expect(result.cards.length).toBeGreaterThan(0);
    expect(new Set(result.cards.map((c) => c.id)).size).toBe(result.cards.length);
    expect(result.cards.every((c) => c.field === 'algorithms')).toBe(true);
  });
  it('mixes only selected fields and includes each field when space permits', () => {
    const result = buildSession(
      { mode: 'multiple', fields: ['algorithms', 'databases'], count: 6, weakOnly: false },
      emptyProgress(),
    );
    expect(result.cards).toHaveLength(6);
    expect(new Set(result.cards.map((c) => c.field))).toEqual(new Set(['algorithms', 'databases']));
  });
  it('selects random fields independently of manual selection', () => {
    const result = buildSession(
      { mode: 'random', fields: [], count: 10, weakOnly: false },
      emptyProgress(),
      () => 0.3,
    );
    expect(result.fields.length).toBeGreaterThanOrEqual(2);
    expect(result.cards.every((c) => result.fields.includes(c.field))).toBe(true);
    expect(new Set(result.cards.map((c) => c.field)).size).toBe(result.fields.length);
  });
  it('rejects invalid selection and excludes confident questions from weak-only sessions', () => {
    expect(() =>
      buildSession({ mode: 'single', fields: [], count: 10, weakOnly: false }, emptyProgress()),
    ).toThrow();
    expect(() =>
      buildSession(
        { mode: 'multiple', fields: ['algorithms'], count: 10, weakOnly: false },
        emptyProgress(),
      ),
    ).toThrow();
    expect(() =>
      buildSession(
        { mode: 'single', fields: ['unknown'], count: 10, weakOnly: false },
        emptyProgress(),
      ),
    ).toThrow();
    const progress = emptyProgress();
    const candidate = cards.find((c) => c.field === 'algorithms')!;
    progress.ratings[candidate.id] = {
      rating: 'practice',
      reviewedAt: '2026-11-07T10:00:00.000Z',
      reviews: 1,
    };
    const result = buildSession(
      { mode: 'single', fields: ['algorithms'], count: 10, weakOnly: true },
      progress,
    );
    expect(result.cards.map((c) => c.id)).toEqual([candidate.id]);
    expect(() =>
      buildSession({ mode: 'single', fields: ['databases'], count: 10, weakOnly: true }, progress),
    ).toThrow(/No questions/);
  });
  it('does not mutate inputs when shuffling', () => {
    const original = [1, 2, 3, 4];
    expect(shuffle(original, () => 0)).toEqual([2, 3, 4, 1]);
    expect(original).toEqual([1, 2, 3, 4]);
  });
});

describe('backups and content integrity', () => {
  it('round-trips valid progress', () => {
    const progress = emptyProgress();
    progress.read = [concepts[0].id];
    progress.ratings[cards[0].id] = {
      rating: 'confident',
      reviewedAt: '2026-11-07T10:00:00.000Z',
      reviews: 2,
    };
    expect(parseProgress(JSON.stringify(progress))).toEqual(progress);
  });
  it('rejects corrupt backups, unsafe IDs, invalid dates, and unknown schemas', () => {
    for (const value of [
      '{',
      '{}',
      'null',
      JSON.stringify({ version: 2, read: [], ratings: {} }),
      JSON.stringify({ version: 1, read: ['unknown'], ratings: {} }),
    ]) {
      expect(() => parseProgress(value)).toThrow();
    }
    const p = emptyProgress();
    p.ratings[cards[0].id] = { rating: 'confident', reviewedAt: 'not-a-date', reviews: 1 };
    expect(() => parseProgress(JSON.stringify(p))).toThrow();
    expect(() => parseProgress('{"version":1,"read":[],"ratings":{"__proto__":{}}}')).toThrow();
  });
  it('provides sourced entries and unique linked questions across the catalogue', () => {
    const fieldIds = new Set(fields.map((field) => field.id));
    expect(new Set(concepts.map((c) => c.id)).size).toBe(concepts.length);
    expect(new Set(cards.map((c) => c.id)).size).toBe(cards.length);
    for (const field of fields)
      expect(concepts.some((concept) => concept.field === field.id)).toBe(true);
    for (const concept of concepts) {
      expect(fieldIds.has(concept.field)).toBe(true);
      expect(concept.sources.length).toBeGreaterThan(0);
      expect(
        concept.sources.every((s) => s.title.trim() && new URL(s.url).protocol === 'https:'),
      ).toBe(true);
      expect(concept.explanation.length).toBeGreaterThan(0);
      expect(concept.explanation.every((paragraph) => paragraph.trim().length > 0)).toBe(true);
      expect(concept.example.trim()).not.toBe('');
      expect(concept.takeaway.trim()).not.toBe('');
      expect(concept.questions.length).toBeGreaterThan(0);
      expect(
        new Set(concept.questions.map(([question]) => question.trim().toLowerCase())).size,
      ).toBe(concept.questions.length);
      expect(
        concept.questions.every(([question, answer]) => question.trim() && answer.trim()),
      ).toBe(true);
      expect(cards.filter((c) => c.conceptId === concept.id)).toHaveLength(
        concept.questions.length,
      );
    }
  });
});
