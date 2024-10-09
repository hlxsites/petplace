import { Button, Dialog, Text } from "~/components/design-system";

type DiscardConfirmationModalProps = {
  onClose?: () => void;
  onConfirm?: () => void;
};

export const DiscardConfirmationModal = ({
  onClose,
  onConfirm,
}: DiscardConfirmationModalProps) => {
  return (
    <Dialog
      title="Discard changes"
      id="confirm-reset"
      isOpen
      trigger={undefined}
    >
      <Text>Are you sure to discard the existing pet profile changes?</Text>
      <div className="flex w-full flex-col justify-between gap-small pt-base md:flex-row">
        <Button variant="secondary" fullWidth onClick={onClose}>
          Dismiss
        </Button>
        <Button fullWidth onClick={onConfirm}>Yes</Button>
      </div>
    </Dialog>
  );
};
