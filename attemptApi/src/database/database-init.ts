import { AttemptEntity } from './attemptEntity';
import { AttemptDataSource } from './database';

export async function run(forceDelete : boolean = false) {
  await AttemptDataSource.initialize();
  if (await doEntityExist()) {
    console.log('Initializing or Recreating tables ... ');
    if (forceDelete) {
      await deleteTable();
    }
    await AttemptDataSource.synchronize();
  } else {
    console.log('Table is already initialized ');
    await AttemptDataSource.synchronize();
  }
}

async function doEntityExist() {
  return (
    (
      await AttemptDataSource.query(
        'SELECT 1 FROM information_schema.tables WHERE table_name IN ($1)',
        [AttemptDataSource.getRepository(AttemptEntity).metadata.tableName],
      )
    ).length > 0
  );
}

async function deleteTable() {
  console.log('deleting table...')
  const tname: string = AttemptDataSource.getRepository(AttemptEntity).metadata.tableName

  // await AttemptDataSource.
  await AttemptDataSource.query(
    `DROP TABLE IF EXISTS ${tname}`,);
}