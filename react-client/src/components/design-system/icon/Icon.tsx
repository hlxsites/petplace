import { classNames } from "~/util/styleUtil";
import AddIcon from "./assets/add-icon.svg";
import CheckIcon from "./assets/check-icon.svg";
import ChevronLeftIcon from "./assets/chevron-left-icon.svg";
import ShieldGoodIcon from "./assets/shield-good-icon.svg";
import ShieldOffIcon from "./assets/shield-off-icon.svg";
import WarningTriangleIcon from "./assets/warning-triangle-icon.svg";

const IconMap = Object.freeze({
  add: <AddIcon />,
  check: <CheckIcon />,
  chevronLeft: <ChevronLeftIcon />,
  shieldGood: <ShieldGoodIcon />,
  shieldOff: <ShieldOffIcon />,
  warningTriangle: <WarningTriangleIcon />,
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
