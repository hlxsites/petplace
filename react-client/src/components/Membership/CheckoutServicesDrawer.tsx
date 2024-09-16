import { CheckoutServices } from "~/mocks/MockRestApiServer";
import { Drawer } from "../design-system";
import { CheckoutServiceCard } from "./CheckoutServiceCard";

type CheckoutServicesDrawerProps = {
  onClose: () => void;
  isOpen: boolean;
  services: CheckoutServices[];
};

export const CheckoutServicesDrawer = ({
  services,
  ...rest
}: CheckoutServicesDrawerProps) => {
  return (
    <Drawer
      id="checkout-services"
      title="Services"
      width={400}
      trigger={undefined}
      {...rest}
    >
      <div className="flex flex-col gap-large pt-large">
        {services.map((service) => (
          <CheckoutServiceCard {...service} key={service.id} />
        ))}
      </div>
    </Drawer>
  );
};
