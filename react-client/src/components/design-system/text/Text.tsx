import { ReactNode } from "react";
import { classNames } from "~/util/styleUtil";
import {
  TextCommonStyleProps,
  useTextCommonStyles,
} from "./useTextCommonStyles";

type StyleProps = TextCommonStyleProps & {
  fontFamily?: "franklin" | "raleway" | "roboto";
  fontWeight?: "normal" | "bold";
  size?: "xlg" | "lg" | "base" | "sm" | "xs" | "inherit";
};

type TextProps = StyleProps & {
  ariaHidden?: boolean;
  ariaLabel?: string;
  children: ReactNode;
  element?: "p" | "span";
  id?: string;
};

export const Text = ({
  ariaHidden,
  ariaLabel,
  children,
  element = "p",
  id,
  ...styleProps
}: TextProps) => {
  const { className } = useTextBase(styleProps);

  const Comp = element;

  return (
    <Comp
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      className={className}
      id={id}
    >
      {children}
    </Comp>
  );
};

function useTextBase({
  color = "text-black",
  fontFamily = "franklin",
  fontWeight = "normal",
  size = "xs",
  ...rest
}: StyleProps) {
  const commonClassName = useTextCommonStyles({color, ...rest});

  const className = classNames("inline-block", commonClassName, {
    "font-franklin": fontFamily === "franklin",
    "font-raleway": fontFamily === "raleway",
    "font-roboto": fontFamily === "roboto",
    "font-normal": fontWeight === "normal",
    "font-bold": fontWeight === "bold",
    "text-xl leading-8": size === "xlg",
    "text-lg leading-7": size === "lg",
    "text-base leading-6": size === "base",
    "text-sm leading-5": size === "sm",
    "text-xs leading-4": size === "xs",
  });

  return { className };
}
