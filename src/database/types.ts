import type { open } from '@op-engineering/op-sqlite';

export type DB = ReturnType<typeof open>;

export interface Migration {
  version: number;
  up: (db: Pick<DB, 'execute'>) => Promise<void>;
}

export interface PendingMigrationsResult {
  currentVersion: number;
  pendingMigrations: Migration[];
}