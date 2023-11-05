import { createConnection, DataSource } from 'typeorm';
import Config from '../dataStructs/config';
import { AttemptEntity } from './attemptEntity';

const config = Config.get();

export const AttemptDataSource = new DataSource({
    type: 'postgres',
    password: config.dbPass,
    username: config.dbUser,
    host: config.dbHost,
    port: config.dbPort,
    database: config.dbDB,
    entities: [AttemptEntity],
    connectTimeoutMS: config.dbTimeout,
    poolSize: config.dbPool,
    synchronize: false,
  });


AttemptDataSource.initialize()
    .then(() => {
        console.log("Successfully connected to database")
})
    .catch((err) => {
        console.error("Failed to connect to DB! If you have pgadmin, postgres service might be up causing conflict. ")
        console.error(err)
})