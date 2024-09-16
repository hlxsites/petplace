import { LinkButton } from "~/components/design-system";
import { PetUnavailableActionDialog } from "~/components/Pet/PetUnavailableActionDialog";
import { AppRoutePaths } from "~/routes/AppRoutePaths";

type ReportLostPetButtonProps = {
  className?: string;
  disabled?: boolean;
};

export const ReportLostPetButton = ({
  className,
  disabled,
}: ReportLostPetButtonProps) => {
  const button = (
    <div className={className}>
      <LinkButton
        iconLeft="shieldGood"
        iconProps={{ className: "text-brand-secondary" }}
        to={`/${AppRoutePaths.lostPet}`}
        variant="secondary"
      >
        Report lost pet
      </LinkButton>
    </div>
  );

  if (!disabled) return button;

  return <PetUnavailableActionDialog trigger={button} />;
};
