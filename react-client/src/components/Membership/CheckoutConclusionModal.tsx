import { PET_PROFILE_FULL_ROUTE } from "~/routes/AppRoutePaths";
import { Dialog, Icon, LinkButton, Text, Title } from "../design-system";

type CheckoutConclusionModalProps = {
  petId: string;
};

export const CheckoutConclusionModal = ({
  petId,
}: CheckoutConclusionModalProps) => {
  if (!petId) return null;

  const petProfilePath = PET_PROFILE_FULL_ROUTE(petId);

  return (
    <Dialog
      id="checkout-conclusion"
      ariaLabel="Checkout conclusion"
      isOpen
      align="center"
      padding="p-0"
    >
      <div className="flex flex-col items-center gap-xxlarge px-large py-xxlarge md:w-[708px] md:px-xxlarge">
        <Icon display="shieldGood" size={72} className="text-green-300" />
        <Title level="h2" size="24">
          Congratulations! Your Pet is now covered with 24Petwatch Protection
          Plan!
        </Title>
        <Text size="16" color="text-color-supporting">
          You can access your plan benefits in your pet profile's “Active pet
          services” section. Your purchase may take up to 24 hours to reflect.
          Your invoice and plan details will be emailed shortly.
        </Text>
        <div className="flex w-full flex-col gap-medium md:flex-row md:gap-small">
          <LinkButton fullWidth replace to={petProfilePath} variant="secondary">
            Back to pet profile
          </LinkButton>
        </div>
      </div>
    </Dialog>
  );
};
