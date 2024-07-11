import { ReactNode } from "react";
import { Title } from "../text/Title";
import { IconButton } from "../button/IconButton";

interface DrawerProps {
  children: ReactNode;
  title: string;
  onClose: () => void;
}

export const Drawer = ({ children, title, onClose }: DrawerProps) => {
  return (
    <div className="w-full rounded-t-2xl bg-neutral-white p-xlarge border border-border-secondary lg:h-screen lg:w-[336px] lg:rounded-none" data-testid="drawer">
      <div className="mb-small flex items-center justify-between">
        <Title>{title}</Title>
        <IconButton icon="closeXMark" label="Close drawer" className="text-neutral-600" variant="link" onClick={onClose} />
      </div>
      {children}
    </div>
  );
};
