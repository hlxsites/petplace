import { classNames } from "~/util/styleUtil";
import AddIcon from "./assets/add-icon.svg";
import AppsIcon from "./assets/apps-icon.svg";
import CheckIcon from "./assets/check-icon.svg";
import ChevronLeftIcon from "./assets/chevron-left-icon.svg";
import CloseXMarkIcon from "./assets/close-x-mark-icon.svg";
import ShieldGoodIcon from "./assets/shield-good-icon.svg";
import ShieldOffIcon from "./assets/shield-off-icon.svg";
import WarningTriangleIcon from "./assets/warning-triangle-icon.svg";

const IconMap = Object.freeze({
  add: <AddIcon />,
  apps: <AppsIcon />,
  check: <CheckIcon />,
  chevronLeft: <ChevronLeftIcon />,
  closeXMark: <CloseXMarkIcon />,
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
      className={classNames("icon w-[16px] lg:w-[24px]", className)}
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
