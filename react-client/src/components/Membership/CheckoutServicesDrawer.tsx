import { CheckoutServices } from "~/mocks/MockRestApiServer";
import { Drawer, Text, TextSpan, Title } from "../design-system";
import { CartItemImages } from "./CartItemImages";

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
        {services.map((service) => renderService(service))}
      </div>
    </Drawer>
  );

  function renderService({
    name,
    price,
    isAnnual,
    images,
    description,
  }: CheckoutServices) {
    return (
      <>
        <div className="flex justify-between">
          <Title level="h5">{name}</Title>
          <Text fontWeight="bold">
            <TextSpan>{price}</TextSpan>
            {`${isAnnual ? "/year" : ""}`}
          </Text>
        </div>
        <CartItemImages images={images} name={name} />
        <div className="flex flex-col gap-base">
          <Text color="background-color-tertiary">{description}</Text>
        </div>
      </>
    );
  }
};
