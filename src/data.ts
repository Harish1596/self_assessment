import type { Card, Concept, FieldId } from './types';
import { initialConcepts } from './content/initial';
import { allFields } from './content/fields';

export const concepts: Concept[] = initialConcepts;
export const fields = allFields.filter((field) =>
  concepts.some((concept) => concept.field === field.id),
);
export const cards: Card[] = concepts.flatMap((concept) =>
  concept.questions.map(([question, answer], i) => ({
    id: `${concept.id}-${i + 1}`,
    conceptId: concept.id,
    field: concept.field,
    question,
    answer,
  })),
);
export const fieldById = Object.fromEntries(fields.map((f) => [f.id, f])) as Record<
  FieldId,
  (typeof fields)[number]
>;
export const fieldCounts = Object.fromEntries(
  fields.map((field) => [
    field.id,
    {
      concepts: concepts.filter((concept) => concept.field === field.id).length,
      cards: cards.filter((card) => card.field === field.id).length,
    },
  ]),
) as Record<FieldId, { concepts: number; cards: number }>;
