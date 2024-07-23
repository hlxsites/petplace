import { PetInfo } from "~/mocks/MockRestApiServer";
import { Button, Title } from "../design-system";
import { Tab } from "../design-system/tab/Tab";
import { Text } from "../design-system/text/Text";
import { PetDocumentsTabContent } from "./PetDocumentsTabContent";
import { PetInfoTabContent } from "./PetInfoTabContent";

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

  const tabOptions: Tab[] = [
    {
      content: PetInfoTabContent({
        age,
        breed,
        dateOfBirth,
        mixedBreed,
        sex,
        spayedNeutered,
        species,
      }),
      icon: "paw",
      label: "Pet info",
    },
    {
      content: PetDocumentsTabContent(),
      icon: "file",
      label: "Pet documents",
    },
  ];

  return (
    <div className="w-full p-large lg:p-xxlarge">
      <div className="max-h-xxxlarge mb-small flex w-full items-center justify-between">
        <Title level="h1">{name}</Title>

        <Button
          className="hidden lg:block"
          iconLeft="shieldGood"
          iconProps={{ className: "text-brand-secondary" }}
          variant="secondary"
        >
          Report lost pet
        </Button>
        <Button
          className="block lg:hidden"
          iconLeft="apps"
          variant="secondary"
          iconProps={{ className: "text-brand-secondary" }}
        >
          Actions
        </Button>
      </div>
      {renderSubInfo()}
    </div>
  );

  function renderSubInfo() {
    const getMicrochipNumber = microchipNumber ?? "";
    return (
      <>
        <Text size="base">{`Microchip#: ${getMicrochipNumber}`}</Text>

        <div className="mt-base">
          <Tab tabs={tabOptions}></Tab>
        </div>
      </>
    );
  }
};
