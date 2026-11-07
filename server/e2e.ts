// Dedicated disposable database for browser tests; never connect this helper to user data.
import { Pool } from 'pg';
import { connectDatabase, migrate } from './db';
import { importCatalogue } from './catalogue';
import { createApi } from './http';
import { cards, concepts, fields } from '../src/seed-data';
const url = new URL(
  process.env.DATABASE_URL ?? 'postgresql://recall:recall_local@127.0.0.1:54329/recall',
);
url.pathname = '/postgres';
const admin = new Pool({ connectionString: url.toString() });
try {
  await admin.query('CREATE DATABASE recall_e2e');
} catch (e) {
  if ((e as { code: string }).code !== '42P04') throw e;
} finally {
  await admin.end();
}
url.pathname = '/recall_e2e';
const db = connectDatabase(url.toString());
await migrate(db);
await importCatalogue(
  db,
  {
    fields,
    concepts,
    cards: cards.map((c) => ({ ...c, kind: 'recall', answers: [c.answer], choices: [] })),
  },
  'cs-foundations-v1',
);
process.env.RECALL_WEB_ORIGIN = 'http://127.0.0.1:5174';
const server = createApi(db);
server.listen(3002, '127.0.0.1', () => console.log('Recall isolated browser-test API ready'));
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () =>
    server.close(() => {
      void db.close().then(() => process.exit(0));
    }),
  );
