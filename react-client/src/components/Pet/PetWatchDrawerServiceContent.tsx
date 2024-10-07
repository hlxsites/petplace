import { PetServices } from "~/domain/models/pet/PetModel";
import { PetWatchDrawerBody } from "./PetWatchDrawerBody";
import { PetWatchDrawerHeader } from "./PetWatchDrawerHeader";

type PetWatchDrawerServiceContentProps = {
  serviceStatus: PetServices["membershipStatus"];
  route?: string;
};

export const PetWatchDrawerServiceContent = ({
  serviceStatus,
  route,
}: PetWatchDrawerServiceContentProps) => {
  return (
    <>
      <PetWatchDrawerHeader serviceStatus={serviceStatus} />
      <PetWatchDrawerBody route={route} serviceStatus={serviceStatus} />
    </>
  );
};
