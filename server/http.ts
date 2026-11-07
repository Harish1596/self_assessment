import { createServer } from 'node:http';
import type { Database } from './db';
import { getCatalogue, importCatalogue } from './catalogue';
import {
  ConflictError,
  NotFoundError,
  createSession,
  getProgress,
  getSession,
  importProgress,
  listSessions,
  markRead,
  mutateSession,
} from './sessions';
import { ValidationError } from '../shared/validation';

export function createApi(db: Database) {
  return createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    try {
      // The personal API is loopback-only and accepts JSON writes from the app origin.
      const host = req.headers.host ?? '';
      if (!/^(127\.0\.0\.1|localhost):\d+$/.test(host)) throw new ValidationError('Invalid host.');
      if (
        req.headers.origin &&
        ![
          `http://${host}`,
          'http://127.0.0.1:5173',
          'http://localhost:5173',
          'http://127.0.0.1:4173',
          process.env.RECALL_WEB_ORIGIN,
        ].includes(req.headers.origin)
      ) {
        res.statusCode = 403;
        res.end(JSON.stringify({ error: 'Origin not allowed.' }));
        return;
      }
      let body: any = {};
      if (['POST', 'PUT', 'PATCH'].includes(req.method ?? '')) {
        if (!req.headers['content-type']?.startsWith('application/json'))
          throw new ValidationError('Send JSON request data.');
        const chunks: Buffer[] = [];
        let size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 10_000_000) throw new ValidationError('Request is too large.');
          chunks.push(Buffer.from(chunk));
        }
        try {
          body = JSON.parse(Buffer.concat(chunks).toString());
        } catch {
          throw new ValidationError('Invalid JSON.');
        }
        if (!body || typeof body !== 'object' || Array.isArray(body))
          throw new ValidationError('Send a JSON object.');
      }
      const path = new URL(req.url ?? '/', 'http://localhost').pathname;
      const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
      let result: unknown;
      if (req.method === 'GET' && path === '/api/bootstrap')
        result = {
          catalogue: await getCatalogue(db),
          progress: await getProgress(db),
          sessions: await listSessions(db),
        };
      else if (req.method === 'GET' && path === '/api/health') {
        await db.query('SELECT 1');
        result = { ok: true };
      } else if (req.method === 'POST' && path === '/api/catalogue') {
        await importCatalogue(db, body);
        result = await getCatalogue(db);
      } else if (req.method === 'POST' && path === '/api/sessions')
        result = await createSession(db, body.config, body.cardIds);
      else if (
        parts.length === 3 &&
        parts[1] === 'sessions' &&
        /^[0-9a-f-]{36}$/i.test(parts[2]) &&
        req.method === 'GET'
      )
        result = await getSession(db, parts[2]);
      else if (
        parts.length === 3 &&
        parts[1] === 'sessions' &&
        /^[0-9a-f-]{36}$/i.test(parts[2]) &&
        req.method === 'PATCH'
      )
        result = await mutateSession(db, parts[2], body);
      else if (req.method === 'PUT' && parts.length === 3 && parts[1] === 'read')
        result = await markRead(db, parts[2], body.read);
      else if (req.method === 'POST' && path === '/api/progress/import')
        result = await importProgress(db, body.progress, body.legacy === true);
      else throw new NotFoundError('Endpoint not found.');
      res.end(JSON.stringify(result));
    } catch (error) {
      res.statusCode =
        error instanceof ConflictError
          ? 409
          : error instanceof NotFoundError
            ? 404
            : error instanceof ValidationError
              ? 400
              : 503;
      if (res.statusCode === 503)
        console.error('Database request failed:', (error as Error).message);
      res.end(
        JSON.stringify({
          error:
            res.statusCode === 503
              ? 'The database is unavailable. Your changes were not confirmed saved.'
              : (error as Error).message,
        }),
      );
    }
  });
}
