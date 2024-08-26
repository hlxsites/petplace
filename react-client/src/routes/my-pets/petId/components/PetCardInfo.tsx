import {
  RouteBasedTabs,
  RouteTab,
  Text,
  Title,
} from "~/components/design-system";
import { PetInfo } from "~/mocks/MockRestApiServer";
import { AppRoutePaths } from "~/routes/AppRoutePaths";
import { PetActionsDropdownMenu } from "./PetActionsDropdownMenu";
import { PetDocumentsTabContent } from "./PetDocumentsTabContent";
import { PetInfoTabContent } from "./PetInfoTabContent";
import { ReportLostPetButton } from "./ReportLostPetButton";

export const PetCardInfo = ({ ...petInfo }: PetInfo) => {
  const {
    age,
    breed,
    dateOfBirth,
    microchipNumber,
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
      route: getRouteFor(""),
    },
    {
      content: () => <PetDocumentsTabContent />,
      icon: "file",
      label: "Pet documents",
      route: getRouteFor(AppRoutePaths.petProfileDocuments),
    },
  ];

  return (
    <div className="w-full p-large lg:p-xxlarge">
      <div className="max-h-xxxlarge mb-small flex w-full items-center justify-between">
        <Title level="h1">{name}</Title>

        <ReportLostPetButton className="hidden lg:flex" />
        <PetActionsDropdownMenu className="flex lg:hidden" />
      </div>
      {renderSubInfo()}
    </div>
  );

  function renderSubInfo() {
    const getMicrochipNumber = microchipNumber ?? "";
    return (
      <>
        <Text size="16">{`Microchip#: ${getMicrochipNumber}`}</Text>

        <div className="mt-base">
          <RouteBasedTabs tabs={tabOptions} />
        </div>
      </>
    );
  }

  function getRouteFor(type: string) {
    return `/${AppRoutePaths.myPets}/${petInfo.id}/${type}`;
  }
};
