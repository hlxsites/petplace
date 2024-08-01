import { classNames } from "~/util/styleUtil";

export type TextCommonStyleProps = {
  align?: "center" | "left" | "right" | "justify";
  srOnly?: boolean;
};

export function useTextCommonStyles({ align, srOnly }: TextCommonStyleProps) {
  return classNames({
    "text-left": align === "left",
    "text-center": align === "center",
    "text-right": align === "right",
    "text-justify": align === "justify",
    "sr-only": srOnly,
  });
}
