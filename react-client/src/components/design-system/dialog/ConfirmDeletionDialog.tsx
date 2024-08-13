import { ReactNode } from "react";
import { Button } from "../button/Button";
import { Text } from "../text/Text";
import { Dialog } from "./Dialog";

type ConfirmDeletionDialogProps = {
  isOpen: boolean;
  message?: ReactNode | string;
  onCancel: () => void;
  onConfirm: () => void;
};

export const ConfirmDeletionDialog = ({
  isOpen,
  message,
  onCancel,
  onConfirm,
}: ConfirmDeletionDialogProps) => {
  const messageElement = (() => {
    if (message && typeof message !== "string") return message;

    const textMessage = message ?? "This action is irreversible.";
    return <Text size="base">{textMessage}</Text>;
  })();

  return (
    <Dialog
      id="confirm-deletion-dialog"
      isOpen={isOpen}
      onClose={onCancel}
      title="Are you sure you want to delete this file?"
      titleLevel="h2"
    >
      {({ onCloseWithAnimation }) => (
        <div className="grid gap-xlarge pt-xlarge">
          {messageElement}
          <div className="flex gap-small">
            <Button
              fullWidth
              onClick={onCloseWithAnimation}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button fullWidth onClick={onConfirm}>
              Yes, delete
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
};
