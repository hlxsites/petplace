import {
  ConfirmDialogDetails,
  ConfirmDialogType,
} from "~/components/design-system/dialog/ConfirmDialog";

const ERROR_DETAILS: ConfirmDialogDetails = {
  confirmButtonLabel: "Check Payment Settings",
  message:
    "We were unable to renew your service. Please check your payment settings to ensure your information is up to date.",
  title: "Renewal Failed",
  type: "error",
};

const SUCCESS_DETAILS: ConfirmDialogDetails = {
  icon: "checkCircle",
  message: "Your service has been successfully renewed for another year.",
  title: "Renewal Successful",
  type: "success",
};

export const RenewDialogDetails: Record<
  Exclude<ConfirmDialogType, "info">,
  ConfirmDialogDetails
> = {
  error: ERROR_DETAILS,
  success: SUCCESS_DETAILS,
};
