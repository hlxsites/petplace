import { cloneElement, ReactElement, useState } from "react";
import { Button, Dialog, DialogTrigger, Text } from "../design-system";

type PetUnavailableActionDialogProps = {
  trigger: DialogTrigger;
};

export const PetUnavailableActionDialog = ({
  trigger,
}: PetUnavailableActionDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderTrigger = (() => {
    // @ts-expect-error - We know that trigger is a valid element
    return cloneElement<ReactElement<HTMLButtonElement>>(trigger, {
      onClick: openDialog,
    });
  })();

  return (
    <Dialog
      id="unavailable-actions-dialog"
      isOpen={isOpen}
      title="Sorry, this action is unavailable right now. "
      onClose={onClose}
      trigger={renderTrigger}
    >
      <Text>
        We’re currently processing your pet’s information. Please try again in
        about an hour.
      </Text>
      <Button
        className="mt-xlarge"
        fullWidth
        onClick={onClose}
        variant="secondary"
      >
        Dismiss
      </Button>
    </Dialog>
  );

  function openDialog() {
    setIsOpen(true);
  }

  function onClose() {
    setIsOpen(false);
  }
};
