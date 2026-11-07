import { connectConfiguredDatabase, migrate } from './db';
import { createApi } from './http';
const db = connectConfiguredDatabase();
await migrate(db);
const port = Number(process.env.RECALL_API_PORT ?? 3001);
const api = createApi(db, process.env.RECALL_STATIC_DIR);
api.listen(port, process.env.RECALL_API_HOST ?? '127.0.0.1', () =>
  console.log(`Recall API http://127.0.0.1:${port}`),
);
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => {
    api.close(() => {
      void db.close().then(() => process.exit(0));
    });
  });
