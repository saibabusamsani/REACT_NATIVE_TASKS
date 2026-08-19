
import type { Migration } from '../types';

const migration: Migration = {
  version: 2,

  up: async (db) => {
    await db.execute(`DROP TABLE IF EXISTS employee;`);

    await db.execute(`
      CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL
      );
    `);
  },
};

export default migration;