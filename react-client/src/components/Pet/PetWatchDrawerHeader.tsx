import { ASSET_IMAGES } from "~/assets";
import { PetWatchServiceProps } from "~/routes/my-pets/petId/utils/petServiceDetails";
import { IconButton, Text, Title } from "../design-system";

type PetWatchDrawerHeaderProps = {
  contentDetails?: PetWatchServiceProps;
  onClick: () => void;
};

export const PetWatchDrawerHeader = ({
  contentDetails,
  onClick,
}: PetWatchDrawerHeaderProps) => {
  if (!contentDetails) return <MainHeader />;

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
};

const MainHeader = () => {
  return (
    <>
      <img
        alt="Pet watch logo"
        className="pb-small"
        src={ASSET_IMAGES.petWatchLogo}
      />
      <Text color="tertiary-600" size="base">
        Here is all the available benefits and perks
      </Text>
    </>
  );
};
