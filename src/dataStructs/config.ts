/**
 * @file Defines {@link Config}.
 */

/** Represents the app's configs. */
export default class Config {
  // Variable names that are found in environment
  private static readonly _envDatabaseHost: string = 'DATABASE_HOST';
  private static readonly _envDatabasePort: string = 'DATABASE_PORT';
  private static readonly _envDatabaseUser: string = 'DATABASE_USER';
  private static readonly _envDatabasePass: string = 'DATABASE_PASSWORD';
  private static readonly _envDatabaseDB: string = 'DATABASE_NAME';
  private static readonly _envDatabaseTls: string = 'DATABASE_SHOULD_USE_TLS';

  private static readonly _envVarDatabaseTimeout: string =
    'DATABASE_CONNECTION_TIMEOUT_MILLIS';
  private static readonly _envVarDatabasePool: string =
    'DATABASE_MAX_CLIENT_COUNT';

  private static readonly _envVarExpressPort: string = 'API_PORT';
  private static readonly _appModeEnvVar: string = 'NODE_ENV';

  // Talk to US if user tries retrieve stats
  private static readonly _envUserServiceHost: string = 'USER_SERVICE_HOST';
  private static readonly _envUserServicePort: string = 'USER_SERVICE_PORT';

  /** Other variables. */
  private static _instance: Config;

  /** Copies from Environment and save into these variable names. */
  public readonly dbHost: string;
  public readonly dbPort: number;
  public readonly dbUser: string;
  public readonly dbPass: string;
  public readonly dbDB: string;
  public readonly dbTimeout: number;
  public readonly dbPool: number;
  public readonly dbTls: boolean;

  public readonly expressPort: number;

  public readonly userServiceURL: string;

  /** Copies from Development variables. */
  public readonly isDevEnv: boolean;

  /**
   * Constructs a Config and assigns to each field, the value stored in their
   * corresponding environment variable. If an environment variable does not
   * have a valid value, assigns a default value instead.
   * @param env - Environment variables.
   * @param localDev - For development.
   */
  private constructor(
    env: NodeJS.ProcessEnv = process.env,
    localDev: boolean = false,
  ) {
    this.isDevEnv = env[Config._appModeEnvVar] === 'development';

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
      this.dbTls = false;
    } else {
      this.dbHost = this._getEnvAsString(env, Config._envDatabaseHost);
      this.dbPort = this._getEnvAsInt(env, Config._envDatabasePort);
      this.dbUser = this._getEnvAsString(env, Config._envDatabaseUser);
      this.dbPass = this._getEnvAsString(env, Config._envDatabasePass);
      this.dbDB = this._getEnvAsString(env, Config._envDatabaseDB);

      this.expressPort = this._getEnvAsInt(env, Config._envVarExpressPort);

      const userServiceHost = this._getEnvAsString(
        env,
        Config._envUserServiceHost,
      );
      const userServicePort = this._getEnvAsInt(
        env,
        Config._envUserServicePort,
      );
      this.userServiceURL = `http://${userServiceHost}:${userServicePort}`;

      this.dbTimeout = this._getEnvAsInt(env, Config._envVarDatabaseTimeout);
      this.dbPool = this._getEnvAsInt(env, Config._envVarDatabasePool);

      this.dbTls = this._getEnvAsString(env, Config._envDatabaseTls) === 'true';
    }
  }

  /**
   * Instantiates config if not yet done, else returns the config.
   * @returns The current running configuration.
   */
  public static get(): Config {
    if (Config._instance == undefined) {
      Config._instance = new Config();
    }
    return Config._instance;
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
