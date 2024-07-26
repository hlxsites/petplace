import { classNames } from "~/util/styleUtil";
import AddIcon from "./assets/add-icon.svg";
import {
  default as AlertDiamondIcon,
  default as AlertIcon,
} from "./assets/alert-diamond-icon.svg";
import AppsIcon from "./assets/apps-icon.svg";
import BendArrowDownIcon from "./assets/bend-arrow-down.svg";
import CheckIcon from "./assets/check-icon.svg";
import ChevronDown from "./assets/chevron-down.svg";
import ChevronLeftIcon from "./assets/chevron-left-icon.svg";
import ChevronUp from "./assets/chevron-up.svg";
import CloseXMarkIcon from "./assets/close-x-mark-icon.svg";
import CpuChipIcon from "./assets/cpu-chip-icon.svg";
import DocFileIcon from "./assets/doc-file-icon.svg";
import DownloadIcon from "./assets/download-icon.svg";
import EllipseIcon from "./assets/ellipse-icon.svg";
import FileIcon from "./assets/file-icon.svg";
import InformationIcon from "./assets/information-icon.svg";
import JpgFileIcon from "./assets/jpg-file-icon.svg";
import MedicineIcon from "./assets/medicine-icon.svg";
import PawIcon from "./assets/paw-icon.svg";
import PippetIcon from "./assets/pippet-icon.svg";
import PdfFileIcon from "./assets/pdf-file-icon.svg";
import PngFileIcon from "./assets/png-file-icon.svg";
import SearchIcon from "./assets/search-icon.svg";
import ShieldGoodIcon from "./assets/shield-good-icon.svg";
import ShieldOffIcon from "./assets/shield-off-icon.svg";
import SyringeIcon from "./assets/syringe-icon.svg";
import TransferIcon from "./assets/transfer-icon.svg";
import TrashIcon from "./assets/trash-icon.svg";
import TxtFileIcon from "./assets/txt-file-icon.svg";
import WarningTriangleIcon from "./assets/warning-triangle-icon.svg";
import CloseXMarkIconRegular from "./assets/x-mark-icon-regular.svg";

const IconMap = Object.freeze({
  add: <AddIcon />,
  alert: <AlertIcon />,
  alertDiamond: <AlertDiamondIcon />,
  apps: <AppsIcon />,
  bendArrowDown: <BendArrowDownIcon />,
  check: <CheckIcon />,
  chevronDown: <ChevronDown />,
  chevronLeft: <ChevronLeftIcon />,
  chevronUp: <ChevronUp />,
  closeXMark: <CloseXMarkIcon />,
  closeXMarkRegular: <CloseXMarkIconRegular />,
  cpuChip: <CpuChipIcon />,
  docFile: <DocFileIcon />,
  download: <DownloadIcon />,
  ellipse: <EllipseIcon />,
  file: <FileIcon />,
  medicine: <MedicineIcon />,
  information: <InformationIcon />,
  jpgFile: <JpgFileIcon />,
  paw: <PawIcon />,
  pdfFile: <PdfFileIcon />,
  pippet: <PippetIcon />,
  pngFile: <PngFileIcon />,
  search: <SearchIcon />,
  shieldGood: <ShieldGoodIcon />,
  shieldOff: <ShieldOffIcon />,
  syringe: <SyringeIcon />,
  transfer: <TransferIcon />,
  trash: <TrashIcon />,
  txtFile: <TxtFileIcon />,
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
