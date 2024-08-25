import { Button, DropdownMenu } from "~/components/design-system";
import { usePetProfileContext } from "../usePetProfileLayoutViewModel";

type PetActionsDropdownMenuProps = {
  className?: string;
};

export const PetActionsDropdownMenu = ({
  className,
}: PetActionsDropdownMenuProps) => {
  const viewModel = usePetProfileContext();

  return (
    <DropdownMenu
      trigger={
        <Button
          className={className}
          iconLeft="apps"
          variant="secondary"
          iconProps={{ className: "text-brand-secondary" }}
        >
          Actions
        </Button>
      }
      items={[
        {
          icon: "edit",
          label: "Edit pet profile",
          onClick: viewModel.onEditPet,
          variant: "highlight",
        },
        {
          icon: "trash",
          label: "Download pet ID",
        },
        {
          icon: "trash",
          label: "Remove this pet",
        },
        {
          icon: "trash",
          label: "Transfer this pet",
        },
      ]}
    />
  );
};
