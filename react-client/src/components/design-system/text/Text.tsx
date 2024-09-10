import clsx from "clsx";
import { StyleProps, TextProps } from "../types/TextTypes";
import { useTextCommonStyles } from "./useTextCommonStyles";

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

  const commonClassName = useTextCommonStyles({ color, ...rest });

  const className = clsx(display, commonClassName, {
    // Family
    "font-franklin": fontFamily === "franklin",
    "font-raleway": fontFamily === "raleway",
    "font-roboto": fontFamily === "roboto",

    // Weight
    "font-normal": fontWeight === "normal",
    "font-bold": fontWeight === "bold",
    "font-semibold": fontWeight === "semibold",
    "font-medium": fontWeight === "medium",

    "text-12 leading-4": size === "12",
    "text-14 leading-5": size === "14" && !isResponsive,
    "text-16 leading-6": size === "16" && !isResponsive,
    "text-18 leading-7": size === "18" && !isResponsive,
    "text-20 leading-7": size === "20",
    "text-24 leading-7": size === "24",
    "text-32 leading-8": size === "32",
    "text-40 leading-10": size === "40",

    // Responsive size
    "lg:text-18 lg:leading-7 text-14 leading-5": size === "18" && isResponsive,
    "lg:text-16 lg:leading-6 text-14 leading-5": size === "16" && isResponsive,
    "lg:text-14 lg:leading-5 text-12 leading-4": size === "14" && isResponsive,

    // Decoration
    "line-through": textDecoration === "line-through",
    "no-underline": textDecoration === "none",
    underline: textDecoration === "underline",
  });

  return { className };
}