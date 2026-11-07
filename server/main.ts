import { connectDatabase, migrate } from './db';
import { createApi } from './http';
const db = connectDatabase(
  process.env.DATABASE_URL ?? 'postgresql://recall:recall_local@127.0.0.1:54329/recall',
);
await migrate(db);
const port = Number(process.env.RECALL_API_PORT ?? 3001);
const api = createApi(db);
api.listen(port, '127.0.0.1', () => console.log(`Recall API http://127.0.0.1:${port}`));
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => {
    api.close(() => {
      void db.close().then(() => process.exit(0));
    });
  });
