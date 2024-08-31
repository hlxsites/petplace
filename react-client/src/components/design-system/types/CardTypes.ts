import type { ReactNode } from "react";
import {
  BackgroundColorClasses,
  BorderColorClasses,
} from "~/routes/types/styleTypes";

export type CardProps = {
  backgroundColor?: BackgroundColorClasses;
  border?: BorderColorClasses;
  children: ReactNode;
  padding?: "medium" | "base" | "large" | "xlarge" | "xxlarge";
  radius?: "sm" | "base";
  role?: JSX.IntrinsicElements["div"]["role"];
  shadow?: "elevation-1" | "elevation-3";
};
