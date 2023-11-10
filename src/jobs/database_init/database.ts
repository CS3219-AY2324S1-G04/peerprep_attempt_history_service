/**
 * @file For connecting to Database via typeORM.
 */
import { DataSource } from 'typeorm';

import { AttemptEntity } from '../../database/attemptEntity';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Config from './config';

const config = Config.get();

/**
 * The DataSource to interact with.
 */
export const attemptDataSource = new DataSource({
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
  ssl: config.dbTls,
});

attemptDataSource
  .initialize()
  .then(() => {
    console.log('Successfully connected to database');
  })
  .catch((err) => {
    console.error(
      'Failed to connect to DB! If you have pgadmin, postgres service might be up causing conflict. ',
    );
    console.error(err);
  });
