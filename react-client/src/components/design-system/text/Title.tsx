import { classNames } from "~/util/styleUtil";

type TitleProps = {
  children: string;
  className?: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export const Title = ({ children, level = "h1", className }: TitleProps) => {
  const Comp = level;

  return (
    <Comp
      className={classNames("text-3xl font-bold text-neutral-950", className)}
    >
      {children}
    </Comp>
  );
};
