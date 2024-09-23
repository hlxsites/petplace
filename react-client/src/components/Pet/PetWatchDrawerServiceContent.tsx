import { useContentDetails } from "~/hooks/useContentDetails";
import { PetWatchDrawerHeader } from "./PetWatchDrawerHeader";
import { PetWatchDrawerBody } from "./PetWatchDrawerBody";
import { Locale, PetServices } from "~/domain/models/pet/PetModel";

type PetWatchDrawerServiceContentProps = {
  locale?: Locale | null;
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
