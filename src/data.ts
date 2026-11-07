import type { Catalogue, Field, StoredCard } from '../shared/contracts';
import type { Concept } from './types';

// Installed once before mounting the application. Content lives in PostgreSQL;
// seed-data.ts is used only by the explicit seed command and integrity tests.
export let fields: Field[] = [];
export let concepts: Concept[] = [];
export let cards: StoredCard[] = [];
export let fieldById: Record<string, Field> = {};
export let fieldCounts: Record<string, { concepts: number; cards: number }> = {};
export function installCatalogue(catalogue: Catalogue) {
  ({ fields, concepts, cards } = catalogue);
  fieldById = Object.fromEntries(fields.map((f) => [f.id, f]));
  fieldCounts = Object.fromEntries(
    fields.map((f) => [
      f.id,
      {
        concepts: concepts.filter((c) => c.field === f.id).length,
        cards: cards.filter((c) => c.field === f.id).length,
      },
    ]),
  );
}
