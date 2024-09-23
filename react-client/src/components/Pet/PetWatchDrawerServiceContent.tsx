import { useContentDetails } from "~/hooks/useContentDetails";
import { PetWatchDrawerHeader } from "./PetWatchDrawerHeader";
import { PetWatchDrawerBody } from "./PetWatchDrawerBody";
import { PetServices } from "~/domain/models/pet/PetModel";

type PetWatchDrawerServiceContentProps = {
  serviceStatus: PetServices["membershipStatus"];
  route?: string;
};

export const PetWatchDrawerServiceContent = ({
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
        onClick={handleContentChange}
        route={route}
        serviceStatus={serviceStatus}
      />
    </>
  );
};
