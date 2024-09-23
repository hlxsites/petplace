import { useDrawerContentState } from "~/hooks/useDrawerContentState";
import {
  PET_WATCH_OFFERS,
  PET_WATCH_TAGS,
} from "~/routes/my-pets/petId/utils/petServiceConstants";
import { Button, Card, Drawer, Tag, Text, Title } from "../../design-system";
import { PetWatchDrawerServiceContent } from "../PetWatchDrawerServiceContent";
import { PetServices } from "~/domain/models/pet/PetModel";
import { getStatus } from "~/routes/my-pets/petId/utils/petServiceStatusUtils";

type PetWatchSectionProp = {
  petServiceStatus: PetServices;
  route?: string;
};

export const PetWatchSection = ({
  petServiceStatus,
  route,
}: PetWatchSectionProp) => {
  const { isDrawerOpen, onOpenDrawer, onCloseDrawer } =
    useDrawerContentState("pet-watch");

  const serviceStatus = getStatus(petServiceStatus);

  const { buttonLabel, icon, message } = PET_WATCH_OFFERS[serviceStatus];
  const { label, tagStatus } = PET_WATCH_TAGS[serviceStatus];

  return (
    <>
      <Text fontFamily="raleway" fontWeight="bold" size="18">
        Active Pet Services
      </Text>
      <Card>
        <div className="grid gap-large p-large">
          <div className="flex items-center justify-between">
            <Title level="h4">Lost Pet Protection</Title>
            <Tag label={label} tagStatus={tagStatus} />
          </div>
          <Text size="14">{message}</Text>
          <Drawer
            ariaLabel="24 Pet Watch benefits"
            id="24PetWatchDrawer"
            isOpen={isDrawerOpen}
            onClose={() => onCloseDrawer({ persistOtherParams: true })}
            width={440}
            trigger={
              <Button
                className="text-orange-300-contrast"
                iconLeft={icon}
                variant="secondary"
                onClick={() => onOpenDrawer()}
              >
                {buttonLabel}
              </Button>
            }
          >
            <PetWatchDrawerServiceContent
              route={route}
              serviceStatus={petServiceStatus.membershipStatus}
            />
          </Drawer>
        </div>
      </Card>
    </>
  );
};
