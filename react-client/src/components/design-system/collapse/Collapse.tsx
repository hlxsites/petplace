import * as Collapsible from "@radix-ui/react-collapsible";
import { classNames } from "~/util/styleUtil";
import { Icon } from "../icon/Icon";
import { ReactNode } from "react";

type CollapseProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  trigger: ReactNode;
};

export const Collapse = ({
  children,
  className,
  isOpen,
  trigger,
  ...rest
}: CollapseProps) => {
  return (
    <Collapsible.Root {...rest} data-testid="collapse" open={isOpen}>
      <Collapsible.Trigger
        className={classNames(
          "flex w-full justify-between bg-transparent p-0 text-black hover:bg-transparent focus:bg-transparent focus:outline-none active:bg-transparent",
          className
        )}
      >
        {trigger}{" "}
        <Icon
          display={isOpen ? "chevronUp" : "chevronDown"}
          className="text-orange-300-contrast"
        />
      </Collapsible.Trigger>
      <Collapsible.Content>{children}</Collapsible.Content>
    </Collapsible.Root>
  );
};
