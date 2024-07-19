import { ReactNode } from "react";
import { classNames } from "~/util/styleUtil";

type StyleProps = {
  fontFamily?: "franklin" | "raleway" | "roboto";
  size?: "lg" | "base" | "sm" | "xs";
  srOnly?: boolean;
};

type TextProps = StyleProps & {
  ariaHidden?: boolean;
  ariaLabel?: string;
  children: ReactNode;
  id?: string;
};

export const Text = ({
  ariaHidden,
  ariaLabel,
  children,
  id,
  ...styleProps
}: TextProps) => {
  const { className } = useTextBase(styleProps);
  return (
    <p
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      className={className}
      id={id}
    >
      {children}
    </p>
  );
};

function useTextBase({ fontFamily = "franklin", size, srOnly }: StyleProps) {
  const className = classNames(
    `font-${fontFamily} font-normal text-xs leading-4 inline-block`,
    {
      "text-lg leading-7": size === "lg",
      "text-base leading-6": size === "base",
      "text-sm leading-5": size === "sm",
      "sr-only": srOnly,
    }
  );

  return { className };
}
