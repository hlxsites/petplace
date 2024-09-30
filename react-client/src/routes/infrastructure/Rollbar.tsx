import { ReactNode } from "react";
import { Provider } from "@rollbar/react";

type RollbarProps = {
  children: ReactNode;
};

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        code_version: "1.0.0",
        source_map_enabled: true,
      },
    },
  },
};

export const Rollbar = ({ children }: RollbarProps) => {
  return <Provider config={rollbarConfig}>{children}</Provider>;
};
