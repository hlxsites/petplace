import { classNames } from "~/util/styleUtil";
import { Card, IconButton, IconKeys, Text } from "../design-system";
import { CartItem } from "./utils/cartTypes";

export const CartItemCard = ({
  acquisitionMessage,
  description,
  id,
  name,
  price,
  purchaseLimit,
  quantity,
  recurrence,
  type,
  updateQuantity,
}: CartItem & { updateQuantity: (id: string, value: number) => void }) => {
  const isService = type === "service";

  return (
    <Card>
      <div className="flex flex-col gap-base p-base">
        <div className="flex justify-between">
          <div>
            <Text size="base" fontWeight="bold" display="block">
              {name}
            </Text>
            <Text color="background-color-tertiary">{description}</Text>
          </div>
          <div>
            <Text size="base" fontWeight="bold">
              {price}
            </Text>
          </div>
        </div>

        {isService && (
          <div className="flex justify-between">
            <Text color="background-color-tertiary">{recurrence}</Text>
            <Text fontWeight="bold" color="orange-300-contrast">
              {acquisitionMessage}
            </Text>
          </div>
        )}
        {!isService && (
          <div className="flex w-full justify-end">
            <div className="flex items-center">
              {renderIconButton("remove")}
              <Text fontWeight="bold" size="base">
                {quantity}
              </Text>
              {renderIconButton("add")}
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  function renderIconButton(variation: "remove" | "add") {
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
        iconProps={{ size: 16}}
        onClick={onClick}
        disabled={disabled}
      />
    );
  }

  function buttonVariables(value: "remove" | "add") {
    type ButtonVariables = Record<
      typeof value,
      {
        className: string;
        disabled: boolean;
        icon: IconKeys;
        label: string;
        onClick: () => void;
      }
    >;

    const removeLimit = quantity < 2;
    const addLimit = quantity === purchaseLimit;

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
          className: addLimit ? "text-neutral-600" : "text-orange-300-contrast",
          icon: "addCircle",
          label: "Add one",
          onClick: addOne,
          disabled: addLimit,
        },
      } satisfies ButtonVariables
    )[value];
  }

  function addOne() {
    updateQuantity(id, quantity + 1);
  }

  function removeOne() {
    updateQuantity(id, quantity - 1);
  }
};
