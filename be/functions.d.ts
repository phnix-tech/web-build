export interface DefaultMeta {
  time: string;
  hash: string;
  timestamp: string;
  version: string;
}

export interface Meta<T = DefaultMeta> {
  path: string | string[];
  meta: T | (() => T);
}

export interface Tar {
  /**
   * Create a tarball archive.
   *
   * @param opts Create archive options.
   * @param fileList An array of paths to add to the tarball. Adding a directory also adds its children recursively.
   * @param callback Callback function after archive created.
   * @see https://www.npmjs.com/package/tar/v/4.4.8#tarcoptions-filelist-callback-alias-tarcreate
   */
  create: (
    opts: {
      /**
       * Write the tarball archive to the specified filename.
       */
      file: string;
      /**
       * 是否开启gzip压缩
       */
      gzip?: boolean;
      /**
       * current workding directory
       */
      cwd?: string;
      /**
       * Act synchronously. Default asynchronously.
       */
      sync?: boolean;
    },
    fileList: string[],
    callback?: () => void
  ) => void;
}

/**
 * @see https://www.npmjs.com/package/portfinder
 */
export interface Portfinder {
  basePort: number;
  highestPort: number;

  getPort: (
    cb: (e: Error, port: number) => void
  ) => void;

  getPort: (
    opts: {port?: number; stopPort?: number;},
    cb: (e: Error, port: number) => void
  ) => void;

  getPortPromise: (opts: {port?: number; stopPort?: number;}) => Promise<number>;
}

export interface Functions {
  rmdir: (dir: string) => void;
  mkdirp: (dir: string) => void;
  tar: Tar;
  /**
   * create front-end build meta json object
   *
   * @param path - meta file path(s)
   * or option object, path: {string|array<string>}, meta: {object|function}
   * @returns meta object
   */
  createMeta: <T = DefaultMeta>(path: string | string[] | Meta<T>) => T;
  portfinder: () => Portfinder;
}

declare const functions: Functions;

export default functions;