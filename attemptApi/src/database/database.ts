/**
 * @file For connecting to Database via typeORM.
 */
import { DataSource } from 'typeorm';

import configuration from '../dataStructs/config';
import { AttemptEntity } from './attemptEntity';

const config = configuration.get();

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
