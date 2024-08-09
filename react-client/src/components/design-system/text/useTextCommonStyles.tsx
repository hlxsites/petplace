import { classNames } from "~/util/styleUtil";

export type TextCommonStyleProps = {
  color?: `text-${string}`;
  align?: "center" | "left" | "right" | "justify";
  srOnly?: boolean;
};

export function useTextCommonStyles({ align, color, srOnly }: TextCommonStyleProps) {
  return classNames(color, {
    "text-left": align === "left",
    "text-center": align === "center",
    "text-right": align === "right",
    "text-justify": align === "justify",
    "sr-only": srOnly,
  });
}
