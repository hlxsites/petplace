import { PetInfo } from "~/mocks/MockRestApiServer";
import { Button, Icon, Title } from "../design-system";
import { Text } from "../design-system/text/Text";

export const PetCardInfo = ({ ...petInfo }: PetInfo) => {
  const { breed, microchipNumber, name, sex } = petInfo;

  return (
    <div className="w-full p-large lg:p-xxlarge">
      <div className="max-h-xxxlarge mb-small flex w-full items-center justify-between">
        <Title level="h1">{name}</Title>

        <Button
          iconLeft="shieldGood"
          iconProps={{ className: "text-brand-secondary" }}
          variant="secondary"
        >
          Report lost pet
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
          <div className="flex items-center">
            <Text aria-label={"Animal sex"} size="base">
              {sex}
            </Text>
            <div className="px-medium flex">
              <Icon display="ellipse" size={4} />
            </div>
            <Text aria-label={"Animal breed"} size="base">
              {breed}
            </Text>
          </div>
        </div>
      </>
    );
  }
};
