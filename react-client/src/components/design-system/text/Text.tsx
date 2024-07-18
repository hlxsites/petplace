import { classNames } from "~/util/styleUtil";

type StyleProps = {
  fontFamily?: "franklin" | "raleway" | "roboto";
  size?: "lg" | "base" | "sm" | "xs";
  srOnly?: boolean;
};

type TextProps = StyleProps & {
  ariaHidden?: boolean;
  ariaLabel?: string;
  children: string;
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
    `font-${fontFamily} font-normal text-lg leading-7 inline-block`,
    {
      "text-base leading-6": size === "base",
      "text-sm leading-5": size === "sm",
      "text-xs leading-4": size === "xs",
      "sr-only": srOnly,
    }
  );

  return { className };
}
