interface Loader {
  options?: {
    modules?: {
      getLocalIdent?: unknown;
      localIdentName?: string;
    };
  };
}

export interface Rule {
  use: Loader[];
}

export default interface WebpackConfig {
  publicPath: string;
  contentBasePublicPath: string;
  historyApiFallback?: {
    index: string;
  };

  resolve: {
    alias: Record<string, string>;
  };
  module?: {
    rules: {
      oneOf?: [
        unknown,
        {options: {babelrc: boolean;};},
        unknown,
        unknown,
        Rule,
        unknown,
        Rule
      ];
    }[];
  };
}