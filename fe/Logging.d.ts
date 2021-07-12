export interface Logging {
  LEVEL: {
    DEBUG: "DEBUG";
    INFO: "INFO";
    WARN: "WARN";
    ERROR: "ERROR";
    ASSERT: "ASSERT";
    TRACE: "TRACE";
    // LOG level nodejs use only
    LOG: "LOG";
  };

  /**
   * control logging message or not flag
   * default false, browser env: false, nodejs env: true
   */
  ENABLED: boolean;

  /**
   * @see https://goo.gl/GPwvqj
   * true prevents the firing of the default event handler
   * default true
   */
  DDEH: boolean;

  /**
   * send logging to server flag
   * logging will be send to server by default in browser environment
   * nodejs env no need send logging
   * useful for disable it if debug error
   */
  SEND: boolean;

  log: (...msg: unknown[]) => void;
  debug: (...msg: unknown[]) => void;
  info: (...msg: unknown[]) => void;
  warn: (...msg: unknown[]) => void;
  error: (...msg: unknown[]) => void;
  assert: (...msg: unknown[]) => void;
  trace: (...msg: unknown[]) => void;

  enabled: (enabled?: boolean) => boolean | this;
  ddeh: (ddeh?: boolean) => boolean | this;
  send: (send?: boolean) => boolean | this;

  ensureErrorHandler: () => this;
}

declare const logging: Logging;

export default logging;