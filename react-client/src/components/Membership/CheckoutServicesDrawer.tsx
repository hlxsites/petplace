import { CheckoutServices } from "~/mocks/MockRestApiServer";
import { Drawer, Title } from "../design-system";
import { CheckoutServiceCard } from "./CheckoutServiceCard";

type CheckoutServicesDrawerProps = {
  onClose: () => void;
  isOpen: boolean;
  services: CheckoutServices[];
};

export const CheckoutServicesDrawer = ({
  isOpen,
  services,
  onClose,
}: CheckoutServicesDrawerProps) => {
  return (
    <Drawer
      id="checkout-services"
      ariaLabel="Services"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col gap-large">
        <Title level="h3">Services</Title>
        {services.map((service) => (
          <CheckoutServiceCard {...service} key={service.id} />
        ))}
      </div>
    </Drawer>
  );
};
