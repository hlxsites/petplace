import { classNames } from "~/util/styleUtil";
import { IconButton, IconKeys, Text } from "../design-system";

type CartItemQuantityManagerProps = {
  id: string;
  isAdditionalService?: boolean;
  onUpdateQuantity: (id: string, quantity: number) => void;
  purchaseLimit?: number;
  quantity: number;
};

type AddRemoveButtonVariation = "add" | "remove";

type ButtonVariables = Record<
  AddRemoveButtonVariation,
  {
    className: string;
    disabled: boolean;
    icon: IconKeys;
    label: string;
    onClick: () => void;
  }
>;

export const CartItemQuantityManager = ({
  id,
  isAdditionalService,
  onUpdateQuantity,
  purchaseLimit,
  quantity,
}: CartItemQuantityManagerProps) => {
  return (
    <div className="flex w-full justify-end">
      <div className="flex items-center">
        {renderIconButton("remove")}
        <Text fontWeight="bold" size="16">
          {quantity}
        </Text>
        {renderIconButton("add")}
      </div>
    </div>
  );

  function renderIconButton(variation: AddRemoveButtonVariation) {
    const { label, icon, className, onClick, disabled } =
      buttonVariables(variation);

    return (
      <IconButton
        variant="link"
        label={label}
        icon={icon}
        className={classNames(
          {
            "bg-white": disabled,
          },
          className
        )}
        iconProps={{ size: 16 }}
        onClick={onClick}
        disabled={disabled}
      />
    );
  }

  function buttonVariables(value: "remove" | "add") {
    const removeLimit = quantity <= 0;
    const addLimit = purchaseLimit !== undefined && quantity >= purchaseLimit;

    return (
      {
        remove: {
          className: removeLimit
            ? "text-neutral-600"
            : "text-orange-300-contrast",
          icon: "removeCircle",
          label: "Remove one",
          onClick: removeOne,
          disabled: removeLimit,
        },
        add: {
          className:
            isAdditionalService || addLimit
              ? "text-neutral-600"
              : "text-orange-300-contrast",
          icon: "addCircle",
          label: "Add one",
          onClick: addOne,
          disabled: addLimit,
        },
      } satisfies ButtonVariables
    )[value];
  }

  function addOne() {
    onUpdateQuantity(id, quantity + 1);
  }

  function removeOne() {
    onUpdateQuantity(id, quantity - 1);
  }
};
