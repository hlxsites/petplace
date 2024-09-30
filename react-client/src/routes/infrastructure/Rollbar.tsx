import { Provider } from "@rollbar/react";
import { ReactNode } from "react";
import { ROLLBAR_CONFIG } from "./telemetry/rollbar/rollbarConfig";

type RollbarProps = {
  children: ReactNode;
};

export const Rollbar = ({ children }: RollbarProps) => {
  return <Provider config={ROLLBAR_CONFIG}>{children}</Provider>;
};
