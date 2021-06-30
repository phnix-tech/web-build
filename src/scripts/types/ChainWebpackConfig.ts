type Args<T = unknown> = T[];

interface Plugin {
  tap: <T extends unknown[] = unknown[]>(fn: (args: T) => T) => void;
}

export default interface ChainWebpackConfig {
  plugin: (name: string) => Plugin | undefined;
}

export type {Args};