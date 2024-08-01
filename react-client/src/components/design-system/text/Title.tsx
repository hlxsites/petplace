import { classNames } from "~/util/styleUtil";
import {
  TextCommonStyleProps,
  useTextCommonStyles,
} from "./useTextCommonStyles";

type TitleVariableProps = TextCommonStyleProps & {
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  fullWidth?: boolean;
};

type TitleProps = TitleVariableProps & {
  children: string;
  id?: string;
};

export const Title = ({ children, id, level = "h1", ...rest }: TitleProps) => {
  const Comp = level;
  const { className } = useTitleBase({ level, ...rest });

  return (
    <Comp className={className} id={id}>
      {children}
    </Comp>
  );
};

function useTitleBase({ level, fullWidth, ...rest }: TitleVariableProps) {
  const commonClassName = useTextCommonStyles(rest);

  const className = classNames("font-bold text-neutral-950", commonClassName, {
    "lg:text-[44px] text-[32px]/[36px]": level === "h1",
    "lg:text-[32px]/[36px] text-[24px]/[28px]": level === "h2",
    "lg:text-[24px]/[28px] text-[18px]/[20px]": level === "h3",
    "lg:text-[18px]/[20px] text-[16px]/[20px]": level === "h4",
    "lg:text-[16px]/[20px] text-[14px]/[16px]": level === "h5",
    "w-full": fullWidth,
  });

  return { className };
}
