import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import { Button, DropdownMenu } from "~/components/design-system";
import { PetUnavailableActionDialog } from "~/components/Pet/PetUnavailableActionDialog";
import { PetModel } from "~/domain/models/pet/PetModel";
import { useTransferPet } from "~/hooks/useTransferPet";
import { invariant } from "~/util/invariant";
import { usePetProfileContext } from "../usePetProfileLayoutViewModel";

type PetActionsDropdownMenuProps = {
  className?: string;
};

export const PetActionsDropdownMenu = ({
  className,
}: PetActionsDropdownMenuProps) => {
  const viewModel = usePetProfileContext();
  const { onTransferPet } = useTransferPet();

  return (
    <SuspenseAwait minHeight={"80dvh"} resolve={viewModel.petInfo}>
      {render}
    </SuspenseAwait>
  );

  function render(pet: PetModel | null) {
    invariant(pet, "Pet not found");

    const isFromMyPetHealth = pet?.sourceType === "MyPetHealth";

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
            onClick: viewModel.onEditPet,
          },
          {
            icon: "trash",
            label: "Transfer this pet",
            onClick: onTransferPet,
          },
        ]}
      />
    );
  }
};
