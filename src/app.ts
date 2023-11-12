/**
 * @file Defines {@link App}.
 */
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/naming-convention
import Config from './dataStructs/config';
// eslint-disable-next-line @typescript-eslint/naming-convention
import { attemptDataSource } from './database/database';
import history from './routes/history';

/**
 * This is the server which the front end will talk to.
 */
export default class App {
  private readonly _app;

  private _port: number;

  /**
   * Constructor for App.
   */
  public constructor() {
    const config = Config.get();

    this._app = express();
    this._port = config.expressPort;

    this._middleMan(config);
    this._routes();

    // Last item
    this._app.use((req: Request, res: Response) => {
      res.status(404);
      res.send('Not found.');
    });
  }

  /**
   * Starts listening and activates ttl.
   */
  public async startServer() {
    attemptDataSource.initialize();

    this._app.listen(this._port, () => {
      console.log(`Room Service is running on port ${this._port}`);
    });
  }

  private _middleMan(config: Config): void {
    this._app.use(bodyParser.json());
    this._app.use(cookieParser());

    if (config.isDevEnv) {
      this._enableDevFeatures();
    }
  }

  private _routes(): void {
    this._app.use('/attempt-history-service', history);
  }

  private _enableDevFeatures(): void {
    this._app.use(
      cors({
        origin: new RegExp('http://localhost:[0-9]+'),
        credentials: true,
      }),
    );
  }
}
