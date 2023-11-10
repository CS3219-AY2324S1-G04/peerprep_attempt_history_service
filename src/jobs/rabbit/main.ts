/**
 * Entry point for rabbit.
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
