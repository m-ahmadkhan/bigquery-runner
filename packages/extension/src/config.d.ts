// DO NOT EDIT
// This file is generated from gen-src/config.d.ts.ejs.

export type Config = {
  readonly keyFilename: string | undefined;
  readonly projectId: string | undefined;
  readonly location: string | undefined;
  readonly useLegacySql: boolean;
  readonly maximumBytesBilled: string | undefined;
  readonly validation: {
    readonly enabled: boolean;
    readonly debounceInterval: number;
  };
  readonly languageIds: Array<string>;
  readonly extensions: Array<string>;
  readonly pagination: {
    readonly results: number | undefined;
  };
  readonly csv: {
    readonly header: boolean;
    readonly delimiter: string;
  };
  readonly viewer: {
    readonly column: string | number;
  };
  readonly icon: boolean;
  readonly statusBarItem: {
    readonly align: "left" | "right" | undefined;
    readonly priority: number | undefined;
  };
};
