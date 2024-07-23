import { classNames } from "~/util/styleUtil";
import AddIcon from "./assets/add-icon.svg";
import AlertIcon from "./assets/alert-icon.svg";
import AlertDiamondIcon from "./assets/alert-diamond-icon.svg";
import AppsIcon from "./assets/apps-icon.svg";
import BendArrowDownIcon from "./assets/bend-arrow-down.svg";
import CheckIcon from "./assets/check-icon.svg";
import ChevronLeftIcon from "./assets/chevron-left-icon.svg";
import InformationIcon from "./assets/information-icon.svg";
import SearchIcon from "./assets/search-icon.svg";
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
  alertDiamond: <AlertDiamondIcon />,
  apps: <AppsIcon />,
  bendArrowDown: <BendArrowDownIcon />,
  check: <CheckIcon />,
  chevronLeft: <ChevronLeftIcon />,
  closeXMark: <CloseXMarkIcon />,
  cpuChip: <CpuChipIcon />,
  ellipse: <EllipseIcon />,
  information: <InformationIcon />,
  paw: <PawIcon />,
  search: <SearchIcon />,
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
