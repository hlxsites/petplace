import { Button } from "~/components/design-system";
import { PetUnavailableActionDialog } from "~/components/Pet/PetUnavailableActionDialog";
import { ReportClosingModal } from "~/components/Pet/ReportClosingModal";
import { MissingStatus } from "~/domain/models/pet/PetModel";
import { redirectToLostPet } from "~/util/forceRedirectUtil";

type ReportPetButtonProps = {
  className?: string;
  disabled: boolean;
  missingStatus: MissingStatus;
};

export const ReportPetButton = ({
  className,
  disabled,
  missingStatus,
}: ReportPetButtonProps) => {
  const button = (() => {
    if (missingStatus === "missing") {
      return (
        <ReportClosingModal trigger={renderButton("Report pet as found")} />
      );
    }
    return renderButton("Report lost pet", redirectToLostPet);
  })();

  if (!disabled) return button;

  return <PetUnavailableActionDialog trigger={button} />;

  function renderButton(label: string, onClick?: () => void) {
    return (
      <Button
        className={className}
        iconLeft="shieldGood"
        iconProps={{ className: "text-brand-secondary" }}
        variant="secondary"
        onClick={onClick}
      >
        {label}
      </Button>
    );
  }
};
