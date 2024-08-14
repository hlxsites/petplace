import { ReactNode } from "react";
import { classNames } from "~/util/styleUtil";
import {
  TextCommonStyleProps,
  useTextCommonStyles,
} from "./useTextCommonStyles";
import { DisplayClasses } from "~/routes/types/styleTypes";

type StyleProps = TextCommonStyleProps & {
  fontFamily?: "franklin" | "raleway" | "roboto";
  fontWeight?: "normal" | "bold" | "semibold" | "medium";
  size?: "xlg" | "lg" | "base" | "sm" | "xs";
  display?: DisplayClasses;
  inherit?: boolean;
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
  display = "inline-block",
  fontFamily: fontFamilyProp,
  fontWeight: fontWeightProp,
  inherit,
  size: sizeProp,
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

  const commonClassName = useTextCommonStyles({ ...rest, color });

  const className = classNames(display, commonClassName, {
    "font-franklin": fontFamily === "franklin",
    "font-raleway": fontFamily === "raleway",
    "font-roboto": fontFamily === "roboto",
    "font-normal": fontWeight === "normal",
    "font-bold": fontWeight === "bold",
    "font-semibold": fontWeight === "semibold",
    "font-medium": fontWeight === "medium",
    "text-xl leading-8": size === "xlg",
    "text-lg leading-7": size === "lg",
    "text-base leading-6": size === "base",
    "text-sm leading-5": size === "sm",
    "text-xs leading-4": size === "xs",
  });

  return { className };
}
