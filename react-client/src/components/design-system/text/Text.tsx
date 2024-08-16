import { ReactNode } from "react";
import { classNames } from "~/util/styleUtil";
import {
  TextCommonStyleProps,
  useTextCommonStyles,
} from "./useTextCommonStyles";

type StyleProps = TextCommonStyleProps & {
  inherit?: boolean;
  fontFamily?: "franklin" | "raleway" | "roboto";
  fontWeight?: "normal" | "bold" | "medium";
  size?: "xxlg" | "xlg" | "lg" | "base" | "sm" | "xs";
  textDecoration?: "none" | "line-through" | "underline";
};

export type TextProps = StyleProps & {
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
  color: colorProp,
  fontFamily: fontFamilyProp,
  fontWeight: fontWeightProp,
  inherit,
  size: sizeProp,
  textDecoration: textDecorationProp,
  ...rest
}: StyleProps) {
  const propValueConsideringInherit = <T extends string>(
    prop: T | undefined,
    defaultProp?: T
  ): T | undefined => {
    // If prop is defined always use it
    if (prop) return prop;

    // If prop is not defined and inherit is true, return undefined
    if (inherit) return undefined;

    // If prop is not defined and inherit is false, return defaultProp
    return defaultProp;
  };

  const color = propValueConsideringInherit(colorProp, "black");
  const fontFamily = propValueConsideringInherit(fontFamilyProp, "franklin");
  const fontWeight = propValueConsideringInherit(fontWeightProp, "normal");
  const size = propValueConsideringInherit(sizeProp, "xs");
  const textDecoration = propValueConsideringInherit(textDecorationProp);

  const commonClassName = useTextCommonStyles({ ...rest, color });

  const className = classNames("inline-block", commonClassName, {
    "font-franklin": fontFamily === "franklin",
    "font-raleway": fontFamily === "raleway",
    "font-roboto": fontFamily === "roboto",
    "font-normal": fontWeight === "normal",
    "font-bold": fontWeight === "bold",
    "font-medium": fontWeight === "medium",
    "text-4xl leading-10": size === "xxlg",
    "text-xl leading-8": size === "xlg",
    "text-lg leading-7": size === "lg",
    "text-base leading-6": size === "base",
    "text-sm leading-5": size === "sm",
    "text-xs leading-4": size === "xs",
    "line-through": textDecoration === "line-through",
    "no-underline": textDecoration === "none",
    underline: textDecoration === "underline",
  });

  return { className };
}
