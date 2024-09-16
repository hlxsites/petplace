import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export const LayoutBasic = ({ children }: LayoutProps) => {
  return (
    <div className="m-auto w-full py-xxlarge xl:w-[1080px]">{children}</div>
  );
};
