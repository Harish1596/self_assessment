import { it, expect } from 'vitest';
import { testDatabase } from './test-db';
import { getCatalogue, syncSeedCatalogue, importCatalogue } from './catalogue';
import { createSession, mutateSession, getSession, getProgress } from './sessions';
import type { CatalogueInput } from '../shared/contracts';

it('syncs changed and reverted seed bundles while preserving answers and unrelated content', async () => {
  const db = await testDatabase();
  const seed: CatalogueInput = {
    fields: [{ id: 'basics', name: 'Basics', color: 'green', description: 'Foundation' }],
    concepts: [
      {
        id: 'one',
        field: 'basics',
        title: 'One',
        summary: 'Summary',
        explanation: ['Explanation'],
        example: 'Example',
        takeaway: 'Takeaway',
        sources: [],
      },
    ],
    cards: [
      {
        id: 'one-1',
        conceptId: 'one',
        kind: 'recall',
        question: 'Original prompt',
        answers: ['Original answer'],
        choices: [],
      },
    ],
  };
  try {
    await syncSeedCatalogue(db, seed);
    let session = await createSession(db, {
      mode: 'single',
      fields: ['basics'],
      count: 1,
      weakOnly: false,
    });
    session = await mutateSession(db, session.id, {
      version: session.version,
      action: 'reveal',
      itemId: session.items[0].id,
      response: { answerText: 'My original attempt', selectedChoiceIds: [] },
    });
    session = await mutateSession(db, session.id, {
      version: session.version,
      action: 'rate',
      itemId: session.items[0].id,
      rating: 'partial',
    });
    const progress = await getProgress(db);
    const custom = {
      ...seed,
      cards: [{ ...seed.cards[0], id: 'custom', question: 'My own imported card' }],
    };
    await importCatalogue(db, custom);
    const updated = {
      ...seed,
      concepts: [{ ...seed.concepts[0], title: 'Updated concept' }],
      cards: [{ ...seed.cards[0], answers: ['Updated answer'] }],
    };
    await syncSeedCatalogue(db, updated);
    let catalogue = await getCatalogue(db);
    expect(catalogue.cards.find((c) => c.id === 'one-1')?.revision).toBe(2);
    expect(catalogue.concepts[0].title).toBe('Updated concept');
    await syncSeedCatalogue(db, updated);
    expect((await getCatalogue(db)).cards.find((c) => c.id === 'one-1')?.revision).toBe(2);
    await syncSeedCatalogue(db, seed);
    catalogue = await getCatalogue(db);
    expect(catalogue.cards.find((c) => c.id === 'one-1')?.revision).toBe(3);
    expect(catalogue.cards.find((c) => c.id === 'one-1')?.answer).toBe('Original answer');
    expect(catalogue.cards.some((c) => c.id === 'custom')).toBe(true);
    expect(await getSession(db, session.id)).toEqual(session);
    expect(await getProgress(db)).toEqual(progress);
    await expect(
      syncSeedCatalogue(db, { ...seed, cards: [{ ...seed.cards[0], answers: [] }] }),
    ).rejects.toThrow();
    expect((await getCatalogue(db)).cards.find((c) => c.id === 'one-1')?.revision).toBe(3);
  } finally {
    await db.close();
  }
}, 20000);
