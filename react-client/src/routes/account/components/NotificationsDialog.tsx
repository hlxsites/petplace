import { Button, Dialog, Text, TextSpan } from "~/components/design-system";
import { LostPetUpdate } from "~/domain/models/pet/PetModel";

type NotificationsDialogProps = {
  isOpen: boolean;
  onClose?: () => void;
  viewData?: LostPetUpdate[];
  petName?: string;
};

export const NotificationsDialog = ({
  isOpen,
  onClose,
  viewData,
  petName,
}: NotificationsDialogProps) => {
  const foundedBy = viewData?.[0]?.foundedBy;
  const finderName = foundedBy?.finderName ?? "Unknown Finder";

  return (
    <Dialog
      ariaLabel="Notifications"
      id="notifications-dialog"
      isOpen={isOpen}
      onClose={onClose}
      title={`Pet ${petName} is found by ${finderName}.`}
      titleSize="32"
      trigger={undefined}
      isTitleResponsive
    >
      <div className="grid w-[640px] gap-large pt-large">
        <Text size="16" isResponsive>
          {`${petName} with identifier ${viewData?.[0]?.id} has been found. Contact the
          finder listed below to coordinate a pickup. Once you've been reunited
          with ${petName}, be sure to turn off the found pet alerts by clicking the
          button below.`}
        </Text>

        {/* TODO: This block of code should be refactored once API is defined */}
        <div className="grid gap-xsmall">
          <Text fontFamily="raleway" size="14">
            <TextSpan fontWeight="bold">Finder's name:</TextSpan> {finderName}
          </Text>
          <Text fontFamily="raleway" size="14">
            <TextSpan fontWeight="bold">Finder's phone number:</TextSpan>{" "}
            {foundedBy?.finderPhoneNumber}
          </Text>
          <Text fontFamily="raleway" size="14">
            <TextSpan fontWeight="bold">Finder's organization:</TextSpan>{" "}
            {foundedBy?.finderOrganization}
          </Text>
        </div>

        <Text size="16" isResponsive>
          Thank you for registering your pet.
        </Text>

        {/* TODO: This block of code should be refactored once API is defined */}
        <div className="grid">
          <Text>The following people have been contacted:</Text>
          <Text>Owner</Text>
          <Text>dana.rayman@pethealthinc.com at 03:14 PM Email</Text>
        </div>

        <Button fullWidth variant="secondary" onClick={onClose}>
          Dismiss
        </Button>
      </div>
    </Dialog>
  );
};
