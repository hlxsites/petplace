import { PetInfo } from "~/mocks/MockRestApiServer";
import { Button, Icon, Title } from "../design-system";

export const PetCardInfo = ({ ...petInfo }: PetInfo) => {
  const { breed, microchipNumber, name, sex } = petInfo;

  return (
    <div className="w-full p-large lg:p-xxlarge">
      <div className="max-h-xxxlarge mb-small flex w-full items-center justify-between">
        <Title level="h1">{name}</Title>

        <Button iconLeft="shieldGood" variant="secondary">
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
          <span aria-label={`Microchip number: ${getMicrochipNumber}`}>
            Microchip#: {getMicrochipNumber}
          </span>
        </div>

        <div className="block md:hidden">
          <div className="flex items-center">
            <span aria-label={`Animal sex: ${sex}`}>{sex}</span>
            <div className="px-medium flex">
              <Icon display="ellipse" size={4} />
            </div>
            <span aria-label={`Animal breed: ${breed}`}>{breed}</span>
          </div>
        </div>
      </>
    );
  }
};
