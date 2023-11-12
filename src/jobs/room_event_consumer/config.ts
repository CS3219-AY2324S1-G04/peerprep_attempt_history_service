/**
 * @file Defines {@link Config}.
 */

/** Represents the app's configs. */
export default class Config {
  // Variable names that are found in environment

  private static readonly _envAttemptHistoryHost: string = 'API_HOST';
  private static readonly _envAttemptHistoryPort: string = 'API_PORT';
  private static readonly _appModeEnvVar: string = 'NODE_ENV';

  // Talk to US if user tries retrieve stats
  private static readonly _envUserServiceHost: string = 'USER_SERVICE_HOST';
  private static readonly _envUserServicePort: string = 'USER_SERVICE_PORT';

  private static readonly _envRoomMQPass: string = 'ROOM_SERVICE_MQ_PASSWORD';
  private static readonly _envRoomMQUser: string = 'ROOM_SERVICE_MQ_USER';
  private static readonly _envRoomMQHost: string = 'ROOM_SERVICE_MQ_HOST';
  private static readonly _envRoomMQPort: string = 'ROOM_SERVICE_MQ_PORT';
  private static readonly _envRoomMQVhost: string = 'ROOM_SERVICE_MQ_VHOST';
  private static readonly _envRoomMQTls: string =
    'ROOM_SERVICE_MQ_SHOULD_USE_TLS';
  private static readonly _envRoomMQXchange: string =
    'ROOM_SERVICE_MQ_EXCHANGE_NAME';
  private static readonly _envRoomMQQname: string =
    'ROOM_SERVICE_MQ_QUEUE_NAME';

  private static readonly _envDocsHost: string = 'DOCS_SERVICE_HOST';
  private static readonly _envDocsPort: string = 'DOCS_SERVICE_PORT';

  /** Other variables. */
  private static _instance: Config;

  /** Copies from Environment and save into these variable names. */

  public readonly attemptHistoryURL: string;

  public readonly userServiceURL: string;

  public readonly roomMQPass: string;
  public readonly roomMQUser: string;
  public readonly roomMQHost: string;
  public readonly roomMQPort: number;
  public readonly roomMQVhost: string;
  public readonly roomMQTls: boolean;
  public readonly roomMQXchange: string;
  public readonly roomMQQname: string;

  public readonly docsServiceURL: string;

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
      const attemptHistoryURL = 'localhost';
      const attemptHistoryPort = 9006;
      this.attemptHistoryURL = `http://${attemptHistoryURL}:${attemptHistoryPort}`;

      const userServiceHost = 'localhost';
      const userServicePort = 9000;
      this.userServiceURL = `http://${userServiceHost}:${userServicePort}`;

      this.roomMQPass = 'P@ssword123';
      this.roomMQUser = 'user';
      this.roomMQHost = 'localhost';
      this.roomMQPort = 5672;
      this.roomMQVhost = '';
      this.roomMQTls = false;
      this.roomMQXchange = 'room-events';
      this.roomMQQname = 'attempt-history-service-room-event-queue';

      const docsServiceHost = 'localhost';
      const docsServicePort = 9004;
      this.docsServiceURL = `http://${docsServiceHost}:${docsServicePort}`;
    } else {
      const attemptHistoryHost = this._getEnvAsString(
        env,
        Config._envAttemptHistoryHost,
      );
      const attemptHistoryPort = this._getEnvAsInt(
        env,
        Config._envAttemptHistoryPort,
      );
      this.attemptHistoryURL = `http://${attemptHistoryHost}:${attemptHistoryPort}`;

      const userServiceHost = this._getEnvAsString(
        env,
        Config._envUserServiceHost,
      );
      const userServicePort = this._getEnvAsInt(
        env,
        Config._envUserServicePort,
      );
      this.userServiceURL = `http://${userServiceHost}:${userServicePort}`;

      this.roomMQPass = this._getEnvAsString(env, Config._envRoomMQPass);
      this.roomMQUser = this._getEnvAsString(env, Config._envRoomMQUser);
      this.roomMQHost = this._getEnvAsString(env, Config._envRoomMQHost);
      this.roomMQPort = this._getEnvAsInt(env, Config._envRoomMQPort);
      this.roomMQVhost = this._getEnvAsString(
        env,
        Config._envRoomMQVhost,
        true,
      );
      this.roomMQTls =
        this._getEnvAsString(env, Config._envRoomMQTls) === 'true';
      this.roomMQXchange = this._getEnvAsString(env, Config._envRoomMQXchange);
      this.roomMQQname = this._getEnvAsString(env, Config._envRoomMQQname);

      const docsHost = this._getEnvAsString(env, Config._envDocsHost);
      const docsPort = this._getEnvAsInt(env, Config._envDocsPort);
      this.docsServiceURL = `http://${docsHost}:${docsPort}`;
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
   * @param allowEmpty - Allow empty string.
   * @returns The string value of the variable.
   * @throws Error if unable to process the key.
   */
  private _getEnvAsString(
    env: NodeJS.ProcessEnv,
    key: string,
    allowEmpty: boolean = false,
  ): string {
    if (env[key] !== undefined) {
      const ret = this._parseString(env[key]);
      if (ret !== undefined) {
        return ret;
      }
    }
    if (allowEmpty) {
      return '';
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
