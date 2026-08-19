import { open } from '@op-engineering/op-sqlite';
import type { DB } from './types';

let db: DB | null = null;

export const getDb = (): DB => {
  if (!db) {
    db = open({ name: 'flipcart.db' });
    db.execute('PRAGMA foreign_keys = ON;');
    db.execute('PRAGMA journal_mode = WAL;');
  }

  return db;
};