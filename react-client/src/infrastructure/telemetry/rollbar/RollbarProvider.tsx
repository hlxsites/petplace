import { Provider } from "@rollbar/react";
import { ReactNode } from "react";
import { CREATE_ROLLBAR_CONFIG } from "./rollbarConfig";

type RollbarProps = {
  children: ReactNode;
};

export const RollbarProvider = ({ children }: RollbarProps) => {
  const config = CREATE_ROLLBAR_CONFIG();
  return <Provider config={config}>{children}</Provider>;
};
