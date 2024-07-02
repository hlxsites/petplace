type TitleProps = {
  children: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export const Title = ({ children, level = "h1" }: TitleProps) => {
  const Comp = level;

  return (
    <Comp className="text-neutral-950 text-3xl font-bold">{children}</Comp>
  );
};
