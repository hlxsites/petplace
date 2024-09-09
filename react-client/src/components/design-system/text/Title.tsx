import { clsx } from "clsx";
import { ReactNode } from "react";
import {
  TextCommonStyleProps,
  useTextCommonStyles,
} from "./useTextCommonStyles";

type TitleVariableProps = TextCommonStyleProps & {
  fullWidth?: boolean;
  level?: "h1" | "h2" | "h3" | "h4" | "h5";
  isResponsive?: boolean;
  size?:
    | "12"
    | "14"
    | "16"
    | "18"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44";
};

export type TitleProps = TitleVariableProps & {
  children: ReactNode;
  id?: string;
};

export const Title = ({
  children,
  id,
  isResponsive = false,
  level = "h1",
  ...rest
}: TitleProps) => {
  const Comp = level;

  const { className } = useTitleBase({ level, isResponsive, ...rest });

  return (
    <Comp className={className} id={id}>
      {children}
    </Comp>
  );
};

function useTitleBase({
  color = "neutral-950",
  level,
  fullWidth,
  isResponsive,
  size,
  ...rest
}: TitleVariableProps) {
  const commonClassNames = useTextCommonStyles({ ...rest, color });

  const levelSizes = {
    h1: "44",
    h2: "32",
    h3: "24",
    h4: "18",
    h5: "16",
  };

  // Default to h1 size if level is not provided
  const effectiveSize = size || levelSizes[level || "h1"];

  const className = clsx("font-bold m-0 leading-[1.1]", commonClassNames, {
    // Base sizes
    "text-12": effectiveSize === "12",
    "text-14": effectiveSize === "14",
    "text-16": effectiveSize === "16" && !isResponsive,
    "text-18": effectiveSize === "18",
    "text-20": effectiveSize === "20",
    "text-24": effectiveSize === "24" && !isResponsive,
    "text-28": effectiveSize === "28",
    "text-32": effectiveSize === "32" && !isResponsive,
    "text-36": effectiveSize === "36" && !isResponsive,
    "text-40": effectiveSize === "40",
    "text-44": effectiveSize === "44" && !isResponsive,

    // Responsive sizes
    "lg:text-16 text-14": effectiveSize === "16" && isResponsive,
    "lg:text-24 text-18": effectiveSize === "24" && isResponsive,
    "lg:text-32 text-24": effectiveSize === "32" && isResponsive,
    "lg:text-36 text-24": effectiveSize === "36" && isResponsive,
    "lg:text-44 text-24": effectiveSize === "44" && isResponsive,

    "w-full": fullWidth,
  });

  return { className };
}