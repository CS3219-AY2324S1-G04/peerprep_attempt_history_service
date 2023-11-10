/**
 * @file Initializes Database.
 */
import { AttemptEntity } from '../../database/attemptEntity';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Config from './config';
import { attemptDataSource } from './database';

/**
 * Runs the initialization script for database initialization.
 * @param forceDelete - Boolean to force deletion of tables.
 */
export async function run(forceDelete: boolean = false) {
  await attemptDataSource.initialize();
  if (await doEntityExist()) {
    console.log('Initializing or Recreating tables ... ');
    if (forceDelete) {
      await deleteTable();
    }
    await attemptDataSource.synchronize();
  } else {
    console.log('Table is already initialized ');
    await attemptDataSource.synchronize();
  }
  await attemptDataSource.destroy().then(() => {
    console.log('Disconnected');
  });
}

/**
 * Returns True if table exists.
 * @returns True if table exists.
 */
async function doEntityExist(): Promise<boolean> {
  return (
    (
      await attemptDataSource.query(
        'SELECT 1 FROM information_schema.tables WHERE table_name IN ($1)',
        [attemptDataSource.getRepository(AttemptEntity).metadata.tableName],
      )
    ).length > 0
  );
}

/**
 * Deletes the table in order to allow synchronization.
 * WARNING: This removes all data stored in the table.
 */
async function deleteTable(): Promise<void> {
  console.log('deleting table...');
  const tableName: string =
    attemptDataSource.getRepository(AttemptEntity).metadata.tableName;

  // await AttemptDataSource.
  await attemptDataSource.query(`DROP TABLE IF EXISTS ${tableName}`);
}

attemptDataSource.initialize();
run(Config.get().forceInit);
