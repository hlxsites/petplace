import { useState } from "react";
import { Button } from "~/components/design-system";
import { ConfirmDeletionDialog } from "~/components/design-system/dialog/ConfirmDeletionDialog";

export const ConfirmDeletionDialogPlayground = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <ConfirmDeletionDialog
        isOpen={isOpen}
        onCancel={onClose}
        onConfirm={onClose}
        trigger={<Button onClick={onOpen}>Open confirm dialog</Button>}
      />
    </>
  );

  function onOpen() {
    setIsOpen(true);
  }

  function onClose() {
    setIsOpen(false);
  }
};
