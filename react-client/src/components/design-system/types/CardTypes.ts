import type { ReactNode } from "react";

export type CardProps = {
  backgroundColor?: string;
  border?: string;
  children: ReactNode;
  radius?: "sm" | "base";
  role?: JSX.IntrinsicElements["div"]["role"];
  shadow?: "elevation-1" | "elevation-3";
};
