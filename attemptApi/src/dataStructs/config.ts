/**
 * @file Defines {@link Config}.
 */

/** Represents the app's configs. */
export default class Config {
  // Variable names that are found in environment
  private static readonly envVarDatabaseHost: string = 'HS_DB_HOST';
  private static readonly envVarDatabasePort: string = 'HS_DB_PORT'
  private static readonly envVarDatabaseUser: string = 'HS_DB_USER';
  private static readonly envVarDatabasePass: string = 'HS_DB_PASS';
  private static readonly envVarDatabaseDB: string = 'HS_DB';

  private static readonly envVarDatabaseTimeout: string = 'DATABASE_CONNECTION_TIMEOUT_MILLIS';
  private static readonly envVarDatabasePool: string = 'DATABASE_MAX_CLIENT_COUNT';

  private static readonly envVarExpressPort: string = 'HS_EXPRESS_PORT';
  private static readonly appModeEnvVar: string = 'NODE_ENV';

  // Talk to US if user tries retrieve stats
  private static readonly envUserServiceHost: string = 'SERVICE_USER_HOST';
  private static readonly envUserServicePort: string = 'SERVICE_USER_PORT';

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

  /** Copies from Development variables */
  public readonly isDevEnv: boolean;

  /** Other variables */
  private static instance: Config;

  /**
   * Constructs a Config and assigns to each field, the value stored in their
   * corresponding environment variable. If an environment variable does not
   * have a valid value, assigns a default value instead.
   *
   * @param env - Environment variables.
   */
  private constructor(env: NodeJS.ProcessEnv = process.env, localDev: boolean = false) {

    this.isDevEnv = env[Config.appModeEnvVar] === 'development';

    if (!localDev) {
      this.dbHost = 'localhost';
      this.dbPort = 5432;
      this.dbUser = 'postgres'
      this.dbPass = 'password'
      this.dbDB = 'user'

      this.expressPort = 9010;

      const userServiceHost = 'localhost';
      const userServicePort = 9000;
      this.userServiceURL = `http://${userServiceHost}:${userServicePort}`;

      this.dbTimeout = 0;
      this.dbPool = 20;

    } else {
      this.dbHost = this.getEnvAsString(env, Config.envVarDatabaseHost)
      this.dbPort = this.getEnvAsInt(env, Config.envVarDatabasePort);
      this.dbUser = this.getEnvAsString(env, Config.envVarDatabaseUser)
      this.dbPass = this.getEnvAsString(env, Config.envVarDatabasePass)
      this.dbDB = this.getEnvAsString(env, Config.envVarDatabaseDB)

      this.expressPort = this.getEnvAsInt(env, Config.envVarExpressPort);

      const userServiceHost = this.getEnvAsString(env, Config.envUserServiceHost);
      const userServicePort = this.getEnvAsInt(env, Config.envUserServicePort);
      this.userServiceURL = `http://${userServiceHost}:${userServicePort}`;

      this.dbTimeout = this.getEnvAsInt(env, Config.envVarDatabaseTimeout);
      this.dbPool = this.getEnvAsInt(env, Config.envVarDatabasePool);

    }
  }

  /**
 * Instantiates config if not yet done, else returns the config. 
 * 
 * @returns The current running configuration
 */
  public static get(): Config {
    if (Config.instance == undefined) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  /**
   * Retrieves the string value of key from Environments.
   * 
   * @param env NodeJS.ProcessEnv
   * @param key The environment variable name
   * @returns The string value of the variable
   * @throws Error if unable to process the key
   */
  private getEnvAsString(env: NodeJS.ProcessEnv, key: any): string {
    if (env[key] !== undefined) {
      const ret = this._parseString(env[key])
      if (ret !== undefined) {
        return ret
      }
    }
    throw Error(`${key} is not set in env or is not a string.`)
  }

  /**
 * Retrieves the int value of key from Environments.
 * 
 * @param env NodeJS.ProcessEnv
 * @param key The environment variable name
 * @returns The int value of the variable
 * @throws Error if unable to process the key
 */
  private getEnvAsInt(env: NodeJS.ProcessEnv, key: any): number {
    if (env[key] !== undefined) {
      const ret = this._parseInt(env[key])
      if (ret !== undefined) {
        return ret
      }
    }
    throw Error(`${key} is not set in env or is not a string.`)
  }

  /**
   * Returns undefined if string is empty or undefined.
   *
   * @param raw - The string to be parsed
   * @returns The string or undefined
   */
  private _parseString(raw: string | undefined): string | undefined {
    if (raw === undefined || raw === '') {
      return undefined;
    }
    return raw;
  }

  /**
   * Returns undefined if Integer is not a number or undefined.
   *
   * @param raw - The string to be parsed
   * @returns The string or undefined
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
