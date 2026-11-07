import { expect, it } from 'vitest';
import { cards, concepts, fields, fieldCounts } from './seed-data';
import { initialConcepts } from './content/initial';
import { parseProgress } from './domain';

it('preserves the original question identities and meanings for saved assessments', () => {
  const originalIds = new Set(
    initialConcepts.flatMap((concept) => [`${concept.id}-1`, `${concept.id}-2`]),
  );
  expect(
    cards
      .filter((card) => originalIds.has(card.id))
      .map(({ id, question, answer }) => ({ id, question, answer })),
  ).toMatchSnapshot();
});

it('derives field counts from content rather than a fixed number per entry', () => {
  for (const field of fields) {
    expect(fieldCounts[field.id].concepts).toBe(
      concepts.filter((c) => c.field === field.id).length,
    );
    expect(fieldCounts[field.id].cards).toBe(cards.filter((c) => c.field === field.id).length);
  }
  expect(Object.values(fieldCounts).reduce((sum, count) => sum + count.cards, 0)).toBe(
    cards.length,
  );
});

it('covers absolute basics alongside the original CS fields', () => {
  expect(fields.map((field) => field.id)).toEqual([
    'computing',
    'representation',
    'logic',
    'programming',
    'structures',
    'algorithms',
    'systems',
    'networking',
    'databases',
    'engineering',
    'security',
  ]);
  const basics = concepts.filter((concept) => concept.field === 'computing');
  expect(basics.some((concept) => /computer/i.test(concept.title))).toBe(true);
  expect(basics.some((concept) => /CPU|processor/i.test(concept.title))).toBe(true);
  expect(
    concepts.some((concept) => concept.field === 'programming' && /variable/i.test(concept.title)),
  ).toBe(true);
  expect(
    concepts.some((concept) => concept.field === 'logic' && /Boolean|logic/i.test(concept.title)),
  ).toBe(true);
  expect(concepts[0].field).toBe('computing');
});

it('accepts backups created before the catalogue expansion', () => {
  const backup = {
    version: 1,
    read: ['binary', 'processes'],
    ratings: {
      'binary-1': { rating: 'confident', reviewedAt: '2026-11-07T00:00:00.000Z', reviews: 3 },
      'processes-2': { rating: 'partial', reviewedAt: '2026-11-07T00:00:00.000Z', reviews: 1 },
    },
  };
  expect(parseProgress(JSON.stringify(backup), { cards, concepts })).toEqual(backup);
});

it('expands original concepts without changing their existing question positions', () => {
  for (const original of initialConcepts) {
    const expanded = concepts.find((concept) => concept.id === original.id)!;
    expect(expanded.questions.slice(0, original.questions.length)).toEqual(original.questions);
    expect(expanded.questions.length).toBeGreaterThan(original.questions.length);
  }
});
