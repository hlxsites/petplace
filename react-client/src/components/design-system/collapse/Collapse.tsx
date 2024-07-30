import * as Collapsible from "@radix-ui/react-collapsible";
import { useSpring, animated } from "react-spring";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { classNames } from "~/util/styleUtil";
import { Icon } from "../icon/Icon";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, children]);

  const style = useSpring({
    height: isOpen ? contentHeight : 0,
    overflow: 'hidden'
  });

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
      <Collapsible.Content>
        <animated.div style={style} ref={contentRef}>{children}</animated.div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
