import { ThemeColors } from "~/routes/types/styleTypes";
import { classNames } from "~/util/styleUtil";

export type TextCommonStyleProps = {
  align?: "center" | "left" | "right" | "justify";
  color?: ThemeColors;
  srOnly?: boolean;
};

export function useTextCommonStyles({
  align,
  color,
  srOnly,
}: TextCommonStyleProps) {
  return classNames({
    [`text-${color}`]: !!color,
    "text-left": align === "left",
    "text-center": align === "center",
    "text-right": align === "right",
    "text-justify": align === "justify",
    "sr-only": srOnly,
  });
}
