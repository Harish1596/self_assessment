import { expect, it } from 'vitest';
import { cards, concepts, fields, fieldCounts } from './data';
import { initialConcepts } from './content/initial';

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
