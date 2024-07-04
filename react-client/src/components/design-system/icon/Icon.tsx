import { classNames } from "~/util/styleUtil";
import CheckIcon from "./assets/check-icon.svg";
import ShieldGood from "./assets/shield-good-icon.svg";
import ShieldOff from "./assets/shield-off-icon.svg";

const IconMap = Object.freeze({
  check: <CheckIcon />,
  shieldGood: <ShieldGood />,
  shieldOff: <ShieldOff />,
});

export type IconKeys = keyof typeof IconMap;

export type IconProps = {
  className?: string;
  display: IconKeys;
  size?: number;
};

export const Icon = ({ className, display, size, ...rest }: IconProps) => {
  return (
    <div
      className={classNames("icon", className)}
      {...rest}
      style={{
        height: size,
        width: size,
      }}
    >
      {IconMap[display]}
    </div>
  );
};
