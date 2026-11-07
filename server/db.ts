import { createRequire } from 'node:module';
import { readdir, readFile } from 'node:fs/promises';

export type Sql = {
  query<T extends Record<string, unknown> = Record<string, unknown>>(
    text: string,
    values?: unknown[],
  ): Promise<{ rows: T[] }>;
};
type Connection = Sql & { release(): void };
type Pool = Sql & { connect(): Promise<Connection>; end(): Promise<void> };
export type Database = Sql & {
  transaction<T>(run: (connection: Sql) => Promise<T>): Promise<T>;
  close(): Promise<void>;
};

export function connectDatabase(connectionString?: string): Database {
  // Keep the driver behind one small boundary; repositories consume parameterised SQL.
  const require = createRequire(import.meta.url);
  const { Pool: PgPool } = require('pg') as {
    Pool: new (config: Record<string, unknown>) => Pool;
  };
  const pool = new PgPool({ connectionString, max: 5, connectionTimeoutMillis: 5000 });
  return {
    query: (text, values) => pool.query(text, values),
    async transaction(run) {
      const connection = await pool.connect();
      try {
        await connection.query('BEGIN');
        const value = await run(connection);
        await connection.query('COMMIT');
        return value;
      } catch (error) {
        await connection.query('ROLLBACK');
        throw error;
      } finally {
        connection.release();
      }
    },
    close: () => pool.end(),
  };
}

/** PG* variables are used inside Compose; host development retains its existing URL. */
export function connectConfiguredDatabase(): Database {
  return connectDatabase(
    process.env.DATABASE_URL ||
      (process.env.PGHOST ? undefined : 'postgresql://recall:recall_local@127.0.0.1:54329/recall'),
  );
}

export async function migrate(database: Database): Promise<void> {
  await database.transaction(async (sql) => {
    await sql.query("SELECT pg_advisory_xact_lock(hashtext('recall-schema-migrations'))");
    await sql.query(
      'CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())',
    );
    const applied = new Set(
      (await sql.query<{ id: string }>('SELECT id FROM schema_migrations')).rows.map(
        (row) => row.id,
      ),
    );
    const directory = new URL('./migrations/', import.meta.url);
    const names = (await readdir(directory)).filter((name) => /^\d+.*\.sql$/.test(name)).sort();
    for (const name of names) {
      if (applied.has(name)) continue;
      await sql.query(await readFile(new URL(name, directory), 'utf8'));
      await sql.query('INSERT INTO schema_migrations(id) VALUES ($1)', [name]);
    }
  });
}
