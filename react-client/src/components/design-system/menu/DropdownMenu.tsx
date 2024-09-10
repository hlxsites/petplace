import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { ComponentProps, ReactNode } from "react";
import { MenuItem } from "./MenuItem";

type DropdownMenuProps = {
  trigger: ReactNode;
  items: Array<ComponentProps<typeof MenuItem>>;
};

export const DropdownMenu = ({ trigger, items }: DropdownMenuProps) => {
  return (
    <RadixDropdownMenu.Root modal={false}>
      <RadixDropdownMenu.Trigger asChild>{trigger}</RadixDropdownMenu.Trigger>

      <RadixDropdownMenu.Content
        className="flex min-w-[220px] flex-col gap-small rounded-2xl bg-white p-base shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
        sideOffset={5}
      >
        {items.map(MenuItem)}
        <RadixDropdownMenu.Arrow className="fill-white" />
      </RadixDropdownMenu.Content>
    </RadixDropdownMenu.Root>
  );
};
