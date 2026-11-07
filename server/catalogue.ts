import { createHash, randomUUID } from 'node:crypto';
import type { Catalogue, CatalogueInput, StoredCard } from '../shared/contracts';
import type { Concept } from '../src/types';
import { validateCardInput, ValidationError } from '../shared/validation';
import type { Database, Sql } from './db';

const json = JSON.stringify;
export async function getCatalogue(sql: Sql): Promise<Catalogue> {
  const fields = (
    await sql.query<any>(
      'SELECT id, name, description, color FROM fields WHERE archived_at IS NULL ORDER BY sort_order, id',
    )
  ).rows;
  const entries = (
    await sql.query<any>(
      `SELECT c.*, COALESCE((SELECT jsonb_agg(jsonb_build_object('title', s.title, 'url', s.url) ORDER BY cs.sort_order) FROM concept_sources cs JOIN sources s ON s.id=cs.source_id WHERE cs.concept_id=c.id), '[]') AS sources FROM concepts c JOIN fields f ON f.id=c.field_id WHERE c.archived_at IS NULL AND f.archived_at IS NULL ORDER BY f.sort_order, c.sort_order, c.id`,
    )
  ).rows;
  const rows = (
    await sql.query<any>(
      `SELECT c.id, c.concept_id, e.field_id, r.id AS revision_id, r.revision, r.kind, r.question, r.answers, r.choices FROM cards c JOIN card_revisions r ON r.id=c.current_revision_id JOIN concepts e ON e.id=c.concept_id JOIN fields f ON f.id=e.field_id WHERE c.archived_at IS NULL AND e.archived_at IS NULL AND f.archived_at IS NULL ORDER BY f.sort_order, e.sort_order, c.sort_order, c.id`,
    )
  ).rows;
  const cards: StoredCard[] = rows.map((r) => ({
    id: r.id,
    conceptId: r.concept_id,
    field: r.field_id,
    revisionId: r.revision_id,
    revision: r.revision,
    kind: r.kind,
    question: r.question,
    answer: r.answers[0],
    answers: r.answers,
    choices: r.choices,
  }));
  const concepts: Concept[] = entries.map((c) => ({
    id: c.id,
    field: c.field_id,
    title: c.title,
    summary: c.summary,
    explanation: c.explanation,
    example: c.example,
    takeaway: c.takeaway,
    sources: c.sources,
    questions: cards
      .filter((card) => card.conceptId === c.id)
      .map((card) => [card.question, card.answer]),
  }));
  return { fields, concepts, cards };
}

export function validateCatalogue(value: unknown): CatalogueInput {
  if (!value || typeof value !== 'object') throw new ValidationError('Provide a catalogue object.');
  const input = value as CatalogueInput;
  if (![input.fields, input.concepts, input.cards].every(Array.isArray))
    throw new ValidationError('Provide fields, concepts and cards.');
  const validId = (s: unknown) =>
    typeof s === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,199}$/.test(s);
  const text = (s: unknown) => typeof s === 'string' && !s.includes('\0') && s.length <= 50000;
  for (const group of [input.fields, input.concepts, input.cards]) {
    if (
      group.length > 10000 ||
      new Set(group.map((x) => x?.id)).size !== group.length ||
      group.some((x) => !x || !validId(x.id))
    )
      throw new ValidationError('Content IDs must be valid and unique.');
  }
  for (const f of input.fields)
    if (
      !text(f.name) ||
      !f.name.trim() ||
      !text(f.description) ||
      !['green', 'blue', 'violet', 'amber', 'rose', 'teal'].includes(f.color)
    )
      throw new ValidationError('Invalid field metadata.');
  const fields = new Set(input.fields.map((f) => f.id));
  for (const c of input.concepts) {
    if (
      !fields.has(c.field) ||
      ![c.title, c.summary, c.example, c.takeaway].every(text) ||
      !c.title.trim() ||
      !Array.isArray(c.explanation) ||
      !c.explanation.every(text) ||
      !Array.isArray(c.sources)
    )
      throw new ValidationError('Invalid concept metadata.');
    const urls = new Set<string>();
    for (const s of c.sources) {
      if (!s || !text(s.title) || !s.title.trim() || !text(s.url))
        throw new ValidationError('Invalid source.');
      let url: URL;
      try {
        url = new URL(s.url);
      } catch {
        throw new ValidationError('Invalid source URL.');
      }
      if (!['https:', 'http:'].includes(url.protocol) || urls.has(s.url))
        throw new ValidationError('Source URLs must be unique HTTP links.');
      urls.add(s.url);
    }
  }
  const concepts = new Set(input.concepts.map((c) => c.id));
  const cards = input.cards.map(validateCardInput);
  if (cards.some((c) => !concepts.has(c.conceptId)))
    throw new ValidationError('Every card needs a concept in this catalogue.');
  return { fields: input.fields, concepts: input.concepts, cards };
}

/** Explicit merge: omitted records remain available, revisions are append-only. */
export async function importCatalogue(
  db: Database,
  value: unknown,
  seedId?: string,
): Promise<void> {
  const input = validateCatalogue(value);
  await db.transaction(async (sql) => {
    await sql.query("SELECT pg_advisory_xact_lock(hashtext('recall-catalogue-import'))");
    if (seedId && (await sql.query('SELECT id FROM seed_runs WHERE id=$1', [seedId])).rows.length)
      return;
    for (const [i, f] of input.fields.entries())
      await sql.query(
        'INSERT INTO fields(id,name,description,color,sort_order) VALUES($1,$2,$3,$4,$5) ON CONFLICT(id) DO UPDATE SET name=$2,description=$3,color=$4,sort_order=$5',
        [f.id, f.name, f.description, f.color, i],
      );
    for (const [i, c] of input.concepts.entries()) {
      await sql.query(
        'INSERT INTO concepts(id,field_id,title,summary,explanation,example,takeaway,sort_order) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(id) DO UPDATE SET field_id=$2,title=$3,summary=$4,explanation=$5,example=$6,takeaway=$7,sort_order=$8,updated_at=now()',
        [c.id, c.field, c.title, c.summary, json(c.explanation), c.example, c.takeaway, i],
      );
      await sql.query('DELETE FROM concept_sources WHERE concept_id=$1', [c.id]);
      for (const [n, s] of c.sources.entries()) {
        const id = createHash('sha256').update(s.url).digest('hex');
        await sql.query(
          'INSERT INTO sources(id,title,url) VALUES($1,$2,$3) ON CONFLICT(url) DO UPDATE SET title=$2',
          [id, s.title, s.url],
        );
        await sql.query(
          'INSERT INTO concept_sources(concept_id,source_id,sort_order) VALUES($1,$2,$3)',
          [c.id, id, n],
        );
      }
    }
    for (const [i, c] of input.cards.entries()) {
      const old = (
        await sql.query<any>(
          'SELECT r.*,c.concept_id FROM cards c JOIN card_revisions r ON r.id=c.current_revision_id WHERE c.id=$1',
          [c.id],
        )
      ).rows[0];
      if (old && old.concept_id !== c.conceptId)
        throw new ValidationError('Existing card IDs cannot move to a different concept.');
      await sql.query(
        'INSERT INTO cards(id,concept_id,sort_order) VALUES($1,$2,$3) ON CONFLICT(id) DO UPDATE SET sort_order=$3',
        [c.id, c.conceptId, i],
      );
      if (
        old &&
        old.kind === c.kind &&
        old.question === c.question &&
        json(old.answers) === json(c.answers) &&
        json(old.choices) === json(c.choices)
      )
        continue;
      const revisionId = randomUUID();
      await sql.query(
        'INSERT INTO card_revisions(id,card_id,revision,kind,question,answers,choices) VALUES($1,$2,$3,$4,$5,$6,$7)',
        [
          revisionId,
          c.id,
          (old?.revision ?? 0) + 1,
          c.kind,
          c.question,
          json(c.answers),
          json(c.choices),
        ],
      );
      await sql.query('UPDATE cards SET current_revision_id=$2 WHERE id=$1', [c.id, revisionId]);
    }
    if (seedId) await sql.query('INSERT INTO seed_runs(id) VALUES($1)', [seedId]);
  });
}
