import { Button, Dialog, Text } from "~/components/design-system";
import { useTransferPetViewModel } from "./useTransferPetViewModel";

export const TransferPetDialog = () => {
  const { isDialogOpen, onCloseDialog } = useTransferPetViewModel();

  if (!isDialogOpen) return null;

  return (
    <Dialog
      align="center"
      isOpen
      id="transfer-pet"
      onClose={onCloseDialog}
      title="Transfer pet"
      trigger={undefined}
    >
      <div className="h-[120px] min-w-[300px] md:w-[300px]">
        <div className="flex h-full flex-col justify-between">
          <Text>
            To transfer a pet's microchip registration to a new registrant,
            please call 1-877-707-7297 where one of our customer experience
            specialists will be happy to assist you.
          </Text>
          <Button fullWidth onClick={onCloseDialog} variant="primary">
            Dismiss
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
