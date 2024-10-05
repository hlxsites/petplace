import {
  RouteBasedTabs,
  RouteTab,
  Text,
  Title,
} from "~/components/design-system";
import { PetModel } from "~/domain/models/pet/PetModel";
import { AppRoutePaths, PET_PROFILE_FULL_ROUTE } from "~/routes/AppRoutePaths";
import { getRouteFor } from "~/routes/util/getRouteFor";
import { PetActionsDropdownMenu } from "./PetActionsDropdownMenu";
import { PetDocumentsTabContent } from "./PetDocumentsTabContent";
import { PetInfoTabContent } from "./PetInfoTabContent";
import { ReportPetButton } from "./ReportPetButton";

type PetCardInfoProps = Omit<PetModel, "locale">;

export const PetCardInfo = ({ ...petInfo }: PetCardInfoProps) => {
  const {
    age,
    breed,
    dateOfBirth,
    missingStatus,
    microchip,
    name,
    mixedBreed,
    sex,
    spayedNeutered,
    species,
  } = petInfo;

  const tabOptions: RouteTab[] = [
    {
      content: () =>
        PetInfoTabContent({
          age,
          breed,
          dateOfBirth,
          mixedBreed,
          sex,
          spayedNeutered,
          species,
        }),
      exactRoute: true,
      icon: "paw",
      label: "Pet info",
      route: getRouteFor(PET_PROFILE_FULL_ROUTE(petInfo.id), ""),
    },
    {
      content: () => <PetDocumentsTabContent />,
      icon: "file",
      label: "Pet documents",
      route: getRouteFor(
        PET_PROFILE_FULL_ROUTE(petInfo.id),
        AppRoutePaths.petProfileDocuments
      ),
    },
  ];

  return (
    <div className="w-full p-large lg:p-xxlarge">
      <div className="max-h-xxxlarge mb-small flex w-full items-center justify-between">
        <Title isResponsive>{name}</Title>

        <ReportPetButton
          missingStatus={missingStatus}
          className="hidden lg:flex"
          disabled={petInfo.sourceType !== "MyPetHealth"}
        />
        <PetActionsDropdownMenu className="flex lg:hidden" />
      </div>
      {renderSubInfo()}
    </div>
  );

  function renderSubInfo() {
    const getmicrochip = microchip ?? "";
    return (
      <>
        <Text size="16">{`Microchip#: ${getmicrochip}`}</Text>
        <RouteBasedTabs tabs={tabOptions} />
      </>
    );
  }
};
