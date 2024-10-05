import { Button } from "~/components/design-system";
import { PetUnavailableActionDialog } from "~/components/Pet/PetUnavailableActionDialog";
import { MissingStatus } from "~/domain/models/pet/PetModel";
import { useLostAndFoundReport } from "~/hooks/useLostAndFoundReport";

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
  const { redirectToLostPet, openReportClosingModal } = useLostAndFoundReport();

  const button = (() => {
    if (missingStatus === "found") {
      return renderButton("Report lost pet", redirectToLostPet);
    }
    return renderButton("Report pet as found", openReportClosingModal);
  })();

  if (!disabled) return button;

  return <PetUnavailableActionDialog trigger={button} />;

  function renderButton(label: string, onClick: () => void) {
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
