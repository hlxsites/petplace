import { classNames } from "~/util/styleUtil";
import AddIcon from "./assets/add-icon.svg";
import AddCircleIcon from "./assets/add-circle-icon.svg";
import AlertDiamondIcon from "./assets/alert-diamond-icon.svg";
import AlertIcon from "./assets/alert-icon.svg";
import AppsIcon from "./assets/apps-icon.svg";
import BellIcon from "./assets/bell-icon.svg";
import BendArrowDownIcon from "./assets/bend-arrow-down-icon.svg";
import CheckCircleIcon from "./assets/check-circle-icon.svg";
import CheckIcon from "./assets/check-icon.svg";
import CheckSoloIcon from "./assets/check-solo-icon.svg";
import ChevronDownIcon from "./assets/chevron-down-icon.svg";
import ChevronLeftIcon from "./assets/chevron-left-icon.svg";
import ChevronRightIcon from "./assets/chevron-right-icon.svg";
import ChevronUpIcon from "./assets/chevron-up-icon.svg";
import ClearCircleIcon from "./assets/clear-circle-icon.svg";
import CloseXMarkIcon from "./assets/close-x-mark-icon.svg";
import CloseXMarkRegularIcon from "./assets/close-x-mark-regular-icon.svg";
import CopyRegularIcon from "./assets/copy-regular-icon.svg";
import CpuChipIcon from "./assets/cpu-chip-icon.svg";
import DocFileIcon from "./assets/doc-file-icon.svg";
import DoubleArrowLeftIcon from "./assets/double-arrow-left-icon.svg";
import DoubleArrowRightIcon from "./assets/double-arrow-right-icon.svg";
import DownloadIcon from "./assets/download-icon.svg";
import EditIcon from "./assets/edit-icon.svg";
import EllipseIcon from "./assets/ellipse-icon.svg";
import EllipseWithStrokeIcon from "./assets/ellipse-with-stroke-icon.svg";
import EmptyEllipseIcon from "./assets/empty-ellipse-icon.svg";
import EyeIcon from "./assets/eye-icon.svg";
import ForwardedCallIcon from "./assets/forwarded-call-icon.svg";
import FileIcon from "./assets/file-icon.svg";
import InfoIcon from "./assets/info-icon.svg";
import InformationIcon from "./assets/information-icon.svg";
import JpgFileIcon from "./assets/jpg-file-icon.svg";
import MedicineIcon from "./assets/medicine-icon.svg";
import OutlinedArrowBottom from "./assets/outlined-arrow-bottom-icon.svg";
import OutlinedArrowRight from "./assets/outlined-arrow-right-icon.svg";
import PawIcon from "./assets/paw-icon.svg";
import PaymentCardIcon from "./assets/payment-card-icon.svg";
import PdfFileIcon from "./assets/pdf-file-icon.svg";
import PhoneIcon from "./assets/phone-icon.svg";
import PippetIcon from "./assets/pippet-icon.svg";
import PngFileIcon from "./assets/png-file-icon.svg";
import RemoveCircleIcon from "./assets/remove-circle-icon.svg";
import SearchIcon from "./assets/search-icon.svg";
import ShieldGoodIcon from "./assets/shield-good-icon.svg";
import ShieldOffIcon from "./assets/shield-off-icon.svg";
import ShoppingCartIcon from "./assets/shopping-cart-icon.svg";
import StethoscopeIcon from "./assets/stethoscope-icon.svg";
import SyringeIcon from "./assets/syringe-icon.svg";
import TransferIcon from "./assets/transfer-icon.svg";
import TrashIcon from "./assets/trash-icon.svg";
import TxtFileIcon from "./assets/txt-file-icon.svg";
import UploadCloudIcon from "./assets/upload-cloud-icon.svg";
import UserIcon from "./assets/user-icon.svg";
import WarningIcon from "./assets/warning-icon.svg";
import WarningTriangleIcon from "./assets/warning-triangle-icon.svg";

export const IconMap = Object.freeze({
  add: <AddIcon />,
  addCircle: <AddCircleIcon />,
  alert: <AlertIcon />,
  alertDiamond: <AlertDiamondIcon />,
  apps: <AppsIcon />,
  bell: <BellIcon />,
  bendArrowDown: <BendArrowDownIcon />,
  check: <CheckIcon />,
  checkCircle: <CheckCircleIcon />,
  checkSolo: <CheckSoloIcon />,
  chevronDown: <ChevronDownIcon />,
  chevronLeft: <ChevronLeftIcon />,
  chevronRight: <ChevronRightIcon />,
  chevronUp: <ChevronUpIcon />,
  clearCircle: <ClearCircleIcon />,
  closeXMark: <CloseXMarkIcon />,
  closeXMarkRegular: <CloseXMarkRegularIcon />,
  copyRegular: <CopyRegularIcon />,
  cpuChip: <CpuChipIcon />,
  doubleArrowLeft: <DoubleArrowLeftIcon />,
  doubleArrowRight: <DoubleArrowRightIcon />,
  docFile: <DocFileIcon />,
  download: <DownloadIcon />,
  edit: <EditIcon />,
  ellipse: <EllipseIcon />,
  ellipseWithStroke: <EllipseWithStrokeIcon />,
  emptyEllipse: <EmptyEllipseIcon />,
  eye: <EyeIcon />,
  file: <FileIcon />,
  forwardedCall: <ForwardedCallIcon />,
  information: <InformationIcon />,
  info: <InfoIcon />,
  medicine: <MedicineIcon />,
  outlinedArrowBottom: <OutlinedArrowBottom />,
  outlinedArrowRight: <OutlinedArrowRight />,
  jpgFile: <JpgFileIcon />,
  paw: <PawIcon />,
  paymentCard: <PaymentCardIcon />,
  pdfFile: <PdfFileIcon />,
  phone: <PhoneIcon />,
  pippet: <PippetIcon />,
  pngFile: <PngFileIcon />,
  removeCircle: <RemoveCircleIcon />,
  search: <SearchIcon />,
  shieldGood: <ShieldGoodIcon />,
  shieldOff: <ShieldOffIcon />,
  shoppingCart: <ShoppingCartIcon />,
  stethoscope: <StethoscopeIcon />,
  syringe: <SyringeIcon />,
  transfer: <TransferIcon />,
  trash: <TrashIcon />,
  txtFile: <TxtFileIcon />,
  uploadCloud: <UploadCloudIcon />,
  user: <UserIcon />,
  warning: <WarningIcon />,
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
