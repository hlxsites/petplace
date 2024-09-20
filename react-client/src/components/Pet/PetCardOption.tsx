import { ReactNode } from "react";
import { Card } from "../design-system";

type PetCardOptionProps = {
  actionButton?: ReactNode;
  iconLeft?: ReactNode;
  isDisabled?: boolean;
  text?: ReactNode;
};

export const PetCardOption = ({
  actionButton,
  iconLeft,
  isDisabled,
  text,
}: PetCardOptionProps) => {
  return (
    <Card
      role="listitem"
      backgroundColor={isDisabled ? "bg-neutral-100" : undefined}
    >
      <div className="flex justify-between p-base">
        <div className="flex items-center gap-small">
          {iconLeft}
          {text}
        </div>
        <div className="flex items-center">{actionButton}</div>
      </div>
    </Card>
  );
};
