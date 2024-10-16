import { Button, DropdownMenu } from "~/components/design-system";
import { PetUnavailableActionDialog } from "~/components/Pet/PetUnavailableActionDialog";
import { usePetProfileContext } from "../usePetProfileLayoutViewModel";
import { useTransferPetViewModel } from "./useTransferPetViewModel";

type PetActionsDropdownMenuProps = {
  className?: string;
};

export const PetActionsDropdownMenu = ({
  className,
}: PetActionsDropdownMenuProps) => {
  const { isLoading, onEditPet, pet } = usePetProfileContext();

  const { onOpenDialog: onOpenTransferPetDialog } = useTransferPetViewModel();

  if (isLoading || !pet) return null;

  const isFromMyPetHealth = pet.sourceType === "MyPetHealth";

  const trigger = (
    <Button
      className={className}
      iconLeft="apps"
      iconProps={{ className: "text-brand-secondary" }}
      variant="secondary"
    >
      Actions
    </Button>
  );

  if (!isFromMyPetHealth) {
    return <PetUnavailableActionDialog trigger={trigger} />;
  }

  return (
    <DropdownMenu
      trigger={trigger}
      items={[
        {
          icon: "edit",
          label: "Edit pet profile",
          onClick: onEditPet,
        },
        {
          icon: "exchange",
          label: "Transfer this pet",
          onClick: onOpenTransferPetDialog,
        },
      ]}
    />
  );
};
