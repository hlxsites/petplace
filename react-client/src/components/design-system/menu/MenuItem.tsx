import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";

import { classNames } from "~/util/styleUtil";
import { Icon, IconProps } from "../icon/Icon";
import { Text } from "../text/Text";

type MenuIcon = IconProps["display"];

export type MenuItemProps = {
  icon?: MenuIcon;
  label: string;
  onClick?: () => void;
  variant?: "default" | "highlight";
};

export const MenuItem = ({
  icon,
  label,
  onClick,
  variant = "default",
}: MenuItemProps) => {
  return (
    <RadixDropdownMenu.Item
      className={classNames(
        "flex cursor-pointer select-none items-center rounded-2xl border border-solid px-base py-small leading-none outline-none",
        {
          "border-border-base-color bg-transparent text-neutral-600 data-[highlighted]:border-neutral-600":
            variant === "default",
          "border-transparent bg-orange-200 text-orange-500 data-[highlighted]:border-orange-500":
            variant === "highlight",
        }
      )}
      key={label}
      onClick={onClick}
    >
      {icon && renderIcon({ display: icon, className: "mr-small" })}
      <Text inherit size="16">
        {label}
      </Text>
    </RadixDropdownMenu.Item>
  );

  function renderIcon(props: IconProps) {
    return (
      <Icon size={16} {...props} className={classNames(props.className)} />
    );
  }
};
