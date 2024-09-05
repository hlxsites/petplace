import { DisplayClasses } from "~/routes/types/styleTypes";
import { TextCommonStyleProps } from "../text/useTextCommonStyles";
import { ReactNode } from "react";

export type StyleProps = TextCommonStyleProps & {
  display?: DisplayClasses;
  inherit?: boolean;
  fontFamily?: "franklin" | "raleway" | "roboto";
  fontWeight?: "normal" | "bold" | "semibold" | "medium";
  isResponsive?: boolean;
  size?: "12" | "14" | "16" | "18" | "20" | "24" | "32" | "40";
  textDecoration?: "none" | "line-through" | "underline";
};

export type TextProps = StyleProps & {
  ariaHidden?: boolean;
  ariaLabel?: string;
  children: ReactNode;
  element?: "p" | "span";
  id?: string;
};
