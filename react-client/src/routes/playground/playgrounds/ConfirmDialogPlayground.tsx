import { useState } from "react";
import { Button } from "~/components/design-system";
import { ConfirmDialog } from "~/components/design-system/dialog/ConfirmDialog";

export const ConfirmDialogPlayground = () => {
  const [isOpenErrorDialog, setIsOpenErrorDialog] = useState(false);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [isOpenSuccessDialog, setIsOpenSuccessDialog] = useState(false);

  return (
    <>
      <ConfirmDialog
        isOpen={isOpenErrorDialog}
        message="We're having trouble downloading your pet's document. This could be due to a temporary server issue or a problem with the file. Please try again later."
        onClose={onClose}
        title="Document Download Failed"
        type="error"
        trigger={<Button onClick={onOpenErrorDialog}>Open error dialog</Button>}
      />
      <ConfirmDialog
        icon="info"
        isOpen={isOpenConfirmDialog}
        message="Would you like to renew {service_name} for another year? This ensures continued protection for your pet's."
        onClose={onCloseConfirmDialog}
        confirmButtonLabel="Confirm Renewal"
        title="Confirm Renewal"
        type="info"
        trigger={
          <Button onClick={onOpenConfirmDialog}>Open confirm dialog</Button>
        }
      />
      <ConfirmDialog
        icon="info"
        isOpen={isOpenSuccessDialog}
        message="There is life on the moon, by clicking on dismiss means that's true!"
        onClose={onCloseSuccessDialog}
        title="Success"
        type="success"
        trigger={
          <Button onClick={onOpenSuccessDialog}>Open success dialog</Button>
        }
      />
    </>
  );

  function onOpenErrorDialog() {
    setIsOpenErrorDialog(true);
  }

  function onOpenSuccessDialog() {
    setIsOpenSuccessDialog(true);
  }

  function onOpenConfirmDialog() {
    setIsOpenConfirmDialog(true);
  }

  function onClose() {
    setIsOpenErrorDialog(false);
  }

  function onCloseConfirmDialog() {
    setIsOpenConfirmDialog(false);
  }

  function onCloseSuccessDialog() {
    setIsOpenSuccessDialog(false);
  }
};
