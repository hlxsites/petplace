import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { FC } from "react";
import { regularIcons } from "./regularIcons";
import { solidIcons } from "./solidIcons";

export const IconMap = Object.freeze({
  ...solidIcons,
  ...regularIcons,
});

export type IconKeys = keyof typeof IconMap;

export interface IconProps extends Omit<FontAwesomeIconProps, "icon"> {
  "data-testid"?: string;
  display?: IconKeys;
}

export const Icon: FC<IconProps> = ({
  "data-testid": testId,
  display = "heartR",
  ...rest
}) => (
  <FontAwesomeIcon
    data-testid={testId || `Icon-${display}`}
    icon={IconMap[display]}
    aria-hidden="false"
    {...rest}
  />
);
