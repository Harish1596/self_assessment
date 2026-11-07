import { randomUUID, createHash } from 'node:crypto';
import { buildSession, emptyProgress, parseProgress } from '../src/domain';
import type { Progress, Rating, SessionConfig } from '../src/types';
import type { SessionItem, SessionSummary, StoredSession } from '../shared/contracts';
import { evaluateChoices, validateResponse, ValidationError } from '../shared/validation';
import { getCatalogue } from './catalogue';
import type { Database, Sql } from './db';

export class ConflictError extends Error {}
export class NotFoundError extends Error {}
const iso = (v: any): string => new Date(v).toISOString();
export async function getProgress(sql: Sql): Promise<Progress> {
  const progress = emptyProgress();
  progress.read = (
    await sql.query<{ concept_id: string }>(
      "SELECT concept_id FROM read_progress WHERE profile_id='local' ORDER BY concept_id",
    )
  ).rows.map((r) => r.concept_id);
  for (const r of (await sql.query<any>("SELECT * FROM card_progress WHERE profile_id='local'"))
    .rows)
    progress.ratings[r.card_id] = {
      rating: r.rating,
      reviewedAt: iso(r.reviewed_at),
      reviews: r.reviews,
    };
  return progress;
}
function header(r: any): Omit<StoredSession, 'items'> {
  return {
    id: r.id,
    status: r.status,
    config: {
      mode: r.mode,
      fields: r.requested_fields,
      count: r.requested_count,
      weakOnly: r.weak_only,
    },
    selectedFields: r.selected_fields,
    version: r.version,
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
    finishedAt: r.finished_at ? iso(r.finished_at) : null,
  };
}
export async function getSession(sql: Sql, id: string): Promise<StoredSession> {
  const r = (
    await sql.query<any>("SELECT * FROM sessions WHERE id=$1 AND profile_id='local'", [id])
  ).rows[0];
  if (!r) throw new NotFoundError('Session not found.');
  const rows = (
    await sql.query<any>('SELECT * FROM session_items WHERE session_id=$1 ORDER BY position', [id])
  ).rows;
  const items: SessionItem[] = rows.map((i) => ({
    id: i.id,
    position: i.position,
    card: i.snapshot,
    answerText: i.answer_text,
    selectedChoiceIds: i.selected_choice_ids,
    status: i.status,
    rating: i.rating,
    correct: i.correct,
    revealedAt: i.revealed_at ? iso(i.revealed_at) : null,
    reviewedAt: i.reviewed_at ? iso(i.reviewed_at) : null,
  }));
  return { ...header(r), items };
}
export async function listSessions(sql: Sql): Promise<SessionSummary[]> {
  const rows = (
    await sql.query<any>(
      `SELECT s.*,count(i.id)::int AS total,count(i.id) FILTER(WHERE i.status='reviewed')::int AS reviewed FROM sessions s LEFT JOIN session_items i ON i.session_id=s.id WHERE s.profile_id='local' GROUP BY s.id ORDER BY s.updated_at DESC LIMIT 100`,
    )
  ).rows;
  return rows.map((r) => ({ ...header(r), total: r.total, reviewed: r.reviewed }));
}
export async function createSession(
  db: Database,
  config: SessionConfig,
  cardIds?: unknown,
): Promise<StoredSession> {
  return db.transaction(async (sql) => {
    await sql.query("SELECT id FROM profiles WHERE id='local' FOR UPDATE");
    if (
      (await sql.query("SELECT id FROM sessions WHERE profile_id='local' AND status='active'")).rows
        .length
    )
      throw new ConflictError('Resume or end your active session before starting another.');
    if (!config || typeof config !== 'object')
      throw new ValidationError('Provide session options.');
    const catalogue = await getCatalogue(sql),
      progress = await getProgress(sql);
    let selection;
    try {
      selection = buildSession(config, progress, Math.random, catalogue);
    } catch (e) {
      throw new ValidationError((e as Error).message);
    }
    if (cardIds !== undefined) {
      if (
        !Array.isArray(cardIds) ||
        !cardIds.length ||
        cardIds.length > 10000 ||
        !cardIds.every((id) => typeof id === 'string') ||
        new Set(cardIds).size !== cardIds.length
      )
        throw new ValidationError('Invalid retry card IDs.');
      const retry = catalogue.cards.filter((c) => cardIds.includes(c.id));
      if (retry.length !== cardIds.length) throw new ValidationError('Unknown retry card.');
      selection = { cards: retry, fields: [...new Set(retry.map((c) => c.field))] };
    }
    const id = randomUUID();
    await sql.query(
      "INSERT INTO sessions(id,profile_id,mode,requested_fields,selected_fields,requested_count,weak_only) VALUES($1,'local',$2,$3,$4,$5,$6)",
      [
        id,
        config.mode,
        JSON.stringify(config.fields),
        JSON.stringify(selection.fields),
        config.count,
        config.weakOnly,
      ],
    );
    for (const [position, c] of selection.cards.entries()) {
      const card = catalogue.cards.find((x) => x.id === c.id)!;
      await sql.query(
        'INSERT INTO session_items(id,session_id,position,card_id,revision_id,snapshot) VALUES($1,$2,$3,$4,$5,$6)',
        [randomUUID(), id, position, card.id, card.revisionId, JSON.stringify(card)],
      );
    }
    return getSession(sql, id);
  });
}
export type SessionAction = {
  version: number;
  action: 'answer' | 'reveal' | 'rate' | 'pause' | 'resume' | 'abandon';
  itemId?: string;
  response?: unknown;
  rating?: Rating;
};
export async function mutateSession(
  db: Database,
  id: string,
  input: SessionAction,
): Promise<StoredSession> {
  if (
    !input ||
    !Number.isSafeInteger(input.version) ||
    input.version < 0 ||
    !['answer', 'reveal', 'rate', 'pause', 'resume', 'abandon'].includes(input.action)
  )
    throw new ValidationError('Invalid session action.');
  return db.transaction(async (sql) => {
    await sql.query("SELECT id FROM profiles WHERE id='local' FOR UPDATE");
    await sql.query("SELECT id FROM sessions WHERE id=$1 AND profile_id='local' FOR UPDATE", [id]);
    const session = await getSession(sql, id);
    const item = session.items.find((i) => i.id === input.itemId);
    // Safe retry after a lost rating acknowledgement: do not count it twice.
    if (input.action === 'rate' && item?.status === 'reviewed' && item.rating === input.rating)
      return session;
    if (session.version !== input.version)
      throw new ConflictError('This session changed. Reload it before saving again.');
    if (['completed', 'abandoned'].includes(session.status))
      throw new ConflictError('Finished sessions cannot be changed.');
    if (['answer', 'reveal', 'rate'].includes(input.action)) {
      if (session.status !== 'active')
        throw new ConflictError('Resume the session before answering.');
      if (!item || item.id !== session.items.find((i) => i.status !== 'reviewed')?.id)
        throw new ValidationError('Only the current session question can be answered.');
      if (input.action === 'answer') {
        if (item.status !== 'pending') throw new ConflictError('Answers are locked after reveal.');
        const response = validateResponse(input.response, item.card);
        await sql.query(
          'UPDATE session_items SET answer_text=$2,selected_choice_ids=$3,updated_at=now() WHERE id=$1',
          [item.id, response.answerText, JSON.stringify(response.selectedChoiceIds)],
        );
      } else if (input.action === 'reveal') {
        if (item.status !== 'pending') throw new ConflictError('This answer is already revealed.');
        const response =
          input.response === undefined
            ? { answerText: item.answerText, selectedChoiceIds: item.selectedChoiceIds }
            : validateResponse(input.response, item.card);
        await sql.query(
          "UPDATE session_items SET answer_text=$2,selected_choice_ids=$3,status='revealed',revealed_at=now(),correct=$4,updated_at=now() WHERE id=$1",
          [
            item.id,
            response.answerText,
            JSON.stringify(response.selectedChoiceIds),
            evaluateChoices(item.card, response.selectedChoiceIds),
          ],
        );
      } else {
        if (item.status !== 'revealed')
          throw new ValidationError('Reveal the answer before rating.');
        if (!['practice', 'partial', 'confident'].includes(input.rating ?? ''))
          throw new ValidationError('Invalid rating.');
        await sql.query(
          "UPDATE session_items SET status='reviewed',rating=$2,reviewed_at=now(),updated_at=now() WHERE id=$1",
          [item.id, input.rating],
        );
        await sql.query(
          "INSERT INTO card_progress(profile_id,card_id,rating,reviewed_at,reviews) VALUES('local',$1,$2,now(),1) ON CONFLICT(profile_id,card_id) DO UPDATE SET rating=$2,reviewed_at=now(),reviews=card_progress.reviews+1",
          [item.card.id, input.rating],
        );
        if (session.items.every((i) => i.id === item.id || i.status === 'reviewed'))
          await sql.query("UPDATE sessions SET status='completed',finished_at=now() WHERE id=$1", [
            id,
          ]);
      }
    } else {
      if (input.action === 'resume') {
        if (session.status !== 'paused')
          throw new ConflictError('Only paused sessions can resume.');
        if (
          (await sql.query("SELECT id FROM sessions WHERE profile_id='local' AND status='active'"))
            .rows.length
        )
          throw new ConflictError('Pause or end the other active session first.');
      }
      const status =
        input.action === 'pause' ? 'paused' : input.action === 'resume' ? 'active' : 'abandoned';
      await sql.query(
        "UPDATE sessions SET status=$2,finished_at=CASE WHEN $2='abandoned' THEN now() ELSE NULL END WHERE id=$1",
        [id, status],
      );
    }
    await sql.query('UPDATE sessions SET version=version+1,updated_at=now() WHERE id=$1', [id]);
    return getSession(sql, id);
  });
}
export async function markRead(db: Database, id: string, read: unknown): Promise<Progress> {
  if (typeof read !== 'boolean') throw new ValidationError('Read status must be true or false.');
  return db.transaction(async (sql) => {
    if (!(await sql.query('SELECT id FROM concepts WHERE id=$1', [id])).rows.length)
      throw new NotFoundError('Concept not found.');
    if (read)
      await sql.query(
        "INSERT INTO read_progress(profile_id,concept_id) VALUES('local',$1) ON CONFLICT DO NOTHING",
        [id],
      );
    else
      await sql.query("DELETE FROM read_progress WHERE profile_id='local' AND concept_id=$1", [id]);
    return getProgress(sql);
  });
}
export async function importProgress(
  db: Database,
  value: unknown,
  legacy = false,
): Promise<Progress> {
  return db.transaction(async (sql) => {
    await sql.query("SELECT id FROM profiles WHERE id='local' FOR UPDATE");
    let progress: Progress;
    try {
      progress = parseProgress(JSON.stringify(value), await getCatalogue(sql));
    } catch (e) {
      throw new ValidationError((e as Error).message);
    }
    const hash = createHash('sha256').update(JSON.stringify(progress)).digest('hex');
    if (
      legacy &&
      (
        await sql.query(
          "SELECT content_hash FROM legacy_imports WHERE profile_id='local' AND content_hash=$1",
          [hash],
        )
      ).rows.length
    )
      return getProgress(sql);
    if (!legacy) {
      await sql.query("DELETE FROM read_progress WHERE profile_id='local'");
      await sql.query("DELETE FROM card_progress WHERE profile_id='local'");
    }
    for (const id of progress.read)
      await sql.query(
        "INSERT INTO read_progress(profile_id,concept_id) VALUES('local',$1) ON CONFLICT DO NOTHING",
        [id],
      );
    for (const [id, r] of Object.entries(progress.ratings))
      await sql.query(
        `INSERT INTO card_progress(profile_id,card_id,rating,reviewed_at,reviews) VALUES('local',$1,$2,$3,$4) ON CONFLICT(profile_id,card_id) DO UPDATE SET rating=EXCLUDED.rating,reviewed_at=EXCLUDED.reviewed_at,reviews=EXCLUDED.reviews ${legacy ? 'WHERE card_progress.reviewed_at<EXCLUDED.reviewed_at' : ''}`,
        [id, r.rating, r.reviewedAt, r.reviews],
      );
    if (legacy)
      await sql.query("INSERT INTO legacy_imports(profile_id,content_hash) VALUES('local',$1)", [
        hash,
      ]);
    return getProgress(sql);
  });
}
