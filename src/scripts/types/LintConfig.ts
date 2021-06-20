type Rules<T extends Record<string, unknown> = Record<string, unknown>> = Record<"rules", T>;

type LingConfig <
  T extends Rules<Record<string, unknown>> = Rules<Record<string, unknown>>
> = T;

export type {Rules};
export default LingConfig;