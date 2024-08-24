import * as Collapsible from "@radix-ui/react-collapsible";
import { type ReactNode } from "react";
import { animated, useSpring } from "react-spring";

import { useMeasure } from "~/hooks/useMeasure";
import { classNames } from "~/util/styleUtil";
import { Card } from "../card/Card";
import { Icon } from "../icon/Icon";

type CollapseProps = {
  children: ReactNode;
  disabled?: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: ReactNode;
  isLocked?: boolean;
};

export const Collapse = ({
  children,
  isOpen,
  isLocked,
  title,
  ...rest
}: CollapseProps) => {
  const [measureRef, { height }] = useMeasure<HTMLDivElement>();

  const style = useSpring({
    config: { duration: 300 },
    from: { height: 0, opacity: 0 },
    to: {
      height: isOpen ? height : 0,
      opacity: isOpen ? 1 : 0,
    },
    overflow: "hidden",
  });

  return (
    <Card padding="base">
      <Collapsible.Root {...rest} data-testid="collapse" open={isOpen}>
        {isLocked ? (
          <div>{title}</div>
        ) : (
          <Collapsible.Trigger
            className={classNames(
              "flex w-full justify-between rounded-none bg-transparent p-0 text-black hover:bg-transparent focus:bg-transparent focus:outline-none active:bg-transparent"
            )}
          >
            {title}
            <Icon
              display="chevronDown"
              className={classNames(
                "transition-300 text-orange-300-contrast transition-all",
                {
                  "rotate-180 transform": isOpen,
                }
              )}
            />
          </Collapsible.Trigger>
        )}
        <Collapsible.Content forceMount>
          <animated.div data-testid="CollapseContentWrapper" style={style}>
            <div ref={measureRef}>{children}</div>
          </animated.div>
        </Collapsible.Content>
      </Collapsible.Root>
    </Card>
  );
};
