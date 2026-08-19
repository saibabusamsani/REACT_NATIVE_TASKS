import { Migration } from "../types";


const migration: Migration = {
  version: 1,

  up: async (db) => {
    await db.execute(`
      CREATE TABLE employee (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        department_id INTEGER,
        salary INTEGER
      );
    `);
  },
};

export default migration;