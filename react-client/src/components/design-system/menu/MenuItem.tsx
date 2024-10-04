import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";

import { classNames } from "~/util/styleUtil";
import { Icon, IconProps } from "../icon/Icon";
import { Text } from "../text/Text";

type MenuIcon = IconProps["display"];

export type MenuItemProps = {
  icon?: MenuIcon;
  label: string;
  onClick?: () => void;
};

export const MenuItem = ({
  icon,
  label,
  onClick,
}: MenuItemProps) => {
  return (
    <RadixDropdownMenu.Item
      className={classNames(
        "flex cursor-pointer select-none items-center rounded-2xl border border-solid border-border-base-color bg-transparent px-base py-small leading-none text-neutral-600 outline-none hover:border-transparent hover:bg-orange-200 hover:text-orange-500 data-[highlighted]:border-neutral-600 hover:data-[highlighted]:border-orange-500"
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
