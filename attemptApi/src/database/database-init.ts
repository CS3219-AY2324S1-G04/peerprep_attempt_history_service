import { AttemptEntity } from "./attemptEntity";
import { AttemptDataSource } from "./database";

async function run() {
    await AttemptDataSource.initialize()
    if (await doEntityExist()) {
        console.log("Initializing or Recreating tables ... ")
        deleteTable()
        await AttemptDataSource.synchronize()
    } else {
        console.log("Table is already initialized ")
    }
}

async function doEntityExist() {
    return (await AttemptDataSource.query(
        'SELECT 1 FROM information_schema.tables WHERE table_name IN ($1)',
        [AttemptDataSource.getRepository(AttemptEntity).metadata.tableName],
    )).length > 0;
}

async function deleteTable() {
    await AttemptDataSource.query(
        `DROP TABLE IF EXISTS ${AttemptDataSource.getRepository(AttemptEntity).metadata.tableName}`,
    )
}

console.log('a')
async function Fa() {


}