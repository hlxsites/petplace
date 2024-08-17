import { Button } from "~/components/design-system";

type ReportLostPetButtonProps = {
  className?: string;
};

export const ReportLostPetButton = ({
  className,
}: ReportLostPetButtonProps) => {
  return (
    <Button
      className={className}
      iconLeft="shieldGood"
      iconProps={{ className: "text-brand-secondary" }}
      variant="secondary"
    >
      Report lost pet
    </Button>
  );
};
