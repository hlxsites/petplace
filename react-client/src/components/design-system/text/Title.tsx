type TitleProps = {
  children: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export const Title = ({ children, level = "h1" }: TitleProps) => {
  const Comp = level;

  return (
    <Comp className="lg:text-3xl text-xl font-bold text-neutral-950">
      {children}
    </Comp>
  );
};
