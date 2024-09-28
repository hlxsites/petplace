import { PetServices } from "~/domain/models/pet/PetModel";
import { useContentDetails } from "~/hooks/useContentDetails";
import { PetWatchDrawerBody } from "./PetWatchDrawerBody";
import { PetWatchDrawerHeader } from "./PetWatchDrawerHeader";

type PetWatchDrawerServiceContentProps = {
  locale?: PetServices["locale"];
  serviceStatus: PetServices["membershipStatus"];
  route?: string;
};

export const PetWatchDrawerServiceContent = ({
  locale,
  serviceStatus,
  route,
}: PetWatchDrawerServiceContentProps) => {
  const { handleContentChange, contentDetails } = useContentDetails();

  return (
    <>
      <PetWatchDrawerHeader
        contentDetails={contentDetails}
        onClick={handleContentChange()}
        serviceStatus={serviceStatus}
      />
      <PetWatchDrawerBody
        contentDetails={contentDetails}
        locale={locale}
        onClick={handleContentChange}
        route={route}
        serviceStatus={serviceStatus}
      />
    </>
  );
};
