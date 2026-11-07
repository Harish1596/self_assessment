import { PGlite } from '@electric-sql/pglite';
import type { Database, Sql } from './db';
import { migrate } from './db';
/** Actual embedded PostgreSQL for deterministic repository tests, not a SQL mock. */
export async function testDatabase(): Promise<Database> {
  const pg = new PGlite();
  const adapt = (sql: Pick<PGlite, 'query' | 'exec'>): Sql => ({
    query: async (text, values) => {
      const result = values ? await sql.query(text, values) : (await sql.exec(text)).at(-1)!;
      return { rows: result.rows as any[] };
    },
  });
  const db: Database = {
    ...adapt(pg),
    transaction: (run) => pg.transaction((tx) => run(adapt(tx))),
    close: () => pg.close(),
  };
  await migrate(db);
  return db;
}
