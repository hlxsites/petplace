import { Provider } from "@rollbar/react";
import { ReactNode } from "react";
import { ROLLBAR_CONFIG } from "./rollbarConfig";

type RollbarProps = {
  children: ReactNode;
};

export const RollbarProvider = ({ children }: RollbarProps) => {
  return <Provider config={ROLLBAR_CONFIG}>{children}</Provider>;
};
