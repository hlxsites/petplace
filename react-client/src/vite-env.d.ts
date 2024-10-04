declare module "*.svg" {
  import * as React from "react";

  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<"svg"> & { title?: string }
  >;

  export default ReactComponent;
}

/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly VITE_APP_VERSION: string;
  readonly VITE_AUTH_TOKEN: string;
  readonly VITE_PETPLACE_SERVER_STG_URL: string;
  readonly VITE_PETPLACE_SERVER_PROD_URL: string;
  readonly VITE_ENABLE_MOCK: string;
  readonly VITE_R_A_T: string;
  readonly VITE_R_A_T2: string;
  readonly VITE_R_A_T3: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
