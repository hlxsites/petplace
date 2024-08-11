import { PetServiceTypes } from "~/routes/my-pets/:petId/types/PetServicesTypes";
import {
  PET_WATCH_OFFERS,
  PET_WATCH_TAGS,
} from "~/routes/my-pets/:petId/utils/petServiceConstants";
import { Button, Card, Tag, Text } from "../../design-system";

type PetWatchSectionProp = {
  petServiceStatus: PetServiceTypes;
};

export const PetWatchSection = ({ petServiceStatus }: PetWatchSectionProp) => {
  const { buttonLabel, icon, message } = PET_WATCH_OFFERS[petServiceStatus];
  const { label, tagStatus } = PET_WATCH_TAGS[petServiceStatus];

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
