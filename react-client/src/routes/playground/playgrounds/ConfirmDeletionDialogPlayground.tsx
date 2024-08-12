import { useState } from "react";
import { Button } from "~/components/design-system";
import { ConfirmDeletionDialog } from "~/components/design-system/dialog/ConfirmDeletionDialog";

export const ConfirmDeletionDialogPlayground = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={onOpen}>Open confirm dialog</Button>
      <ConfirmDeletionDialog
        fileName="Test doc"
        isOpen={isOpen}
        onClose={onClose}
        onConfirmDeletion={onClose}
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
