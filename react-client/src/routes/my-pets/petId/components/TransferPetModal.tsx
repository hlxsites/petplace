import { Button, Dialog, Text } from "~/components/design-system";
import { useTransferPet } from "~/hooks/useTransferPet";

export const TransferPetModal = () => {
  const { onDismissTransferPet } = useTransferPet();

  return (
    <Dialog
      isOpen
      id="transfer-pet"
      title="Transfer pet"
      align="center"
      trigger={undefined}
    >
      <div className="h-[120px] min-w-[300px] md:w-[300px]">
        <div className="flex h-full flex-col justify-between">
          <Text>
            To transfer a pet's microchip registration to a new registrant,
            please call 1-877-707-7297 where one of our customer experience
            specialists will be happy to assist you.
          </Text>
          <Button onClick={onDismissTransferPet} variant="primary" fullWidth>
            Dismiss
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
