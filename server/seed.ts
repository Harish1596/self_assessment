import { cards, concepts, fields } from '../src/seed-data';
import { connectConfiguredDatabase, migrate } from './db';
import { syncSeedCatalogue } from './catalogue';
const db = connectConfiguredDatabase();
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
