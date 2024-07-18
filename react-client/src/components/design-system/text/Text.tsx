import { classNames } from "~/util/styleUtil";

type TextProps = {
  ariaLabel?: string;
  children: string;
  fontFamily?: "franklin" | "raleway" | "roboto";
  id?: string;
  isHidden?: boolean;
  size?: "lg" | "base" | "sm" | "xs";
};

export const Text = ({
  ariaLabel,
  children,
  fontFamily = "franklin",
  isHidden,
  size,
  ...rest
}: TextProps) => {
  const { className } = useTextBase(size, fontFamily);
  return (
    <p
      aria-hidden={isHidden}
      aria-label={ariaLabel}
      className={className}
      {...rest}
    >
      {children}
    </p>
  );
};

function useTextBase(
  size: TextProps["size"],
  fontFamily: TextProps["fontFamily"]
) {
  const className = classNames(
    `font-${fontFamily} font-normal text-lg leading-7 inline-block`,
    {
      "text-base leading-6": size === "base",
      "text-sm leading-5": size === "sm",
      "text-xs leading-4": size === "xs",
    }
  );

  return { className };
}
