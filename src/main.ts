/**
 * @file Entry point to the program.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
import App from './app';

// import { consumer } from './jobs/rabbit/rabbit';

const app = new App();

app.startServer();

// consumer();
