import { cards, concepts, fields } from './data';
import type { Card, FieldId, Progress, Rating, SessionConfig } from './types';

export function emptyProgress(): Progress {
  return { version: 1, read: [], ratings: {} };
}

export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function buildSession(
  config: SessionConfig,
  progress: Progress,
  random = Math.random,
  catalogue: { cards: Card[]; concepts: { id: string }[]; fields: { id: string }[] } = {
    cards,
    concepts,
    fields,
  },
): { cards: Card[]; fields: FieldId[] } {
  const { cards, fields } = catalogue;
  if (!['single', 'multiple', 'random'].includes(config.mode))
    throw new Error('Choose a valid selection mode.');
  if (
    !Array.isArray(config.fields) ||
    config.fields.length > 10000 ||
    !config.fields.every((field) => typeof field === 'string') ||
    typeof config.weakOnly !== 'boolean'
  )
    throw new Error('Invalid session options.');
  if (!Number.isInteger(config.count) || config.count < 1 || config.count > 10000)
    throw new Error('Choose at least one question.');
  const knownFields = fields.map((f) => f.id);
  const selected = [...new Set(config.fields)];
  if (config.mode !== 'random' && selected.some((f) => !knownFields.includes(f as FieldId)))
    throw new Error('Choose a valid field.');
  if (config.mode === 'single' && selected.length !== 1)
    throw new Error('Choose one field to continue.');
  if (config.mode === 'multiple' && selected.length < 2)
    throw new Error('Choose at least two fields to continue.');
  const eligible = cards.filter(
    (c) => !config.weakOnly || ['practice', 'partial'].includes(progress.ratings[c.id]?.rating),
  );
  const available = knownFields.filter((f) => eligible.some((c) => c.field === f));
  let picked: FieldId[];
  if (config.mode === 'random') {
    if (!available.length)
      throw new Error(
        'No questions match yet. Rate some cards as Needs practice or Partly understood first.',
      );
    const count = Math.min(
      config.count,
      available.length,
      Math.max(2, Math.floor(random() * (available.length - 1)) + 2),
    );
    picked = shuffle(available, random).slice(0, count);
  } else picked = selected as FieldId[];
  const pool = eligible.filter((c) => picked.includes(c.field));
  if (!pool.length)
    throw new Error(
      'No questions match yet. Rate some cards as Needs practice or Partly understood first.',
    );
  // Reserve one card per selected field before filling: small mixed sessions still cover the selection.
  const first = shuffle(picked, random)
    .flatMap((f) =>
      shuffle(
        pool.filter((c) => c.field === f),
        random,
      ).slice(0, 1),
    )
    .slice(0, config.count);
  const reserved = new Set(first.map((c) => c.id));
  const chosen = [
    ...first,
    ...shuffle(
      pool.filter((c) => !reserved.has(c.id)),
      random,
    ),
  ].slice(0, config.count);
  return {
    cards: shuffle(chosen, random),
    fields: picked.filter((f) => chosen.some((c) => c.field === f)),
  };
}

export function parseProgress(
  raw: string,
  catalogue: { cards: { id: string }[]; concepts: { id: string }[] } = { cards, concepts },
): Progress {
  const { cards, concepts } = catalogue;
  const fail = (): never => {
    throw new Error(
      'This is not a valid Recall progress backup. Your current progress has not changed.',
    );
  };
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return fail();
  }
  if (!value || typeof value !== 'object') return fail();
  const p = value as Record<string, unknown>;
  if (
    p.version !== 1 ||
    !Array.isArray(p.read) ||
    !p.ratings ||
    typeof p.ratings !== 'object' ||
    Array.isArray(p.ratings)
  )
    return fail();
  const conceptIds = new Set(concepts.map((c) => c.id));
  const cardIds = new Set(cards.map((c) => c.id));
  if (!p.read.every((id) => typeof id === 'string' && conceptIds.has(id))) return fail();
  const ratings: Progress['ratings'] = {};
  for (const [id, entry] of Object.entries(p.ratings)) {
    if (!cardIds.has(id) || !entry || typeof entry !== 'object') return fail();
    const r = entry as Record<string, unknown>;
    if (
      !['practice', 'partial', 'confident'].includes(r.rating as string) ||
      typeof r.reviewedAt !== 'string' ||
      !Number.isFinite(Date.parse(r.reviewedAt)) ||
      !Number.isSafeInteger(r.reviews) ||
      (r.reviews as number) < 1
    )
      return fail();
    ratings[id] = {
      rating: r.rating as Rating,
      reviewedAt: r.reviewedAt,
      reviews: r.reviews as number,
    };
  }
  return { version: 1, read: [...new Set(p.read as string[])], ratings };
}

export const STORAGE_KEY = 'recall-progress-v1';
