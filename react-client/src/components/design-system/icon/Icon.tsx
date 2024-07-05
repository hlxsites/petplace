import { classNames } from "~/util/styleUtil";
import AddIcon from "./assets/add-icon.svg";
import AlertIcon from "./assets/alert-icon.svg";
import CheckIcon from "./assets/check-icon.svg";
import InformationIcon from "./assets/information-icon.svg";
import SearchIcon from "./assets/search-icon.svg";
import ShieldGoodIcon from "./assets/shield-good-icon.svg";
import ShieldOffIcon from "./assets/shield-off-icon.svg";
import WarningTriangleIcon from "./assets/warning-triangle-icon.svg";

const IconMap = Object.freeze({
  add: <AddIcon />,
  alert: <AlertIcon />,
  check: <CheckIcon />,
  search: <SearchIcon />,
  information: <InformationIcon />,
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
