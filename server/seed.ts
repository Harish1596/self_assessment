import { cards, concepts, fields } from '../src/seed-data';
import { connectDatabase, migrate } from './db';
import { syncSeedCatalogue } from './catalogue';
const db = connectDatabase(
  process.env.DATABASE_URL ?? 'postgresql://recall:recall_local@127.0.0.1:54329/recall',
);
try {
  await migrate(db);
  await syncSeedCatalogue(db, {
    fields,
    concepts,
    cards: cards.map((c) => ({ ...c, kind: 'recall', answers: [c.answer], choices: [] })),
  });
  console.log(
    'Recall foundation catalogue is ready (changed seed content synchronised; progress preserved).',
  );
} finally {
  await db.close();
}
