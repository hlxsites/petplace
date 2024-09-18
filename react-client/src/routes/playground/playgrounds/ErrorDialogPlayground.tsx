import { useState } from "react";
import { Button } from "~/components/design-system";
import { ErrorDialog } from "~/components/design-system/dialog/ErrorDialog";

export const ErrorDialogPlayground = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ErrorDialog
        isOpen={isOpen}
        message="We're having trouble downloading your pet's document. This could be due to a temporary server issue or a problem with the file. Please try again later."
        onCancel={onClose}
        title="Document Download Failed"
        trigger={<Button onClick={onOpen}>Open error dialog</Button>}
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
