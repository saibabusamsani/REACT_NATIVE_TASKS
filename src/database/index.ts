import { runMigration } from './migration/index';

export const initDatabase = async (): Promise<void> => {
  try {
    await runMigration();
  } catch (err) {
    console.log('error at database ', err);
  }
};