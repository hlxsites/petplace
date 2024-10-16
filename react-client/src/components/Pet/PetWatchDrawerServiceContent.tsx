import { PetServices } from "~/domain/models/pet/PetModel";
import { PetWatchDrawerBody } from "./PetWatchDrawerBody";
import { PetWatchDrawerHeader } from "./PetWatchDrawerHeader";

type PetWatchDrawerServiceContentProps = {
  isAnnualPlanExpired?: boolean;
  serviceStatus: PetServices["membershipStatus"];
  route?: string;
};

export const PetWatchDrawerServiceContent = ({
  isAnnualPlanExpired,
  serviceStatus,
  route,
}: PetWatchDrawerServiceContentProps) => {
  return (
    <>
      <PetWatchDrawerHeader serviceStatus={serviceStatus} />
      <PetWatchDrawerBody
        isAnnualPlanExpired={isAnnualPlanExpired}
        route={route}
        serviceStatus={serviceStatus}
      />
    </>
  );
};
