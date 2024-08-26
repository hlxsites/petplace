import { ReactNode } from "react";
import { DisplayClasses } from "~/routes/types/styleTypes";
import { classNames } from "~/util/styleUtil";
import {
  TextCommonStyleProps,
  useTextCommonStyles,
} from "./useTextCommonStyles";

type StyleProps = TextCommonStyleProps & {
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
  isResponsive = false,
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
  const size = propValueConsideringInherit(sizeProp, "12");
  const textDecoration = propValueConsideringInherit(textDecorationProp);

  const commonClassName = useTextCommonStyles({ ...rest, color });

  const className = classNames(display, commonClassName, {
    // Family
    "font-franklin": fontFamily === "franklin",
    "font-raleway": fontFamily === "raleway",
    "font-roboto": fontFamily === "roboto",

    // Weight
    "font-normal": fontWeight === "normal",
    "font-bold": fontWeight === "bold",
    "font-semibold": fontWeight === "semibold",
    "font-medium": fontWeight === "medium",

    // Size
    "text-xs leading-4": size === "12",
    "text-sm leading-5": size === "14",
    "text-base leading-6": size === "16",
    "text-lg leading-7": size === "18",
    "text-xl leading-7": size === "20",
    "text-[24px] leading-7": size === "24",
    "text-[32px] leading-8": size === "32",
    "text-[40px] leading-10": size === "40",

    // Responsive size
    "lg:text-[18px] lg:leading-7 text-sm leading-5":
      size === "18" && isResponsive,
    "lg:text-base lg:leading-6 text-sm leading-5":
      size === "16" && isResponsive,
    "lg:text-sm lg:leading-5 text-xs leading-4": size === "14" && isResponsive,

    // Decoration
    "line-through": textDecoration === "line-through",
    "no-underline": textDecoration === "none",
    underline: textDecoration === "underline",
  });

  return { className };
}
