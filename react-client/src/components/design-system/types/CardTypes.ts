import type { ReactNode } from "react";

type BackgroundColor = `bg-${string}`;
type BorderColor = `border-${string}`;

export type CardProps = {
  backgroundColor?: BackgroundColor;
  border?: BorderColor;
  children: ReactNode;
  padding?: "base" | "large" | "xlarge" | "xxlarge";
  radius?: "sm" | "base";
  role?: JSX.IntrinsicElements["div"]["role"];
  shadow?: "elevation-1" | "elevation-3";
};
