import { Card, Checkbox, Title } from "~/components/design-system";
import { useCheckoutProductsViewModelContext } from "~/routes/checkout/products/useCheckoutProductsViewModel";

export const OptInsSection = () => {
  const { autoRenew, onUpdateOptIn, optInLabel } =
    useCheckoutProductsViewModelContext();

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
              onClick={onUpdateOptIn}
            />
          </div>
        </div>
      </Card>
    </>
  );
};
