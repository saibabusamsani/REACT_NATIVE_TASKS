import type { DB, Migration, PendingMigrationsResult } from '../types';
import { getDb } from '../connection';
import migration001 from './001_create_tables';
import migration002 from './002_replace_employee_products';

const MIGRATIONS: Migration[] = [migration001, migration002];

const getPendingMigrations = async (db: DB): Promise<PendingMigrationsResult> => {
  const result = await db.execute('PRAGMA user_version;');

  const currentVersion: number = Number(result.rows?.[0]?.user_version ?? 0);

  console.log('Current Version:', currentVersion);

  const pendingMigrations = MIGRATIONS
    .filter(({ version }) => version > currentVersion)
    .sort((a, b) => a.version - b.version);

  return { currentVersion, pendingMigrations };
};

export const runMigration = async (): Promise<void> => {
  const db = getDb();

  const { currentVersion, pendingMigrations } = await getPendingMigrations(db);

  for (const migration of pendingMigrations) {
    console.log(`Running migration ${migration.version}`);

    await db.transaction(async (tx) => {
      await migration.up(tx);
    });

    await db.execute(`PRAGMA user_version = ${migration.version};`);

    console.log(`Migration ${migration.version} completed`);
  }

  console.log(
    'Database updated to version:',
    pendingMigrations.length
      ? pendingMigrations[pendingMigrations.length - 1].version
      : currentVersion
  );
};