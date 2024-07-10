import { PetInfo } from "~/mocks/MockRestApiServer";
import { Button, Icon, Title } from "../design-system";

export const PetCardInfo = ({ ...petInfo }: PetInfo) => {
  const { breed, microchipNumber, name, sex } = petInfo;

  return (
    <div className="w-full p-[24px] lg:p-[40px]">
      <div className="mb-[8px] flex max-h-[48px] w-full items-center justify-between">
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
          <span
            aria-label={`Microchip number: ${getMicrochipNumber}`}
            role="text"
          >
            Microchip#: {getMicrochipNumber}
          </span>
        </div>

        <div className="block md:hidden">
          <div className="flex items-center">
            <span aria-label={`Animal sex: ${sex}`} role="text">
              {sex}
            </span>
            <div className="flex px-[12px]">
              <Icon display="ellipse" size={4} />
            </div>
            <span aria-label={`Animal breed: ${breed}`} role="text">
              {breed}
            </span>
          </div>
        </div>
      </>
    );
  }
};
