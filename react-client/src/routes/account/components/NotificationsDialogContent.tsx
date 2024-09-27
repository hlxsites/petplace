import { Button, Text, TextSpan } from "~/components/design-system";
import { LostPetUpdateModel } from "~/domain/models/user/UserModels";

type NotificationsDialogContentProps = {
  isOpen: boolean;
  onClose?: () => void;
  viewData?: LostPetUpdateModel;
};

export const NotificationsDialogContent = ({
  onClose,
  viewData,
}: NotificationsDialogContentProps) => {
  const foundedBy = viewData?.foundedBy;
  const finderName = foundedBy?.finderName ?? "Unknown Finder";

  return (
      <div className="grid max-w-[640px] md:min-h-[350px] gap-large pt-large">
        <Text size="16" isResponsive>
          {`${viewData?.petName} with identifier ${viewData?.id} has been found. Contact the
          finder listed below to coordinate a pickup. Once you've been reunited
          with ${viewData?.petName}, be sure to turn off the found pet alerts by clicking the
          button below.`}
        </Text>

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

        <div className="grid">
          <Text>The following people have been contacted:</Text>
          <Text>Owner</Text>
          {foundedBy?.contact?.map(({ email, date }, i) => {
            let localDateTimeString;
            if (date) {
              const dateObject = new Date(date);
              const localDate = dateObject.toLocaleDateString("en-CA");
              const localTime = dateObject.toTimeString().slice(0, 8);
              localDateTimeString = `${localDate} ${localTime}`;
            }
            return (
              <Text key={`${i}-${date}`}>
                {email} at {localDateTimeString ?? date}
              </Text>
            );
          })}
        </div>

        <Button fullWidth variant="secondary" onClick={onClose}>
          Dismiss
        </Button>
      </div>
  );
};
