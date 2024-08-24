import { ASSET_IMAGES } from "~/assets";
import { useDrawerContentState } from "~/hooks/useDrawerContentState";
import { PetServiceTypes } from "~/routes/my-pets/:petId/types/PetServicesTypes";
import {
  PET_WATCH_OFFERS,
  PET_WATCH_TAGS,
} from "~/routes/my-pets/:petId/utils/petServiceConstants";
import { Button, Card, Drawer, Tag, Text } from "../../design-system";
import { PetWatchDrawerServiceContent } from "../PetWatchDrawerServiceContent";

type PetWatchSectionProp = {
  petServiceStatus: PetServiceTypes;
};

export const PetWatchSection = ({ petServiceStatus }: PetWatchSectionProp) => {
  const { isDrawerOpen, onOpenDrawer, onCloseDrawer } =
    useDrawerContentState("pet-watch");

  const { buttonLabel, icon, message } = PET_WATCH_OFFERS[petServiceStatus];
  const { label, tagStatus } = PET_WATCH_TAGS[petServiceStatus];

  return (
    <>
      <Card>
        <div className="grid gap-large p-large">
          <div className="flex items-center justify-between">
            <img
              className="max-h-[20px]"
              alt="24 Pet Watch logo"
              src={ASSET_IMAGES.petWatchLogo}
            />
            <Tag label={label} tagStatus={tagStatus} />
          </div>
          <Text size="base">{message}</Text>
          <Button
            className="text-orange-300-contrast"
            iconLeft={icon}
            variant="secondary"
            onClick={() => onOpenDrawer()}
          >
            {buttonLabel}
          </Button>
        </div>
      </Card>
      <Drawer
        ariaLabel="24 Pet Watch benefits"
        id="24PetWatchDrawer"
        isOpen={isDrawerOpen}
        onClose={onCloseDrawer}
        width={440}
      >
        <PetWatchDrawerServiceContent />
      </Drawer>
    </>
  );
};
