import { ReactNode } from "react";
import { classNames } from "~/util/styleUtil";

type StyleProps = {
  fontFamily?: "franklin" | "raleway" | "roboto";
  size?: "lg" | "base" | "sm" | "xs" | "inherit";
  srOnly?: boolean;
  fontWeight?: "normal" | "bold";
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
  fontFamily = "franklin",
  fontWeight = "normal",
  size = "xs",
  srOnly,
}: StyleProps) {
  const className = classNames("inline-block", {
    "font-franklin": fontFamily === "franklin",
    "font-raleway": fontFamily === "raleway",
    "font-roboto": fontFamily === "roboto",
    "font-normal": fontWeight === "normal",
    "font-bold": fontWeight === "bold",
    "text-xl leading-7": size === "lg",
    "text-base leading-6": size === "base",
    "text-sm leading-5": size === "sm",
    "text-xs leading-4": size === "xs",
    "sr-only": srOnly,
  });

  return { className };
}
