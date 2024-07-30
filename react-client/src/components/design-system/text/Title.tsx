import { classNames } from "~/util/styleUtil";

type TitleVariableProps = {
  align?: "center" | "left" | "right" | "justify";
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  fullWidth?: boolean;
};

type TitleProps = TitleVariableProps & {
  children: string;
  id?: string;
};

export const Title = ({
  children,
  id,
  level = "h1",
  ...rest
}: TitleProps) => {
  const Comp = level;
  const { className } = useTitleBase({ level, ...rest });

  return (
    <Comp className={className} id={id}>
      {children}
    </Comp>
  );
};

function useTitleBase({ level, align, fullWidth }: TitleVariableProps) {
  const className = classNames("font-bold text-neutral-950", {
    "lg:text-[44px] text-[32px]/[36px]": level === "h1",
    "lg:text-[32px]/[36px] text-[24px]/[28px]": level === "h2",
    "lg:text-[24px]/[28px] text-[18px]/[20px]": level === "h3",
    "lg:text-[18px]/[20px] text-[16px]/[20px]": level === "h4",
    "lg:text-[16px]/[20px] text-[14px]/[16px]": level === "h5",
    "text-left": align === "left",
    "text-center": align === "center",
    "text-right": align === "right",
    "text-justify": align === "justify",
    "w-full": fullWidth,
  });

  return { className };
}
