import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import type { Database } from './db';
import { testDatabase } from './test-db';
import { importCatalogue, getCatalogue } from './catalogue';
import {
  createSession,
  getSession,
  mutateSession,
  getProgress,
  importProgress,
  listSessions,
} from './sessions';
import type { CatalogueInput } from '../shared/contracts';
import { createApi } from './http';
const input: CatalogueInput = {
  fields: [{ id: 'new-field', name: 'New field', description: 'Expandable', color: 'green' }],
  concepts: [
    {
      id: 'concept',
      field: 'new-field',
      title: 'Example',
      summary: 'Summary',
      explanation: ['Explanation'],
      example: 'Example',
      takeaway: 'Takeaway',
      sources: [{ title: 'Source', url: 'https://example.com/docs' }],
    },
  ],
  cards: [
    {
      id: 'card',
      conceptId: 'concept',
      kind: 'multiple_choice',
      question: 'Pick both',
      answers: ['A and B', 'Both A and B are correct.'],
      choices: [
        { id: 'a', label: 'A', correct: true },
        { id: 'b', label: 'B', correct: true },
        { id: 'c', label: 'C', correct: false },
      ],
    },
  ],
};
const config = { mode: 'single' as const, fields: ['new-field'], count: 5, weakOnly: false };
let db: Database;
beforeAll(async () => {
  db = await testDatabase();
  await importCatalogue(db, input);
}, 20000);
afterAll(async () => {
  await db?.close();
});
describe('PostgreSQL library and sessions', () => {
  it('imports arbitrary fields, preserves revisions and sources, validates before writing', async () => {
    const cat = await getCatalogue(db);
    expect(cat.cards[0].answers).toHaveLength(2);
    expect(cat.concepts[0].sources[0].url).toContain('example.com');
    await importCatalogue(db, input);
    expect((await getCatalogue(db)).cards[0].revision).toBe(1);
    await expect(
      importCatalogue(db, { ...input, cards: [{ ...input.cards[0], choices: [] }] }),
    ).rejects.toThrow();
    expect((await getCatalogue(db)).cards).toHaveLength(1);
  });
  it('persists drafts and reveal, rejects stale writes, rates once and keeps old snapshots', async () => {
    let s = await createSession(db, config);
    const item = s.items[0];
    expect(s.items).toHaveLength(1);
    await expect(createSession(db, config)).rejects.toThrow(/active session/);
    await expect(
      mutateSession(db, s.id, {
        version: s.version,
        action: 'rate',
        itemId: item.id,
        rating: 'confident',
      }),
    ).rejects.toThrow(/Reveal/);
    await expect(
      mutateSession(db, s.id, {
        version: 0,
        action: 'answer',
        itemId: item.id,
        response: { answerText: 'My thinking', selectedChoiceIds: ['foreign'] },
      }),
    ).rejects.toThrow();
    s = await mutateSession(db, s.id, {
      version: s.version,
      action: 'answer',
      itemId: item.id,
      response: { answerText: 'My thinking', selectedChoiceIds: ['a', 'b'] },
    });
    expect((await getSession(db, s.id)).items[0].answerText).toBe('My thinking');
    await expect(
      mutateSession(db, s.id, { version: 0, action: 'reveal', itemId: item.id }),
    ).rejects.toThrow(/changed/);
    s = await mutateSession(db, s.id, { version: s.version, action: 'reveal', itemId: item.id });
    expect(s.items[0].correct).toBe(true);
    await expect(
      mutateSession(db, s.id, {
        version: s.version,
        action: 'answer',
        itemId: item.id,
        response: { answerText: 'changed', selectedChoiceIds: [] },
      }),
    ).rejects.toThrow(/locked/);
    const v = s.version;
    s = await mutateSession(db, s.id, {
      version: v,
      action: 'rate',
      itemId: item.id,
      rating: 'confident',
    });
    expect(s.status).toBe('completed');
    await mutateSession(db, s.id, {
      version: v,
      action: 'rate',
      itemId: item.id,
      rating: 'confident',
    });
    expect((await getProgress(db)).ratings.card.reviews).toBe(1);
    await importCatalogue(db, {
      ...input,
      cards: [{ ...input.cards[0], question: 'Updated prompt' }],
    });
    expect((await getCatalogue(db)).cards[0].revision).toBe(2);
    expect((await getSession(db, s.id)).items[0].card.question).toBe('Pick both');
    await expect(db.query("UPDATE card_revisions SET question='tampered'")).rejects.toThrow(
      /immutable/,
    );
    expect((await listSessions(db))[0].reviewed).toBe(1);
  });
  it('pauses, resumes and abandons with responses preserved', async () => {
    let s = await createSession(db, config);
    s = await mutateSession(db, s.id, { version: s.version, action: 'pause' });
    expect(s.status).toBe('paused');
    s = await mutateSession(db, s.id, { version: s.version, action: 'resume' });
    expect(s.status).toBe('active');
    s = await mutateSession(db, s.id, { version: s.version, action: 'abandon' });
    expect(s.finishedAt).toBeTruthy();
    await expect(mutateSession(db, s.id, { version: s.version, action: 'resume' })).rejects.toThrow(
      /Finished/,
    );
  });
  it('migrates legacy progress idempotently and preserves data on invalid imports', async () => {
    const progress = {
      version: 1,
      read: ['concept'],
      ratings: { card: { rating: 'practice', reviewedAt: '2026-11-07T00:00:00Z', reviews: 10 } },
    };
    await importProgress(db, progress, true);
    const before = await getProgress(db);
    await importProgress(db, progress, true);
    expect(await getProgress(db)).toEqual(before);
    await expect(importProgress(db, { ...progress, read: ['missing'] })).rejects.toThrow();
    expect(await getProgress(db)).toEqual(before);
    expect((await listSessions(db)).length).toBe(2);
  });
  it('serves HTTP data and rejects cross-origin or malformed writes', async () => {
    const server = createApi(db);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address() as { port: number };
    const url = `http://127.0.0.1:${address.port}`;
    try {
      expect((await fetch(url + '/api/bootstrap')).status).toBe(200);
      expect(
        (
          await fetch(url + '/api/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Origin: 'https://foreign.test' },
            body: '{}',
          })
        ).status,
      ).toBe(403);
      expect(
        (
          await fetch(url + '/api/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{}',
          })
        ).status,
      ).toBe(400);
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });
});
