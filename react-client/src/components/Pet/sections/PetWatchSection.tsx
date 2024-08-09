import {
  PET_WATCH_OFFERS,
  PET_WATCH_TAGS,
} from "~/routes/my-pets/:petId/utils/petServiceConstants";
import { Button, Card, Tag, Text } from "../../design-system";
import { PetServiceTypes } from "~/routes/my-pets/:petId/types/PetServicesTypes";

type PetWatchSectionProp = {
  petServiceType: PetServiceTypes;
};

export const PetWatchSection = ({ petServiceType }: PetWatchSectionProp) => {
  const { buttonLabel, icon, message } = PET_WATCH_OFFERS[petServiceType];
  const { label, tagStatus } = PET_WATCH_TAGS[petServiceType];

  return (
    <>
      <Card>
        <div className="grid gap-large p-large">
          <div className="flex items-center justify-between">
            <img className="max-h-[20px]" alt="24 Pet Watch logo" src={""} />
            <Tag label={label} tagStatus={tagStatus} />
          </div>
          <Text size="base">{message}</Text>
          <Button
            className="text-orange-300-contrast"
            iconLeft={icon}
            variant="secondary"
          >
            {buttonLabel}
          </Button>
        </div>
      </Card>
    </>
  );
};
