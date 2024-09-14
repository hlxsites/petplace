import { Button } from "~/components/design-system";
import { PetUnavailableActionDialog } from "~/components/Pet/PetUnavailableActionDialog";

type ReportLostPetButtonProps = {
  className?: string;
  disabled: boolean;
};

export const ReportLostPetButton = ({
  className,
  disabled,
}: ReportLostPetButtonProps) => {
  const button = (
    <Button
      className={className}
      iconLeft="shieldGood"
      iconProps={{ className: "text-brand-secondary" }}
      variant="secondary"
    >
      Report lost pet
    </Button>
  );

  if (!disabled) return button;

  return <PetUnavailableActionDialog trigger={button} />;
};
