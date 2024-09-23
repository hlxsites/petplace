import { ASSET_IMAGES } from "~/assets";
import { PetWatchServiceProps } from "~/routes/my-pets/petId/utils/petServiceDetails";
import { IconButton, Text, Title } from "../design-system";
import { PetServices } from "~/domain/models/pet/PetModel";
import { shouldRenderStandardServiceDrawer } from "~/util/petWatchServiceUtils";

type PetWatchDrawerHeaderProps = {
  contentDetails?: PetWatchServiceProps;
  onClick: () => void;
  serviceStatus: PetServices["membershipStatus"];
};

export const PetWatchDrawerHeader = ({
  contentDetails,
  onClick,
  serviceStatus,
}: PetWatchDrawerHeaderProps) => {
  if (!contentDetails) return mainHeader();

  return (
    <div className="mb-xxlarge">
      <div className="flex items-center">
        <IconButton
          icon="chevronLeft"
          label="go back"
          variant="link"
          className="text-orange-300-contrast"
          onClick={onClick}
        />
        <Title level="h4">{contentDetails?.title}</Title>
      </div>
      {contentDetails.subtitle && (
        <div className="-mt-small ml-[26px] lg:ml-[42px]">
          <Text color="tertiary-600">{contentDetails?.subtitle}</Text>
        </div>
      )}
    </div>
  );

  function mainHeader() {
    return (
      <>
        <img
          alt="Pet watch logo"
          className="pb-small"
          src={ASSET_IMAGES.petWatchLogo}
        />

        {shouldRenderStandardServiceDrawer(serviceStatus) ? (
          <div className="grid gap-medium text-14 text-tertiary-600">
            <Text inherit>
              If your pet ever goes missing and is found, they can be scanned at
              a vet or animal shelter to identify their microchip number. When
              the chip number is shared with 24Petwatch, you'll be notified
              using the consent and information on file. This may include email,
              automated phone call and SMS. Be sure to keep your contact details
              up-to-date.
            </Text>
            <Text inherit>
              Upgrade your membership to unlock the following benefits:
            </Text>
          </div>
        ) : (
          <Text color="tertiary-600" size="14">
            Here is all the available benefits and perks
          </Text>
        )}
      </>
    );
  }
};
