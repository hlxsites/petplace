import { classNames } from "~/util/styleUtil";

export type TitleProps = {
  children: string;
  color?: "blue-500" | "neutral-950";
  id?: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export const Title = ({
  children,
  color = "neutral-950",
  level = "h1",
  id,
}: TitleProps) => {
  const Comp = level;
  const { className } = useTitleBase(color, level);

  return (
    <Comp className={className} id={id}>
      {children}
    </Comp>
  );
};

function useTitleBase(color: TitleProps["color"], level: TitleProps["level"]) {
  const className = classNames("font-bold", {
    "lg:text-[44px] text-[32px]/[36px]": level === "h1",
    "lg:text-[32px]/[36px] text-[24px]/[28px]": level === "h2",
    "lg:text-[24px]/[28px] text-[18px]/[20px]": level === "h3",
    "lg:text-[18px]/[20px] text-[16px]/[20px]": level === "h4",
    "lg:text-[16px]/[20px] text-[14px]/[16px]": level === "h5",
    "text-blue-500": color === "blue-500",
    "text-neutral-950": color === "neutral-950",
  });

  return { className };
}
