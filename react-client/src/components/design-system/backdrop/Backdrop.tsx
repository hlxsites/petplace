import { ReactNode } from "react";

interface BackdropProps {
  children: ReactNode;
}

const Backdrop = ({ children }: BackdropProps) => {
  return (
    <div className={"absolute left-0 top-0 flex h-screen w-full backdrop-blur-sm items-end justify-center lg:justify-end"}>
      {children}
    </div>
  );
};

export default Backdrop;
