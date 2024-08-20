import { ASSET_IMAGES } from "~/assets";
import { useContentDetails } from "~/hooks/useContentDetails";
import { PET_WATCH_OPTIONS } from "~/routes/my-pets/:petId/utils/petWatchConstants";
import { IconButton, Text, TextSpan } from "../design-system";
import { PetCardPetWatch } from "./PetCardPetWatch";
import { PetServiceDetailsCard } from "./PetServiceDetailsCard";

export const PetWatchDrawerServiceContent = () => {
  const { handleContentChange, contentDetails } = useContentDetails();

  return (
    <>
      {drawerHeader()}
      {drawerBody()}
    </>
  );

  function drawerHeader() {
    if (!contentDetails) return <MainHeader />;

    return (
      <div className="mb-xxlarge">
        <div className="flex items-center">
          <IconButton
            icon="chevronLeft"
            label="go back"
            variant="link"
            className="text-orange-300-contrast"
            onClick={handleContentChange()}
          />
          <TextSpan fontWeight="bold">{contentDetails?.title}</TextSpan>
        </div>
        {contentDetails.subtitle && (
          <div className="-mt-small ml-[26px] lg:ml-[42px]">
            <Text color="tertiary-600">{contentDetails?.subtitle}</Text>
          </div>
        )}
      </div>
    );
  }

  function drawerBody() {
    if (contentDetails) return <PetServiceDetailsCard {...contentDetails} />;

    return (
      <div className="grid gap-small pt-large">
        {PET_WATCH_OPTIONS.map(({ id, ...props }) => (
          <PetCardPetWatch
            key={props.label}
            onClick={handleContentChange(id)}
            {...props}
          />
        ))}
      </div>
    );
  }
};

export const MainHeader = () => {
  return (
    <>
      <img className="pb-small" src={ASSET_IMAGES.petWatchLogo} />
      <Text color="tertiary-600" size="base">
        Here is all the available benefits and perks
      </Text>
    </>
  );
};
