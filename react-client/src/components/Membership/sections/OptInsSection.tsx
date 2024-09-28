import { Button, Card, Checkbox, Title } from "~/components/design-system";
import { CheckoutServicesDrawer } from "../CheckoutServicesDrawer";
import { useServicesDetails } from "../hooks/useServicesDetails";

type OptInsSectionProps = {
  autoRenew: boolean;
  onClick: () => void;
  optInLabel: string;
};

export const OptInsSection = ({
  autoRenew,
  onClick,
  optInLabel,
}: OptInsSectionProps) => {
  const { items, goBack, openServiceDetails } = useServicesDetails();

  return (
    <>
      <Card>
        <div className="p-large">
          <Title level="h4">Opt-ins</Title>
          <div className="grid place-items-center gap-large pt-small lg:flex">
            <Checkbox
              id="opt-in-renew"
              label={optInLabel}
              checked={autoRenew}
              onClick={onClick}
            />
            <Button
              className="text-sm min-w-[90px] font-franklin text-orange-300-contrast"
              onClick={handleClick}
              variant="link"
            >
              More info
            </Button>
          </div>
        </div>
      </Card>
      <CheckoutServicesDrawer
        isOpen={!!items.length}
        onClose={goBack}
        services={items}
      />
    </>
  );

  function handleClick() {
    openServiceDetails();
  }
};
