/**
 * @file Defines {@link Configuration}.
 */

/** Represents the app's configs. */
export default class Configuration {
  // Variable names that are found in environment
  private static readonly _envDatabaseHost: string = 'HS_DB_HOST';
  private static readonly _envDatabasePort: string = 'HS_DB_PORT';
  private static readonly _envDatabaseUser: string = 'HS_DB_USER';
  private static readonly _envDatabasePass: string = 'HS_DB_PASS';
  private static readonly _envDatabaseDB: string = 'HS_DB';

  private static readonly _envVarDatabaseTimeout: string =
    'DATABASE_CONNECTION_TIMEOUT_MILLIS';
  private static readonly _envVarDatabasePool: string =
    'DATABASE_MAX_CLIENT_COUNT';

  private static readonly _envVarExpressPort: string = 'HS_EXPRESS_PORT';
  private static readonly _appModeEnvVar: string = 'NODE_ENV';

  // Talk to US if user tries retrieve stats
  private static readonly _envUserServiceHost: string = 'SERVICE_USER_HOST';
  private static readonly _envUserServicePort: string = 'SERVICE_USER_PORT';

  /** Other variables. */
  private static _instance: Configuration;

  /** Copies from Environment and save into these variable names. */
  public readonly dbHost: string;
  public readonly dbPort: number;
  public readonly dbUser: string;
  public readonly dbPass: string;
  public readonly dbDB: string;
  public readonly dbTimeout: number;
  public readonly dbPool: number;

  public readonly expressPort: number;

  public readonly userServiceURL: string;

  /** Copies from Development variables. */
  public readonly isDevEnv: boolean;

  /**
   * Constructs a Config and assigns to each field, the value stored in their
   * corresponding environment variable. If an environment variable does not
   * have a valid value, assigns a default value instead.
   * @param env - Environment variables.
   * @param localDev
   */
  private constructor(
    env: NodeJS.ProcessEnv = process.env,
    localDev: boolean = false,
  ) {
    this.isDevEnv = env[Configuration._appModeEnvVar] === 'development';

    if (localDev) {
      this.dbHost = 'localhost';
      this.dbPort = 5432;
      this.dbUser = 'postgres';
      this.dbPass = 'password';
      this.dbDB = 'user';

      this.expressPort = 9006;

      const userServiceHost = 'localhost';
      const userServicePort = 9000;
      this.userServiceURL = `http://${userServiceHost}:${userServicePort}`;

      this.dbTimeout = 0;
      this.dbPool = 20;
    } else {
      this.dbHost = this._getEnvAsString(env, Configuration._envDatabaseHost);
      this.dbPort = this._getEnvAsInt(env, Configuration._envDatabasePort);
      this.dbUser = this._getEnvAsString(env, Configuration._envDatabaseUser);
      this.dbPass = this._getEnvAsString(env, Configuration._envDatabasePass);
      this.dbDB = this._getEnvAsString(env, Configuration._envDatabaseDB);

      this.expressPort = this._getEnvAsInt(
        env,
        Configuration._envVarExpressPort,
      );

      const userServiceHost = this._getEnvAsString(
        env,
        Configuration._envUserServiceHost,
      );
      const userServicePort = this._getEnvAsInt(
        env,
        Configuration._envUserServicePort,
      );
      this.userServiceURL = `http://${userServiceHost}:${userServicePort}`;

      this.dbTimeout = this._getEnvAsInt(
        env,
        Configuration._envVarDatabaseTimeout,
      );
      this.dbPool = this._getEnvAsInt(env, Configuration._envVarDatabasePool);
    }
  }

  /**
   * Instantiates config if not yet done, else returns the config.
   * @returns The current running configuration.
   */
  public static get(): Configuration {
    if (Configuration._instance == undefined) {
      Configuration._instance = new Configuration();
    }
    return Configuration._instance;
  }

  /**
   * Retrieves the string value of key from Environments.
   * @param env - NodeJS.ProcessEnv.
   * @param key - The environment variable name.
   * @returns The string value of the variable.
   * @throws Error if unable to process the key.
   */
  private _getEnvAsString(env: NodeJS.ProcessEnv, key: string): string {
    if (env[key] !== undefined) {
      const ret = this._parseString(env[key]);
      if (ret !== undefined) {
        return ret;
      }
    }
    throw Error(`${key} is not set in env or is not a string.`);
  }

  /**
   * Retrieves the int value of key from Environments.
   * @param env - NodeJS.ProcessEnv.
   * @param key - The environment variable name.
   * @returns The int value of the variable.
   * @throws Error if unable to process the key.
   */
  private _getEnvAsInt(env: NodeJS.ProcessEnv, key: string): number {
    if (env[key] !== undefined) {
      const ret = this._parseInt(env[key]);
      if (ret !== undefined) {
        return ret;
      }
    }
    throw Error(`${key} is not set in env or is not a string.`);
  }

  /**
   * Returns undefined if string is empty or undefined.
   * @param raw - The string to be parsed.
   * @returns The string or undefined.
   */
  private _parseString(raw: string | undefined): string | undefined {
    if (raw === undefined || raw === '') {
      return undefined;
    }
    return raw;
  }

  /**
   * Returns undefined if Integer is not a number or undefined.
   * @param raw - The string to be parsed.
   * @returns The string or undefined.
   */
  private _parseInt(raw: string | undefined): number | undefined {
    if (raw === undefined) {
      return undefined;
    }

    const val: number = parseFloat(raw);
    if (isNaN(val) || !Number.isInteger(val)) {
      return undefined;
    }

    return val;
  }
}
