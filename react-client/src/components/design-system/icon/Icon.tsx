import { classNames } from "~/util/styleUtil";
import AddIcon from "./assets/add-icon.svg";
import AlertIcon from "./assets/alert-diamond-icon.svg";
import AppsIcon from "./assets/apps-icon.svg";
import BendArrowDownIcon from "./assets/bend-arrow-down.svg";
import CheckIcon from "./assets/check-icon.svg";
import ChevronDown from "./assets/chevron-down.svg";
import ChevronLeftIcon from "./assets/chevron-left-icon.svg";
import ChevronUp from "./assets/chevron-up.svg";
import CloseXMarkIcon from "./assets/close-x-mark-icon.svg";
import CpuChipIcon from "./assets/cpu-chip-icon.svg";
import EllipseIcon from "./assets/ellipse-icon.svg";
import PawIcon from "./assets/paw-icon.svg";
import ShieldGoodIcon from "./assets/shield-good-icon.svg";
import ShieldOffIcon from "./assets/shield-off-icon.svg";
import TransferIcon from "./assets/transfer-icon.svg";
import WarningTriangleIcon from "./assets/warning-triangle-icon.svg";

const IconMap = Object.freeze({
  add: <AddIcon />,
  alert: <AlertIcon />,
  apps: <AppsIcon />,
  bendArrowDown: <BendArrowDownIcon />,
  check: <CheckIcon />,
  chevronDown: <ChevronDown />,
  chevronLeft: <ChevronLeftIcon />,
  chevronUp: <ChevronUp />,
  closeXMark: <CloseXMarkIcon />,
  cpuChip: <CpuChipIcon />,
  ellipse: <EllipseIcon />,
  paw: <PawIcon />,
  shieldGood: <ShieldGoodIcon />,
  shieldOff: <ShieldOffIcon />,
  transfer: <TransferIcon />,
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
      className={classNames("icon w-base lg:w-large", className)}
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
