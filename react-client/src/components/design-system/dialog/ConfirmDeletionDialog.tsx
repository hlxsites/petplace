import { Button } from "../button/Button";
import { Text } from "../text/Text";
import { Dialog } from "./Dialog";

type ConfirmDeletionDialogProps = {
  fileName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDeletion: () => void;
};

export const ConfirmDeletionDialog = ({
  fileName,
  isOpen,
  onClose,
  onConfirmDeletion,
}: ConfirmDeletionDialogProps) => {
  return (
    <Dialog
      id="Confirm deletion file"
      isOpen={isOpen}
      onClose={onClose}
      title="Are you sure you want to delete this file?"
      titleLevel="h2"
    >
      <div className="grid gap-xlarge pt-xlarge">
        {fileName && (
          <Text size="base">
            {`You are about to permanently delete important pet records including:
          ${fileName}? This action cannot be undone.`}
          </Text>
        )}
        <div className="flex gap-small">
          <Button fullWidth onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button fullWidth onClick={onConfirmDeletion}>
            Yes, delete
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
