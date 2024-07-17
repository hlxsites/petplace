import { classNames } from "~/util/styleUtil";

type TextProps = {
  ariaDescribedby?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaLive?: "assertive" | "off" | "polite";
  children: string;
  fontFamily?: "franklin" | "raleway";
  isHidden?: boolean;
  size?: "lg" | "base" | "sm" | "xs";
};

export const Text = ({
  ariaDescribedby,
  ariaLabel,
  ariaLabelledBy,
  ariaLive = "polite",
  children,
  fontFamily = "franklin",
  isHidden,
  size,
}: TextProps) => {
  const { className } = useTextBase(size, fontFamily);
  return (
    <p
      aria-describedby={ariaDescribedby}
      aria-hidden={isHidden}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-live={ariaLive}
      className={className}
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
