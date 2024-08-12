import { useNavigate } from "react-router-dom";
import { ASSET_IMAGES } from "~/assets";
import { Drawer, Text } from "~/components/design-system";
import { PetCardPetWatch } from "~/components/Pet/PetCardPetWatch";
import { PET_WATCH_OPTIONS } from "../utils/petWatchConstants";

export const PetWatchIndex = () => {
  const navigate = useNavigate();

  return (
    <Drawer
      ariaLabel="24 Pet Watch benefits"
      id="24PetWatchDrawer"
      isOpen
      onClose={onCloseDrawer}
      title=""
    >
      <div>
        <img className="pb-small" src={ASSET_IMAGES.petWatchLogo} />
        <Text color="tertiary-600" size="base">
          Here is all the available benefits and perks
        </Text>
        <div className="grid gap-small pt-large">
          {PET_WATCH_OPTIONS.map(
            ({ imgBrand, imgLabel, isDisabled, label, labelStatus }) => (
              <PetCardPetWatch
                imgBrand={imgBrand}
                imgLabel={imgLabel}
                isDisabled={isDisabled}
                label={label}
                labelStatus={labelStatus}
              />
            )
          )}
        </div>
      </div>
    </Drawer>
  );

  function onCloseDrawer() {
    navigate("..");
  }
};
