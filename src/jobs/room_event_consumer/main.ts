/**
 * Entry point for MQ consumer.
 */
import { consumer } from './rabbit';

/**
 *
 */
async function run() {
  console.log('Activated');
  await consumer();
}
run();
