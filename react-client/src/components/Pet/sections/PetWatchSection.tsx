import { useDrawerContentState } from "~/hooks/useDrawerContentState";
import { Button, Card, Drawer, Tag, Text, Title } from "../../design-system";
import { PetWatchDrawerServiceContent } from "../PetWatchDrawerServiceContent";
import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import { useRenewMembershipViewModel } from "~/routes/my-pets/petId/useRenewMembershipViewModel";

type PetWatchSectionProp = {
  route?: string;
};

export const PetWatchSection = ({ route }: PetWatchSectionProp) => {
  const { petWatchInfo } = useRenewMembershipViewModel();

  const { isDrawerOpen, onOpenDrawer, onCloseDrawer } =
    useDrawerContentState("pet-watch");

  return (
    <>
      <Text fontFamily="raleway" fontWeight="bold" size="18">
        Active Pet Services
      </Text>
      <SuspenseAwait resolve={petWatchInfo}>
        {({ petWatchOffersAndTags, membershipStatus }) => {
          if (!petWatchOffersAndTags) return null;
          const { buttonLabel, icon, message, label, tagStatus } =
            petWatchOffersAndTags;
          return (
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
                  onClose={onCloseDrawer}
                  width={480}
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
                    serviceStatus={membershipStatus}
                  />
                </Drawer>
              </div>
            </Card>
          );
        }}
      </SuspenseAwait>
    </>
  );
};
