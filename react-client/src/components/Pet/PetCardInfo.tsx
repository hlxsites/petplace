import { PetInfo } from "~/mocks/MockRestApiServer";
import { Button, Icon, Title } from "../design-system";
import { Text } from "../design-system/text/Text";
import { Tab } from "../design-system/tab/Tab";
import { getPetInfoTab } from "./getPetInfoTab";
import { getPetDocumentsTab } from "./getPetDocumentsTab";

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
      content: getPetInfoTab({
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
      content: getPetDocumentsTab(),
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
        <div className="hidden md:block">
          <Text size="base">{`Microchip#: ${getMicrochipNumber}`}</Text>
        </div>

        <div className="block md:hidden">
          <div aria-label="Animal sex and breed" className="flex items-center">
            <Text size="base">{sex}</Text>
            <div className="flex px-medium">
              <Icon display="ellipse" size={4} />
            </div>
            <Text size="base">{breed}</Text>
          </div>
        </div>

        <div className="mt-base">
          <Tab tabs={tabOptions}></Tab>
        </div>
      </>
    );
  }
};
