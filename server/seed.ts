import { cards, concepts, fields } from '../src/data';
import { connectDatabase, migrate } from './db';
import { importCatalogue } from './catalogue';
const db = connectDatabase(
  process.env.DATABASE_URL ?? 'postgresql://recall:recall_local@127.0.0.1:54329/recall',
);
try {
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
  console.log('Recall foundation catalogue is ready (existing seed is left unchanged).');
} finally {
  await db.close();
}
