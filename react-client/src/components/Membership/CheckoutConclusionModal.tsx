import { AppRoutePaths } from "~/routes/AppRoutePaths";
import {
  Button,
  Dialog,
  Icon,
  LinkButton,
  Text,
  Title,
} from "../design-system";

type CheckoutConclusionModalProps = {
  petId: string;
};

export const CheckoutConclusionModal = ({
  petId,
}: CheckoutConclusionModalProps) => {
  return (
    <Dialog
      id="checkout-conclusion"
      ariaLabel="Checkout conclusion"
      isOpen
      align="center"
      padding="p-0"
    >
      <div className="flex md:w-[708px] flex-col items-center gap-xxlarge px-large py-xxlarge md:px-xxlarge">
        <Icon display="shieldGood" size={72} className="text-green-300" />
        <Title level="h2">
          Congratulations! Your Pet’s Protection Plan is Now Active!
        </Title>
        <Text size="16" color="text-color-supporting">
          You can now access all the benefits of your selected tier, including
          24/7 Vet Help and Lost Pet Protection, in the Membership section.
        </Text>
        <div className="flex flex-col md:flex-row w-full gap-medium md:gap-small">
          <LinkButton
            fullWidth
            variant="secondary"
            to={`/${AppRoutePaths.myPets}/${petId}`}
          >
            Back to pet profile
          </LinkButton>
          <Button fullWidth>See my benefits</Button>
        </div>
      </div>
    </Dialog>
  );
};
