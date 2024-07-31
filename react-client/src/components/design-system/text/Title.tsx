import { classNames } from "~/util/styleUtil";

export type TitleProps = {
  children: string;
  id?: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export const Title = ({ children, level = "h1", id }: TitleProps) => {
  const Comp = level;
  const { className } = useTitleBase(level);

  return (
    <Comp className={className} id={id}>
      {children}
    </Comp>
  );
};

function useTitleBase(level: TitleProps["level"]) {
  const className = classNames("font-bold text-neutral-950", {
    "lg:text-[44px] text-[32px]/[36px]": level === "h1",
    "lg:text-[32px]/[36px] text-[24px]/[28px]": level === "h2",
    "lg:text-[24px]/[28px] text-[18px]/[20px]": level === "h3",
    "lg:text-[18px]/[20px] text-[16px]/[20px]": level === "h4",
    "lg:text-[16px]/[20px] text-[14px]/[16px]": level === "h5",
  });

  return { className };
}
